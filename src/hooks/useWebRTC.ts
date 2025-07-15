import { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';

interface PeerConnection {
  pc: RTCPeerConnection;
  stream?: MediaStream;
}

interface UseWebRTCResult {
  localStream: MediaStream | null;
  remoteStreams: Map<string, MediaStream>;
  localVideoRef: React.RefObject<HTMLVideoElement | null>;
}

export const useWebRTC = (roomId: string): UseWebRTCResult & { socket: Socket | null } => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const [socket, setSocket] = useState<Socket | null>(null);

  const localStreamRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const peersRef = useRef<Map<string, PeerConnection>>(new Map());

  const rtcConfig: RTCConfiguration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  };

  const initLocalMedia = async () => {
    const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localStreamRef.current = s;
    setLocalStream(s);
    if (localVideoRef.current) localVideoRef.current.srcObject = s;
  };

  const getPeerConnection = (peerId: string) => {
    if (peersRef.current.has(peerId)) return peersRef.current.get(peerId)!.pc;

    const pc = new RTCPeerConnection(rtcConfig);

    localStreamRef.current?.getTracks().forEach((t) => pc.addTrack(t, localStreamRef.current!));

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socketRef.current?.emit('ice-candidate', { to: peerId, candidate: e.candidate });
      }
    };

    pc.ontrack = (e) => {
      const [remote] = e.streams;
      setRemoteStreams((p) => (p.has(peerId) ? p : new Map(p).set(peerId, remote)));
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
    let mounted = true;

    initLocalMedia().catch(console.error);

    const socket = io('http://localhost:8000', {
      withCredentials: true,
      transports: ['websocket'],
    });
    socketRef.current = socket;
    setSocket(socket);

    socket.on('connect', () => {
      console.log('[socket] connected:', socket.id);
      socket.emit('join-room', roomId);
    });

    socket.on('existing-users', (list: { userId: string }[]) => {
      list.forEach((u) => u.userId !== socket.id && makeOffer(u.userId));
    });

    socket.on('user-joined', ({ userId }: { userId: string }) => {
      if (userId !== socket.id) makeOffer(userId);
    });

    socket.on('offer', ({ from, offer }) => handleOffer(from, offer));
    socket.on('answer', ({ from, answer }) => handleAnswer(from, answer));
    socket.on('ice-candidate', ({ from, candidate }) => handleCandidate(from, candidate));

    socket.on('user-left', (id: string) => {
      peersRef.current.get(id)?.pc.close();
      peersRef.current.delete(id);
      setRemoteStreams((p) => {
        const m = new Map(p);
        m.delete(id);
        return m;
      });
    });

    return () => {
      mounted = false;
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      peersRef.current.forEach(({ pc }) => pc.close());
      peersRef.current.clear();
      socket.disconnect();
    };
  }, [roomId]);

  return { localStream, remoteStreams, localVideoRef, socket };
};
