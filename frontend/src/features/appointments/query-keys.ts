export const appointmentsQueryKeys = {
  list: (clinicId: string) => ["appointments", clinicId] as const,
  doctors: (clinicId: string) => ["doctors", clinicId] as const,
  patients: (clinicId: string) => ["patients-appt", clinicId] as const,
};
