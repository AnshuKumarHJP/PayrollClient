import { Label } from "../../../Library/Label";
import { MultiSelect } from "../../../Lib/MultiSelect";

const FieldApplicableSelect = ({ fieldForm, setFieldForm }) => {
  return (
    <div className="">
      <Label>Applicable <span className="text-red-500"> *</span></Label>
      <MultiSelect
        value={fieldForm.ApplicableJson || ["form"]}
        options={[
          { value: "form", label: "Form" },
          { value: "upload", label: "Upload" },
        ]}
        onChange={(v) =>
          setFieldForm({ ...fieldForm, ApplicableJson: v })
        }
      />
    </div>
  );
};

export default FieldApplicableSelect;
