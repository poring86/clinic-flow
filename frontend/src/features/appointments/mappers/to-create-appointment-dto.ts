import dayjs from "dayjs";

import type { CreateAppointmentDto } from "@/api/schemas";

import type { CreateAppointmentCommand } from "../contracts/create-appointment-command";

export const toCreateAppointmentDto = (
  command: CreateAppointmentCommand,
): CreateAppointmentDto => {
  const { clinicId, values } = command;
  const dateTimeString = `${dayjs(values.date).format("YYYY-MM-DD")} ${values.time}`;
  const appointmentDateTime = dayjs(dateTimeString).toISOString();

  return {
    clinicId,
    patientId: values.patientId,
    doctorId: values.doctorId,
    date: appointmentDateTime,
    appointmentPriceInCents: Math.round(values.appointmentPrice * 100),
  };
};
