import z from "zod";

export const createAppointmentSchema = z.object({
  patientId: z.string().uuid({
    message: "Patient is required.",
  }),
  doctorId: z.string().uuid({
    message: "Doctor is required.",
  }),
  date: z.date({
    message: "Date is required.",
  }),
  time: z.string().min(1, {
    message: "Time is required.",
  }),
  appointmentPriceInCents: z.number().min(1, {
    message: "Appointment price is required.",
  }),
});

export type CreateAppointmentActionSchema = z.infer<
  typeof createAppointmentSchema
>;
