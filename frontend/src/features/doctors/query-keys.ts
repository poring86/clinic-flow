export const doctorsQueryKeys = {
  all: ["doctors"] as const,
  list: () => [...doctorsQueryKeys.all, "list"] as const,
  listByClinic: (clinicId: string, page: number = 1, pageSize: number = 10) =>
    [...doctorsQueryKeys.list(), { clinicId, page, pageSize }] as const,
  detail: () => [...doctorsQueryKeys.all, "detail"] as const,
  detailById: (clinicId: string, doctorId: string) =>
    [...doctorsQueryKeys.detail(), { clinicId, doctorId }] as const,
  specialties: () => [...doctorsQueryKeys.all, "specialties"] as const,
  specialtiesByClinic: (clinicId: string) =>
    [...doctorsQueryKeys.specialties(), { clinicId }] as const,
};
