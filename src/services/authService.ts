import api from './api';
import type { CurrentUser } from '../types/user.types';

export const fetchCurrentUser = async (): Promise<CurrentUser> => {
  const response = await api.get('/auth/me');
  return response.data.data.user;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const updateNickname = async (nickname: string): Promise<Omit<CurrentUser, 'isDemo'>> => {
  const response = await api.patch('/auth/me/nickname', { nickname });
  return response.data.data.user;
};

export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  await api.patch('/auth/me/password', { currentPassword, newPassword });
};

export const deleteAccount = async (password?: string): Promise<void> => {
  await api.delete('/auth/me', { data: password ? { password } : {} });
};
