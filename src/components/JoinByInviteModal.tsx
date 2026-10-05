import { useState } from 'react';
import axios from 'axios';
import StudyRoomService from '../services/studyroomService';

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
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    setValue('');
    setError(null);
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;

    const inviteCode = extractInviteCode(value);
    if (!inviteCode) {
      setError('초대 링크 또는 코드를 입력해주세요.');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await StudyRoomService.joinByInviteCode(encodeURIComponent(inviteCode));
      onSuccess();
      handleClose();
    } catch (err) {
      const message = axios.isAxiosError(err) ? err.response?.data?.message : undefined;
      setError(message || '스터디룸 참여에 실패했습니다.');
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
          <h2 className="text-2xl font-bold mb-6 text-gray-800">초대 코드로 참여</h2>

          <div className="block text-sm font-medium text-gray-700 mb-2">초대 링크 또는 코드</div>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            placeholder="초대 링크를 붙여넣어 주세요"
          />

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition disabled:opacity-50"
            >
              {isSubmitting ? '참여 중...' : '참여하기'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default JoinByInviteModal;
