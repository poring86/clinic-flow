"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";

import {
  getPatientControllerFindAllQueryKey,
} from "@/api/generated/patient";
import type { PatientDto as Patient } from "@/api/schemas";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getApiBaseUrl } from "@/lib/api-base-url";

const formSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Name is required.",
  }),
  email: z.string().email({
    message: "Invalid email.",
  }),
  phoneNumber: z.string().trim().min(1, {
    message: "Phone number is required.",
  }),
  sex: z.enum(["male", "female"], {
    required_error: "Sex is required.",
  }),
});

type PatientFormValues = z.infer<typeof formSchema>;
type CreatePatientPayload = PatientFormValues & { clinicId: string };


interface UpsertPatientFormProps {
  isOpen: boolean;
  patient?: Patient;
  clinicId?: string;
  onSuccess?: () => void;
}

const UpsertPatientForm = ({
  patient,
  clinicId,
  onSuccess,
  isOpen,
}: UpsertPatientFormProps) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (values: CreatePatientPayload) => {
      const response = await fetch(`${getApiBaseUrl()}/patient`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to create patient");
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: PatientFormValues;
    }) => {
      const response = await fetch(`${getApiBaseUrl()}/patient/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to update patient");
      }
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: patient?.name ?? "",
      email: patient?.email ?? "",
      phoneNumber: patient?.phoneNumber ?? "",
      sex: patient?.sex ?? undefined,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset(patient);
    }
  }, [isOpen, form, patient]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (patient?.id) {
        await updateMutation.mutateAsync(
          { id: patient.id, values },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({
                queryKey: getPatientControllerFindAllQueryKey(),
              });
              toast.success("Patient updated successfully.");
              onSuccess?.();
            },
            onError: () => {
              toast.error("Error updating patient.");
            },
          },
        );
      } else {
        const resolvedClinicId = clinicId ?? patient?.clinicId;
        if (!resolvedClinicId) {
          toast.error("Error creating patient.");
          return;
        }

        await createMutation.mutateAsync(
          { ...values, clinicId: resolvedClinicId },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({
                queryKey: getPatientControllerFindAllQueryKey(),
              });
              toast.success("Patient created successfully.");
              onSuccess?.();
            },
            onError: () => {
              toast.error("Error creating patient.");
            },
          },
        );
      }
    } catch {
      // Errors are handled in onError callbacks
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {patient ? patient.name : "Add patient"}
        </DialogTitle>
        <DialogDescription>
          {patient
            ? "Edit this patient's information."
            : "Add a new patient."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter the patient's full name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="exemplo@email.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <PatternFormat
                    format="(##) #####-####"
                    mask="_"
                    placeholder="(11) 99999-9999"
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value.value);
                    }}
                    customInput={Input}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sex</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select sex" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full"
            >
              {isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default UpsertPatientForm;
