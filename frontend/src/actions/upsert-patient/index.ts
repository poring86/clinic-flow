"use server";

import { revalidatePath } from "next/cache";

import { getApiBaseUrl } from "@/lib/api-base-url";

export const upsertPatientAction = async (input: { id?: string; name: string; email: string; phoneNumber: string; sex: "male" | "female" }) => {
  try {
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}/patient/${input.id}`;
    
    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: input.name,
        email: input.email,
        phoneNumber: input.phoneNumber,
        sex: input.sex,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update patient: ${response.statusText}`);
    }

    // Revalidate the patients page to force re-fetch
    revalidatePath("/patients");

    return { data: true };
  } catch (error) {
    return { serverError: error };
  }
};
