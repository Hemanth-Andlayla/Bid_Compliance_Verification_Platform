import axiosClient from './axiosClient';

export const documentApi = {
  getDocumentById: (id) => axiosClient.get(`/documents/${id}`),
  getDocumentsByBidId: (bidId) => axiosClient.get(`/documents/bid/${bidId}`),
};

export default documentApi;
