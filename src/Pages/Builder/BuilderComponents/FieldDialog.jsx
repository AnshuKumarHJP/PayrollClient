import { useState, useEffect } from "react";


import { Button } from "../../../Lib/button";
import { useToast } from "../../../Lib/use-toast";

// Field Components
import FieldBasicInputs from "./FieldBasicInputs";
import FieldTypeSelect from "./FieldTypeSelect";
import FieldValidationSelect from "./FieldValidationSelect";
import FieldOptionsSection from "./FieldOptionsSection";
import FieldApplicableSelect from "./FieldApplicableSelect";
import FieldRequiredCheckbox from "./FieldRequiredCheckbox";
import AppIcon from "../../../Component/AppIcon";
import Modal from "../../../Component/Modal";
import { CardContent } from "../../../Library/Card";

// ------------------------------------------------
// PROCESS FIELD DETAILS (VALIDATION & FILTERING)
// ------------------------------------------------
const processFieldDetails = (field) => {
  // Required validations (NOT NULL fields from database schema)
  if (!field.Name?.trim()) {
    throw new Error("Field Name is required.");
  }
  if (!field.Label?.trim()) {
    throw new Error("Field Label is required.");
  }
  if (!field.Type?.trim()) {
    throw new Error("Field Type is required.");
  }

  // Select-specific validations
  const selectTypes = ["select", "multi-select"];
  if (selectTypes.includes(field.Type)) {
    const hasOptionsJson = field.OptionsJson?.trim();
    const hasApiUrl = field.ApiUrl?.trim();
    if (!hasOptionsJson && !hasApiUrl) {
      throw new Error("Either Options JSON or API URL is required for select field types.");
    }
    if (hasOptionsJson && hasApiUrl) {
      throw new Error("Cannot specify both Options JSON and API URL for select field types. Choose one.");
    }
    // If API URL is provided, ensure ValueKey and LabelKey are also provided
    if (hasApiUrl && !field.ValueKey?.trim()) {
      throw new Error("Value Key is required when using API URL for select field types.");
    }
    if (hasApiUrl && !field.LabelKey?.trim()) {
      throw new Error("Label Key is required when using API URL for select field types.");
    }
  }

  // API-specific validations
  const apiTypes = ["api-select", "api-multi-select"];
  if (apiTypes.includes(field.Type)) {
    if (!field.ApiUrl?.trim()) {
      throw new Error("API URL is required for API-based field types.");
    }
    if (!field.ValueKey?.trim()) {
      throw new Error("Value Key is required for API-based field types.");
    }
    if (!field.LabelKey?.trim()) {
      throw new Error("Label Key is required for API-based field types.");
    }
  }

  // Process and filter the field object
  const processed = {
    ...field,
    Name: field.Name.trim(),
    Label: field.Label.trim(),
    Type: field.Type.trim(),
    Required: field.Required ?? false,
    ValidationRuleId: field.ValidationRuleId ? Number(field.ValidationRuleId) : null,
    ApplicableJson: field.ApplicableJson || ["form"],
    // Ensure other fields are trimmed if strings
    Placeholder: field.Placeholder?.trim() || "",
    OptionsJson: field.OptionsJson?.trim() || "",
    ApiUrl: field.ApiUrl?.trim() || "",
    ValueKey: field.ValueKey?.trim() || "",
    LabelKey: field.LabelKey?.trim() || "",
    DefaultValue: field.DefaultValue?.trim() || "",
    FieldGroup: field.FieldGroup?.trim() || "",
    GroupBackendKey: field.GroupBackendKey?.trim() || "",
  };

  return processed;
};

const FieldDialog = ({ isOpen, onClose, onSave, initialFieldForm }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState(initialFieldForm);

  useEffect(() => {
    setFormData(initialFieldForm);
  }, [initialFieldForm]);

  const handleSave = () => {
    try {
      const processedField = processFieldDetails(formData);
      onSave(processedField);
      onClose();
    } catch (error) {
      toast({
        title: "Validation Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pop Up"
      Header={() => (
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center
         px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-emerald-400 to-green-400">
          {/* LEFT CONTENT */}
          <div className="items-start gap-3">
            <h2 className="text-sm sm:text-xl font-semibold text-white flex items-center gap-2">
              <AppIcon name="Settings" size={20} />
              {initialFieldForm.id ? "Edit" : "Create"} Form Field Configuration
            </h2>
            <p className="text-green-100 text-xs sm:text-sm">
              Create and manage custom forms for data collection and user interaction.
            </p>
          </div>
        </div>
      )}
      Footer={() => (
        <div className="flex justify-end gap-2 p-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {initialFieldForm.id ? "Update" : "Add"}
          </Button>
        </div>
      )}
    >
      <div className="space-y-6 p-2 md:p-4">
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldBasicInputs fieldForm={formData} setFieldForm={setFormData} />
          <FieldTypeSelect fieldForm={formData} setFieldForm={setFormData} />
          <FieldOptionsSection fieldForm={formData} setFieldForm={setFormData} />
          <FieldValidationSelect fieldForm={formData} setFieldForm={setFormData} />
          <FieldApplicableSelect fieldForm={formData} setFieldForm={setFormData} />
          <FieldRequiredCheckbox fieldForm={formData} setFieldForm={setFormData} />
        </CardContent>
      </div>
    </Modal>
  );
};

export default FieldDialog;
