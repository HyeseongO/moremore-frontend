import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import SettingsSection from './SettingsSection';
import { settingsInputClass } from './styles';
import { deleteAccount } from '../../services/authService';
import { translateApiError } from '../../utils/apiError';
import type { CurrentUser } from '../../types/user.types';

interface DeleteAccountSectionProps {
  user: CurrentUser;
  disabled: boolean;
}

function DeleteAccountSection({ user, disabled }: DeleteAccountSectionProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const needsPassword = user.authProvider === 'EMAIL';
  const canSubmit =
    confirmation === user.nickname && (!needsPassword || password.length > 0) && !isDeleting;

  const close = () => {
    if (isDeleting) return;
    setIsOpen(false);
    setConfirmation('');
    setPassword('');
    setError(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    setIsDeleting(true);
    setError(null);
    try {
      await deleteAccount(needsPassword ? password : undefined);
      alert(t('settings.delete.success'));
      navigate('/', { replace: true });
    } catch (err) {
      setError(translateApiError(err, 'settings.delete.failed'));
      setIsDeleting(false);
    }
  };

  return (
    <SettingsSection title={t('settings.delete.title')} tone="danger">
      <p className="text-sm text-gray-600">{t('settings.delete.description')}</p>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        className="mt-4 rounded-lg border border-rose-300 px-5 py-2 font-medium text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {t('settings.delete.open')}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={close} />
          <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
            <form
              onSubmit={handleSubmit}
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-account-title"
              className="pointer-events-auto w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl break-keep"
            >
              <h3 id="delete-account-title" className="text-xl font-bold text-gray-900">
                {t('settings.delete.modalTitle')}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{t('settings.delete.description')}</p>

              <label
                htmlFor="delete-confirmation"
                className="mt-5 mb-1 block text-sm font-medium text-gray-700"
              >
                {t('settings.delete.confirmLabel', { nickname: user.nickname })}
              </label>
              <input
                id="delete-confirmation"
                type="text"
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                autoComplete="off"
                autoFocus
                className={settingsInputClass}
              />

              {needsPassword && (
                <>
                  <label
                    htmlFor="delete-password"
                    className="mt-4 mb-1 block text-sm font-medium text-gray-700"
                  >
                    {t('settings.delete.passwordLabel')}
                  </label>
                  <input
                    id="delete-password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className={settingsInputClass}
                  />
                </>
              )}

              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={close}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-50"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="flex-1 rounded-lg bg-rose-600 px-4 py-2 font-medium text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isDeleting ? t('settings.delete.submitting') : t('settings.delete.submit')}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </SettingsSection>
  );
}

export default DeleteAccountSection;
