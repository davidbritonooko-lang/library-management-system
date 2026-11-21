import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: { Accept: 'application/json' },
});

export async function getBooks({ search = '', genreId = '', page = 1, limit = 12, signal } = {}) {
  const response = await api.get('/books', {
    params: { search: search || undefined, genreId: genreId || undefined, page, limit },
    signal,
  });
  return response.data;
}

export async function getBook(id, signal) {
  const response = await api.get('/books/' + encodeURIComponent(id), { signal });
  return response.data;
}

export async function getGenres(signal) {
  const response = await api.get('/genres', { signal });
  return response.data;
}

export function getApiError(error) {
  if (axios.isCancel(error) || error?.code === 'ERR_CANCELED') return '';
  if (error?.code === 'ECONNABORTED' || error?.code === 'ERR_NETWORK') {
    return 'We could not reach the library server. Check that the API is running and try again.';
  }
  return error?.response?.data?.message || 'Something went wrong. Please try again.';
}

export default api;