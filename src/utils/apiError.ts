import axios from 'axios';
import i18n from '../i18n';

type ErrorBody = Record<string, unknown> & { code?: unknown; message?: unknown };

const asErrorBody = (body: unknown): ErrorBody =>
  typeof body === 'object' && body !== null ? (body as ErrorBody) : {};

export const translateErrorBody = (body: unknown, fallbackKey: string): string => {
  const data = asErrorBody(body);
  const key = `errors.${String(data.code)}`;

  if (typeof data.code === 'string' && i18n.exists(key)) {
    return i18n.t(key, data);
  }

  if (i18n.resolvedLanguage === 'ko') {
    if (typeof data.message === 'string' && data.message) return data.message;
    if (Array.isArray(data.message) && data.message.length) return data.message.join(', ');
  }

  return i18n.t(fallbackKey);
};

export const translateApiError = (error: unknown, fallbackKey: string): string =>
  translateErrorBody(axios.isAxiosError(error) ? error.response?.data : undefined, fallbackKey);
