import { getApiBaseUrl } from "@/lib/api-base-url";

export interface SummaryData {
  totalRevenue: { total: number };
  totalAppointments: { total: number };
  totalPatients: { total: number };
  totalDoctors: { total: number };
}

const TIMEOUT_MS = 8000;

export const getSummary = async (
  clinicId: string,
  from: string,
  to: string,
): Promise<SummaryData> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const params = new URLSearchParams({ clinicId, from, to });
    const res = await fetch(`${getApiBaseUrl()}/dashboard/summary?${params}`, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 30 },
      signal: controller.signal,
    });

    if (!res.ok) {
      return {
        totalRevenue: { total: 0 },
        totalAppointments: { total: 0 },
        totalPatients: { total: 0 },
        totalDoctors: { total: 0 },
      };
    }

    return (await res.json()) as SummaryData;
  } catch {
    return {
      totalRevenue: { total: 0 },
      totalAppointments: { total: 0 },
      totalPatients: { total: 0 },
      totalDoctors: { total: 0 },
    };
  } finally {
    clearTimeout(timeoutId);
  }
};
