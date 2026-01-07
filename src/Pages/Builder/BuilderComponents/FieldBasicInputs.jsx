import { Input } from "../../../Lib/input";
import { Label } from "../../../Lib/label";

const FieldBasicInputs = ({ fieldForm, setFieldForm }) => {
  const inputs = [
    ["Name", "Field Name *", "Enter unique field name (e.g. firstName)"],
    ["Label", "Field Label *", "Enter label shown to users"],
    ["Placeholder", "Placeholder", "Enter input placeholder"],
    ["FieldGroup", "Group", "Enter section/group name"],
    ["GroupBackendKey", "Group Backend Key", "Backend key for grouping"],
    ["DefaultValue", "Default Value", "Enter default field value"],
  ];

  return (
    <>
      {inputs.map(([key, label, placeholder]) => {
        const isRequired = label.includes("*");
        const labelText = label.replace("*", "").trim();

        return (
          <div key={key} className="space-y-1">
            <Label className="text-sm font-medium">
              {labelText}
              {isRequired && <span className="text-red-500"> *</span>}
            </Label>

            <Input
              value={fieldForm[key] || ""}
              placeholder={placeholder}
              onChange={(e) =>
                setFieldForm({ ...fieldForm, [key]: e.target.value })
              }
            />
          </div>
        );
      })}
    </>
  );
};

export default FieldBasicInputs;
