export const appointmentsQueryKeys = {
  list: (clinicId: string, page: number = 1) => ["appointments", clinicId, page] as const,
  doctors: (clinicId: string) => ["doctors", clinicId] as const,
  patients: (clinicId: string) => ["patients-appt", clinicId] as const,
};
