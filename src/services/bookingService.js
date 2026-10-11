import api from './api';

export const bookSlot = async (slotId) => {
  const response = await api.post(`/api/bookings/${slotId}`);
  return response.data;
};

export const getMyBookings = async () => {
  const response = await api.get('/api/bookings/my-bookings');
  return response.data;
};

export const cancelBooking = async (bookingId) => {
  const response = await api.delete(`/api/bookings/${bookingId}`);
  return response.data;
};
