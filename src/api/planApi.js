import api from './axiosInstance';

export const createPlan = (prompt) => api.post('/plan', { prompt });
export const getPlanHistory = (page = 1) => api.get(`/plan/history?page=${page}`);
export const getPlan = (id) => api.get(`/plan/${id}`);
export const deletePlan = (id) => api.delete(`/plan/${id}`);
