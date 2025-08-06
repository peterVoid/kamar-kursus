import { buttonVariants } from "@/components/ui/button";
import { getSession } from "@/data/get-session";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (session) {
    return redirect("/");
  }

  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
      <div className="absolute top-2 left-2">
        <Link className={buttonVariants()} href="/">
          <ChevronLeftIcon className="size-5" />
          Back
        </Link>
      </div>
      {children}
    </div>
  );
}
