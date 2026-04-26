import { dashboardService } from "@/modules/dashboard/dashboard.service";
import { dashboardRepository } from "@/modules/dashboard/repositories/dashboard.repository";

jest.mock("@/modules/dashboard/repositories/dashboard.repository", () => ({
  dashboardRepository: {
    countPatients: jest.fn(),
    listTodayAppointments: jest.fn(),
    listUpcomingAppointments: jest.fn(),
    countCompletedAppointmentsInMonth: jest.fn(),
    getMonthlyFinancialTotals: jest.fn(),
    listRecentCancelledAppointments: jest.fn(),
    listOverdueAppointments: jest.fn(),
  },
}));

const repo = dashboardRepository as jest.Mocked<typeof dashboardRepository>;

describe("dashboardService.getSnapshot", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    repo.countPatients.mockResolvedValue(10);
    repo.listTodayAppointments.mockResolvedValue([
      {
        id: 1,
        patientName: "Maria Silva",
        startDate: "2026-04-26T10:00:00.000Z",
        status: "agendado",
        notes: null,
      },
    ]);
    repo.listUpcomingAppointments.mockResolvedValue([
      {
        id: 2,
        patientName: "João Lima",
        startDate: "2026-04-28T09:00:00.000Z",
        status: "agendado",
        notes: "Retorno",
      },
    ]);
    repo.countCompletedAppointmentsInMonth.mockResolvedValue(5);
    repo.getMonthlyFinancialTotals.mockResolvedValue({
      entries: 1000,
      exits: 400,
    });
    repo.listRecentCancelledAppointments.mockResolvedValue([]);
    repo.listOverdueAppointments.mockResolvedValue([]);
  });

  it("retorna snapshot com a estrutura completa", async () => {
    const snapshot = await dashboardService.getSnapshot();

    expect(snapshot).toMatchObject({
      summary: expect.objectContaining({
        totalPatients: 10,
        appointmentsToday: 1,
        appointmentsCompletedMonth: 5,
      }),
      todayAppointments: expect.arrayContaining([
        expect.objectContaining({ id: 1, patientName: "Maria Silva" }),
      ]),
      upcomingAppointments: expect.arrayContaining([
        expect.objectContaining({ id: 2, patientName: "João Lima" }),
      ]),
      monthlyFinancial: expect.objectContaining({
        entries: 1000,
        exits: 400,
        balance: 600,
      }),
      alerts: [],
    });
  });

  it("calcula saldo mensal como entradas menos saidas", async () => {
    repo.getMonthlyFinancialTotals.mockResolvedValue({
      entries: 2000,
      exits: 800,
    });

    const snapshot = await dashboardService.getSnapshot();

    expect(snapshot.monthlyFinancial.balance).toBe(1200);
    expect(snapshot.summary.monthBalance).toBe(1200);
  });

  it("retorna resumo com totais financeiros corretos", async () => {
    repo.getMonthlyFinancialTotals.mockResolvedValue({
      entries: 500,
      exits: 300,
    });

    const snapshot = await dashboardService.getSnapshot();

    expect(snapshot.summary.monthEntries).toBe(500);
    expect(snapshot.summary.monthExits).toBe(300);
  });

  it("mapeia agendamentos cancelados como alertas", async () => {
    repo.listRecentCancelledAppointments.mockResolvedValue([
      {
        id: 99,
        patientName: "Carlos",
        startDate: "2026-04-20T10:00:00.000Z",
        notes: "Cancelou por motivo pessoal",
      },
    ]);

    const snapshot = await dashboardService.getSnapshot();

    expect(snapshot.alerts).toHaveLength(1);
    expect(snapshot.alerts[0].type).toBe("cancelado");
    expect(snapshot.alerts[0].patientName).toBe("Carlos");
  });

  it("mapeia agendamentos atrasados como alertas", async () => {
    repo.listOverdueAppointments.mockResolvedValue([
      {
        id: 88,
        patientName: "Ana",
        startDate: "2026-04-25T08:00:00.000Z",
        status: "agendado",
        notes: null,
      },
    ]);

    const snapshot = await dashboardService.getSnapshot();

    expect(snapshot.alerts).toHaveLength(1);
    expect(snapshot.alerts[0].type).toBe("atrasado");
    expect(snapshot.alerts[0].patientName).toBe("Ana");
  });

  it("limita total de alertas a 5", async () => {
    const cancelados = Array.from({ length: 4 }, (_, i) => ({
      id: i + 1,
      patientName: `Paciente ${i + 1}`,
      startDate: "2026-04-20T10:00:00.000Z",
      notes: null,
    }));
    const atrasados = Array.from({ length: 4 }, (_, i) => ({
      id: i + 100,
      patientName: `Atrasado ${i + 1}`,
      startDate: "2026-04-25T08:00:00.000Z",
      status: "agendado" as const,
      notes: null,
    }));

    repo.listRecentCancelledAppointments.mockResolvedValue(cancelados);
    repo.listOverdueAppointments.mockResolvedValue(atrasados);

    const snapshot = await dashboardService.getSnapshot();

    expect(snapshot.alerts.length).toBeLessThanOrEqual(5);
  });

  it("retorna lista vazia de agendamentos quando banco está vazio", async () => {
    repo.listTodayAppointments.mockResolvedValue([]);
    repo.listUpcomingAppointments.mockResolvedValue([]);

    const snapshot = await dashboardService.getSnapshot();

    expect(snapshot.todayAppointments).toHaveLength(0);
    expect(snapshot.upcomingAppointments).toHaveLength(0);
    expect(snapshot.summary.appointmentsToday).toBe(0);
  });

  it("inclui notesSummary truncado nos agendamentos de hoje", async () => {
    repo.listTodayAppointments.mockResolvedValue([
      {
        id: 1,
        patientName: "Maria",
        startDate: "2026-04-26T10:00:00.000Z",
        status: "agendado",
        notes: "a".repeat(80),
      },
    ]);

    const snapshot = await dashboardService.getSnapshot();

    expect(snapshot.todayAppointments[0].notesSummary).not.toBeNull();
    expect(snapshot.todayAppointments[0].notesSummary!.endsWith("…")).toBe(
      true,
    );
  });

  it("inclui generatedAt no snapshot", async () => {
    const snapshot = await dashboardService.getSnapshot();

    expect(typeof snapshot.generatedAt).toBe("string");
    expect(snapshot.generatedAt.length).toBeGreaterThan(0);
  });
});
