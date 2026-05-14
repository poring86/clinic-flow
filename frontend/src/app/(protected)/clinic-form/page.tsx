import { Metadata } from "next";

import { ClinicFormPage } from "@/features/clinic";

export const metadata: Metadata = {
  title: "Create Clinic | Clic Flow",
  description: "Page to create a new clinic in Clic Flow.",
};

const ClinicFormRoute = () => {
  return <ClinicFormPage />;
};

export default ClinicFormRoute;
