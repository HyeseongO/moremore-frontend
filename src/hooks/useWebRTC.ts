import { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';

interface PeerConnection {
  pc: RTCPeerConnection;
  stream?: MediaStream;
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

  const rtcConfig: RTCConfiguration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  };

  useEffect(() => {
    if (!roomMode) return;
    let stream: MediaStream;

    const initLocalMedia = async () => {
      stream = await navigator.mediaDevices.getUserMedia(
        roomMode === 'small' ? { video: true, audio: true } : { video: false, audio: true }
      );
      setLocalStream(stream);
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        await localVideoRef.current.play().catch(() => {});
      }

      peersRef.current.forEach(({ pc }) => {
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      });
    };
    initLocalMedia().catch(console.error);

    return () => {
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      setLocalStream(null);
    };
  }, [roomMode]);

  const getPeerConnection = (peerId: string) => {
    if (peersRef.current.has(peerId)) return peersRef.current.get(peerId)!.pc;

    const pc = new RTCPeerConnection(rtcConfig);

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

    peersRef.current.set(peerId, { pc });
    return pc;
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
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socketRef.current?.emit('answer', { to: peerId, answer });
  };

  const handleAnswer = async (peerId: string, answer: RTCSessionDescriptionInit) => {
    const pc = peersRef.current.get(peerId)?.pc;
    pc && (await pc.setRemoteDescription(answer));
  };

  const handleCandidate = async (peerId: string, cand: RTCIceCandidate) => {
    const pc = peersRef.current.get(peerId)?.pc;
    pc && cand && (await pc.addIceCandidate(cand));
  };

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL, {
      withCredentials: true,
      transports: ['websocket'],
    });
    socketRef.current = socket;
    setSocket(socket);

    socket.on('connect', () => {
      console.log('[socket] connected:', socket.id);
      socket.emit('join-room', roomId);
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
        makeOffer(userId);
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
