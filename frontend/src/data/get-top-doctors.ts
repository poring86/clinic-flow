import { getApiBaseUrl } from "@/lib/api-base-url";

export interface TopDoctor {
  id: string;
  name: string;
  avatarImageUrl: string | null;
  specialty: string;
  appointments: number;
}

const TIMEOUT_MS = 8000;

export const getTopDoctors = async (
  clinicId: string,
  from: string,
  to: string,
): Promise<TopDoctor[]> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const params = new URLSearchParams({ clinicId, from, to });
    const res = await fetch(`${getApiBaseUrl()}/dashboard/top-doctors?${params}`, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 30 },
      signal: controller.signal,
    });

    if (!res.ok) {
      return [];
    }

    return (await res.json()) as TopDoctor[];
  } catch {
    return [];
  } finally {
    clearTimeout(timeoutId);
  }
};
