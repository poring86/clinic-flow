"use server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

// import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/safe-action";

import { type UpsertDoctorActionSchema, upsertDoctorSchema } from "./schema";

dayjs.extend(utc);

// Calls the local action, which can be adapted to call the API when available.
export const upsertDoctorAction = async (input: UpsertDoctorActionSchema) => {
  return upsertDoctor(input);
};

export const upsertDoctor = actionClient
  .schema(upsertDoctorSchema)
  .action(async () => {
    // TODO: Implement session/authentication checks through the API.
    // auth.api.getSession usage was removed.
    // const session = await auth.api.getSession({ headers: await headers() });
    // if (!session?.user) throw new Error("User is not authenticated.");
    // if (!session?.user?.clinic?.id) throw new Error("Clinic not found.");

    // TODO: Call the backend API to create/update the doctor when the endpoint is available.
    // Example:
    // await doctorControllerUpsert({ body: JSON.stringify({ ... }) });
    throw new Error("Doctor upsert must be done through the API. Implement the endpoint in the backend and regenerate the client.");
  });
