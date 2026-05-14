import z from "zod";

export const upsertPatientSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, {
    message: "Name is required.",
  }),
  email: z.string().email({
    message: "Invalid email.",
  }),
  phoneNumber: z.string().min(1, {
    message: "Phone number is required.",
  }),
  sex: z.enum(["male", "female"], {
    errorMap: () => ({ message: "Sex is required." }),
  }),
});

export type UpsertPatientActionSchema = z.infer<typeof upsertPatientSchema>;
