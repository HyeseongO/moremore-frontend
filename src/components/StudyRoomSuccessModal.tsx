import { useState } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface StudyRoomSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomData: {
    id: number;
    title: string;
    roomType: 'SMALL' | 'LARGE';
    maxMembers: number;
    inviteLink: string;
    description?: string;
  } | null;
}

function StudyRoomSuccessModal({ isOpen, onClose, roomData }: StudyRoomSuccessModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (roomData?.inviteLink) {
      navigator.clipboard.writeText(roomData.inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen || !roomData) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />

      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 w-[450px] max-w-[90vw] shadow-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>

          <div className="flex justify-center mb-6">
            <div className="bg-green-100 rounded-full p-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center mb-2">스터디룸이 생성되었습니다!</h2>
          <p className="text-gray-600 text-center mb-6">이제 친구들을 초대해보세요</p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-lg mb-3">{roomData.title}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">참여 인원</span>
                <span className="font-medium">1 / {roomData.maxMembers}명</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">스터디룸 타입</span>
                <span className="font-medium">
                  {roomData.roomType === 'SMALL' ? '소규모' : '대규모'}
                </span>
              </div>
            </div>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-gray-700">초대 링크</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={roomData.inviteLink}
                readOnly
                className="flex-1 bg-gray-100 rounded px-3 py-2 text-sm"
              />
              <button
                onClick={handleCopyLink}
                className={`px-4 py-2 rounded-lg transition-all ${
                  copied
                    ? 'bg-green-600 text-white'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {copied ? '복사됨!' : '복사'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              * 이 링크를 통해 친구들이 스터디룸에 참여할 수 있습니다
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            확인
          </button>
        </div>
      </div>
    </>
  );
}

export default StudyRoomSuccessModal;
