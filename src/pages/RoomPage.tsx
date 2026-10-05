import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Background from '../components/Background';
import { useCallback, useEffect, useState } from 'react';
import api from '../services/api';
import type { StudyRoom } from '../types/studyroom.types';
import { IoChatbubbleEllipses } from 'react-icons/io5';
import { ChatSidebar } from '../components/ChatSidebar';
import type { Socket } from 'socket.io-client';
import AudioChat from '../components/media/AudioChat';
import { VideoChat } from '../components/VideoChat';
import LanguageToggle from '../components/LanguageToggle';

function RoomPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const [userNickname, setUserNickname] = useState('');
  const [roomInfo, setRoomInfo] = useState<StudyRoom | null>(null);
  const [roomMode, setRoomMode] = useState<'small' | 'large' | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  const [activeUsersCount, setActiveUsersCount] = useState(0);

  const handleSocketReady = useCallback(
    (newSocket: Socket) => {
      setSocket(newSocket);

      newSocket.on('room-count-update', (data: { roomId: string; currentMembers: number }) => {
        if (data.roomId === roomId) setActiveUsersCount(data.currentMembers);
      });

      newSocket.on('activeUserUpdate', (data: { roomId: string; count: number }) => {
        if (data.roomId === roomId) setActiveUsersCount(data.count);
      });

      newSocket.emit('getActiveUsers', { roomId });
    },
    [roomId]
  );

  useEffect(() => {
    return () => {
      if (socket && roomId) {
        socket.emit('leave-room', roomId);
      }
    };
  }, [socket, roomId]);

  useEffect(() => {
    return () => {
      if (socket) {
        socket.off('room-count-update');
        socket.off('activeUserUpdate');
      }
    };
  }, [socket]);

  useEffect(() => {
    if (roomId) {
      fetchUserInfo();
      fetchRoomInfo();
    }
  }, [roomId]);

  const fetchUserInfo = async () => {
    try {
      const { data } = await api.get('/auth/me');
      const user = data.data.user;
      if (user) {
        setUserNickname(user.nickname);
        setUserId(user.id);

        return data.token;
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    }
  };

  const fetchRoomInfo = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/studyrooms/${roomId}`);
      if (data) {
        setRoomInfo(data);
        setRoomMode(data.roomType === 'SMALL' ? 'small' : 'large');
      } else {
        setError('room.notFound');
      }
    } catch (error) {
      console.error('Failed to fetch study room:', error);
      setError('room.loadFailed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-amber-100">
        <Background size="large">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700 mx-auto"></div>
              <p className="mt-4 text-gray-600">{t('room.connecting')}</p>
            </div>
          </div>
        </Background>
      </div>
    );
  }

  if (error || !roomId || !roomInfo) {
    return (
      <div className="relative min-h-screen bg-amber-100">
        <Background size="large">
          <div className="flex items-center justify-center h-full">
            <div className="text-center bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-red-600">
                {t(error ?? 'room.notFound')}
              </h2>
              <Link
                to="/main"
                className="inline-block px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
              >
                {t('room.backToMain')}
              </Link>
            </div>
          </div>
        </Background>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-amber-100">
      <Background size="large">
        <div className="absolute top-6 left-16 z-10">
          <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-gray-800">{roomInfo.title}</h2>
            <p className="text-sm text-gray-600">
              {t('room.onlineCount', { current: activeUsersCount, max: roomInfo.maxMembers })}
            </p>
            <p className="text-xs text-gray-500">
              {t('room.totalMembers', { count: roomInfo._count?.members || 0 })}
            </p>
          </div>
        </div>

        <div className="absolute top-6 right-16 z-10 flex items-center gap-3">
          <LanguageToggle inline />
          <button
            onClick={() => navigate('/main')}
            className="px-8 py-1.5 rounded-lg bg-rose-200 hover:bg-rose-300 text-rose-800 font-medium"
          >
            {t('room.leave')}
          </button>
        </div>

        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          aria-label={t('chat.open')}
          className="fixed right-6 bottom-6 z-40 p-4 bg-indigo-500 text-white rounded-full shadow-lg hover:bg-indigo-600 transition"
        >
          <IoChatbubbleEllipses size={24} />
        </button>

        <div className="w-full h-full flex items-center justify-center">
          {roomMode === 'small' && (
            <VideoChat
              roomId={roomId}
              roomMode="small"
              userNickname={userNickname}
              onSocketReady={handleSocketReady}
            />
          )}

          {roomMode === 'large' && (
            <AudioChat
              roomId={roomId}
              userNickname={userNickname}
              onSocketReady={handleSocketReady}
            />
          )}
        </div>

        {socket && (
          <ChatSidebar
            roomId={roomId}
            socket={socket}
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            currentUserId={userId || 0}
            currentUserNickname={userNickname}
          />
        )}
      </Background>
    </div>
  );
}

export default RoomPage;
