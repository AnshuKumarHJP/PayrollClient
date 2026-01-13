import { Label } from "../../../Lib/label";
import { Switch } from "../../../Lib/switch";

const FieldRequiredCheckbox = ({ fieldForm, setFieldForm }) => {
  return (
   <div className="md:col-span-2 flex items-center gap-2">
    <div className=" flex items-center gap-2">
      <Switch
        checked={fieldForm.Required}
        onCheckedChange={(checked) =>
          setFieldForm({
            ...fieldForm,
            Required: checked,
          })
        }
      />
      <Label>Required <span className="text-red-500"> *</span></Label>
    </div>
     <div className="flex items-center gap-2">
      <Switch
        checked={fieldForm.Active}
        onCheckedChange={(checked) =>
          setFieldForm({
            ...fieldForm,
            Active: checked,
          })
        }
      />
      <Label>Active <span className="text-red-500"> *</span></Label>
    </div>
   </div>
  );
};

export default FieldRequiredCheckbox;
