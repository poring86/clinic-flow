import type { CreateAppointmentFormValues } from "./create-appointment-form-values";

export interface CreateAppointmentCommand {
  clinicId: string;
  values: CreateAppointmentFormValues;
}
