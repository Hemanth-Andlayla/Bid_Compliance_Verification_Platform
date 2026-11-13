import axiosClient from './axiosClient';

export const adminApi = {
  getAuditLogs: (entityType, entityId) =>
    axiosClient.get(`/audit-logs/${entityType}/${entityId}`),
  getAllUsers: () => axiosClient.get('/users'),
  getAllTenders: () => axiosClient.get('/tenders'),
  getAllBids: () => axiosClient.get('/bids'),
};

export default adminApi;
