import api from './api';

export const getSlots = async (shopCode) => {
  const response = await api.get(`/api/queue-slots/dealer/${encodeURIComponent(shopCode)}`);
  return response.data;
};

export const getSlotsByDate = async (shopCode, date) => {
  const response = await api.get(`/api/queue-slots/dealer/${encodeURIComponent(shopCode)}/date/${encodeURIComponent(date)}`);
  return response.data;
};

export const createSlot = async (shopCode, slotData) => {
  const startTime = (slotData.startTime || '').slice(0, 5);
  const endTime = (slotData.endTime || '').slice(0, 5);

  const response = await api.post(`/api/queue-slots/dealer/${encodeURIComponent(shopCode)}`, {
    slotDate: slotData.slotDate,
    startTime: startTime,
    endTime: endTime,
    capacity: parseInt(slotData.capacity, 10),
  });
  return response.data;
};
