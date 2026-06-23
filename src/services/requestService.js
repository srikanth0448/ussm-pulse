import { api } from "./api/axiosClient";
import moment from "moment";

export const requestService = {
  getMyRequests: () => api.get("/my-requests"),
  // Create request via raise-a-request endpoint using encoded params
  createRequest: (payload) => {
    console.log("Payload in requestService:", payload);
    const params = {
      request_type: payload.request_text,
      request_date: payload.request_date,
      from_time: payload.from_time,
      to_time: payload.to_time,
      reason: payload.reason,
      from_date: payload.from_date,
      to_date: payload.to_date,
    };

    return api.post("/raise-a-request", null, { params });
  },

  updateRequest: (id, payload) => {
    const params = {
      request_type: payload.request_text,
      request_date: payload.request_date,
      from_time: payload.from_time,
      to_time: payload.to_time,
      reason: payload.reason,
      request_id: id,
      from_date: payload.from_date,
      to_date: payload.to_date,
    };

    return api.post("/edit-raise-request", null, { params });
  },
  cancelRequest: (id) => api.delete(`/my-requests/${id}`),
};

export default requestService;
