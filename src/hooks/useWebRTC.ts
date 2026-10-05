import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import api from '../services/api';
import { createSocket } from '../services/socket';

interface PeerConnection {
  pc: RTCPeerConnection;
  stream?: MediaStream;
  pendingCandidates: RTCIceCandidateInit[];
}

interface UseWebRTCResult {
  localStream: MediaStream | null;
  remotePeers: Map<string, RemotePeerInfo>;
  localVideoRef: React.RefObject<HTMLVideoElement | null>;
}

export interface RemotePeerInfo {
  stream?: MediaStream;
  nickname: string;
  profileImage?: string;
}

const DEFAULT_ICE_SERVERS: RTCIceServer[] = [{ urls: 'stun:stun.l.google.com:19302' }];

const fetchIceServers = async () => {
  const response = await api.get('/webrtc/ice-servers');
  return response.data.data.iceServers as RTCIceServer[];
};

export const useWebRTC = (
  roomId: string,
  roomMode: 'small' | 'large' | null
): UseWebRTCResult & { socket: Socket | null } => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remotePeers, setRemotePeers] = useState<Map<string, RemotePeerInfo>>(new Map());
  const [socket, setSocket] = useState<Socket | null>(null);

  const localStreamRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const peersRef = useRef<Map<string, PeerConnection>>(new Map());
  const mediaReadyRef = useRef<Promise<void> | null>(null);
  const iceServersRef = useRef<RTCIceServer[]>(DEFAULT_ICE_SERVERS);

  useEffect(() => {
    if (!roomMode) return;
    let cancelled = false;

    const initLocalMedia = async () => {
      const stream = await navigator.mediaDevices.getUserMedia(
        roomMode === 'small' ? { video: true, audio: true } : { video: false, audio: true }
      );
      if (cancelled) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      setLocalStream(stream);
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        await localVideoRef.current.play().catch(() => {});
      }
    };
    mediaReadyRef.current = initLocalMedia().catch(console.error);

    return () => {
      cancelled = true;
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
      setLocalStream(null);
    };
  }, [roomMode]);

  const getPeerConnection = (peerId: string) => {
    if (peersRef.current.has(peerId)) return peersRef.current.get(peerId)!.pc;

    const pc = new RTCPeerConnection({ iceServers: iceServersRef.current });

    localStreamRef.current?.getTracks().forEach((t) => pc.addTrack(t, localStreamRef.current!));

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socketRef.current?.emit('ice-candidate', { to: peerId, candidate: e.candidate });
      }
    };

    pc.ontrack = ({ streams }) => {
      const remoteStream = streams[0];

      setRemotePeers((prev) => {
        const m = new Map(prev);
        const prevInfo = m.get(peerId) ?? { nickname: '참가자', profileImage: undefined };
        m.set(peerId, { ...prevInfo, stream: remoteStream });
        return m;
      });
    };

    peersRef.current.set(peerId, { pc, pendingCandidates: [] });
    return pc;
  };

  const flushPendingCandidates = async (peerId: string) => {
    const peer = peersRef.current.get(peerId);
    if (!peer) return;
    const candidates = peer.pendingCandidates.splice(0);
    for (const cand of candidates) {
      await peer.pc.addIceCandidate(cand).catch(console.error);
    }
  };

  const makeOffer = async (peerId: string) => {
    const pc = getPeerConnection(peerId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socketRef.current?.emit('offer', { to: peerId, offer });
  };

  const handleOffer = async (peerId: string, offer: RTCSessionDescriptionInit) => {
    const pc = getPeerConnection(peerId);
    await pc.setRemoteDescription(offer);
    await flushPendingCandidates(peerId);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socketRef.current?.emit('answer', { to: peerId, answer });
  };

  const handleAnswer = async (peerId: string, answer: RTCSessionDescriptionInit) => {
    const pc = peersRef.current.get(peerId)?.pc;
    if (!pc) return;
    await pc.setRemoteDescription(answer);
    await flushPendingCandidates(peerId);
  };

  const handleCandidate = async (peerId: string, cand: RTCIceCandidateInit) => {
    if (!cand) return;
    getPeerConnection(peerId);
    const peer = peersRef.current.get(peerId)!;
    if (!peer.pc.remoteDescription) {
      peer.pendingCandidates.push(cand);
      return;
    }
    await peer.pc.addIceCandidate(cand).catch(console.error);
  };

  useEffect(() => {
    const iceReady = fetchIceServers()
      .then((iceServers) => {
        iceServersRef.current = iceServers;
      })
      .catch(() => {});

    const socket = createSocket();
    socketRef.current = socket;
    setSocket(socket);

    socket.on('connect', async () => {
      await Promise.all([mediaReadyRef.current, iceReady]);
      if (socket.connected) socket.emit('join-room', roomId);
    });
    socket.on(
      'existing-users',
      (list: { userId: string; nickname: string; profileImage?: string }[]) => {
        list.forEach((u) => {
          if (u.userId === socket.id) return;
          setRemotePeers((prev) =>
            new Map(prev).set(u.userId, { nickname: u.nickname, profileImage: u.profileImage })
          );
          makeOffer(u.userId);
        });
      }
    );
    socket.on(
      'user-joined',
      ({
        userId,
        nickname,
        profileImage,
      }: {
        userId: string;
        nickname: string;
        profileImage?: string;
      }) => {
        if (userId === socket.id) return;
        setRemotePeers((prev) => new Map(prev).set(userId, { nickname, profileImage }));
      }
    );

    socket.on('offer', ({ from, offer }) => handleOffer(from, offer));
    socket.on('answer', ({ from, answer }) => handleAnswer(from, answer));
    socket.on('ice-candidate', ({ from, candidate }) => handleCandidate(from, candidate));

    socket.on('user-left', (id: string) => {
      peersRef.current.get(id)?.pc.close();
      peersRef.current.delete(id);
      setRemotePeers((p) => {
        const m = new Map(p);
        m.delete(id);
        return m;
      });
    });

    return () => {
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      peersRef.current.forEach(({ pc }) => pc.close());
      peersRef.current.clear();
      socket.disconnect();
    };
  }, [roomId]);

  return { localStream, remotePeers, localVideoRef, socket };
};
