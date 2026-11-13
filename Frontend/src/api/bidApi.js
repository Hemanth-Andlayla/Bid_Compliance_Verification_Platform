import axiosClient from './axiosClient';

export const bidApi = {
  getAllBids: () => axiosClient.get('/bids'),
  getBidById: (id) => axiosClient.get(`/bids/${id}`),

  /**
   * Submit bid with multipart data matching Spring Boot @RequestPart requirements:
   * - 'bidData': JSON blob (application/json)
   * - 'documentTypes': JSON blob (application/json)
   * - 'files': MultipartFile[]
   */
  submitBid: ({ tenderId, quotedPrice, bidderDetails, documentTypes, files }) => {
    const formData = new FormData();

    const bidDataObj = {
      tenderId: Number(tenderId),
      quotedPrice: Number(quotedPrice),
      bidderDetails: {
        name: bidderDetails.name,
        pan: bidderDetails.pan,
        gstin: bidderDetails.gstin,
        udyamNumber: bidderDetails.udyamNumber || null,
        address: bidderDetails.address,
      },
    };

    formData.append(
      'bidData',
      new Blob([JSON.stringify(bidDataObj)], { type: 'application/json' })
    );

    formData.append(
      'documentTypes',
      new Blob([JSON.stringify(documentTypes)], { type: 'application/json' })
    );

    files.forEach((file) => {
      formData.append('files', file);
    });

    return axiosClient.post('/bids', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default bidApi;
