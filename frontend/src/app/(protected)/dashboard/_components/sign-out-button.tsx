"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authControllerDeleteSession } from "@/api/generated/auth/auth";
import { Button } from "@/components/ui/button";

export const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      // Recuperar token salvo (ajuste conforme seu storage)
      const token = localStorage.getItem("token");
      if (token) {
        await authControllerDeleteSession({ token });
        localStorage.removeItem("token");
      }
      toast.success("Sessão encerrada com sucesso");
      router.push("/authentication");
    } catch {
      toast.error("Erro ao encerrar sessão");
    }
  };

  return (
    <Button onClick={handleSignOut}>
      Sair
    </Button>
  );
};
