import { api } from "../api/axiosClient";

 const clockinclockoutservice = {
  getHomeInfo: () =>
    api.get("/home-page-info"),

  clockInOut: (params) =>
    api.post(
      "/clock-in-or-clock-out",
      null,
      {
        params,
      }
    ),
};


export default clockinclockoutservice;