export type AuthProvider = 'EMAIL' | 'GOOGLE';

export interface CurrentUser {
  id: number;
  email: string;
  nickname: string;
  authProvider: AuthProvider;
  profileImage?: string | null;
}
