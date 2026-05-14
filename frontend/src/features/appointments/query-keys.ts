export const appointmentsQueryKeys = {
  list: (clinicId: string, page: number = 1, pageSize: number = 10) =>
    ["appointments", clinicId, page, pageSize] as const,
  doctors: (clinicId: string) => ["doctors", clinicId] as const,
  patients: (clinicId: string) => ["patients-appt", clinicId] as const,
};
