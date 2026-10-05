export interface DemoAccount {
  label: string;
  email: string;
  password: string;
}

const env = import.meta.env;

const candidates = [
  { label: '데모 1', email: env.VITE_DEMO_EMAIL_1, password: env.VITE_DEMO_PASSWORD_1 },
  { label: '데모 2', email: env.VITE_DEMO_EMAIL_2, password: env.VITE_DEMO_PASSWORD_2 },
] as { label: string; email?: string; password?: string }[];

export const DEMO_ACCOUNTS: DemoAccount[] = candidates.filter(
  (account): account is DemoAccount => Boolean(account.email && account.password),
);
