
import axiosClient from './axiosClient';

export const documentApi = {

  getDocumentsByBidId: async (bidId) => {

    return await axiosClient.get(
      `/documents/bid/${bidId}`
    );

  },


  getDocumentById: async (documentId) => {

    return await axiosClient.get(
      `/documents/${documentId}`
    );

  },


  getDocumentFile: async (documentId) => {

    return await axiosClient.get(
      `/documents/${documentId}/file`,
      {
        responseType: 'blob',
      }
    );

  },

};
