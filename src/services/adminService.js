import api from './api';

export const createDealer = async (dealerData) => {
  const response = await api.post('/api/admin/dealers', dealerData);
  return response.data;
};

export const linkDealer = async (linkData) => {
  const response = await api.post('/api/admin/link-dealer', linkData);
  return response.data;
};

export const getAllDealers = async () => {
  const response = await api.get('/api/admin/dealers');
  return response.data;
};

export const getSystemStats = async () => {
  const response = await api.get('/api/admin/stats');
  return response.data;
};

export const assignRationCard = async (cardData) => {
  const response = await api.post('/api/admin/assign-card', cardData);
  return response.data;
};
