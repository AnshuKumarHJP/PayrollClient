import { useState, useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "../../Lib/card";
import { Button } from "../../Lib/button";
import { Input } from "../../Lib/input";
import { Label } from "../../Lib/label";
import { Textarea } from "../../Lib/textarea";
import { Switch } from "../../Lib/switch";
import { Badge } from "../../Lib/badge";
import AdvanceTable from "../../Component/AdvanceTable";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  Eye,
} from "lucide-react";

import { templateService } from "../../../api/services/templateService";
import ruleTypesService from "../../../api/services/ruleTypesService";
import { useToast } from "../../Lib/use-toast";

// Redux
import { useSelector, useDispatch } from "react-redux";
import Loading from '../../Component/Loading'
import AppIcon from "../../Component/AppIcon";
import FieldDialog from "./BuilderComponents/FieldDialog";
import { ActiveBadge } from "../../Component/HealperComponents";
import FormBuilderPreviewDialog from "./FormBuilderPreviewDialog";
import { SweetConfirm, SweetSuccess } from "../../Component/SweetAlert";


// ------------------------------------------------
// DEFAULT DETAILS (FormBuilderDetails)
// ------------------------------------------------
const emptyField = {
  Name: "",
  Label: "",
  Type: "text",
  Required: false,
  ValidationRuleCode: null,
  MaxLength: "",
  Placeholder: "",
  OptionsJson: "",
  ApplicableJson: ["form"],
  ApiUrl: "",
  ValueKey: "",
  LabelKey: "",
  DefaultValue: "",
  FieldGroup: "",
  GroupBackendKey: "",
  Active: true,
};

const TemplateEdit = ({ id: propId, onSave, onCancel }) => {
  const templateId = propId;
  const { toast } = useToast();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [version, setVersion] = useState("1.0");
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [addApi, setAddApi] = useState("");
  const [updateApi, setUpdateApi] = useState("");
  const [getApi, setGetApi] = useState("");
  const [bulkApi, setBulkApi] = useState("");
  const [Icon, setIcon] = useState("");
  const [groupSave, setGroupSave] = useState(false);
  const [fields, setFields] = useState([]);
  const [ruleTypes, setRuleTypes] = useState([]);
  const [isFieldDialogOpen, setIsFieldDialogOpen] = useState(false);

  const [saveStatus, setSaveStatus] = useState(null);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [initialFieldForm, setInitialFieldForm] = useState(emptyField);


  // LOADERS
  useEffect(() => {
    if (templateId) loadTemplate(templateId);
    loadRuleTypes();
  }, [templateId]);

  const loadRuleTypes = async () => {
    try {
      const data = await ruleTypesService.getAllRuleTypes();
      setRuleTypes([{ id: "none", value: "none", label: "No Validation" }, ...(data || [])]);
    } catch {
      setRuleTypes([
        { id: "none", value: "none", label: "No Validation" },
        { id: "required", value: "required", label: "Required" },
        { id: "email", value: "email", label: "Email" },
        { id: "alphabetic", value: "alphabetic", label: "Alphabetic" },
        { id: "alphanumeric", value: "alphanumeric", label: "Alphanumeric" },
        { id: "numeric", value: "numeric", label: "Numeric" },
        { id: "date", value: "date", label: "Date" },
        { id: "phone", value: "phone", label: "Phone" },
      ]);
    }
  };

  const loadTemplate = async () => {
    try {
      setLoading(true);
      const template = await templateService.getById(templateId);

      setTemplateName(template.name);
      setTemplateDescription(template.description || "");
      setIsActive(template.status === "active");
      setVersion(template.version);
      setAddApi(template.addApi || "");
      setUpdateApi(template.updateApi || "");
      setGetApi(template.getApi || "");
      setBulkApi(template.bulkApi || "");
      setIcon(template.Icon || "");
      setGroupSave(template.groupSave || false);

      setFields(
        (template.fields || []).map((f, i) => ({
          ...f,
          id: f.id || Date.now() + i,
          validation: f.validation || "none",
        }))
      );
    } catch {
      toast({
        title: "Error",
        description: "Failed to load template.",
        variant: "destructive",
      });
      onCancel && onCancel();
    } finally {
      setLoading(false);
    }
  };

  // FIELD DIALOG OPEN
  const handleAddField = () => {
    // setEditingField(null);
    setInitialFieldForm(emptyField);
    setIsFieldDialogOpen(true);
  };

  const handleEditField = (row) => {
    // setEditingField(row);
    setInitialFieldForm({ ...row });
    setIsFieldDialogOpen(true);
  };

  // SAVE FIELD
  const handleSaveField = (processedField) => {
    if (!processedField.Name || !processedField.Label)
      return toast({
        title: "Required",
        description: "Field name & label required",
        variant: "destructive",
      });
    if (initialFieldForm.id) {
      setFields(fields.map((f) => (f.id === initialFieldForm.id ? processedField : f)));
      SweetSuccess({
        title: "Updated",
        text: "Field updated successfully.",
      });
    } else {
      processedField.id = Date.now();
      processedField.DisplayOrder = fields.length + 1;
      setFields([...fields, processedField]);
      SweetSuccess({
        title: "Created",
        text: "Field created successfully.",
      });
    }

    setIsFieldDialogOpen(false);
  };

  const handleDeleteField = (id) => {
    SweetConfirm({
      title: "Delete Field",
      text: "Are you sure you want to delete this field?",
      onConfirm: () => setFields(fields.filter((x) => x.id !== id))
    });
  };

  // SAVE TEMPLATE
  const handleSaveTemplate = async () => {
    if (!templateName.trim())
      return toast({
        title: "Missing",
        description: "Template name is required.",
        variant: "destructive",
      });

    try {
      setSaveStatus("saving");

      const payload = {
        name: templateName,
        description: templateDescription,
        status: isActive ? "active" : "inactive",
        version,
        addApi,
        updateApi,
        getApi,
        bulkApi,
        groupSave,
        Icon,
        fields,
        createdBy: "currentUser",
      };

      const savedTemplate = templateId
        ? await templateService.update(templateId, payload)
        : await templateService.create(payload);

      SweetSuccess({
        title: templateId ? "Updated" : "Created",
        text: `Template ${templateId ? "updated" : "created"} successfully.`,
      });

      onSave && onSave(savedTemplate);
    } catch {
      toast({
        title: "Failed",
        description: "Unable to save template.",
        variant: "destructive",
      });
    } finally {
      setSaveStatus(null);
    }
  };

  const moveField = (i, direction) => {
    const newIndex = direction === "up" ? i - 1 : i + 1;
    if (newIndex < 0 || newIndex >= fields.length) return;

    const arr = [...fields];
    [arr[i], arr[newIndex]] = [arr[newIndex], arr[i]];
    setFields(arr);
  };

  const formatValidationDisplay = (v) => {
    if (!v || v === "none") return "No Validation";
    if (typeof v === "string") return v;

    if (typeof v === "object") {
      const arr = [];
      if (v.minLength || v.maxLength) arr.push(`Length: ${v.minLength || ""}-${v.maxLength || ""}`);
      if (v.min !== undefined) arr.push(`Min: ${v.min}`);
      if (v.max !== undefined) arr.push(`Max: ${v.max}`);
      if (v.pattern) arr.push("Pattern");
      return arr.join(", ") || "Custom";
    }

    return "No Validation";
  };

  if (loading)
    return (<Loading />);

  const renderActions = (row) => {
    return (
      <div className="flex gap-1">
        <Button
          size="sm"
          variant="outline"
          disabled={row.index === 0}
          onClick={() => moveField(row.index, "up")}
        >
          ↑
        </Button>

        <Button
          size="sm"
          variant="outline"
          disabled={row.index === fields.length - 1}
          onClick={() => moveField(row.index, "down")}
        >
          ↓
        </Button>

        <Button size="sm" variant="outline" onClick={() => handleEditField(row)}>
          <Edit size={14} />
        </Button>

        <Button size="sm" variant="outline" onClick={() => handleDeleteField(row.id)}>
          <Trash2 size={14} />
        </Button>
      </div>
    );
  }

  const columns = [
    { key: "Name", label: "Name",sticky:true },
    { key: "Label", label: "Label" },
    {
      key: "Type",
      label: "Type",
      render: (value) => <Badge>{value}</Badge>,
    },
    {
      key: "Required",
      label: "Required",
      render: (value) =>
        value ? (
          <Badge className="bg-red-100 text-red-800">Required</Badge>
        ) : (
          <Badge variant="outline">Optional</Badge>
        ),
    },
    {
      key: "ValidationRuleCode",
      label: "Validation",
      render: (value) => (
        <Badge variant="secondary">{formatValidationDisplay(value)}</Badge>
      ),
    },
    { key: "MaxLength", label: "Max Length" },
    { key: "Placeholder", label: "Placeholder" },
    {
      key: "OptionsJson",
      label: "Options",
      render: (value) => value ? JSON.stringify(value) : "-",
    },
    {
      key: "ApplicableJson",
      label: "Applicable",
      render: (value) =>
        Array.isArray(value) && value.length > 0
          ? value.join(", ").toUpperCase()
          : "-",
    },
    { key: "ApiUrl", label: "API URL" },
    { key: "ValueKey", label: "Value Key" },
    { key: "LabelKey", label: "Label Key" },
    { key: "DefaultValue", label: "Default Value" },
    {
      key: "FieldGroup",
      label: "Group",
      render: (value) => value || "General",
    },
    { key: "GroupBackendKey", label: "Group Backend Key" },
    {
      key: "Active",
      label: "Active",
      render: (value) => <ActiveBadge value={value} />,
    },
  ]

  return (
    <>
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden ">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center
         px-4 sm:px-6 py-3 sm:py-5 bg-gradient-to-r from-emerald-400 to-green-400">
          {/* LEFT CONTENT */}
          <div className="items-start gap-3">
            <h2 className="text-sm sm:text-xl font-semibold text-white flex items-center gap-2">
              <AppIcon name={"BookOpenCheck"} size={30} />  Field Validation Rule
            </h2>
            <p className="text-green-100 text-xs sm:text-sm">
              Create and manage validation rules dynamically
            </p>
          </div>

          {/* RIGHT ACTIONS */}
          <div className=" flex flex-col gap-2 sm:flex-row sm:gap-3 w-full sm:w-auto ">
            <Button variant="outline" onClick={() => setIsPreviewDialogOpen(true)}>
              <Eye size={16} className="mr-1" /> Preview
            </Button>

            <Button
              variant="success"
              className="bg-green-600/90 text-white"
              disabled={saveStatus === "saving"}
              onClick={handleSaveTemplate}
            >
              <Save size={16} className="mr-1" />
              {saveStatus === "saving" ? "Saving..." : "Save"}
            </Button>
            <Button onClick={handleAddField} variant="purple">
              <Plus size={16} className="mr-1" /> Add Field
            </Button>
          </div>
        </div>

        <div className="space-y-6 p-2 md:p-4">
          <form>
            {/* SETTINGS */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Template Settings</CardTitle>
              </CardHeader>

              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <Label>Template Name <span className="text-red-500">*</span></Label>
                  <Input
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Enter template name"
                  />
                </div>

                <div>
                  <Label>Add Api <span className="text-red-500">*</span></Label>
                  <Input
                    value={addApi}
                    onChange={(e) => setAddApi(e.target.value)}
                    placeholder="Enter add API URL"
                  />
                </div>

                <div>
                  <Label>Update Api *</Label>
                  <Input
                    value={updateApi}
                    onChange={(e) => setUpdateApi(e.target.value)}
                    placeholder="Enter update API URL"
                  />
                </div>

                <div>
                  <Label>Get Api *</Label>
                  <Input
                    value={getApi}
                    onChange={(e) => setGetApi(e.target.value)}
                    placeholder="Enter get API URL"
                  />
                </div>

                <div>
                  <Label>Bulk Api <span className="text-red-500">*</span></Label>
                  <Input
                    value={bulkApi}
                    onChange={(e) => setBulkApi(e.target.value)}
                    placeholder="Enter bulk API URL"
                  />
                </div>

                <div>
                  <Label>Template Icon <span className="text-red-500">*</span></Label>
                  <Input
                    value={Icon}
                    onChange={(e) => setIcon(e.target.value)}
                    placeholder="Enter icon class or URL"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label>Description</Label>
                  <Textarea
                    rows={2}
                    value={templateDescription}
                    onChange={(e) => setTemplateDescription(e.target.value)}
                    placeholder="Enter description"
                  />
                </div>

                <div className="md:col-span-2 flex flex-wrap gap-6">
                  <div className="flex gap-2 items-center">
                    <Switch checked={isActive} onCheckedChange={setIsActive} />
                    <Label>Active</Label>
                  </div>


                  <div className="flex gap-2 items-center">
                    <Switch checked={groupSave} onCheckedChange={setGroupSave} />
                    <Label>Group Save</Label>
                  </div>
                </div>
              </CardContent>

            </Card>
            {/* FIELDS TABLE */}
          </form>
          {(fields?.length > 0) &&
            <AdvanceTable
              title="Fields"
              columns={columns}
              data={fields}
              renderActions={renderActions}
              showIndex={true}
            />
          }
        </div>


        {/* FIELD DIALOG */}
        <FieldDialog
          isOpen={isFieldDialogOpen}
          onClose={() => setIsFieldDialogOpen(false)}
          initialFieldForm={initialFieldForm}
          onSave={handleSaveField}
        />


        {/* Preview */}
        <FormBuilderPreviewDialog
          isOpen={isPreviewDialogOpen}
          onOpenChange={setIsPreviewDialogOpen}
          formName={templateName}
          formDescription={templateDescription}
          isActive={isActive}
          version={version}
          fields={fields}
          formatValidationDisplay={formatValidationDisplay}
        />
      </div>
    </>
  );
};

export default TemplateEdit;
