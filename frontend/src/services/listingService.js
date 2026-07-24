import API from './api';

export const getAllListings = (filters = {}) => API.get('/listings', { params: filters });
export const getListingById = (id) => API.get(`/listings/${id}`);
export const createListing = (listingData) => API.post('/listings', listingData);
export const updateListing = (id, listingData) => API.put(`/listings/${id}`, listingData);
export const deleteListing = (id) => API.delete(`/listings/${id}`);
export const getMyListings = () => API.get('/listings/my-listings');
export const uploadImages = (formData) => API.post('/listings/upload-images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});