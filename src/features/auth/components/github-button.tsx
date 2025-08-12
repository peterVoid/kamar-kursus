"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { GithubIcon, Loader2Icon } from "lucide-react";
import { useTransition } from "react";

export function GithubButton() {
  const [isLoading, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      try {
        await authClient.signIn.social({
          provider: "github",
        });
      } catch {
        console.log("ERROR: GITHUB BUTTON");
      }
    });
  };

  return (
    <Button
      className={cn("w-full", isLoading && "cursor-not-allowed")}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2Icon className="size-4 animate-spin" />
      ) : (
        <GithubIcon className="size-4" />
      )}
      <p>Sign in with Github</p>
    </Button>
  );
}
