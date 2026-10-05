import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import LanguageToggle from '../components/LanguageToggle';
import type { Messages } from '../i18n/locales/ko';
import { ISSUES_URL } from '../constants/links';

const EFFECTIVE_DATE = '2026-10-05';

type PolicySection = Messages['privacy']['sections'][number];

function PrivacyPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const sections = t('privacy.sections', { returnObjects: true }) as PolicySection[];

  return (
    <div className="min-h-screen bg-blue-400 px-4 py-10">
      <LanguageToggle />
      <main className="mx-auto max-w-3xl rounded-[40px] bg-white p-8 shadow-lg break-keep sm:p-12">
        <button
          type="button"
          onClick={() => (location.key === 'default' ? navigate('/') : navigate(-1))}
          className="text-sm text-blue-500 hover:underline"
        >
          {t('privacy.back')}
        </button>

        <h1 className="mt-4 text-2xl font-bold text-gray-900">{t('privacy.title')}</h1>
        <p className="mt-2 text-sm text-gray-500">
          {t('privacy.effectiveDate', { date: EFFECTIVE_DATE })}
        </p>
        <p className="mt-4 text-gray-700">{t('privacy.intro')}</p>

        {sections.map((section) => (
          <section key={section.title} className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-700">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}

        <p className="mt-6">
          <a
            href={ISSUES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {t('privacy.contactLink')}
          </a>
        </p>
      </main>
    </div>
  );
}

export default PrivacyPage;
