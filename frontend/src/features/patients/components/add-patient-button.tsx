"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

import UpsertPatientForm from "./upsert-patient-form";

interface AddPatientButtonProps {
  clinicId: string;
}

export const AddPatientButton = ({ clinicId }: AddPatientButtonProps) => {
  const [isUpsertPatientDialogOpen, setIsUpsertPatientDialogOpen] =
    useState(false);

  return (
    <>
      <Button type="button" onClick={() => setIsUpsertPatientDialogOpen(true)}>
        <Plus />
        Add Patient
      </Button>

      <Dialog
        open={isUpsertPatientDialogOpen}
        onOpenChange={setIsUpsertPatientDialogOpen}
      >
        <UpsertPatientForm
          isOpen={isUpsertPatientDialogOpen}
          clinicId={clinicId}
          onSuccess={() => setIsUpsertPatientDialogOpen(false)}
        />
      </Dialog>
    </>
  );
};
