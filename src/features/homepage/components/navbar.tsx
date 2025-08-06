import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="border-b h-14 fixed top-0 z-50 w-full">
      <div className="flex items-center justify-between px-4 md:px-7 lg:px-16 h-full">
        <div className="flex items-center gap-x-2">
          <Link href="/" className="text-sm">
            Home
          </Link>
          <Link href="/courses" className="text-sm">
            Courses
          </Link>
          <Link href="/dashboard" className="text-sm">
            Dashboard
          </Link>
        </div>
        <div className="flex items-center gap-x-2">
          <Link
            className={buttonVariants({
              variant: "secondary",
            })}
            href="/login"
          >
            Login
          </Link>
          <Link className={buttonVariants()} href="/login">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
