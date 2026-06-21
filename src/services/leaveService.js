import { api } from "../services/api/axiosClient";

export const leaveService = {
  getMyLeaves: () => api.get("/my-leaves"),
};
