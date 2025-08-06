import { env } from "@/env";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateSlug = (value: string) => {
  return value
    .trim() // Remove leading/trailing spaces
    .toLowerCase() // Convert to lowercase
    .replace(/[^\w\s-]/g, "") // Remove non-word chars except spaces and hyphens
    .replace(/[\s_-]+/g, "-") // Convert spaces/underscores to single hyphens
    .replace(/^-+|-+$/g, ""); // Trim hyphens from start/end
};

export const generateCourseImageUrl = (key: string) => {
  return `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME}.t3.storageapi.dev/${key}`;
};
