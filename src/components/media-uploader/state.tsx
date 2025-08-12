import { ImageIcon, UploadCloudIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";

export function EmptyMediaState() {
  return (
    <div className="flex flex-col gap-y-4 items-center">
      <div className="bg-muted rounded-full p-2">
        <UploadCloudIcon className="size-6" />
      </div>
      <div className="font-semibold">
        Drop your files here or click wherever inside
      </div>
      <Button type="button">Select File</Button>
    </div>
  );
}

export function ExistMediaState({
  url,
  removeMedia,
  isDeleting,
  type,
}: {
  url: string;
  removeMedia: () => void;
  isDeleting: boolean;
  type: "image" | "video";
}) {
  return (
    <>
      {type === "image" ? (
        <div className="relative size-full">
          <Image src={url} alt="Preview" fill className="object-contain p-1" />
          <Button
            type="button"
            variant="destructive"
            className="absolute right-2 top-2"
            size="sm"
            onClick={removeMedia}
            disabled={isDeleting}
          >
            <XIcon className="size-4" />
          </Button>
        </div>
      ) : (
        <div className="relative w-full h-full flex items-center justify-center">
          <video src={url} controls className="size-full" />
          <Button
            type="button"
            variant="destructive"
            className="absolute right-2 top-2"
            size="sm"
            onClick={removeMedia}
            disabled={isDeleting}
          >
            <XIcon className="size-4" />
          </Button>
        </div>
      )}
    </>
  );
}

export function LoadingMediaState({
  file,
  progress,
}: {
  file: File;
  progress: number;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-y-2">
      <p>{progress}</p>
      <p className="text-muted-foreground font-medium text-sm">Uploading...</p>
      <p className="text-muted-foreground truncate max-w-xs text-xs">
        {file.name}
      </p>
    </div>
  );
}

export function ErrorMediaState() {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center mx-auto size-12 rounded-full bg-destructive/30 mb-4">
        <ImageIcon className="size-6 text-destructive" />
      </div>

      <p className="text-base font-semibold">Upload Failed</p>
      <p className="text-xs mt-1 text-muted-foreground">Something went wrong</p>
      <Button type="button" className="mt-4">
        Retry
      </Button>
    </div>
  );
}
