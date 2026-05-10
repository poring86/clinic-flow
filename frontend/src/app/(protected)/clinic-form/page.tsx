import { Metadata } from "next";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { ClinicForm } from "./_components/form";

export const metadata: Metadata = {
  title: "Criar clínica | Clic Flow",
  description: "Página para criar uma nova clínica no Clic Flow.",
};

const ClinicFormPage = () => {
  return (
    <div>
      <Dialog open>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Clínica</DialogTitle>
            <DialogDescription>
              Preencha os dados da clínica e clique em salvar quando estiver
              pronto.
            </DialogDescription>
          </DialogHeader>
          <ClinicForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClinicFormPage;
