import { useEffect, useRef } from 'react';
import MutedBadge from './MutedBadge';

interface Props {
  stream?: MediaStream;
  nickname: string;
  profileImage?: string;
  isLocal?: boolean;
  audioEnabled?: boolean;
}

export const ParticipantTile: React.FC<Props> = ({
  stream,
  nickname,
  profileImage,
  isLocal = false,
  audioEnabled = true,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const hasVideo = !!stream?.getVideoTracks().length;

  useEffect(() => {
    if (!stream) return;
    if (hasVideo && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {});
    } else if (!isLocal && audioRef.current) {
      audioRef.current.srcObject = stream;
      audioRef.current.play().catch(() => {});
    }
  }, [stream, hasVideo, isLocal]);

  return (
    <div className="relative rounded-xl overflow-hidden bg-gray-100 shadow">
      {!hasVideo && !isLocal && stream && <audio ref={audioRef} autoPlay />}
      {hasVideo ? (
        <video ref={videoRef} muted={isLocal} playsInline className="w-full h-full object-cover" />
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          {profileImage ? (
            <img
              src={profileImage}
              alt={nickname}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <span className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold text-gray-600">
              {nickname[0]}
            </span>
          )}
        </div>
      )}
      <div className="absolute bottom-2 left-2 flex items-center gap-2">
        <span className="bg-white/80 px-3 py-1 text-sm font-medium rounded-md">{nickname}</span>
        {!audioEnabled && <MutedBadge />}
      </div>
    </div>
  );
};
