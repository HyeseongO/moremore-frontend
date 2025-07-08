import { useNavigate } from 'react-router-dom';

export interface UserInfo {
  id: number;
  nickname: string;
  profileImage?: string;
}

interface UserInfoProps {
  user: UserInfo | null;
}

function UserProfile({ user }: UserInfoProps) {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/main/settings');
  };

  if (!user) {
    return (
      <div
        className="user-profile flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 rounded-lg transition"
        onClick={handleProfileClick}
      >
        <div className="profile-image w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
          <svg viewBox="0 0 24 24" fill="#999" className="w-6 h-6">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
        <span className="nickname text-gray-800 font-medium">로딩중...</span>
      </div>
    );
  }

  return (
    <div
      className="user-profile flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 rounded-lg transition"
      onClick={handleProfileClick}
    >
      <div className="profile-image w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
        {user.profileImage ? (
          <img src={user.profileImage} alt={user.nickname} className="w-full h-full object-cover" />
        ) : (
          <span className="text-sm font-medium text-gray-600">
            {user.nickname && user.nickname.length > 0 ? user.nickname[0].toUpperCase() : '?'}
          </span>
        )}
      </div>
      <span className="nickname text-gray-800 font-medium">{user.nickname}</span>
    </div>
  );
}

export default UserProfile;
