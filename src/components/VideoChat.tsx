import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useWebRTC } from '../hooks/useWebRTC';
import type { Socket } from 'socket.io-client';
import MediaControls from './media/MediaControls';
import MutedBadge from './media/MutedBadge';

interface VideoChatProps {
  roomId: string;
  roomMode: 'small' | 'large';
  userNickname?: string;
  onSocketReady?: (socket: Socket) => void;
}

export const VideoChat: React.FC<VideoChatProps> = ({
  roomId,
  roomMode,
  userNickname,
  onSocketReady,
}: VideoChatProps) => {
  const { t } = useTranslation();
  const {
    localStream,
    remotePeers,
    localVideoRef,
    socket,
    isAudioEnabled,
    isVideoEnabled,
    toggleAudio,
    toggleVideo,
  } = useWebRTC(roomId, roomMode);

  useEffect(() => {
    if (socket && onSocketReady) {
      onSocketReady(socket);
    }
  }, [socket, onSocketReady]);

  const totalUser = remotePeers.size + 1;

  const allVideos = [
    {
      id: 'local',
      stream: localStream,
      label: userNickname,
      isLocal: true,
      audioEnabled: isAudioEnabled,
      videoEnabled: isVideoEnabled,
    },
    ...Array.from(remotePeers.entries()).map(([peerId, info], index) => ({
      id: peerId,
      stream: info.stream,
      label: info.nickname || t('room.participantNumbered', { number: index + 1 }),
      isLocal: false,
      audioEnabled: info.audioEnabled !== false,
      videoEnabled: info.videoEnabled !== false,
    })),
  ];

  const getContainerStyle = () => {
    switch (totalUser) {
      case 1:
        return 'flex items-center justify-center h-full';
      case 2:
        return 'grid grid-cols-2 gap-6 h-full content-center';
      case 3:
        return 'grid grid-cols-2 gap-6 h-full content-center';
      case 4:
        return 'grid grid-cols-2 gap-6 h-full content-center';
      default:
        return 'grid grid-cols-2 gap-6 h-full content-center';
    }
  };

  const getVideoStyle = (index: number) => {
    if (totalUser === 1) {
      return 'relative bg-gray-100 rounded-2xl overflow-hidden shadow-xl w-full max-w-[600px] aspect-video border-2 border-gray-200';
    }

    if (totalUser === 3 && index === 2) {
      return 'relative bg-gray-100 rounded-2xl overflow-hidden shadow-xl aspect-video col-span-2 max-w-[500px] mx-auto border-2 border-gray-200';
    }

    return 'relative bg-gray-100 rounded-2xl overflow-hidden shadow-xl aspect-video border-2 border-gray-200';
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="w-full max-w-5xl h-full">
        <div className={getContainerStyle()}>
          {allVideos.map((video, index) => (
            <div key={video.id} className={getVideoStyle(index)}>
              {video.isLocal ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              ) : (
                <video
                  autoPlay
                  playsInline
                  muted={false}
                  ref={(videoEl) => {
                    if (videoEl && video.stream instanceof MediaStream) {
                      if (videoEl.srcObject !== video.stream) {
                        videoEl.srcObject = video.stream;
                      }
                    }
                  }}
                  className="w-full h-full object-cover"
                  onLoadedMetadata={(e) => {
                    (e.target as HTMLVideoElement).play().catch((err) => {
                      console.error('Error playing remote video:', err);
                    });
                  }}
                />
              )}

              {!video.videoEnabled && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-400 text-3xl font-bold text-white">
                    {video.label?.[0]?.toUpperCase() ?? '?'}
                  </span>
                </div>
              )}

              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <span className="bg-white/90 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold shadow-md backdrop-blur-sm">
                  {video.label}
                </span>
                {!video.audioEnabled && <MutedBadge />}
              </div>

              {video.isLocal && !localStream && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700 mx-auto mb-4"></div>
                    <p className="text-gray-600">{t('room.connectingCamera')}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <MediaControls
        disabled={!localStream}
        isAudioEnabled={isAudioEnabled}
        onToggleAudio={toggleAudio}
        isVideoEnabled={isVideoEnabled}
        onToggleVideo={toggleVideo}
      />
    </div>
  );
};
