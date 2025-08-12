import { Loader2Icon } from "lucide-react";

export function PageLoader() {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <Loader2Icon className="animate-spin mx-auto size-12" />
    </div>
  );
}
