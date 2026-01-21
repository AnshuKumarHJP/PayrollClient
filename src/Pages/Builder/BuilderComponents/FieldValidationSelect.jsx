import { useDispatch, useSelector } from "react-redux";
import { Label } from "../../../Library/Label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../Lib/select";
import { useEffect } from "react";
import AppIcon from "../../../Component/AppIcon"; // spinner icon if needed
import { GetAllFieldValidationRules } from "../../../Store/FormBuilder/Action";

const FieldValidationSelect = ({ fieldForm, setFieldForm }) => {
    const dispatch = useDispatch();
    const {
        data = [],
        isLoading,
        error,
        Success
    } = useSelector(
        (state) => state.FormBuilderStore.FieldValidationRule || {}
    );
    const dataset = data || [];
    useEffect(() => {
        dispatch(GetAllFieldValidationRules());
    }, []);

    return (
        <div>
            <Label>Validation <span className="text-red-500"> *</span></Label>

            <Select
                value={fieldForm.ValidationRuleId || "0"}
                onValueChange={(v) =>
                    setFieldForm({
                        ...fieldForm,
                        ValidationRuleId: v === "0" ? null : v,
                    })
                }
                disabled={isLoading}   // 🌟 disables select while loading
            >
                <SelectTrigger>
                    <SelectValue placeholder={isLoading ? "Loading..." : "Select..."} />
                </SelectTrigger>

                <SelectContent>
                    {/* 🌟 Loading Placeholder Inside Dropdown */}
                    {isLoading && (
                        <div className="p-3 flex items-center gap-2 text-gray-500">
                            <AppIcon name="Loader2" className="animate-spin h-4 w-4" />
                            Loading...
                        </div>
                    )}

                    {!isLoading && (
                        <>
                            {/* Optional "None" option */}
                            <SelectItem value="0">None</SelectItem>

                            {dataset.map((r, idx) => (
                                <SelectItem key={idx} value={r.Id}>
                                    {r.RuleName}
                                </SelectItem>
                            ))}
                        </>
                    )}
                </SelectContent>
            </Select>
        </div>
    );
};

export default FieldValidationSelect;
