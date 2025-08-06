import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export function useSignOut() {
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Sign out successfully");
          redirect("/");
        },
      },
    });
  };

  return handleLogout;
}
