import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../Lib/dialog";

import { Card, CardContent, CardHeader, CardTitle } from "../../Lib/card";
import { Button } from "../../Lib/button";
import { Input } from "../../Lib/input";
import { Label } from "../../Lib/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../Lib/select";
import { Textarea } from "../../Lib/textarea";
import FileInput from "../../Lib/FileInput";

const TemplatePreviewDialog = ({
  isOpen,
  onOpenChange,
  templateName,
  templateDescription,
  isActive,
  version,
  fields,
  formatValidationDisplay,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl"
        header={
          <DialogHeader>
            <DialogTitle>
              Template Preview: {templateName || "New Template"}
            </DialogTitle>
          </DialogHeader>
        }
        body={
          <div className="space-y-6">
            {/* TEMPLATE DETAILS */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-1">
                {templateName || "Template Name"}
              </h3>

              {templateDescription && (
                <p className="text-gray-600 text-sm">{templateDescription}</p>
              )}

              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>Status: {isActive ? "Active" : "Draft"}</span>
                <span>Version: {version}</span>
              </div>
            </div>

            {/* FORM PREVIEW */}
            <Card>
              <CardHeader>
                <CardTitle>Form Preview</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {fields.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No fields configured yet.
                  </div>
                ) : (
                  fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label className="flex items-center gap-2">
                        {field.label}
                        {field.required && (
                          <span className="text-red-500">*</span>
                        )}
                      </Label>

                      {/* TEXT / BASIC */}
                      {["text", "email", "number", "date"].includes(
                        field.type
                      ) && (
                        <Input
                          type={field.type}
                          placeholder={field.placeholder || ""}
                          maxLength={field.maxLength}
                          defaultValue={field.defaultValue || ""}
                          disabled
                        />
                      )}

                      {/* TEXTAREA */}
                      {field.type === "textarea" && (
                        <Textarea
                          rows={3}
                          placeholder={field.placeholder || ""}
                          defaultValue={field.defaultValue || ""}
                          disabled
                        />
                      )}

                      {/* SELECT */}
                      {field.type === "select" && (
                        <Select disabled>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                field.placeholder || "Select an option"
                              }
                            />
                          </SelectTrigger>

                          <SelectContent className="max-h-60 overflow-y-auto">
                            {(Array.isArray(field.options)
                              ? field.options
                              : field.options?.split(",")
                            )?.map((option, i) => {
                              const value = typeof option === "object" ? option.value : option.trim();
                              const label = typeof option === "object" ? option.label : option.trim();
                              return (
                                <SelectItem key={i} value={value}>
                                  {label}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      )}

                      {/* CHECKBOX */}
                      {field.type === "checkbox" && (
                        <label className="flex items-center gap-2">
                          <input
                            disabled
                            type="checkbox"
                            className="rounded"
                            defaultChecked={field.defaultValue === "true"}
                          />
                          <span className="text-sm">{field.label}</span>
                        </label>
                      )}

                      {/* FILE INPUT */}
                      {field.type === "file" && <FileInput disabled />}

                      {/* VALIDATION */}
                      {field.validation && field.validation !== "none" && (
                        <div className="text-xs text-gray-500">
                          Validation:{" "}
                          {formatValidationDisplay(field.validation)}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        }
      />
    </Dialog>
  );
};

export default TemplatePreviewDialog;
