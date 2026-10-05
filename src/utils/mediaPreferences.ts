const STORAGE_KEY = 'moremore-media-devices';

export interface MediaPreferences {
  audioInputId?: string;
  videoInputId?: string;
}

export const loadMediaPreferences = (): MediaPreferences => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MediaPreferences) : {};
  } catch {
    return {};
  }
};

export const saveMediaPreferences = (preferences: MediaPreferences) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch {
    return;
  }
};

const deviceConstraint = (deviceId?: string): MediaTrackConstraints | boolean =>
  deviceId ? { deviceId: { exact: deviceId } } : true;

const FALLBACK_ERRORS = ['OverconstrainedError', 'NotFoundError'];

export const getPreferredMedia = async (withVideo: boolean): Promise<MediaStream> => {
  const { audioInputId, videoInputId } = loadMediaPreferences();
  try {
    return await navigator.mediaDevices.getUserMedia({
      audio: deviceConstraint(audioInputId),
      video: withVideo ? deviceConstraint(videoInputId) : false,
    });
  } catch (error) {
    const hasPreference = Boolean(audioInputId || (withVideo && videoInputId));
    const name = (error as { name?: string } | null)?.name ?? '';
    if (!hasPreference || !FALLBACK_ERRORS.includes(name)) throw error;
    return navigator.mediaDevices.getUserMedia({ audio: true, video: withVideo });
  }
};
