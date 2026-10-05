import { MicOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function MutedBadge() {
  const { t } = useTranslation();

  return (
    <span
      role="img"
      aria-label={t('room.controls.mutedIndicator')}
      title={t('room.controls.mutedIndicator')}
      className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-500 text-white shadow"
    >
      <MicOff size={14} />
    </span>
  );
}

export default MutedBadge;
