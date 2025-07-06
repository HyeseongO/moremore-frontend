import { useState } from 'react';

interface StudyRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function StudyRoomModal({ isOpen, onClose }: StudyRoomModalProps) {
  const [data, setData] = useState({
    title: '',
    memberType: 'small',
    description: '',
  });

  const handleSubmit = () => {
    onClose();
    setData({
      title: '',
      memberType: 'small',
      description: '',
    });
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
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />

      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 w-[500px] max-w-[90vw] shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">스터디룸 생성</h2>

          <div className="space-y-5">
            <div>
              <div className="block text-sm font-medium text-gray-700 mb-2">스터디룸 제목</div>
              <input
                type="text"
                name="title"
                value={data.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="예: 바닐라코딩 19기 정기 모임"
              />
            </div>

            <div>
              <div className="block text-sm font-medium text-gray-700 mb-2">인원 규모</div>
              <div className="flex gap-4">
                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="memberType"
                    value="small"
                    checked={data.memberType === 'small'}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="border-2 border-gray-300 rounded-lg p-4 text-center peer-checked:border-indigo-500 peer-checked:bg-indigo-50 transition">
                    <div className="font-medium text-gray-800">소규모</div>
                    <div className="text-sm text-gray-600">최대 4명</div>
                  </div>
                </label>
                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="memberType"
                    value="large"
                    checked={data.memberType === 'large'}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="border-2 border-gray-300 rounded-lg p-4 text-center peer-checked:border-indigo-500 peer-checked:bg-indigo-50 transition">
                    <div className="font-medium text-gray-800">대규모</div>
                    <div className="text-sm text-gray-600">최대 12명</div>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <div className="block text-sm font-medium text-gray-700 mb-2">세부 사항</div>
              <textarea
                name="description"
                value={data.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
                placeholder="스터디룸에 대한 설명을 입력해주세요!"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                취소
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
              >
                생성하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StudyRoomModal;
