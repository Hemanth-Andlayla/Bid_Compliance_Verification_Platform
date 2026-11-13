import axiosClient from './axiosClient';

export const decisionApi = {
  submitDecision: (bidId, { decision, remarks }) =>
    axiosClient.post(`/officer/bids/${bidId}/decision`, { decision, remarks }),
  getDecisionByBidId: (bidId) => axiosClient.get(`/officer/bids/${bidId}/decision`),
};

export default decisionApi;
