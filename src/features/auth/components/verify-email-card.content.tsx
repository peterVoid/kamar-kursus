"use client";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface Props {
  email: string;
}

export function VerifyEmailCardContent({ email }: Props) {
  const router = useRouter();
  const [otpInput, setOtpInput] = useState("");
  const [isPending, startTransition] = useTransition();

  const onSubmit = () => {
    startTransition(async () => {
      await authClient.signIn.emailOtp({
        email,
        otp: otpInput,
        fetchOptions: {
          onSuccess: (data) => {
            console.log(data);

            // router.push("/");
          },
          onError: () => {
            toast.error("Something went wrong");
          },
        },
      });
    });
  };

  return (
    <>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-center">
          <InputOTP maxLength={6} onChange={(e) => setOtpInput(e)}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <span className="text-xs text-muted-foreground">
          Masukan 6 digit code yang sudah dikirim melalui email
        </span>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full disabled:cursor-not-allowed"
          disabled={otpInput.length !== 6 || isPending}
          onClick={onSubmit}
        >
          Verifikasi Akun
        </Button>
      </CardFooter>
    </>
  );
}
