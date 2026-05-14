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
      toast.success("Patient deleted successfully.");
    },
    onError: () => {
      toast.error("Error deleting patient.");
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
              Edit
            </DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Trash />
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to delete this patient?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. It will delete the patient
                    permanently from the system.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeletePatientClick}>
                    Delete
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
