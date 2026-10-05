import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Background from '../components/Background';
import UserProfile from '../components/UserProfile';
import StudyRoomModal from '../components/StudyRoomModal';
import StudyRoomSuccessModal from '../components/StudyRoomSuccessModal';
import JoinByInviteModal from '../components/JoinByInviteModal';
import StudyRoomList from '../components/StudyRoomList';
import LanguageToggle from '../components/LanguageToggle';
import { useNavigate } from 'react-router-dom';
import type { MyStudyRoom, StudyRoomSuccessResponse } from '../types/studyroom.types';
import StudyRoomService from '../services/studyroomService';
import api from '../services/api';

interface UserInfo {
  id: number;
  nickname: string;
  profileImage?: string;
}

function MainPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [createdRoom, setCreatedRoom] = useState<StudyRoomSuccessResponse | null>(null);
  const [studyRooms, setStudyRooms] = useState<MyStudyRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    fetchUserInfo();
    fetchMyStudyRooms();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await api.get('/auth/me');

      if (response.data.success && response.data.data.user) {
        setCurrentUser(response.data.data.user);
      }
    } catch (error: any) {
      console.error('Failed to fetch user info:', error);
    }
  };

  const fetchMyStudyRooms = async () => {
    try {
      setIsLoading(true);
      setLoadFailed(false);
      const data = await StudyRoomService.getMyStudyRooms();
      setStudyRooms(data);
    } catch (error: any) {
      console.error('Failed to fetch study rooms:', error);
      setLoadFailed(true);

      if (error.response?.status === 401) {
        navigate('/');
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

  const handleDeleteRoom = async (roomId: number) => {
    if (!confirm(t('main.deleteConfirm'))) return;

    try {
      await api.delete(`/studyrooms/${roomId}`);
      await fetchMyStudyRooms();
    } catch (error) {
      alert(t('main.deleteFailed'));
    }
  };

  return (
    <div className="relative min-h-screen bg-blue-400">
      <Background size="large">
        <div className="w-full h-full flex flex-col px-6 pb-11">
          <div className="flex items-center justify-end gap-2 pt-6 pr-10">
            <LanguageToggle inline />
            <UserProfile user={currentUser} />
          </div>
          <div className="mt-4 mb-1 px-8 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="
                bg-indigo-500 text-white px-6 py-2 rounded-full font-medium
                hover:bg-indigo-600 transition-colors
              "
              >
                {t('main.createRoom')}
              </button>
              <button
                onClick={() => setIsJoinModalOpen(true)}
                className="
                border-2 border-indigo-500 text-indigo-600 bg-white px-6 py-1.5 rounded-full font-medium
                hover:bg-indigo-50 transition-colors
              "
              >
                {t('main.joinByInvite')}
              </button>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <input
                type="text"
                className="min-w-0 flex-1 sm:flex-none px-6 py-1 border-2 rounded-full outline-none"
                placeholder={t('main.searchPlaceholder')}
              />
              <button
                className="
              border border-slate-300 text-slate-700 font-medium
              px-4 py-1.5 rounded-full
              hover:bg-slate-100 active:bg-slate-200
              focus:outline-none focus:ring-indigo-400 focus:ring-offset-1 focus:ring-2
              transition-colors duration-150"
              >
                {t('main.search')}
              </button>
            </div>
          </div>
          <div className="flex-1 min-h-0 bg-orange-50 rounded-[40px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">{t('main.loadingRooms')}</p>
                </div>
              </div>
            ) : loadFailed ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-red-600 mb-4">{t('main.loadFailed')}</p>
                  <button
                    onClick={fetchMyStudyRooms}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
                  >
                    {t('common.retry')}
                  </button>
                </div>
              </div>
            ) : (
              <StudyRoomList
                rooms={studyRooms}
                onRoomClick={handleRoomClick}
                onDeleteRoom={handleDeleteRoom}
              />
            )}
          </div>
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
      <JoinByInviteModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onSuccess={fetchMyStudyRooms}
      />
    </div>
  );
}

export default MainPage;
