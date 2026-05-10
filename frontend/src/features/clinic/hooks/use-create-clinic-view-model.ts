import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import type { CreateClinicFormValues } from "../contracts/create-clinic-form-values";
import { createClinicService } from "../services/create-clinic-service";

interface UseCreateClinicViewModelParams {
  onSuccess?: () => void;
}

export const useCreateClinicViewModel = ({
  onSuccess,
}: UseCreateClinicViewModelParams = {}) => {
  const createClinicMutation = useMutation({
    mutationFn: async (values: CreateClinicFormValues) => {
      await createClinicService({ values });
    },
    onSuccess: () => {
      toast.success("Clinic created successfully.");
      onSuccess?.();
    },
    onError: (error: unknown) => {
      console.error(error);
      toast.error("Unable to create clinic.");
    },
  });

  return {
    isPending: createClinicMutation.isPending,
    submit: (values: CreateClinicFormValues) =>
      createClinicMutation.mutate(values),
  };
};
