import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { LucideIcon } from "lucide-react";

interface Props {
  buttonText: string;
  buttonVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  className?: string;
  children: React.ReactNode;
  icon?: LucideIcon;
  title: string;
  description: string;
}

export function ButtonDialog({
  buttonText,
  buttonVariant = "default",
  children,
  className,
  icon: Icon,
  description,
  title,
}: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} className={cn(className)}>
          {Icon && <Icon />}
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        {description && <DialogDescription>{description}</DialogDescription>}
        {children}
      </DialogContent>
    </Dialog>
  );
}
