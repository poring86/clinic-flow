import type { AppointmentDto } from "@/api/schemas";
import { getApiBaseUrl } from "@/lib/api-base-url";

import type { CreateAppointmentCommand } from "../contracts/create-appointment-command";
import { toCreateAppointmentDto } from "../mappers/to-create-appointment-dto";

export const createAppointmentService = async (
  command: CreateAppointmentCommand,
): Promise<AppointmentDto> => {
  const payload = toCreateAppointmentDto(command);

  const response = await fetch(`${getApiBaseUrl()}/appointment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || "Failed to create appointment");
  }

  return (await response.json()) as AppointmentDto;
};
