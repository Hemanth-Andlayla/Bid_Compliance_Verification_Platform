import axiosClient from './axiosClient';

export const tenderApi = {
  getAllTenders: () => axiosClient.get('/tenders'),
  getTenderById: (id) => axiosClient.get(`/tenders/${id}`),
  createTender: (data) => axiosClient.post('/tenders', data),
};

export default tenderApi;
