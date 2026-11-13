import axiosClient from './axiosClient';

export const userApi = {
  register: (data) => axiosClient.post('/auth/register', data),
  getUser: (id) => axiosClient.get(`/users/${id}`),
  getAllUsers: () => axiosClient.get('/users'),
};

export default userApi;
