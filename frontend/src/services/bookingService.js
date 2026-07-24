import API from './api';

export const createBooking = (bookingData) => API.post('/bookings', bookingData);
export const getMyBookings = () => API.get('/bookings/my-bookings');
export const getHostBookings = () => API.get('/bookings/host-bookings');
export const cancelBooking = (id) => API.put(`/bookings/${id}/cancel`);