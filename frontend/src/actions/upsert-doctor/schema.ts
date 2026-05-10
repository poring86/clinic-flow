import z from "zod";

export const upsertDoctorSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().trim().min(1, {
      message: "Nome é obrigatório.",
    }),
    specialty: z.string().trim().min(1, {
      message: "Especialidade é obrigatória.",
    }),
    appointmentPriceInCents: z.number().min(1, {
      message: "Preço da consulta é obrigatório.",
    }),
    availableFromWeekDay: z
      .number()
      .min(0, "Dia da semana de início é obrigatório.")
      .max(
        6,
        "Dia da semana de início deve ser entre 0 (Domingo) e 6 (Sábado).",
      ),
    availableToWeekDay: z
      .number()
      .min(0, "Dia da semana de término é obrigatório.")
      .max(
        6,
        "Dia da semana de término deve ser entre 0 (Domingo) e 6 (Sábado).",
      ),
    availableFromTime: z.string().min(1, {
      message: "Hora de início é obrigatória.",
    }),
    availableToTime: z.string().min(1, {
      message: "Hora de término é obrigatória.",
    }),
  })
  .refine(
    (data) => {
      return data.availableFromTime < data.availableToTime;
    },
    {
      message:
        "O horário de início não pode ser anterior ao horário de término.",
      path: ["availableToTime"],
    },
  );

export type UpsertDoctorActionSchema = z.infer<typeof upsertDoctorSchema>;
