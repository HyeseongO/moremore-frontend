import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import StudyRoomService from '../services/studyroomService';

interface StudyRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (roomData: any) => void;
}

function StudyRoomModal({ isOpen, onClose, onSuccess }: StudyRoomModalProps) {
  const { t } = useTranslation();
  const [data, setData] = useState({
    title: '',
    roomType: 'SMALL' as 'SMALL' | 'LARGE',
    description: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setData({
      title: '',
      roomType: 'SMALL',
      description: '',
    });
    setError(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (!data.title.trim()) {
      setError(t('createRoom.titleRequired'));
      return;
    }
    setError(null);

    try {
      const roomData = await StudyRoomService.createStudyRoom(data);

      onSuccess(roomData);
      handleClose();
    } catch (error: any) {
      setError(error.response?.data?.message || t('createRoom.failed'));
    }
  };

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={handleClose} />

      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div className="bg-white rounded-2xl p-8 w-[500px] max-w-[90vw] shadow-2xl pointer-events-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">{t('createRoom.title')}</h2>

          <div className="space-y-5">
            <div>
              <div className="block text-sm font-medium text-gray-700 mb-2">{t('createRoom.titleLabel')}</div>
              <input
                type="text"
                name="title"
                value={data.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder={t('createRoom.titlePlaceholder')}
              />
            </div>

            <div>
              <div className="block text-sm font-medium text-gray-700 mb-2">{t('createRoom.sizeLabel')}</div>
              <div className="flex gap-4">
                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="roomType"
                    value="SMALL"
                    checked={data.roomType === 'SMALL'}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="border-2 border-gray-300 rounded-lg p-4 text-center peer-checked:border-indigo-500 peer-checked:bg-indigo-50 transition">
                    <div className="font-medium text-gray-800">{t('roomType.SMALL')}</div>
                    <div className="text-sm text-gray-600">{t('createRoom.maxMembers', { count: 4 })}</div>
                  </div>
                </label>
                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="roomType"
                    value="LARGE"
                    checked={data.roomType === 'LARGE'}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="border-2 border-gray-300 rounded-lg p-4 text-center peer-checked:border-indigo-500 peer-checked:bg-indigo-50 transition">
                    <div className="font-medium text-gray-800">{t('roomType.LARGE')}</div>
                    <div className="text-sm text-gray-600">{t('createRoom.maxMembers', { count: 12 })}</div>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <div className="block text-sm font-medium text-gray-700 mb-2">{t('createRoom.descriptionLabel')}</div>
              <textarea
                name="description"
                value={data.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
                placeholder={t('createRoom.descriptionPlaceholder')}
              />
            </div>

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
              >
                {t('createRoom.submit')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StudyRoomModal;
