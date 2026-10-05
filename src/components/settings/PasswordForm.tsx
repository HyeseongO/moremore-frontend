import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import SettingsSection from './SettingsSection';
import { settingsButtonClass, settingsInputClass } from './styles';
import { changePassword } from '../../services/authService';
import { translateApiError } from '../../utils/apiError';
import { validatePassword } from '../../utils/validation';

interface PasswordFormProps {
  disabled: boolean;
}

const EMPTY_FORM = { currentPassword: '', newPassword: '', confirmPassword: '' };

function PasswordForm({ disabled }: PasswordFormProps) {
  const { t } = useTranslation();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errorKeys, setErrorKeys] = useState<string[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof typeof EMPTY_FORM) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrorKeys([]);
    setServerError(null);
    setSaved(false);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaved(false);
    setServerError(null);

    const errors = [
      ...(form.currentPassword ? [] : ['settings.password.currentRequired']),
      ...validatePassword(form.newPassword),
      ...(form.newPassword === form.confirmPassword ? [] : ['settings.password.mismatch']),
    ];
    setErrorKeys(errors);
    if (errors.length > 0) return;

    setIsSaving(true);
    try {
      await changePassword(form.currentPassword, form.newPassword);
      setForm(EMPTY_FORM);
      setSaved(true);
    } catch (error) {
      setServerError(translateApiError(error, 'settings.password.failed'));
    } finally {
      setIsSaving(false);
    }
  };

  const fields = [
    { id: 'currentPassword', label: t('settings.password.current'), autoComplete: 'current-password' },
    { id: 'newPassword', label: t('settings.password.new'), autoComplete: 'new-password' },
    { id: 'confirmPassword', label: t('settings.password.confirm'), autoComplete: 'new-password' },
  ] as const;

  return (
    <SettingsSection title={t('settings.password.title')}>
      <form onSubmit={handleSubmit} noValidate className="space-y-3">
        {fields.map((field) => (
          <div key={field.id}>
            <label
              htmlFor={`settings-${field.id}`}
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              {field.label}
            </label>
            <input
              id={`settings-${field.id}`}
              type="password"
              autoComplete={field.autoComplete}
              value={form[field.id]}
              onChange={(event) => handleChange(field.id)(event.target.value)}
              disabled={disabled}
              maxLength={20}
              placeholder={field.id === 'newPassword' ? t('settings.password.newPlaceholder') : undefined}
              className={settingsInputClass}
            />
          </div>
        ))}
        {errorKeys.map((key) => (
          <p key={key} className="text-sm text-red-600">
            {t(key)}
          </p>
        ))}
        {serverError && <p className="text-sm text-red-600">{serverError}</p>}
        {saved && (
          <p role="status" className="text-sm text-green-600">
            {t('settings.password.success')}
          </p>
        )}
        <button type="submit" disabled={disabled || isSaving} className={settingsButtonClass}>
          {isSaving ? t('settings.saving') : t('settings.password.submit')}
        </button>
      </form>
    </SettingsSection>
  );
}

export default PasswordForm;
