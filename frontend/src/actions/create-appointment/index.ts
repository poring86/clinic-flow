"use server";

import dayjs from "dayjs";
import { revalidatePath } from "next/cache";

import { appointmentControllerCreate } from "@/api/generated/appointment";
import { getServerSession } from "@/lib/auth/server-session";
import { actionClient } from "@/lib/safe-action";

import { createAppointmentSchema } from "./schema";

export const createAppointment = actionClient
  .schema(createAppointmentSchema)
  .action(async ({ parsedInput }) => {
    const session = await getServerSession();
    const clinicId = session?.clinicId;

    if (!clinicId) {
      throw new Error("Clinic not found in current session.");
    }

    // Build one timestamp from date + selected time.
    const dateTimeString = `${dayjs(parsedInput.date).format("YYYY-MM-DD")} ${parsedInput.time}`;
    const appointmentDateTime = dayjs(dateTimeString).toISOString();

    await appointmentControllerCreate({
      clinicId,
      patientId: parsedInput.patientId,
      doctorId: parsedInput.doctorId,
      date: appointmentDateTime,
      appointmentPriceInCents: parsedInput.appointmentPriceInCents,
    });

    revalidatePath("/appointments");
  });
