import { StoredUser } from '../interfaces/User';

const USER_LOCALSTORAGE_KEY = 'chirper_user';

const getStoredUser = (): StoredUser | null => {
  const storedUser = localStorage.getItem(USER_LOCALSTORAGE_KEY);
  return storedUser ? JSON.parse(storedUser) : null;
};

const setStoredUser = (user: StoredUser): void => {
  localStorage.setItem(USER_LOCALSTORAGE_KEY, JSON.stringify(user));
};

const clearStoredUser = (): void => {
  localStorage.removeItem(USER_LOCALSTORAGE_KEY);
};

export { getStoredUser, setStoredUser, clearStoredUser };
