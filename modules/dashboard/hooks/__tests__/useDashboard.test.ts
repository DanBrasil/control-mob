import { renderHook, waitFor } from "@testing-library/react-native";

import { dashboardService } from "@/modules/dashboard/dashboard.service";
import { useDashboard } from "@/modules/dashboard/hooks/useDashboard";

jest.mock("expo-router", () => ({
  useFocusEffect: (cb: () => void) => {
    const React = require("react");
    React.useEffect(() => {
      cb();
    }, []);
  },
}));

jest.mock("@/modules/dashboard/dashboard.service", () => ({
  dashboardService: {
    getSnapshot: jest.fn(),
  },
}));

const mockGetSnapshot = dashboardService.getSnapshot as jest.Mock;

const mockSnapshot = {
  summary: {
    totalPatients: 5,
    appointmentsToday: 2,
    appointmentsCompletedMonth: 10,
    monthBalance: 600,
    monthEntries: 1000,
    monthExits: 400,
  },
  todayAppointments: [],
  upcomingAppointments: [],
  monthlyFinancial: { entries: 1000, exits: 400, balance: 600 },
  alerts: [],
  generatedAt: "2026-04-26T00:00:00.000Z",
};

describe("useDashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("inicia com loading true", () => {
    mockGetSnapshot.mockResolvedValue(mockSnapshot);

    const { result } = renderHook(() => useDashboard());

    expect(result.current.loading).toBe(true);
  });

  it("preenche data e desativa loading apos resolucao bem-sucedida", async () => {
    mockGetSnapshot.mockResolvedValue(mockSnapshot);

    const { result } = renderHook(() => useDashboard());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data.summary.totalPatients).toBe(5);
    expect(result.current.error).toBeNull();
  });

  it("define mensagem de erro e desativa loading quando servico falha", async () => {
    mockGetSnapshot.mockRejectedValue(new Error("Falha no banco"));

    const { result } = renderHook(() => useDashboard());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).not.toBeNull();
  });

  it("expoe funcao reload que recarrega os dados", async () => {
    mockGetSnapshot.mockResolvedValue(mockSnapshot);

    const { result } = renderHook(() => useDashboard());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    mockGetSnapshot.mockResolvedValue({
      ...mockSnapshot,
      summary: { ...mockSnapshot.summary, totalPatients: 99 },
    });

    await result.current.reload();

    await waitFor(() => {
      expect(result.current.data.summary.totalPatients).toBe(99);
    });
  });

  it("limpa erro anterior em nova tentativa bem-sucedida via reload", async () => {
    mockGetSnapshot.mockRejectedValue(new Error("Erro inicial"));

    const { result } = renderHook(() => useDashboard());

    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });

    mockGetSnapshot.mockResolvedValue(mockSnapshot);
    await result.current.reload();

    await waitFor(() => {
      expect(result.current.error).toBeNull();
    });
  });
});
