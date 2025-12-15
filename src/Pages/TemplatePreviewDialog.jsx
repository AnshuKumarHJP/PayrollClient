import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../Lib/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "../Lib/card";
import { Button } from "../Lib/button";
import { Input } from "../Lib/input";
import { Label } from "../Lib/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Lib/select";
import { Textarea } from "../Lib/textarea";
import FileInput from "../Lib/FileInput";

const TemplatePreviewDialog = ({
  isOpen,
  onOpenChange,
  templateName,
  templateDescription,
  isActive,
  version,
  fields,
  formatValidationDisplay
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Template Preview: {templateName || "New Template"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Template Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">{templateName || "Template Name"}</h3>
            {templateDescription && (
              <p className="text-gray-600 text-sm">{templateDescription}</p>
            )}
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span>Status: {isActive ? "Active" : "Draft"}</span>
              <span>Version: {version}</span>
            </div>
          </div>

          {/* Form Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Form Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No fields configured yet. Add fields to see the preview.
                </div>
              ) : (
                fields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <Label className="flex items-center gap-2">
                      {field.label}
                      {field.required && <span className="text-red-500">*</span>}
                    </Label>

                    {field.type === "text" && (
                      <Input
                        type="text"
                        placeholder={field.placeholder || ""}
                        maxLength={field.maxLength}
                        defaultValue={field.defaultValue || ""}
                        disabled
                      />
                    )}

                    {field.type === "email" && (
                      <Input
                        type="email"
                        placeholder={field.placeholder || ""}
                        defaultValue={field.defaultValue || ""}
                        disabled
                      />
                    )}

                    {field.type === "number" && (
                      <Input
                        type="number"
                        placeholder={field.placeholder || ""}
                        defaultValue={field.defaultValue || ""}
                        disabled
                      />
                    )}

                    {field.type === "date" && (
                      <Input
                        type="date"
                        placeholder={field.placeholder || ""}
                        defaultValue={field.defaultValue || ""}
                        disabled
                      />
                    )}

                    {field.type === "select" && (
                      <Select disabled>
                        <SelectTrigger>
                          <SelectValue placeholder={field.placeholder || "Select an option"} />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.isArray(field.options)
                            ? field.options.map((option, index) => (
                                <SelectItem key={index} value={option}>
                                  {option}
                                </SelectItem>
                              ))
                            : field.options?.split(',').map((option, index) => (
                                <SelectItem key={index} value={option.trim()}>
                                  {option.trim()}
                                </SelectItem>
                              ))}
                        </SelectContent>
                      </Select>
                    )}

                    {field.type === "textarea" && (
                      <Textarea
                        placeholder={field.placeholder || ""}
                        defaultValue={field.defaultValue || ""}
                        disabled
                        rows={3}
                      />
                    )}

                    {field.type === "checkbox" && (
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          defaultChecked={field.defaultValue === "true"}
                          disabled
                          className="rounded"
                        />
                        <Label className="text-sm">{field.label}</Label>
                      </div>
                    )}

                    {field.type === "file" && (
                      <FileInput
                        label=""
                        disabled
                      />
                    )}

                    {/* Validation Info */}
                    {field.validation && field.validation !== "none" && (
                      <div className="text-xs text-gray-500">
                        Validation: {formatValidationDisplay(field.validation)}
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close Preview
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplatePreviewDialog;
