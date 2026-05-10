import { getApiBaseUrl } from "@/lib/api-base-url";

export interface DailyAppointmentData {
  date: string;
  appointments: number;
  revenue: number | null;
}

const TIMEOUT_MS = 8000;

export const getDailyAppointmentsData = async (
  clinicId: string,
  from: string,
  to: string,
): Promise<DailyAppointmentData[]> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const params = new URLSearchParams({ clinicId, from, to });
    const res = await fetch(`${getApiBaseUrl()}/dashboard/daily-appointments?${params}`, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 30 },
      signal: controller.signal,
    });

    if (!res.ok) {
      return [];
    }

    return (await res.json()) as DailyAppointmentData[];
  } catch {
    return [];
  } finally {
    clearTimeout(timeoutId);
  }
};
