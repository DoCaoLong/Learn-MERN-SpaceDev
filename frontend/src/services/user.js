import axiosInstance from "@/configs/api";

export const usersService = {
  getUsers: () => axiosInstance.get(`/user`),
};
