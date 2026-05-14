import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { CreateAppointmentFormValues } from "../contracts/create-appointment-form-values";
import { createAppointmentService } from "../services/create-appointment-service";

interface UseCreateAppointmentViewModelParams {
  clinicId: string;
  onSuccess?: () => void;
}

export const useCreateAppointmentViewModel = ({
  clinicId,
  onSuccess,
}: UseCreateAppointmentViewModelParams) => {
  const queryClient = useQueryClient();

  const createAppointmentMutation = useMutation({
    mutationFn: async (values: CreateAppointmentFormValues) => {
      return createAppointmentService({ clinicId, values });
    },
    onSuccess: async () => {
      toast.success("Appointment created successfully.");
      onSuccess?.();
      await queryClient.invalidateQueries({
        queryKey: ["appointments", clinicId],
      });
    },
    onError: (error: unknown) => {
      console.error(error);
      toast.error("Unable to create appointment.");
    },
  });

  return {
    isPending: createAppointmentMutation.isPending,
    submit: (values: CreateAppointmentFormValues) =>
      createAppointmentMutation.mutate(values),
  };
};
