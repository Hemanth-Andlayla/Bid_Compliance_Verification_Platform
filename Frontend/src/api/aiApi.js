import axiosClient from './axiosClient';

export const aiApi = {

  getSummaryByBidId: async (bidId) => {

    return await axiosClient.get(
      `/ai-summaries/bid/${bidId}`
    );

  },

};