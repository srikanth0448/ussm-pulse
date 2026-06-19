import { api } from "../api/axiosClient";

export const leaveService = {
  getMyLeaves: () => api.get("/my-leaves"),
};
