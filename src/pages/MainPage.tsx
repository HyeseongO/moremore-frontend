import { useEffect, useState } from 'react';
import Background from '../components/Background';
import UserProfile from '../components/UserProfile';
import StudyRoomModal from '../components/StudyRoomModal';
import StudyRoomSuccessModal from '../components/StudyRoomSuccessModal';
import StudyRoomList from '../components/StudyRoomList';
import { useNavigate } from 'react-router-dom';
import type { MyStudyRoom, StudyRoomSuccessResponse } from '../types/studyroom.types';
import StudyRoomService from '../services/studyroomService';

function MainPage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdRoom, setCreatedRoom] = useState<StudyRoomSuccessResponse | null>(null);
  const [studyRooms, setStudyRooms] = useState<MyStudyRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMyStudyRooms();
  }, []);

  const fetchMyStudyRooms = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await StudyRoomService.getMyStudyRooms();
      setStudyRooms(data);
    } catch (error: any) {
      console.error('스터디룸 목록 조회 실패:', error);
      setError('스터디룸 목록을 불러오는데 실패했습니다.');

      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSuccess = (roomData: StudyRoomSuccessResponse) => {
    setCreatedRoom(roomData);
    setIsSuccessModalOpen(true);

    const newRoom: MyStudyRoom = {
      ...roomData,
      myRole: 'OWNER',
      joinedAt: new Date().toISOString(),
    };

    setStudyRooms((prev) => [newRoom, ...prev]);
  };

  const handleRoomClick = (roomId: number) => {
    navigate(`/studyroom/${roomId}`);
  };

  return (
    <div className="relative min-h-screen bg-blue-400">
      <Background size="large">
        <div className="absolute top-6 right-16">
          <UserProfile />
        </div>
        <div
          className="
          absolute left-1/2 -translate-x-1/2
          top-28 w-[1250px] px-8
          flex items-center justify-between
        "
        >
          <button
            onClick={() => setIsModalOpen(true)}
            className="
            bg-indigo-500 text-white px-6 py-2 rounded-full font-medium
            hover:bg-indigo-600 transition-colors
          "
          >
            스터디룸 생성
          </button>
          <div className="flex items-center gap-3">
            <input
              type="text"
              className="px-6 py-1 border-2 rounded-full outline-none"
              placeholder="검색어 입력"
            />
            <button
              className="
            border border-slate-300 text-slate-700 font-medium
            px-4 py-1.5 rounded-full
            hover:bg-slate-100 active:bg-slate-200
            focus:outline-none focus:ring-indigo-400 focus:ring-offset-1 focus:ring-2
            transition-colors duration-150"
            >
              검색
            </button>
          </div>
        </div>
        <div className="absolute mx-auto w-[1250px] h-[500px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-50 mt-14 rounded-[40px] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">스터디룸을 불러오는 중...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchMyStudyRooms}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
                >
                  다시 시도
                </button>
              </div>
            </div>
          ) : (
            <StudyRoomList rooms={studyRooms} onRoomClick={handleRoomClick} />
          )}
        </div>
      </Background>

      <StudyRoomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
      <StudyRoomSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        roomData={createdRoom}
      />
    </div>
  );
}

export default MainPage;
