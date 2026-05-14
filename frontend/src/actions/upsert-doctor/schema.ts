import z from "zod";

export const upsertDoctorSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().trim().min(1, {
      message: "Name is required.",
    }),
    specialty: z.string().trim().min(1, {
      message: "Specialty is required.",
    }),
    appointmentPriceInCents: z.number().min(1, {
      message: "Appointment price is required.",
    }),
    availableFromWeekDay: z
      .number()
      .min(0, "Start weekday is required.")
      .max(
        6,
        "Start weekday must be between 0 (Sunday) and 6 (Saturday).",
      ),
    availableToWeekDay: z
      .number()
      .min(0, "End weekday is required.")
      .max(
        6,
        "End weekday must be between 0 (Sunday) and 6 (Saturday).",
      ),
    availableFromTime: z.string().min(1, {
      message: "Start time is required.",
    }),
    availableToTime: z.string().min(1, {
      message: "End time is required.",
    }),
  })
  .refine(
    (data) => {
      return data.availableFromTime < data.availableToTime;
    },
    {
      message:
        "Start time cannot be earlier than end time.",
      path: ["availableToTime"],
    },
  );

export type UpsertDoctorActionSchema = z.infer<typeof upsertDoctorSchema>;
