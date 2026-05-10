import { getApiBaseUrl } from "@/lib/api-base-url";

export interface TodayAppointment {
  id: string;
  date: string;
  appointmentPriceInCents: number;
  patientId: string;
  doctorId: string;
  clinicId: string;
  createdAt: string;
  updatedAt: string;
  patient: {
    name: string;
  };
  doctor: {
    name: string;
    specialty: string;
  };
}

const TIMEOUT_MS = 8000;

export const getTodayAppointments = async (clinicId: string): Promise<TodayAppointment[]> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const params = new URLSearchParams({ clinicId });
    const res = await fetch(`${getApiBaseUrl()}/dashboard/today-appointments?${params}`, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 30 },
      signal: controller.signal,
    });

    if (!res.ok) {
      return [];
    }

    return (await res.json()) as TodayAppointment[];
  } catch {
    return [];
  } finally {
    clearTimeout(timeoutId);
  }
};
