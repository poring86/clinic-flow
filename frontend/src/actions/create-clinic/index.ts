
"use server";
import { clinicControllerCreate } from "@/api/generated/clinic";

export const createClinicAction = async (name: string) => {
  // Chama a API do backend para criar a clínica
  await clinicControllerCreate({
    body: JSON.stringify({ name }),
    headers: { 'Content-Type': 'application/json' },
  });
};
