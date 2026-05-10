"use server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

// import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/safe-action";

import { type UpsertDoctorActionSchema,upsertDoctorSchema } from "./schema";

dayjs.extend(utc);

// Chama a action local (que pode ser adaptada para chamar a API quando disponível)
export const upsertDoctorAction = async (input: UpsertDoctorActionSchema) => {
  return upsertDoctor(input);
};

export const upsertDoctor = actionClient
  .schema(upsertDoctorSchema)
    .action(async () => {
      // TODO: Implementar verificação de sessão/autenticação via API
      // Removido uso de auth.api.getSession
      // const session = await auth.api.getSession({ headers: await headers() });
      // if (!session?.user) throw new Error("Usuário não autenticado.");
      // if (!session?.user?.clinic?.id) throw new Error("Clínica não encontrada.");
  
      // TODO: Chamar a API do backend para criar/atualizar médico quando endpoint estiver disponível
      // Exemplo:
      // await doctorControllerUpsert({ body: JSON.stringify({ ... }) });
      throw new Error("Ação de upsert de médico deve ser feita via API. Implemente o endpoint no backend e gere novamente o client.");
  });
