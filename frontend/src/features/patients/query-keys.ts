export const patientsQueryKeys = {
  all: ["patients"] as const,
  list: () => [...patientsQueryKeys.all, "list"] as const,
  listByClinic: (clinicId: string, page: number = 1, pageSize: number = 10) =>
    [...patientsQueryKeys.list(), { clinicId, page, pageSize }] as const,
  detail: () => [...patientsQueryKeys.all, "detail"] as const,
  detailById: (clinicId: string, patientId: string) =>
    [...patientsQueryKeys.detail(), { clinicId, patientId }] as const,
  search: () => [...patientsQueryKeys.all, "search"] as const,
  searchByClinic: (clinicId: string, query: string) =>
    [...patientsQueryKeys.search(), { clinicId, query }] as const,
};
