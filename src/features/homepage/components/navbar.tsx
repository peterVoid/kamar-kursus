"use client";

import { buttonVariants } from "@/components/ui/button";
import UserDropdown from "@/features/users/components/user-dropdown";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

export function Navbar() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <nav className="border-b h-14 sticky bg-background/90 backdrop-blur-[backdrop-filter]:bg-background/60 top-0 z-50 w-full">
      <div className="flex items-center justify-between px-4 md:px-7 lg:px-16 h-full">
        <div className="flex items-center gap-x-2">
          <Link href="/" className="text-sm font-medium">
            Home
          </Link>
          <Link href="/courses" className="text-sm font-medium">
            Courses
          </Link>
          <Link href="/dashboard" className="text-sm font-medium">
            Dashboard
          </Link>
        </div>
        <div className="flex items-center gap-x-4">
          {isPending ? null : session ? (
            <UserDropdown
              email={session.user.email}
              name={
                session?.user.name != ""
                  ? session?.user.name
                  : session?.user.email.split("@")[0]
              }
              image={
                session.user.image ??
                `https://avatar.vercel.sh/${session?.user.email}`
              }
            />
          ) : (
            <>
              <Link
                href="/login"
                className={buttonVariants({
                  variant: "secondary",
                })}
              >
                Login
              </Link>
              <Link href="/login" className={buttonVariants()}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
