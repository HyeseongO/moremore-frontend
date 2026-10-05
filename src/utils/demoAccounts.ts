export interface DemoAccount {
  number: number;
  email: string;
  password: string;
}

const env = import.meta.env;

const candidates = [
  { number: 1, email: env.VITE_DEMO_EMAIL_1, password: env.VITE_DEMO_PASSWORD_1 },
  { number: 2, email: env.VITE_DEMO_EMAIL_2, password: env.VITE_DEMO_PASSWORD_2 },
] as { number: number; email?: string; password?: string }[];

export const DEMO_ACCOUNTS: DemoAccount[] = candidates.filter(
  (account): account is DemoAccount => Boolean(account.email && account.password),
);
