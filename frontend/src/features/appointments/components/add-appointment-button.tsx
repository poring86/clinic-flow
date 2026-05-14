"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import type { DoctorDto as Doctor, PatientDto as Patient } from "@/api/schemas";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

import { AddAppointmentForm } from "./add-appointment-form";

interface AddAppointmentButtonProps {
  patients: Patient[];
  doctors: Doctor[];
  clinicId: string;
}

export const AddAppointmentButton = ({
  patients,
  doctors,
  clinicId,
}: AddAppointmentButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        New appointment
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <AddAppointmentForm
          isOpen={isOpen}
          patients={patients}
          doctors={doctors}
          clinicId={clinicId}
          onSuccess={() => setIsOpen(false)}
        />
      </Dialog>
    </>
  );
};
