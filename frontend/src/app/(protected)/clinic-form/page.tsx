import { Metadata } from "next";

import { ClinicFormPage } from "@/features/clinic";

export const metadata: Metadata = {
  title: "Criar clínica | Clic Flow",
  description: "Página para criar uma nova clínica no Clic Flow.",
};

const ClinicFormRoute = () => {
  return <ClinicFormPage />;
};

export default ClinicFormRoute;
