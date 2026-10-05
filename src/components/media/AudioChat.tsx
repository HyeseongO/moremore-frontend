import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useWebRTC } from '../../hooks/useWebRTC';
import { ParticipantTile } from './ParticipantTile';
import type { Socket } from 'socket.io-client';

interface AudioChatProps {
  roomId: string;
  userNickname: string;
  onSocketReady?: (socket: Socket) => void;
}

export default function AudioChat({ roomId, userNickname, onSocketReady }: AudioChatProps) {
  const { t } = useTranslation();
  const { remotePeers, socket } = useWebRTC(roomId, 'large');

  useEffect(() => {
    if (socket) onSocketReady?.(socket);
  }, [socket, onSocketReady]);

  const tiles: {
    id: string;
    nickname: string;
    profileImage?: string;
    stream?: MediaStream;
    isLocal: boolean;
  }[] = [
    { id: 'local', nickname: userNickname, isLocal: true },
    ...Array.from(remotePeers.entries()).map(([id, p]) => ({
      id,
      ...p,
      nickname: p.nickname || t('room.participant'),
      isLocal: false,
    })),
  ];

  return (
    <div className="grid grid-cols-3 gap-6 w-full h-full p-8">
      {tiles.map((t) => (
        <ParticipantTile
          key={t.id}
          nickname={t.nickname}
          profileImage={t.profileImage}
          stream={t.stream}
          isLocal={t.isLocal}
        />
      ))}
    </div>
  );
}
