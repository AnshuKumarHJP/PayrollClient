import React, { forwardRef, useState, useEffect } from "react";
import { Avatar } from "./avatar";
import { Label } from "./Label";
import AppIcon from "../Component/AppIcon";
import { cn } from "./utils";

const FileInput = forwardRef((props, ref) => {
  const {
    label,
    error,
    mand,
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
    const droppedFile = e.dataTransfer.files?.[0] || null;
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
    <div className={cn("w-full p-2 rounded-sm my-4", className)}>
      {label && (
        <Label
          htmlFor={inputId}
          className="block font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label} {mand &&<span className="text-red-600"> *</span>}
        </Label>
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
          className="mb-2 text-gray-500 dark:text-gray-400"
          size={24}
        />

        <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
          Drag and drop your file here, or{" "}
          <span className="font-medium text-primary-500 dark:text-primary-400">
            click to upload
          </span>
        </p>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Allowed: {allowTypes.join(", ")}
        </p>
      </div>

      {/* File Preview / Info */}
      <div className="mt-4">
        {file &&
          (isImage ? (
            <div className="flex flex-col items-start gap-2">
              <Avatar src={preview || ""} size={160} />
              <span className="font-medium text-gray-600 dark:text-gray-300">
                {file.name}
              </span>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3 p-1">
              {view && (
                <span className="font-medium text-primary-500 dark:text-primary-400 cursor-pointer">
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
                  className="flex items-center gap-1 font-medium text-primary-500 dark:text-primary-400 cursor-pointer"
                >
                  Download
                  <AppIcon name="Download" size={16} />
                </span>
              )}

              <span className="text-gray-700 dark:text-gray-300">
                📁 {file.name.split(".").pop()?.toUpperCase() || "FILE"}
              </span>

              <span className="text-gray-500 dark:text-gray-400 underline truncate max-w-xs">
                {file.name}
              </span>
            </div>
          ))}
      </div>

      {/* Error */}
      {(error || invalidType) && (
        <p className="text-red-500 dark:text-red-400 mt-2">
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
