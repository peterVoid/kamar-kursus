/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckIcon } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="w-full min-h-screen flex flex-1 justify-center items-center">
      <Card className="w-[350px]">
        <div className="w-full flex justify-center">
          <CheckIcon className="size-12 p-2 bg-green-500/30 text-green-500 rounded-full" />
        </div>
        <div className="mt-3 md:mt-5 w-full text-center">
          <h2 className="text-xl font-semibold">Payment Successful</h2>
          <p className="text-sm text-muted-foreground mt-2 tracking-tight text-balance">
            Congrats your payment was successfull, now you have access to
            Course.
          </p>
          <Link
            href="/dashboard"
            className={buttonVariants({
              className: "w-full mt-5",
            })}
          >
            <ArrowLeft />
            Go back to Dashboard
          </Link>
        </div>
      </Card>
    </div>
  );
}
