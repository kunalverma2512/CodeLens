import { useState, useEffect, useCallback } from "react";
import {
  cfGetProfile,
  cfGetRatingHistory,
  cfGetSubmissions,
  cfGetDashboardSummary,
  cfInitiateConnection,
  cfVerifyConnection,
  cfRefreshData,
  cfDisconnect,
} from "../services/codeforcesService";

/**
 * Master hook for Codeforces data.
 * @param {boolean} dashboardOnly  - If true, only fetches summary (for dashboard widget).
 */
export const useCodeforces = (dashboardOnly = false) => {
  const [profile, setProfile] = useState(null);
  const [ratingHistory, setRatingHistory] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [dashboardSummary, setDashboardSummary] = useState(null);

  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);

  // Connection flow state
  const [verificationCode, setVerificationCode] = useState(null);
  const [pendingHandle, setPendingHandle] = useState(null);
  const [connectLoading, setConnectLoading] = useState(false);
  const [connectError, setConnectError] = useState(null);

  const unwrapApiData = (response) => response?.data?.data ?? response?.data ?? null;

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (dashboardOnly) {
        const response = await cfGetDashboardSummary();
        setDashboardSummary(unwrapApiData(response));
      } else {
        const [profileRes, ratingRes, submissionsRes] = await Promise.all([
          cfGetProfile(),
          cfGetRatingHistory(),
          cfGetSubmissions(50),
        ]);
        setProfile(unwrapApiData(profileRes));
        setRatingHistory(unwrapApiData(ratingRes) || []);
        setSubmissions(unwrapApiData(submissionsRes) || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load Codeforces data");
    } finally {
      setLoading(false);
    }
  }, [dashboardOnly]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  /** Step 1: initiate verification */
  const initiateConnect = async (handle) => {
    setConnectLoading(true);
    setConnectError(null);
    try {
      const response = await cfInitiateConnection(handle);
      const payload = unwrapApiData(response);
      setVerificationCode(payload?.verificationCode);
      setPendingHandle(handle);
      return payload;
    } catch (err) {
      const msg = err.response?.data?.message || "Connection failed";
      setConnectError(msg);
      throw new Error(msg);
    } finally {
      setConnectLoading(false);
    }
  };

  /** Step 2: verify surname */
  const verifyConnect = async () => {
    if (!pendingHandle) return;
    setConnectLoading(true);
    setConnectError(null);
    try {
      const response = await cfVerifyConnection(pendingHandle);
      const payload = unwrapApiData(response);
      setVerificationCode(null);
      setPendingHandle(null);
      await fetchAll();
      return payload;
    } catch (err) {
      const msg = err.response?.data?.message || "Verification failed";
      setConnectError(msg);
      throw new Error(msg);
    } finally {
      setConnectLoading(false);
    }
  };

  /** Manual refresh */
  const refresh = async () => {
    setSyncing(true);
    try {
      await cfRefreshData();
      // Poll after a few seconds to let backend finish
      setTimeout(fetchAll, 4000);
    } catch (err) {
      setError(err.response?.data?.message || "Refresh failed");
    } finally {
      setSyncing(false);
    }
  };

  /** Disconnect */
  const disconnect = async () => {
    try {
      await cfDisconnect();
      setProfile(null);
      setRatingHistory([]);
      setSubmissions([]);
      setDashboardSummary(null);
    } catch (err) {
      setError(err.response?.data?.message || "Disconnect failed");
    }
  };

  const isConnected = dashboardOnly
    ? dashboardSummary?.connected
    : profile?.connected;

  const isPending = profile?.pendingVerification;

  return {
    // Data
    profile: profile?.profile || null,
    ratingHistory,
    submissions,
    dashboardSummary,

    // Status
    isConnected,
    isPending,
    loading,
    syncing,
    error,

    // Connection flow
    verificationCode: verificationCode || profile?.verificationCode,
    pendingHandle,
    connectLoading,
    connectError,

    // Actions
    initiateConnect,
    verifyConnect,
    refresh,
    disconnect,
    refetch: fetchAll,
  };
};
