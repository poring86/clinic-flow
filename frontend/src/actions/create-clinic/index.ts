
"use server";
import { clinicControllerCreate } from "@/api/generated/clinic";

export const createClinicAction = async (name: string) => {
  // Calls the backend API to create the clinic.
  await clinicControllerCreate({
    body: JSON.stringify({ name }),
    headers: { 'Content-Type': 'application/json' },
  });
};
