// src/utils/auth.ts

const TOKEN_KEY = 'token';
const USER_KEY = 'userInfo';

export const setToken = (token: string): void => {
  console.log('Setting token:', token);
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  const token = localStorage.getItem(TOKEN_KEY);
  console.log('Getting token:', token);
  return token;
};

export const setUserInfo = (user: any): void => {
  console.log('Setting user info:', user);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUserInfo = (): any | null => {
  try {
    const userStr = localStorage.getItem(USER_KEY);
    const user = userStr ? JSON.parse(userStr) : null;
    console.log('Getting user info:', user);
    return user;
  } catch (error) {
    console.error('Error parsing user info:', error);
    return null;
  }
};

export const removeToken = (): void => {
  console.log('Removing token');
  localStorage.removeItem(TOKEN_KEY);
};

export const removeUserInfo = (): void => {
  console.log('Removing user info');
  localStorage.removeItem(USER_KEY);
};