export const dashboardQueryKeys = {
  all: ["dashboard"] as const,
  summary: () => [...dashboardQueryKeys.all, "summary"] as const,
  summaryByDateRange: (clinicId: string, from: string, to: string) =>
    [...dashboardQueryKeys.summary(), { clinicId, from, to }] as const,
  topDoctors: () => [...dashboardQueryKeys.all, "top-doctors"] as const,
  topDoctorsByDateRange: (clinicId: string, from: string, to: string) =>
    [...dashboardQueryKeys.topDoctors(), { clinicId, from, to }] as const,
  topSpecialties: () => [...dashboardQueryKeys.all, "top-specialties"] as const,
  topSpecialtiesByDateRange: (clinicId: string, from: string, to: string) =>
    [...dashboardQueryKeys.topSpecialties(), { clinicId, from, to }] as const,
  todayAppointments: () =>
    [...dashboardQueryKeys.all, "today-appointments"] as const,
  todayAppointmentsByDateRange: (clinicId: string, from: string, to: string) =>
    [...dashboardQueryKeys.todayAppointments(), { clinicId, from, to }] as const,
  dailyAppointmentsData: () =>
    [...dashboardQueryKeys.all, "daily-appointments-data"] as const,
  dailyAppointmentsDataByDateRange: (
    clinicId: string,
    from: string,
    to: string,
  ) =>
    [
      ...dashboardQueryKeys.dailyAppointmentsData(),
      { clinicId, from, to },
    ] as const,
};
