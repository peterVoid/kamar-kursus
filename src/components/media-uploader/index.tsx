"use client";

import { cn, generateCourseImageUrl } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { ErrorCodeType, FileRejection, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Card, CardContent } from "../ui/card";
import {
  EmptyMediaState,
  ErrorMediaState,
  ExistMediaState,
  LoadingMediaState,
} from "./state";

type FileType = "image" | "video";

type MediaUploader = {
  id: string | null;
  file: File | null;
  fileName: string;
  fileType: FileType;
  uploading: boolean;
  progress: number;
  key?: string;
  error: boolean;
  isDeleting: boolean;
  objectUrl: string | null;
};

interface Props {
  value?: string;
  onChange: (value: string) => void;
  type?: "image" | "video";
  disabled?: boolean;
}

export function MediaUploader({
  onChange,
  value,
  type = "image",
  disabled = false,
}: Props) {
  const [mediaState, setMediaState] = useState<MediaUploader>({
    id: null,
    file: null,
    fileName: "",
    fileType: type,
    progress: 0,
    uploading: false,
    error: false,
    isDeleting: false,
    objectUrl: null,
    key: undefined,
  });

  useEffect(() => {
    setMediaState((prev) => ({
      ...prev,
      key: value,
      objectUrl: value ? generateCourseImageUrl(value) : null,
    }));
  }, [value]);

  const uploadMedia = useCallback(
    async (file: File) => {
      if (!file) return null;

      setMediaState((prev) => ({
        ...prev,
        uploading: true,
        isDeleting: false,
        error: false,
        progress: 0,
      }));

      try {
        const response = await fetch("/api/s3/upload", {
          method: "POST",
          body: JSON.stringify({
            fileName: file.name,
            size: file.size,
            contentType: file.type,
          }),
        });

        const { presignedUrl, key } = await response.json();

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          xhr.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
              const progressPercentage = Math.round(
                (event.loaded / event.total) * 100
              );
              setMediaState((prev) => ({
                ...prev,
                progress: progressPercentage,
              }));
            }
          });

          xhr.addEventListener("load", () => {
            setMediaState((prev) => ({
              ...prev,
              progress: 0,
              uploading: false,
              key,
            }));

            onChange(key);

            resolve();
            toast.success("Uploading successfully");
          });

          xhr.addEventListener("error", () => {
            setMediaState((prev) => ({
              ...prev,
              error: true,
            }));

            reject(new Error("Failed to upload media"));
          });

          xhr.open("PUT", presignedUrl);
          xhr.setRequestHeader("Content-Type", file.type);
          xhr.send(file);
        });
      } catch {
        toast.error("Something went wrong");
        console.log("ERROR: GET PRESIGNED URL");
        setMediaState((prev) => ({
          ...prev,
          error: true,
          isDeleting: false,
          progress: 0,
          uploading: false,
        }));
      }
    },
    [onChange]
  );

  const onDrop = useCallback(
    (fileAccepted: File[], fileReject: FileRejection[]) => {
      if (!!fileReject.length) {
        const errorCode: ErrorCodeType = fileReject[0].errors[0]
          .code as ErrorCodeType;

        if (errorCode === "file-invalid-type") {
          toast.error("Invalid file type");
          return;
        }

        if (errorCode === "file-too-large") {
          toast.error("File to large");
          return;
        }
      }

      const file: File = fileAccepted[0];

      setMediaState({
        objectUrl: URL.createObjectURL(file),
        file,
        fileName: file.name,
        progress: 0,
        isDeleting: false,
        error: false,
        fileType: file.type as FileType,
        id: uuidv4(),
        uploading: false,
      });

      uploadMedia(file);
    },
    [uploadMedia]
  );

  const handleRemoveMedia = async () => {
    setMediaState((state) => ({
      ...state,
      isDeleting: true,
    }));

    try {
      const response = await fetch("/api/s3/delete", {
        method: "DELETE",
        body: JSON.stringify({
          key: mediaState.key,
        }),
      });

      await response.json();

      if (response.ok) {
        setMediaState((prev) => ({
          ...prev,
          error: false,
          isDeleting: false,
          objectUrl: null,
          file: null,
          fileName: "",
          fileType: type,
          key: "",
          progress: 0,
          uploading: false,
          id: null,
        }));

        onChange("");
        toast.success("Media has been removed");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to deleting Media...");
      setMediaState((state) => ({
        ...state,
        isDeleting: false,
        error: true,
      }));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept:
      type === "image"
        ? {
            "image/*": [],
          }
        : {
            "video/*": [],
          },
    maxFiles: 1,
    maxSize: type === "image" ? 5 * 1024 * 1024 : 2000 * 1024 * 1024,
    onDrop,
  });

  const RenderContent = () => {
    if (mediaState.uploading) {
      return (
        <LoadingMediaState
          file={mediaState.file!}
          progress={mediaState.progress}
        />
      );
    }

    if (mediaState.error) {
      return <ErrorMediaState />;
    }

    if (mediaState.objectUrl) {
      return (
        <ExistMediaState
          url={mediaState.objectUrl}
          removeMedia={handleRemoveMedia}
          isDeleting={mediaState.isDeleting || disabled}
          type={type}
        />
      );
    }

    return <EmptyMediaState />;
  };

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative border-dashed border-2 h-64",
        isDragActive
          ? "border-primary bg-primary/10 border-solid"
          : "hover:border-primary"
      )}
    >
      <CardContent className="flex items-center justify-center size-full">
        {!mediaState.key && <input {...getInputProps()} />}
        {RenderContent()}
      </CardContent>
    </Card>
  );
}
