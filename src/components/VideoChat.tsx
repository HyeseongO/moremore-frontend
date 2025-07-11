import React from 'react';
import { useWebRTC } from '../hooks/useWebRTC';

interface VideoChatProps {
  roomId: string;
  userNickname?: string;
}

export const VideoChat: React.FC<VideoChatProps> = ({ roomId, userNickname = '???' }) => {
  const { localStream, remoteStreams, localVideoRef } = useWebRTC(roomId);

  const totalUser = remoteStreams.size + 1;

  const allVideos = [
    { id: 'local', stream: localStream, label: userNickname, isLocal: true },
    ...Array.from(remoteStreams.entries()).map(([peerId, stream], index) => ({
      id: peerId,
      stream: stream,
      label: `참가자 ${index + 1}`,
      isLocal: false,
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
                  ref={(videoEl) => {
                    if (videoEl && video.stream) videoEl.srcObject = video.stream;
                  }}
                  className="w-full h-full object-cover"
                />
              )}

              <div className="absolute bottom-4 left-4">
                <span className="bg-white/90 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold shadow-md backdrop-blur-sm">
                  {video.label}
                </span>
              </div>

              {video.isLocal && !localStream && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700 mx-auto mb-4"></div>
                    <p className="text-gray-600">카메라 연결 중...</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
