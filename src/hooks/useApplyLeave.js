import { useState } from "react";
import { leaveService } from "../services/leaveService";
import { useAuth } from "../context/AuthContext";

export const useApplyLeave = () => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const applyLeave = async ({ form, startDate, endDate }) => {
    setSubmitting(true);
    setError(null);

    const from_date = startDate
      ? startDate.toISOString().split("T")[0]
      : form.fromDate || "";

    const to_date =
      endDate || startDate
        ? (endDate || startDate).toISOString().split("T")[0]
        : form.toDate || "";

    const payload = {
      leave_type: form.leaveType,
      leave_for: form.leaveFor,
      from_date,
      to_date,
      num_of_days: form.noOfDays,
      worked_on: form.reason || "",
      comp_off: form.leaveType === "12" ? 1 : "",
      optional_holiday_type: form.leaveType === "13" ? 1 : "",
      latitude: "",
      longitude: "",
    };

    // attach current user id (Auth context or sessionStorage fallback)
    payload.user_id = user?.user_id || sessionStorage.getItem("userid") || "";

    if (typeof navigator !== "undefined" && navigator.geolocation) {
      try {
        const pos = await new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            maximumAge: 60000,
            timeout: 5000,
          }),
        );

        payload.latitude = pos.coords.latitude;
        payload.longitude = pos.coords.longitude;
      } catch (err) {
        // ignore geolocation errors
      }
    }

    try {
      const response = await leaveService.applyLeave(payload);
      console.log("Leave applied successfully:", response);
      return response.data;
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Failed to apply leave";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return { applyLeave, submitting, error, setError };
};
