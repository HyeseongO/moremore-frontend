import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import StudyRoomService from '../services/studyroomService';
import { translateApiError } from '../utils/apiError';

interface JoinByInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const extractInviteCode = (value: string) => {
  const trimmed = value.trim();
  const match = trimmed.match(/\/join\/([^/?#]+)/);
  return match ? match[1] : trimmed;
};

function JoinByInviteModal({ isOpen, onClose, onSuccess }: JoinByInviteModalProps) {
  const { t } = useTranslation();
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    setValue('');
    setError(null);
    setNotice(null);
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;

    const inviteCode = extractInviteCode(value);
    if (!inviteCode) {
      setError(t('joinRoom.required'));
      return;
    }

    setError(null);
    setNotice(null);
    setIsSubmitting(true);
    try {
      const room = await StudyRoomService.joinByInviteCode(encodeURIComponent(inviteCode));
      if (room.alreadyMember) {
        setNotice(t('joinRoom.alreadyMember', { title: room.title }));
        return;
      }
      onSuccess();
      handleClose();
    } catch (err) {
      setError(translateApiError(err, 'joinRoom.failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={handleClose} />

      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-8 w-[500px] max-w-[90vw] shadow-2xl pointer-events-auto"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800">{t('joinRoom.title')}</h2>

          <div className="block text-sm font-medium text-gray-700 mb-2">{t('joinRoom.label')}</div>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            placeholder={t('joinRoom.placeholder')}
          />

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          {notice && <p className="mt-3 text-sm text-indigo-600">{notice}</p>}

          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition disabled:opacity-50"
            >
              {isSubmitting ? t('joinRoom.submitting') : t('joinRoom.submit')}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default JoinByInviteModal;
