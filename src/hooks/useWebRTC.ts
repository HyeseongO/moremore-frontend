import { useEffect, useRef, useState, useCallback } from 'react';
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

export const useWebRTC = (roomId: string): UseWebRTCResult => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(
    new Map<string, MediaStream>()
  );

  const socketRef = useRef<Socket | null>(null);
  const peerConnections = useRef<Map<string, PeerConnection>>(new Map());
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const configuration: RTCConfiguration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  };

  const createPeerConnection = useCallback(
    (peerId: string): RTCPeerConnection => {
      const pc = new RTCPeerConnection(configuration);

      if (localStream) {
        localStream.getTracks().forEach((track) => {
          pc.addTrack(track, localStream);
        });
      }

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current?.emit('ice-candidate', {
            to: peerId,
            candidate: event.candidate,
          });
        }
      };

      pc.ontrack = (event) => {
        const [remoteStream] = event.streams;
        setRemoteStreams((prev) => new Map(prev).set(peerId, remoteStream));
      };

      peerConnections.current.set(peerId, { pc });
      return pc;
    },
    [localStream]
  );

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Media access error:', error);
    }
  };

  const makeOffer = async (peerId: string) => {
    const pc = createPeerConnection(peerId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socketRef.current?.emit('offer', {
      to: peerId,
      offer: offer,
    });
  };

  const handleOffer = async (peerId: string, offer: RTCSessionDescriptionInit) => {
    const pc = createPeerConnection(peerId);
    await pc.setRemoteDescription(offer);

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socketRef.current?.emit('answer', {
      to: peerId,
      answer: answer,
    });
  };

  const handleAnswer = async (peerId: string, answer: RTCSessionDescriptionInit) => {
    const connection = peerConnections.current.get(peerId);
    if (connection) {
      await connection.pc.setRemoteDescription(answer);
    }
  };

  const handleIceCandidate = async (peerId: string, candidate: RTCIceCandidate) => {
    const connection = peerConnections.current.get(peerId);
    if (connection) {
      await connection.pc.addIceCandidate(candidate);
    }
  };

  useEffect(() => {
    initializeMedia();

    socketRef.current = io('http://localhost:8000', {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      socket.emit('join-room', roomId);
    });

    socket.on('error', (error: any) => {
      console.error('❌ Socket connection error:', error.message);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    socket.on('error', (error: any) => {
      console.error('❌ Server error:', error);
    });

    socket.on('existing-users', (users: string[]) => {
      users.forEach((userId) => makeOffer(userId));
    });

    socket.on('user-joined', (userId: string) => {
      console.log('User joined:', userId);
    });

    socket.on('offer', async ({ from, offer }) => {
      await handleOffer(from, offer);
    });

    socket.on('answer', async ({ from, answer }) => {
      await handleAnswer(from, answer);
    });

    socket.on('ice-candidate', async ({ from, candidate }) => {
      await handleIceCandidate(from, candidate);
    });

    socket.on('user-left', (userId: string) => {
      const connection = peerConnections.current.get(userId);
      if (connection) {
        connection.pc.close();
        peerConnections.current.delete(userId);
        setRemoteStreams((prev) => {
          const newMap = new Map(prev);
          newMap.delete(userId);
          return newMap;
        });
      }
    });

    socket.on('room-info', (info: any) => {
      console.log('Room info updated:', info);
    });

    return () => {
      localStream?.getTracks().forEach((track) => track.stop());
      peerConnections.current.forEach(({ pc }) => pc.close());
      socket.disconnect();
    };
  }, [roomId]);

  return {
    localStream,
    remoteStreams,
    localVideoRef,
  };
};
