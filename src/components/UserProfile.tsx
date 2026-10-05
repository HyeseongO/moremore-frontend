import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, Settings } from 'lucide-react';
import { useLogout } from '../hooks/useLogout';

export interface UserInfo {
  id: number;
  nickname: string;
  profileImage?: string;
}

interface UserInfoProps {
  user: UserInfo | null;
}

function UserProfile({ user }: UserInfoProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout, isLoggingOut } = useLogout();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const initial = user?.nickname ? user.nickname[0].toUpperCase() : '?';

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={t('userMenu.open')}
        className="user-profile flex items-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition"
      >
        <div className="profile-image w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
          {user?.profileImage ? (
            <img src={user.profileImage} alt={user.nickname} className="w-full h-full object-cover" />
          ) : user ? (
            <span className="text-sm font-medium text-gray-600">{initial}</span>
          ) : (
            <svg viewBox="0 0 24 24" fill="#999" className="w-6 h-6">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          )}
        </div>
        <span className="nickname text-gray-800 font-medium">
          {user ? user.nickname : t('common.loading')}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full z-30 mt-1 w-44 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => navigate('/main/settings')}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Settings size={16} />
            {t('userMenu.settings')}
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={logout}
            disabled={isLoggingOut}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 disabled:opacity-50"
          >
            <LogOut size={16} />
            {isLoggingOut ? t('userMenu.loggingOut') : t('userMenu.logout')}
          </button>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
