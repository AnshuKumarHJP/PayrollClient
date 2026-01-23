import { Label } from "../../../Library/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../Library/Select";

const typeOptions = [
  "text", "textarea", "number", "email", "password", "tel", "url",
  "select", "multi-select", "radio", "checkbox", "switch",
  "date", "datetime", "time", "month", "year",
  "file", "image", "document", "signature",
  "autocomplete", "range", "rating", "color",
];

const FieldTypeSelect = ({ fieldForm, setFieldForm }) => {
  return (
    <div>
      <Label>Type <span className="text-red-500"> *</span></Label>
      <Select
        value={fieldForm.Type}
        onValueChange={(v) =>
          setFieldForm({ ...fieldForm, Type: v })
        }
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {typeOptions.map((t) => (
            <SelectItem key={t} value={t}>
              {t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FieldTypeSelect;
