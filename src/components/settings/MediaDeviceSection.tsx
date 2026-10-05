import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VideoOff } from 'lucide-react';
import SettingsSection from './SettingsSection';
import { settingsButtonClass, settingsInputClass } from './styles';
import {
  getPreferredMedia,
  loadMediaPreferences,
  saveMediaPreferences,
  type MediaPreferences,
} from '../../utils/mediaPreferences';

type Status = 'idle' | 'starting' | 'active';

interface DeviceLists {
  audio: MediaDeviceInfo[];
  video: MediaDeviceInfo[];
}

const errorKeyFor = (error: unknown) => {
  const name = error instanceof DOMException ? error.name : '';
  if (name === 'NotAllowedError' || name === 'SecurityError') return 'settings.media.errors.denied';
  if (name === 'NotFoundError') return 'settings.media.errors.notFound';
  return 'settings.media.errors.failed';
};

const openStream = async () => {
  try {
    return await getPreferredMedia(true);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'NotFoundError') {
      return getPreferredMedia(false);
    }
    throw error;
  }
};

function MediaDeviceSection() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<Status>('idle');
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [devices, setDevices] = useState<DeviceLists>({ audio: [], video: [] });
  const [selected, setSelected] = useState<MediaPreferences>({});
  const [hasVideo, setHasVideo] = useState(false);

  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const levelRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const frameRef = useRef<number | null>(null);

  const stopPreview = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    void audioContextRef.current?.close();
    audioContextRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (levelRef.current) levelRef.current.style.width = '0%';
  }, []);

  const refreshDevices = useCallback(async () => {
    const list = await navigator.mediaDevices.enumerateDevices();
    setDevices({
      audio: list.filter((device) => device.kind === 'audioinput'),
      video: list.filter((device) => device.kind === 'videoinput'),
    });
  }, []);

  const startMeter = (stream: MediaStream) => {
    if (stream.getAudioTracks().length === 0) return;
    const context = new AudioContext();
    const analyser = context.createAnalyser();
    analyser.fftSize = 512;
    context.createMediaStreamSource(stream).connect(analyser);
    audioContextRef.current = context;

    const samples = new Uint8Array(analyser.fftSize);
    const draw = () => {
      analyser.getByteTimeDomainData(samples);
      const rms = Math.sqrt(
        samples.reduce((sum, value) => sum + ((value - 128) / 128) ** 2, 0) / samples.length
      );
      if (levelRef.current) {
        levelRef.current.style.width = `${Math.min(100, Math.round(rms * 400))}%`;
      }
      frameRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  const startPreview = async () => {
    stopPreview();
    setStatus('starting');
    setErrorKey(null);
    try {
      const stream = await openStream();
      streamRef.current = stream;
      const [videoTrack] = stream.getVideoTracks();
      const [audioTrack] = stream.getAudioTracks();
      setHasVideo(Boolean(videoTrack));
      setSelected({
        videoInputId: videoTrack?.getSettings().deviceId,
        audioInputId: audioTrack?.getSettings().deviceId,
      });
      if (videoRef.current) videoRef.current.srcObject = videoTrack ? stream : null;
      startMeter(stream);
      await refreshDevices();
      setStatus('active');
    } catch (error) {
      stopPreview();
      setErrorKey(errorKeyFor(error));
      setStatus('idle');
    }
  };

  const handleSelect = (key: keyof MediaPreferences, deviceId: string) => {
    saveMediaPreferences({ ...loadMediaPreferences(), [key]: deviceId || undefined });
    void startPreview();
  };

  const handleStop = () => {
    stopPreview();
    setStatus('idle');
  };

  useEffect(() => {
    if (status !== 'active') return;
    const handleChange = () => void refreshDevices();
    navigator.mediaDevices.addEventListener('devicechange', handleChange);
    return () => navigator.mediaDevices.removeEventListener('devicechange', handleChange);
  }, [status, refreshDevices]);

  useEffect(() => stopPreview, [stopPreview]);

  const isActive = status === 'active';

  const deviceSelect = (
    id: string,
    label: string,
    key: keyof MediaPreferences,
    list: MediaDeviceInfo[],
    numberedKey: string
  ) => (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={id}
        value={selected[key] ?? ''}
        onChange={(event) => handleSelect(key, event.target.value)}
        disabled={!isActive || list.length === 0}
        className={settingsInputClass}
      >
        {list.length === 0 && <option value="">{t('settings.media.noDevice')}</option>}
        {list.map((device, index) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || t(numberedKey, { number: index + 1 })}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <SettingsSection title={t('settings.media.title')}>
      <p className="text-sm text-gray-600">{t('settings.media.description')}</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-100">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            aria-label={t('settings.media.preview')}
            className={`h-full w-full scale-x-[-1] object-cover ${isActive && hasVideo ? '' : 'invisible'}`}
          />
          {!(isActive && hasVideo) && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <VideoOff size={32} />
            </div>
          )}
        </div>

        <div className="space-y-3">
          {deviceSelect(
            'settings-camera',
            t('settings.media.camera'),
            'videoInputId',
            devices.video,
            'settings.media.cameraNumbered'
          )}
          {deviceSelect(
            'settings-microphone',
            t('settings.media.microphone'),
            'audioInputId',
            devices.audio,
            'settings.media.microphoneNumbered'
          )}
          <div>
            <p className="mb-1 text-sm font-medium text-gray-700">{t('settings.media.level')}</p>
            <div
              role="meter"
              aria-label={t('settings.media.level')}
              className="h-2 overflow-hidden rounded-full bg-gray-200"
            >
              <div ref={levelRef} className="h-full w-0 bg-green-500 transition-[width] duration-75" />
            </div>
          </div>
        </div>
      </div>

      {errorKey && <p className="mt-3 text-sm text-red-600">{t(errorKey)}</p>}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {isActive ? (
          <button
            type="button"
            onClick={handleStop}
            className="rounded-lg border border-gray-300 px-5 py-2 font-medium text-gray-700 transition hover:bg-gray-50"
          >
            {t('settings.media.stop')}
          </button>
        ) : (
          <button
            type="button"
            onClick={startPreview}
            disabled={status === 'starting'}
            className={settingsButtonClass}
          >
            {status === 'starting' ? t('settings.media.starting') : t('settings.media.start')}
          </button>
        )}
        <p className="text-xs text-gray-500">{t('settings.media.appliedNote')}</p>
      </div>
    </SettingsSection>
  );
}

export default MediaDeviceSection;
