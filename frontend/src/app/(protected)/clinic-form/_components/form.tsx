"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

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
import { getApiBaseUrl } from "@/lib/api-base-url";

const registerClinicSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
});

export const ClinicForm = () => {
  const form = useForm<z.infer<typeof registerClinicSchema>>({
    resolver: zodResolver(registerClinicSchema),
    defaultValues: {
      name: "",
    },
  });

  const createClinicMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch(`${getApiBaseUrl()}/clinic`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Failed to create clinic");
    },
    onSuccess: () => {
      toast.success("Clínica criada com sucesso!");
      form.reset();
    },
    onError: () => {
      toast.error("Não foi possível criar sua clínica");
    },
  });

  const onSubmit = (data: z.infer<typeof registerClinicSchema>) => {
    createClinicMutation.mutate(data.name);
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome da clínica" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={createClinicMutation.isPending}
        >
          {createClinicMutation.isPending && (
            <Loader2 className="mr-2 animate-spin" />
          )}
          Criar Clínica
        </Button>
      </form>
    </Form>
  );
};
