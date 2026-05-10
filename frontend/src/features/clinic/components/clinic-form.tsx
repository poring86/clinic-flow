"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import type { CreateClinicFormValues } from "../contracts/create-clinic-form-values";
import { useCreateClinicViewModel } from "../hooks/use-create-clinic-view-model";

const createClinicSchema = z.object({
  name: z.string().trim().min(1, "Clinic name is required."),
});

interface ClinicFormProps {
  onSuccess?: () => void;
}

export const ClinicForm = ({ onSuccess }: ClinicFormProps) => {
  const form = useForm<CreateClinicFormValues>({
    resolver: zodResolver(createClinicSchema),
    defaultValues: {
      name: "",
    },
  });

  const createClinicViewModel = useCreateClinicViewModel({
    onSuccess: () => {
      form.reset();
      onSuccess?.();
    },
  });

  const onSubmit = (values: CreateClinicFormValues) => {
    createClinicViewModel.submit(values);
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Clinic name</FormLabel>
              <FormControl>
                <Input placeholder="Enter clinic name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={createClinicViewModel.isPending}
        >
          {createClinicViewModel.isPending && (
            <Loader2 className="mr-2 animate-spin" />
          )}
          Create clinic
        </Button>
      </form>
    </Form>
  );
};
