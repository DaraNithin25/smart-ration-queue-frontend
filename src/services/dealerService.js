import api from './api';

export const getAllDealers = async () => {
  const response = await api.get('/api/dealers');
  return response.data;
};

export const getDealerByShopCode = async (shopCode) => {
  const response = await api.get(`/api/dealers/${encodeURIComponent(shopCode)}`);
  return response.data;
};

export const getMyRationCard = async () => {
  const response = await api.get('/api/ration-cards/my-card');
  return response.data;
};
