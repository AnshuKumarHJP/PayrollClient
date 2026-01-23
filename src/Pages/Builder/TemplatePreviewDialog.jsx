import { useState } from "react";
import Modal from "../../Component/Modal";

import { Card, CardContent, CardHeader, CardTitle } from "../../Library/Card";
import { Button } from "../../Library/Button";
import { Input } from "../../Library/Input";
import { Label } from "../../Library/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../Library/Select";
import { Textarea } from "../../Library/Textarea";
import FileInput from "../../Library/FileInput";

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
    <Modal
      isOpen={isOpen}
      onClose={() => onOpenChange(false)}
      title={`Template Preview: ${templateName || "New Template"}`}
      Header={
        <div className="p-4">
          <h2 className="text-lg font-semibold">
            Template Preview: {templateName || "New Template"}
          </h2>
        </div>
      }
      Body={
        <div className="space-y-6 p-4">
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
                      {field.Label}
                      {field.Required && (
                        <span className="text-red-500">*</span>
                      )}
                    </Label>

                    {/* TEXT / BASIC */}
                    {["text", "email", "number", "date"].includes(
                      field.Type
                    ) && (
                      <Input
                        type={field.Type}
                        placeholder={field.Placeholder || ""}
                        maxLength={field.MaxLength}
                        defaultValue={field.DefaultValue || ""}
                        disabled
                      />
                    )}

                    {/* TEXTAREA */}
                    {field.Type === "textarea" && (
                      <Textarea
                        rows={3}
                        placeholder={field.Placeholder || ""}
                        defaultValue={field.DefaultValue || ""}
                        disabled
                      />
                    )}

                    {/* SELECT */}
                    {field.Type === "select" && (
                      <Select disabled>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              field.Placeholder || "Select an option"
                            }
                          />
                        </SelectTrigger>

                        <SelectContent className="max-h-60 overflow-y-auto">
                          {(Array.isArray(field.OptionsJson)
                            ? field.OptionsJson
                            : field.OptionsJson?.split(",") || []
                          ).map((option, i) => {
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
                    {field.Type === "checkbox" && (
                      <label className="flex items-center gap-2">
                        <input
                          disabled
                          type="checkbox"
                          className="rounded"
                          defaultChecked={field.DefaultValue === "true"}
                        />
                        <span className="text-sm">{field.Label}</span>
                      </label>
                    )}

                    {/* FILE INPUT */}
                    {field.Type === "file" && <FileInput disabled />}

                    {/* VALIDATION */}
                    {field.ValidationRuleCode && field.ValidationRuleCode !== "none" && (
                      <div className="text-xs text-gray-500">
                        Validation:{" "}
                        {formatValidationDisplay(field.ValidationRuleCode)}
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
  );
};

export default TemplatePreviewDialog;
