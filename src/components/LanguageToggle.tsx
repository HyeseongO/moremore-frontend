import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../i18n';

interface LanguageToggleProps {
  inline?: boolean;
}

function LanguageToggle({ inline = false }: LanguageToggleProps) {
  const { t, i18n } = useTranslation();
  const current = i18n.resolvedLanguage;

  return (
    <div
      role="group"
      aria-label={t('language.label')}
      className={`${
        inline ? 'shrink-0' : 'fixed right-4 top-4 z-50'
      } flex overflow-hidden rounded-full bg-white/90 text-sm shadow`}
    >
      {SUPPORTED_LANGUAGES.map((language) => (
        <button
          key={language}
          type="button"
          lang={language}
          aria-pressed={current === language}
          onClick={() => i18n.changeLanguage(language)}
          className={`px-3 py-1 transition-colors ${
            current === language
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {t(`language.${language}`)}
        </button>
      ))}
    </div>
  );
}

export default LanguageToggle;
