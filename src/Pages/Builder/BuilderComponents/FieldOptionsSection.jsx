import { Input } from "../../../Library/Input";
import { Label } from "../../../Library/Label";

const FieldOptionsSection = ({ fieldForm, setFieldForm }) => {
  if (fieldForm.Type !== "select" && fieldForm.Type !== "multi-select") return null;

  return (
    <>
      <div className="md:col-span-2">
        <Label>Options JSON</Label>
        <Input
          value={fieldForm.OptionsJson || ""}
          placeholder='e.g. [{"value":"option1","label":"Option 1"},{"value":"option2","label":"Option 2"}]'
          onChange={(e) =>
            setFieldForm({
              ...fieldForm,
              OptionsJson: e.target.value,
            })
          }
        />
      </div>

      <div className="md:col-span-2">
        <Label>API URL</Label>
        <Input
          value={fieldForm.ApiUrl || ""}
          placeholder="e.g. https://api.example.com/options"
          onChange={(e) =>
            setFieldForm({
              ...fieldForm,
              ApiUrl: e.target.value,
            })
          }
        />
      </div>

      {fieldForm.ApiUrl && (
        <>
          <div>
            <Label>Value Key <span className="text-red-500"> *</span></Label>
            <Input
              value={fieldForm.ValueKey || ""}
              placeholder="e.g. value"
              onChange={(e) =>
                setFieldForm({
                  ...fieldForm,
                  ValueKey: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>Label Key <span className="text-red-500"> *</span></Label>
            <Input
              value={fieldForm.LabelKey || ""}
              placeholder="e.g. label"
              onChange={(e) =>
                setFieldForm({
                  ...fieldForm,
                  LabelKey: e.target.value,
                })
              }
            />
          </div>
        </>
      )}
    </>
  );
};

export default FieldOptionsSection;
