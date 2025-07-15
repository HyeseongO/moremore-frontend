import { Users, Crown, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { io, type Socket } from 'socket.io-client';

export interface StudyRoom {
  id: number;
  title: string;
  description?: string;
  roomType: 'SMALL' | 'LARGE';
  maxMembers: number;
  owner: {
    id: number;
    nickname: string;
    profileImage?: string;
  };
  createdAt: string;
  myRole: 'OWNER' | 'ADMIN' | 'MEMBER';
  _count?: {
    members: number;
  };
}

interface StudyRoomListProps {
  rooms: StudyRoom[];
  onRoomClick?: (roomId: number) => void;
}

interface ActiveUsersMap {
  [roomId: number]: number;
}

function StudyRoomList({ rooms, onRoomClick }: StudyRoomListProps) {
  const [activeUsersMap, setActiveUsersMap] = useState<ActiveUsersMap>({});
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('accessToken='))
      ?.split('=')[1];

    const newSocket = io('http://localhost:8000', {
      auth: {
        token: token,
      },
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('StudyRoomList socket connected');

      rooms.forEach((room) => {
        newSocket.emit('getActiveUsers', { roomId: room.id.toString() });
      });
    });

    newSocket.on('room-count-update', (data: { roomId: string; currentMembers: number }) => {
      setActiveUsersMap((prev) => ({
        ...prev,
        [parseInt(data.roomId)]: data.currentMembers,
      }));
    });

    newSocket.on('activeUserUpdate', (data: { roomId: string; count: number }) => {
      setActiveUsersMap((prev) => ({
        ...prev,
        [parseInt(data.roomId)]: data.count,
      }));
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [rooms]);

  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-gray-500">
        <div className="text-6xl mb-4">📚</div>
        <p className="text-xl font-medium mb-2">아직 참여한 스터디룸이 없습니다</p>
        <p className="text-gray-400">스터디룸을 생성하거나 초대 링크로 참여해보세요!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {rooms.map((room) => {
        const activeUsers = activeUsersMap[room.id] || 0;

        return (
          <div
            key={room.id}
            onClick={() => onRoomClick?.(room.id)}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            {room.myRole === 'OWNER' && (
              <div className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full mb-3">
                <Crown size={12} />
                <span>방장</span>
              </div>
            )}

            <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">{room.title}</h3>

            {room.description && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{room.description}</p>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Users size={16} />
                  <span>참여 현황</span>
                </div>
                <span
                  className={`font-medium ${activeUsers > 0 ? 'text-green-600' : 'text-gray-800'}`}
                >
                  {activeUsers}/{room.maxMembers}명
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <div
                    className={`w-4 h-4 rounded ${
                      room.roomType === 'SMALL' ? 'bg-blue-500' : 'bg-purple-500'
                    }`}
                  />
                  <span>규모</span>
                </div>
                <span className="font-medium text-gray-800">
                  {room.roomType === 'SMALL' ? '소규모' : '대규모'}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={16} />
                  <span>생성일</span>
                </div>
                <span className="font-medium text-gray-800">
                  {new Date(room.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  {room.owner.profileImage ? (
                    <img
                      src={room.owner.profileImage}
                      alt={room.owner.nickname}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-medium text-gray-600">
                      {room.owner.nickname[0]}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500">방장</p>
                  <p className="text-sm font-medium text-gray-800">{room.owner.nickname}</p>
                </div>
              </div>
            </div>

            <button
              className={`w-full mt-4 py-2 rounded-lg transition ${
                activeUsers > 0
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
              onClick={(event) => {
                event.stopPropagation();
                onRoomClick?.(room.id);
              }}
            >
              {activeUsers > 0 ? '입장하기 (접속 중)' : '입장하기'}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default StudyRoomList;
