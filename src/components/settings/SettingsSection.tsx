import type { ReactNode } from 'react';

interface SettingsSectionProps {
  title: string;
  children: ReactNode;
  tone?: 'default' | 'danger';
}

function SettingsSection({ title, children, tone = 'default' }: SettingsSectionProps) {
  return (
    <section
      className={`rounded-2xl border p-6 ${tone === 'danger' ? 'border-rose-200' : 'border-gray-200'}`}
    >
      <h2
        className={`text-lg font-semibold ${tone === 'danger' ? 'text-rose-700' : 'text-gray-900'}`}
      >
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default SettingsSection;
