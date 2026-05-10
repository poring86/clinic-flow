import { getApiBaseUrl } from "@/lib/api-base-url";

import type { CreateClinicCommand } from "../contracts/create-clinic-command";
import { toCreateClinicPayload } from "../mappers/to-create-clinic-payload";

export const createClinicService = async (
  command: CreateClinicCommand,
): Promise<void> => {
  const payload = toCreateClinicPayload(command);

  const response = await fetch(`${getApiBaseUrl()}/clinic`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || "Failed to create clinic");
  }
};
