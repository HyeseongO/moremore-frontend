import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useWebRTC } from '../../hooks/useWebRTC';
import { ParticipantTile } from './ParticipantTile';
import type { Socket } from 'socket.io-client';
import MediaControls from './MediaControls';

interface AudioChatProps {
  roomId: string;
  userNickname: string;
  onSocketReady?: (socket: Socket) => void;
}

export default function AudioChat({ roomId, userNickname, onSocketReady }: AudioChatProps) {
  const { t } = useTranslation();
  const { localStream, remotePeers, socket, isAudioEnabled, toggleAudio } = useWebRTC(
    roomId,
    'large'
  );

  useEffect(() => {
    if (socket) onSocketReady?.(socket);
  }, [socket, onSocketReady]);

  const tiles: {
    id: string;
    nickname: string;
    profileImage?: string;
    stream?: MediaStream;
    isLocal: boolean;
    audioEnabled: boolean;
  }[] = [
    { id: 'local', nickname: userNickname, isLocal: true, audioEnabled: isAudioEnabled },
    ...Array.from(remotePeers.entries()).map(([id, p]) => ({
      id,
      ...p,
      nickname: p.nickname || t('room.participant'),
      isLocal: false,
      audioEnabled: p.audioEnabled !== false,
    })),
  ];

  return (
    <div className="grid grid-cols-3 gap-6 w-full h-full px-8 pt-28 pb-24">
      {tiles.map((t) => (
        <ParticipantTile
          key={t.id}
          nickname={t.nickname}
          profileImage={t.profileImage}
          stream={t.stream}
          isLocal={t.isLocal}
          audioEnabled={t.audioEnabled}
        />
      ))}
      <MediaControls
        disabled={!localStream}
        isAudioEnabled={isAudioEnabled}
        onToggleAudio={toggleAudio}
      />
    </div>
  );
}
