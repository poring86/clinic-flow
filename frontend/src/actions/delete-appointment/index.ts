"use server";


export const deleteAppointment = async (id: string) => {
  const { getApiBaseUrl } = await import("@/lib/api-base-url");
  const res = await fetch(`${getApiBaseUrl()}/appointment/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    // Add authentication here if needed.
  });
  if (!res.ok) {
    throw new Error("Failed to delete appointment");
  }
  // Optional: revalidatePath or other cache actions.
  // revalidatePath('/appointments');
  return await res.json();
};
