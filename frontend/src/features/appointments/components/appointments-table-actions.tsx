"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreVertical, Trash } from "lucide-react";
import { toast } from "sonner";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getApiBaseUrl } from "@/lib/api-base-url";

import { appointmentsQueryKeys } from "../query-keys";

type AppointmentWithRelations = {
  id: string;
  clinicId: string;
  patient: { name: string };
  doctor: { name: string; specialty: string };
};

export const AppointmentsTableActions = ({
  appointment,
}: {
  appointment: AppointmentWithRelations;
}) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${getApiBaseUrl()}/appointment/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete appointment");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: appointmentsQueryKeys.list(appointment.clinicId),
      });
      toast.success("Appointment deleted successfully.");
    },
    onError: () => {
      toast.error("Error deleting appointment.");
    },
  });

  const handleDeleteAppointmentClick = () => {
    if (!appointment) return;
    deleteMutation.mutate(appointment.id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          {appointment.patient?.name} - {appointment.doctor?.name}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
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
                Are you sure you want to delete this appointment?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. It will permanently delete the
                appointment from the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteAppointmentClick}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
