"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

import UpsertDoctorForm from "./upsert-doctor-form";

interface AddDoctorButtonProps {
  clinicId?: string;
}

export const AddDoctorButton = ({ clinicId }: AddDoctorButtonProps) => {
  const [isUpsertDoctorDialogOpen, setIsUpsertDoctorDialogOpen] =
    useState(false);

  return (
    <>
      <Button type="button" onClick={() => setIsUpsertDoctorDialogOpen(true)}>
        <Plus />
        Add Doctor
      </Button>

      <Dialog
        open={isUpsertDoctorDialogOpen}
        onOpenChange={setIsUpsertDoctorDialogOpen}
      >
        <UpsertDoctorForm
          clinicId={clinicId}
          onSuccess={() => setIsUpsertDoctorDialogOpen(false)}
        />
      </Dialog>
    </>
  );
};
