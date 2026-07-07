"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { BrushCleaning, Trash2, UploadCloud } from "lucide-react";

interface ImageDropzoneProps {
  defaultImage?: string;
  onChange?: (file: File | null) => void;
  maxFiles?: number;
  title?: string;
  description?: string;
  className?: string;
}

export function ImageDropzone({
  defaultImage,
  onChange,
  maxFiles = 1,
  title = "Drag & drop an image here",
  description = "PNG, JPG, JPEG, WEBP",
}: ImageDropzoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(defaultImage ?? "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!file) {
      setPreview(defaultImage ?? "");
    }
  }, [defaultImage, file]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const selectedFile = acceptedFiles[0];

      if (!selectedFile) return;

      if (file && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }

      const objectUrl = URL.createObjectURL(selectedFile);

      setFile(selectedFile);
      setPreview(objectUrl);
      setError("");

      onChange?.(selectedFile);
    },
    [file, preview, onChange],
  );

  const removeImage = () => {
    if (preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setFile(null);
    setPreview("");
    setError("");

    onChange?.(null);
  };

  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    if (!fileRejections.length) return;

    const errorCode = fileRejections[0]?.errors[0]?.code;

    switch (errorCode) {
      case "file-too-large":
        setError("File size should be less than 5 MB.");
        break;

      case "too-many-files":
        setError("You can only upload one image.");
        break;

      case "file-invalid-type":
        setError("Only image files are allowed.");
        break;

      default:
        setError(fileRejections[0]?.errors[0]?.message || "Invalid file.");
    }
  }, []);

  const clearError = () => setError("");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    multiple: false,
    maxFiles,
    maxSize: 5 * 1024 * 1024,
    accept: {
      "image/*": [],
    },
  });

  if (preview) {
    return (
      <div className="relative flex justify-center overflow-hidden rounded-xl border">
        <Image
          src={preview}
          alt="Preview"
          width={300}
          height={300}
          className="aspect-square object-cover"
          unoptimized
        />

        <Button
          type="button"
          size="icon"
          variant="destructive"
          className="absolute top-2 right-2"
          onClick={removeImage}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={`group cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
          isDragActive
            ? "border-primary bg-primary/5 scale-[1.01]"
            : error
              ? "border-destructive bg-destructive/5"
              : "border-muted-foreground/25 hover:border-primary/60 hover:bg-muted/30"
        }`}
      >
        <input {...getInputProps()} />

        <div
          className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full transition-colors ${
            error
              ? "bg-destructive/10 text-destructive"
              : isDragActive
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
          }`}
        >
          <UploadCloud className="size-7" />
        </div>

        <h3 className="text-base font-semibold">
          {isDragActive ? "Drop image here" : title}
        </h3>

        <p className="text-muted-foreground mt-2 text-sm">
          Drag & drop or{" "}
          <span className="text-primary font-medium underline underline-offset-2">
            browse files
          </span>
        </p>

        <p className="text-muted-foreground mt-1 text-xs">{description}</p>
      </div>

      {error && (
        <div className="bg-destructive/10 border-destructive/30 flex items-center justify-between rounded-lg border p-3">
          <p className="text-muted-foreground text-sm">{error}</p>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={clearError}
          >
            <BrushCleaning className="mr-1 size-4" />
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}
