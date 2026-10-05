import { io } from 'socket.io-client';
import api, { API_URL } from './api';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || API_URL;

const fetchSocketToken = async () => {
  const response = await api.get('/auth/socket-token');
  return response.data.data.token as string;
};

export const createSocket = () =>
  io(SOCKET_URL, {
    transports: ['websocket'],
    auth: (callback) => {
      fetchSocketToken()
        .then((token) => callback({ token }))
        .catch(() => callback({}));
    },
  });
