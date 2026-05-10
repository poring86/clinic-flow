"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { getPatientControllerFindAllQueryKey } from "@/api/generated/patient";
import type { PatientDto as Patient } from "@/api/schemas";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getApiBaseUrl } from "@/lib/api-base-url";

import UpsertPatientForm from "./upsert-patient-form";

export const PatientsTableActions = ({ patient }: { patient: Patient }) => {
  const [upsertPatientDialogOpen, setUpsertPatientDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${getApiBaseUrl()}/patient/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete patient");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getPatientControllerFindAllQueryKey(),
      });
      toast.success("Paciente deletado com sucesso.");
    },
    onError: () => {
      toast.error("Erro ao deletar paciente.");
    },
  });

  const handleDeletePatientClick = () => {
    if (!patient) return;
    deleteMutation.mutate(patient.id);
  };

  return (
    <>
      <Dialog
        open={upsertPatientDialogOpen}
        onOpenChange={setUpsertPatientDialogOpen}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{patient.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setUpsertPatientDialogOpen(true)}>
              <Pencil />
              Editar
            </DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Trash />
                  Excluir
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Tem certeza que deseja deletar esse paciente?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Essa ação não pode ser revertida. Isso irá deletar o
                    paciente permanentemente do sistema.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeletePatientClick}>
                    Deletar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>

        <UpsertPatientForm
          isOpen={upsertPatientDialogOpen}
          onSuccess={() => setUpsertPatientDialogOpen(false)}
          patient={patient}
        />
      </Dialog>
    </>
  );
};
