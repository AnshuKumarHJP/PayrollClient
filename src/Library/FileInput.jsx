import React, { forwardRef, useState, useEffect } from "react";
import { Avatar } from "./Avatar";
import AppIcon from "../Component/AppIcon";
import { cn } from "@/lib/utils";

const FileInput = forwardRef((props, ref) => {
  const {
    label,
    error,
    className = "",
    allowTypes = [
      ".jpg",
      ".jpeg",
      ".png",
      "application/pdf",
      ".csv",
      ".doc",
      ".docx",
    ],
    view = false,
    download = false,
    onChangeFile,
    ...rest
  } = props;

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isImage, setIsImage] = useState(false);
  const [invalidType, setInvalidType] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const inputId = `file-input-${Math.random().toString(36).slice(2)}`;

  /* ---------------- FILE HANDLING ---------------- */

  const processFile = (selectedFile) => {
    if (!selectedFile) return;

    const valid =
      allowTypes.length === 0 ||
      allowTypes.some((type) =>
        type.startsWith(".")
          ? selectedFile.name.endsWith(type)
          : selectedFile.type === type ||
            (type.endsWith("/*") &&
              selectedFile.type.startsWith(type.split("/")[0]))
      );

    setInvalidType(!valid);

    if (!valid) {
      setFile(null);
      setPreview(null);
      onChangeFile?.(null);
      return;
    }

    setFile(selectedFile);
    onChangeFile?.(selectedFile);

    if (selectedFile.type.startsWith("image/")) {
      setIsImage(true);
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setIsImage(false);
      setPreview(null);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    processFile(selectedFile);
  };

  /* ---------------- DRAG & DROP ---------------- */

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files?.[0];
    processFile(droppedFile);
  };

  /* ---------------- CLEANUP ---------------- */

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  /* ---------------- UI ---------------- */

  return (
    <div className={cn("w-full my-4", className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-[var(--p)] font-medium text-[var(--gray-700)] mb-1"
        >
          {label}
        </label>
      )}

      {/* Hidden input */}
      <input
        id={inputId}
        type="file"
        ref={ref}
        className="hidden"
        onChange={handleFileChange}
        {...rest}
      />

      {/* Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById(inputId).click()}
        className={cn(
          `
          flex flex-col items-center justify-center
          border-2 border-dashed
          rounded-[var(--control-radius-lg)]
          p-6 cursor-pointer
          transition-all duration-200
          `,
          dragActive
            ? `
              border-[var(--control-primary)]
              bg-[var(--primary-50)]
            `
            : `
              border-[var(--stroke-gray-400)]
              hover:border-[var(--control-primary)]
              hover:bg-[var(--light-gray-100)]
            `
        )}
      >
        <AppIcon
          name="CloudUpload"
          className="mb-2 text-[var(--gray-500)]"
          size={28}
        />

        <p className="text-[var(--p)] text-[var(--gray-600)] text-center">
          Drag and drop your file here, or{" "}
          <span className="font-medium text-[var(--primary-500)]">
            click to upload
          </span>
        </p>

        <p className="text-[var(--p11)] text-[var(--gray-500)] mt-1">
          Allowed: {allowTypes.join(", ")}
        </p>
      </div>

      {/* File Preview / Info */}
      <div className="mt-4">
        {file &&
          (isImage ? (
            <div className="flex flex-col items-start gap-2">
              <Avatar src={preview || ""} size={160} />
              <span className="text-[var(--p)] font-medium text-[var(--gray-600)]">
                {file.name}
              </span>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3 p-1">
              {view && (
                <span className="text-[var(--p)] font-medium text-[var(--primary-500)] cursor-pointer">
                  View
                </span>
              )}

              {download && (
                <span
                  onClick={() => {
                    if (!file) return;
                    const url = URL.createObjectURL(file);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = file.name;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                  }}
                  className="flex items-center gap-1 text-[var(--p)] font-medium text-[var(--primary-500)] cursor-pointer"
                >
                  Download
                  <AppIcon name="Download" size={16} />
                </span>
              )}

              <span className="text-[var(--p)] text-[var(--gray-700)]">
                📁 {file.name.split(".").pop()?.toUpperCase() || "FILE"}
              </span>

              <span className="text-[var(--p11)] text-[var(--gray-500)] underline truncate max-w-xs">
                {file.name}
              </span>
            </div>
          ))}
      </div>

      {/* Error */}
      {(error || invalidType) && (
        <p className="text-[var(--p)] text-[var(--danger-500)] mt-2">
          {invalidType
            ? `This file type is not allowed. Allowed: ${allowTypes.join(", ")}`
            : "Please select a valid file."}
        </p>
      )}
    </div>
  );
});

FileInput.displayName = "FileInput";
export default FileInput;
