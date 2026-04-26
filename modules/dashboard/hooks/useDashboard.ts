import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { dashboardService } from "@/modules/dashboard/dashboard.service";
import { DashboardSnapshot } from "@/modules/dashboard/types/dashboard.types";
import { FEEDBACK_MESSAGES } from "@/shared/constants/feedback-messages";
import {
  getErrorMessage,
  reportNonSensitiveError,
} from "@/shared/utils/error-message";

const initialSnapshot: DashboardSnapshot = {
  summary: {
    totalPatients: 0,
    appointmentsToday: 0,
    appointmentsCompletedMonth: 0,
    monthBalance: 0,
    monthEntries: 0,
    monthExits: 0,
  },
  todayAppointments: [],
  upcomingAppointments: [],
  monthlyFinancial: {
    entries: 0,
    exits: 0,
    balance: 0,
  },
  alerts: [],
  generatedAt: new Date(0).toISOString(),
};

export const useDashboard = () => {
  const [data, setData] = useState<DashboardSnapshot>(initialSnapshot);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const snapshot = await dashboardService.getSnapshot();
      setData(snapshot);
    } catch (loadError) {
      reportNonSensitiveError("dashboard.hook.load", loadError);
      setError(getErrorMessage(loadError, FEEDBACK_MESSAGES.genericLoadError));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [loadDashboard]),
  );

  return {
    data,
    loading,
    error,
    reload: loadDashboard,
  };
};
