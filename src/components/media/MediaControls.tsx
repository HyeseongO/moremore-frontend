import { Mic, MicOff, Video, VideoOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MediaControlsProps {
  disabled: boolean;
  isAudioEnabled: boolean;
  onToggleAudio: () => void;
  isVideoEnabled?: boolean;
  onToggleVideo?: () => void;
}

const buttonClass = (enabled: boolean) =>
  `flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition disabled:cursor-not-allowed disabled:opacity-50 ${
    enabled
      ? 'bg-white text-gray-800 hover:bg-gray-100'
      : 'bg-rose-500 text-white hover:bg-rose-600'
  }`;

function MediaControls({
  disabled,
  isAudioEnabled,
  onToggleAudio,
  isVideoEnabled,
  onToggleVideo,
}: MediaControlsProps) {
  const { t } = useTranslation();
  const audioLabel = isAudioEnabled ? t('room.controls.muteMic') : t('room.controls.unmuteMic');
  const videoLabel = isVideoEnabled ? t('room.controls.cameraOff') : t('room.controls.cameraOn');

  return (
    <div
      role="toolbar"
      aria-label={t('room.controls.label')}
      className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-3"
    >
      <button
        type="button"
        onClick={onToggleAudio}
        disabled={disabled}
        aria-label={audioLabel}
        title={audioLabel}
        className={buttonClass(isAudioEnabled)}
      >
        {isAudioEnabled ? <Mic size={22} /> : <MicOff size={22} />}
      </button>
      {onToggleVideo && isVideoEnabled !== undefined && (
        <button
          type="button"
          onClick={onToggleVideo}
          disabled={disabled}
          aria-label={videoLabel}
          title={videoLabel}
          className={buttonClass(isVideoEnabled)}
        >
          {isVideoEnabled ? <Video size={22} /> : <VideoOff size={22} />}
        </button>
      )}
    </div>
  );
}

export default MediaControls;
