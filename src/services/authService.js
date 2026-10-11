import api from './api';

export const login = async (mobile, password) => {
  const response = await api.post('/api/auth/login', {
    mobile: mobile.trim(),
    password: password,
  });

  const data = response.data;
  let token = data.token || data;

  if (typeof token === 'object') {
    token = token.token || token.jwt || token.accessToken;
  }

  if (typeof token !== 'string') {
    throw new Error('Invalid token received from server');
  }

  token = token.trim();

  // Save the real JWT token
  localStorage.setItem('srq_token', token);

  // Authenticated user object directly from backend
  const user = {
    userId: data.userId,
    name: data.name,
    mobile: data.mobile || mobile.trim(),
    role: data.role, // Determined strictly by the backend
    shopCode: data.shopCode || null,
  };

  localStorage.setItem('srq_user', JSON.stringify(user));

  return { token, user };
};

export const register = async (name, mobile, password, cardNumber = '', shopCode = '') => {
  const payload = {
    name: name.trim(),
    mobile: mobile.trim(),
    password: password,
  };

  if (cardNumber && cardNumber.trim()) {
    payload.cardNumber = cardNumber.trim();
  }
  if (shopCode && shopCode.trim()) {
    payload.shopCode = shopCode.trim();
  }

  const response = await api.post('/api/auth/register', payload);
  const data = response.data;
  const token = data.token;

  if (token) {
    localStorage.setItem('srq_token', token);
    const user = {
      userId: data.userId,
      name: data.name,
      mobile: data.mobile || mobile.trim(),
      role: data.role || 'BENEFICIARY',
      shopCode: data.shopCode || null,
    };
    localStorage.setItem('srq_user', JSON.stringify(user));
    return { token, user };
  }

  return data;
};

export const logout = () => {
  localStorage.removeItem('srq_token');
  localStorage.removeItem('srq_user');
};

export const getCurrentUser = () => {
  const stored = localStorage.getItem('srq_user');
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export const getToken = () => {
  return localStorage.getItem('srq_token');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('srq_token');
};
