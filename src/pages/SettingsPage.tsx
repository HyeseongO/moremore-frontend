import { useEffect, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ExternalLink, LogOut } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../i18n';
import { ISSUES_URL } from '../constants/links';
import { useLogout } from '../hooks/useLogout';
import { fetchCurrentUser } from '../services/authService';
import type { CurrentUser } from '../types/user.types';

function SettingsSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { logout, isLoggingOut } = useLogout();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    fetchCurrentUser()
      .then(setUser)
      .catch((error) => {
        console.error('Failed to fetch user info:', error);
        setLoadFailed(true);
      });
  }, []);

  return (
    <div className="min-h-screen bg-blue-400 px-4 py-10">
      <main className="mx-auto max-w-2xl rounded-[40px] bg-white p-6 shadow-lg break-keep sm:p-10">
        <Link to="/main" className="text-sm text-blue-500 hover:underline">
          {t('settings.backToMain')}
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">{t('settings.title')}</h1>

        <div className="mt-8 space-y-6">
          <SettingsSection title={t('settings.profile.title')}>
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.nickname}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-semibold text-gray-600">
                      {user.nickname[0]?.toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold text-gray-900">{user.nickname}</p>
                  <p className="truncate text-sm text-gray-600">{user.email}</p>
                  <span className="mt-1 inline-block rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                    {t(`settings.profile.providers.${user.authProvider}`)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                {loadFailed ? t('settings.profile.loadFailed') : t('common.loading')}
              </p>
            )}
          </SettingsSection>

          <SettingsSection title={t('settings.language.title')}>
            <p className="text-sm text-gray-600">{t('settings.language.description')}</p>
            <div
              role="group"
              aria-label={t('settings.language.title')}
              className="mt-3 inline-flex overflow-hidden rounded-full border border-gray-200"
            >
              {SUPPORTED_LANGUAGES.map((language) => {
                const selected = i18n.resolvedLanguage === language;
                return (
                  <button
                    key={language}
                    type="button"
                    lang={language}
                    aria-pressed={selected}
                    onClick={() => i18n.changeLanguage(language)}
                    className={`px-5 py-2 text-sm transition-colors ${
                      selected ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {t(`settings.language.names.${language}`)}
                  </button>
                );
              })}
            </div>
          </SettingsSection>

          <SettingsSection title={t('settings.about.title')}>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="text-blue-600 hover:underline">
                  {t('settings.about.privacy')}
                </Link>
              </li>
              <li>
                <a
                  href={ISSUES_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                >
                  {t('settings.about.contact')}
                  <ExternalLink size={14} />
                </a>
              </li>
            </ul>
          </SettingsSection>

          <button
            type="button"
            onClick={logout}
            disabled={isLoggingOut}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 py-3 font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
          >
            <LogOut size={18} />
            {isLoggingOut ? t('userMenu.loggingOut') : t('userMenu.logout')}
          </button>
        </div>
      </main>
    </div>
  );
}

export default SettingsPage;
