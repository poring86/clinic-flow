import { getApiBaseUrl } from "@/lib/api-base-url";

export interface Params {
  from?: string;
  to?: string;
  session: {
    user: {
      clinic: {
        id: string;
      };
    };
  };
}

const emptyDashboardData = {
  totalRevenue: { total: 0 },
  totalAppointments: { total: 0 },
  totalPatients: { total: 0 },
  totalDoctors: { total: 0 },
  topDoctors: [],
  topSpecialties: [],
  todayAppointments: [],
  dailyAppointmentsData: [],
};

const DASHBOARD_REQUEST_TIMEOUT_MS = 8000;

const getFetchOptions = (signal?: AbortSignal) => ({
  headers: {
    "Content-Type": "application/json",
  },
  next: {
    revalidate: 30,
  },
  signal,
});

const fetchJsonOrFallback = async <T>(url: string, fallback: T): Promise<T> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, DASHBOARD_REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(url, getFetchOptions(controller.signal));

    if (!res.ok) {
      return fallback;
    }

    return (await res.json()) as T;
  } catch {
    return fallback;
  } finally {
    clearTimeout(timeoutId);
  }
};

export const getDashboard = async ({ from, to, session }: Params) => {
  const clinicId = session.user.clinic.id;

  if (!from || !to || !clinicId) {
    return emptyDashboardData;
  }

  const apiBaseUrl = getApiBaseUrl();
  const params = new URLSearchParams({
    from,
    to,
    clinicId,
  });

  const clinicParams = new URLSearchParams({ clinicId });

  const summaryPromise = fetchJsonOrFallback(
    `${apiBaseUrl}/dashboard/summary?${params.toString()}`,
    {
      totalRevenue: emptyDashboardData.totalRevenue,
      totalAppointments: emptyDashboardData.totalAppointments,
      totalPatients: emptyDashboardData.totalPatients,
      totalDoctors: emptyDashboardData.totalDoctors,
    },
  );

  const topDoctorsPromise = fetchJsonOrFallback(
    `${apiBaseUrl}/dashboard/top-doctors?${params.toString()}`,
    emptyDashboardData.topDoctors,
  );

  const topSpecialtiesPromise = fetchJsonOrFallback(
    `${apiBaseUrl}/dashboard/top-specialties?${params.toString()}`,
    emptyDashboardData.topSpecialties,
  );

  const todayAppointmentsPromise = fetchJsonOrFallback(
    `${apiBaseUrl}/dashboard/today-appointments?${clinicParams.toString()}`,
    emptyDashboardData.todayAppointments,
  );

  const dailyAppointmentsDataPromise = fetchJsonOrFallback(
    `${apiBaseUrl}/dashboard/daily-appointments?${params.toString()}`,
    emptyDashboardData.dailyAppointmentsData,
  );

  const summary = await summaryPromise;
  const topDoctors = await topDoctorsPromise;
  const topSpecialties = await topSpecialtiesPromise;
  const todayAppointments = await todayAppointmentsPromise;
  const dailyAppointmentsData = await dailyAppointmentsDataPromise;

  return {
    totalRevenue: summary.totalRevenue ?? emptyDashboardData.totalRevenue,
    totalAppointments:
      summary.totalAppointments ?? emptyDashboardData.totalAppointments,
    totalPatients: summary.totalPatients ?? emptyDashboardData.totalPatients,
    totalDoctors: summary.totalDoctors ?? emptyDashboardData.totalDoctors,
    topDoctors: topDoctors ?? emptyDashboardData.topDoctors,
    topSpecialties: topSpecialties ?? emptyDashboardData.topSpecialties,
    todayAppointments: todayAppointments ?? emptyDashboardData.todayAppointments,
    dailyAppointmentsData:
      dailyAppointmentsData ?? emptyDashboardData.dailyAppointmentsData,
  };
};
