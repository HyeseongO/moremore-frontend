import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import SettingsSection from './SettingsSection';
import { settingsButtonClass, settingsInputClass } from './styles';
import { updateNickname } from '../../services/authService';
import { translateApiError } from '../../utils/apiError';
import { validateNickname } from '../../utils/validation';

interface NicknameFormProps {
  nickname: string;
  disabled: boolean;
  onChanged: (nickname: string) => void;
}

function NicknameForm({ nickname, disabled, onChanged }: NicknameFormProps) {
  const { t } = useTranslation();
  const [value, setValue] = useState(nickname);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaved(false);
    setServerError(null);

    const [firstError] = validateNickname(value);
    setErrorKey(firstError ?? null);
    if (firstError) return;

    setIsSaving(true);
    try {
      const user = await updateNickname(value);
      onChanged(user.nickname);
      setSaved(true);
    } catch (error) {
      setServerError(translateApiError(error, 'settings.nickname.failed'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SettingsSection title={t('settings.nickname.title')}>
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="settings-nickname" className="mb-2 block text-sm font-medium text-gray-700">
          {t('settings.nickname.label')}
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id="settings-nickname"
            type="text"
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setErrorKey(null);
              setServerError(null);
              setSaved(false);
            }}
            disabled={disabled}
            maxLength={20}
            className={settingsInputClass}
          />
          <button
            type="submit"
            disabled={disabled || isSaving || value === nickname}
            className={`${settingsButtonClass} shrink-0`}
          >
            {isSaving ? t('settings.saving') : t('settings.save')}
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">{t('settings.nickname.hint')}</p>
        {errorKey && <p className="mt-2 text-sm text-red-600">{t(errorKey)}</p>}
        {serverError && <p className="mt-2 text-sm text-red-600">{serverError}</p>}
        {saved && (
          <p role="status" className="mt-2 text-sm text-green-600">
            {t('settings.nickname.success')}
          </p>
        )}
      </form>
    </SettingsSection>
  );
}

export default NicknameForm;
