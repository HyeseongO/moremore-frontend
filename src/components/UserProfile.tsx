import { useNavigate } from 'react-router-dom';

function UserProfile() {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/main/settings');
  };

  return (
    <div className="user-profile" onClick={handleProfileClick}>
      <div className="profile-image">
        <svg viewBox="0 0 24 24" fill="#999">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      </div>
      <span className="nickname">닉네임</span>
    </div>
  );
}

export default UserProfile;
