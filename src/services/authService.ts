import api from './api';
import type { CurrentUser } from '../types/user.types';

export const fetchCurrentUser = async (): Promise<CurrentUser> => {
  const response = await api.get('/auth/me');
  return response.data.data.user;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};
