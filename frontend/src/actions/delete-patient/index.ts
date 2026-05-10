import { getApiBaseUrl } from "@/lib/api-base-url";

export const deletePatient = async (id: string) => {
  const res = await fetch(`${getApiBaseUrl()}/patient/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to delete patient");
  }
  // Opcional: revalidatePath('/patients');
  return await res.json();
};
