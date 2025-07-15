import { Link, useParams } from 'react-router-dom';
import Background from '../components/Background';
import { useCallback, useEffect, useState } from 'react';
import { VideoChat } from '../components/VideoChat';
import api from '../services/api';
import type { StudyRoom } from '../types/studyroom.types';
import { IoChatbubbleEllipses } from 'react-icons/io5';
import { ChatSidebar } from '../components/ChatSidebar';
import type { Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

function RoomPage() {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const [userNickname, setUserNickname] = useState('');
  const [roomInfo, setRoomInfo] = useState<StudyRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  const [activeUsersCount, setActiveUsersCount] = useState(0);

  const handleSocketReady = useCallback(
    (newSocket: Socket) => {
      console.log('RoomPage: Socket ready, setting up listeners');
      setSocket(newSocket);

      newSocket.on('room-count-update', (data: { roomId: string; currentMembers: number }) => {
        if (data.roomId === roomId) setActiveUsersCount(data.currentMembers);
      });

      newSocket.on('activeUserUpdate', (data: { roomId: string; count: number }) => {
        if (data.roomId === roomId) setActiveUsersCount(data.count);
      });

      console.log('Requesting active users for room:', roomId);
      newSocket.emit('getActiveUsers', { roomId });
    },
    [roomId]
  );

  const handleLeaveRoom = useCallback(async () => {
    if (socket && roomId) {
      socket.emit('leave-room', roomId);

      setTimeout(() => {
        navigate('/main');
      }, 100);
    } else {
      navigate('/main');
    }
  }, [socket, roomId, navigate]);

  useEffect(() => {
    return () => {
      if (socket && roomId) {
        console.log('RoomPage unmounting, leaving room:', roomId);
        socket.emit('leave-room', roomId);
      }
    };
  }, [socket, roomId]);

  useEffect(() => {
    return () => {
      if (socket) {
        console.log('RoomPage: Cleaning up socket listeners');
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
      if (data) {
        setUserNickname(data.nickname);
        setUserId(data.id);
        return data.token;
      }
    } catch (error) {
      console.error('사용자 정보 조회 실채:', error);
    }
  };

  const fetchRoomInfo = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/studyrooms/${roomId}`);
      if (data) {
        setRoomInfo(data);
      } else {
        setError('존재하지 않는 스터디룸 입니다.');
      }
    } catch (error: any) {
      console.error('스터디룸 정보 조회 실패:', error);
      setError('스터디룸 정보를 불러올 수 없습니다.');
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
              <p className="mt-4 text-gray-600">스터디룸에 접속 중...</p>
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
                {error || '존재하지 않는 스터디룸입니다'}
              </h2>
              <Link
                to="/main"
                className="inline-block px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
              >
                메인으로 돌아가기
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
              현재 접속자: {activeUsersCount}명 / {roomInfo.maxMembers}명
            </p>
            <p className="text-xs text-gray-500">(전체 멤버: {roomInfo._count?.members || 0}명)</p>
          </div>
        </div>

        <div className="absolute top-6 right-16 z-10" onClick={handleLeaveRoom}>
          <Link
            to="/main"
            className="px-8 py-1.5 rounded-lg bg-rose-200 hover:bg-rose-300 text-rose-800 font-medium"
          >
            나가기
          </Link>
        </div>

        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="fixed right-6 bottom-6 z-40 p-4 bg-indigo-500 text-white rounded-full shadow-lg hover:bg-indigo-600 transition"
        >
          <IoChatbubbleEllipses size={24} />
        </button>

        <div className="w-full h-full flex items-center justify-center">
          <VideoChat
            roomId={roomId}
            userNickname={userNickname || '참가자'}
            onSocketReady={handleSocketReady}
          />
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
