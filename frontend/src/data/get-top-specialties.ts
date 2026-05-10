import { getApiBaseUrl } from "@/lib/api-base-url";

export interface TopSpecialty {
  specialty: string;
  appointments: number;
}

const TIMEOUT_MS = 8000;

export const getTopSpecialties = async (
  clinicId: string,
  from: string,
  to: string,
): Promise<TopSpecialty[]> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const params = new URLSearchParams({ clinicId, from, to });
    const res = await fetch(`${getApiBaseUrl()}/dashboard/top-specialties?${params}`, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 30 },
      signal: controller.signal,
    });

    if (!res.ok) {
      return [];
    }

    return (await res.json()) as TopSpecialty[];
  } catch {
    return [];
  } finally {
    clearTimeout(timeoutId);
  }
};
