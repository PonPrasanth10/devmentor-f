import api from './axiosInstance';

export const createReview = (code, language) => api.post('/review', { code, language });
export const getReviewHistory = (page = 1) => api.get(`/review/history?page=${page}`);
export const getReview = (id) => api.get(`/review/${id}`);
export const deleteReview = (id) => api.delete(`/review/${id}`);
