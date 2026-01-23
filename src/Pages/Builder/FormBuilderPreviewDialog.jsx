import Modal from "../../Component/Modal";

import { Card, CardContent, CardHeader, CardTitle } from "../../Library/Card";
import { Button } from "../../Library/Button";
import { Badge } from "../../Library/Badge";
import { Input } from "../../Library/Input";
import { Label } from "../../Library/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../Library/Select";
import { Textarea } from "../../Library/textarea";
import FileInput from "../...Library/FileInput";

const FormBuilderPreviewDialog = ({
  isOpen,
  onOpenChange,
  formName,
  formDescription,
  isActive,
  version,
  fields,
  FieldValidationRule,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => onOpenChange(false)}
      Header={
        <h2 className="text-sm sm:text-lg md:text-xl p-2">
          Form Preview : {formName || "New Form"}
        </h2>
      }
      Body={
        <div className="space-y-6">
          {/* FORM DETAILS */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold
               text-base sm:text-lg md:text-xl
               mb-1">
              {formName || "Form Name"}
            </h3>
            {formDescription && (
              <p className="text-gray-600 text-sm sm:text-base">
                {formDescription}
              </p>
            )}
            {/* Responsive Status Row */}
            <div className="
      flex flex-col sm:flex-row
      sm:items-center gap-2 sm:gap-4
      mt-3 text-sm sm:text-base
    ">
              <div className="flex items-center gap-2">
                <span className="font-medium">Status:</span>
                <Badge
                  size="xs"
                  className={
                    isActive
                      ? "bg-green-200 text-green-800"
                      : "bg-red-500 text-gray-100"
                  }
                >
                  {isActive ? "Active" : "Draft"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Version:</span>
                <Badge variant="warning" size="xs">{version}</Badge>
              </div>
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
                            : field.OptionsJson?.split(",")
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
                    <div className="text-xs text-gray-500">
                      Validation :{" "}
                      {(() => {
                        const validationRule = FieldValidationRule?.data?.find(rule => rule.Id === field.ValidationRuleId);
                        return <Badge size="xs" variant="teal">{validationRule?.RuleName || "None"}</Badge>;
                      })()}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      }
      Footer={
        <div className="flex justify-end p-4">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      }
    />
  );
};

export default FormBuilderPreviewDialog;
