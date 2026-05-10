"use server";


export const deleteAppointment = async (id: string) => {
  const { getApiBaseUrl } = await import("@/lib/api-base-url");
  const res = await fetch(`${getApiBaseUrl()}/appointment/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    // Se precisar de autenticação, adicione aqui
  });
  if (!res.ok) {
    throw new Error("Failed to delete appointment");
  }
  // Opcional: revalidatePath ou outras ações de cache
  // revalidatePath('/appointments');
  return await res.json();
};
