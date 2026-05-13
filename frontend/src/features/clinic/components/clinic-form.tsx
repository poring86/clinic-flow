"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
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

  const handleLogoutForLater = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/authentication");
    router.refresh();
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

        <div className="space-y-2">
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

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleLogoutForLater}
            disabled={createClinicViewModel.isPending}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            You can create your clinic later.
          </p>
        </div>
      </form>
    </Form>
  );
};
