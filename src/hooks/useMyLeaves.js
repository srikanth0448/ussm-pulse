import { useEffect, useState, useCallback } from "react";
import { leaveService } from "../services/leaveService";

export const useMyLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await leaveService.getMyLeaves();

      const items = Array.isArray(data) ? data : data?.data || [];

      const sortedLeaves = [...items].sort(
        (a, b) => Number(b.leave_id) - Number(a.leave_id),
      );

      setLeaves(sortedLeaves);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to load leaves",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  return {
    leaves,
    loading,
    error,
    refreshLeaves: fetchLeaves,
  };
};
