import axiosInstance from "@/configs/api";

export const categoryService = {
  getCategories: () => axiosInstance.get(`/categories`),
};
