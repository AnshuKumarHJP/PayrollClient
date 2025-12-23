import { useState, useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "../../Lib/card";
import { Button } from "../../Lib/button";
import { Input } from "../../Lib/input";
import { Label } from "../../Lib/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../Lib/select";
import { Textarea } from "../../Lib/textarea";
import { Switch } from "../../Lib/switch";
import { MultiSelect } from "../../Lib/MultiSelect";
import { Badge } from "../../Lib/badge";
import AdvanceTable from "../../Component/AdvanceTable";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../Lib/dialog";
import { Alert, AlertDescription } from "../../Lib/alert";

import {
  Plus,
  Edit,
  Trash2,
  Save,
  Eye,
  Settings,
  CheckCircle,
  Loader2,
} from "lucide-react";

import { templateService } from "../../../api/services/templateService";
import ruleTypesService from "../../../api/services/ruleTypesService";
import { useToast } from "../../Lib/use-toast";
import TemplatePreviewDialog from "./TemplatePreviewDialog";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { setSelectedClient } from "../../Store/Slices/GlobalSaveSlice";

const TemplateEdit = ({ id: propId, onSave, onCancel }) => {
  const templateId = propId;
  const { toast } = useToast();
  const dispatch = useDispatch();

  const clientCode = useSelector((state) => state.GlobalSaveStore?.SelectedClient);

  const [loading, setLoading] = useState(false);
  const [version, setVersion] = useState("1.0");
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isCommon, setIsCommon] = useState(false);
  const [addApi, setAddApi] = useState("");
  const [updateApi, setUpdateApi] = useState("");
  const [getApi, setGetApi] = useState("");
  const [bulkApi, setBulkApi] = useState("");
  const [groupSave, setGroupSave] = useState(false);
  const [fields, setFields] = useState([]);
  const [ruleTypes, setRuleTypes] = useState([]);
  const [isFieldDialogOpen, setIsFieldDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);

  const [fieldForm, setFieldForm] = useState({
    name: "",
    label: "",
    type: "text",
    required: false,
    validation: "none",
    maxLength: "",
    placeholder: "",
    options: "",
    apiUrl: "",
    valueKey: "",
    labelKey: "",
    defaultValue: "",
    group: "",
    groupBackendKey: "",
    applicable: ["form", "upload"],
  });

  const [saveStatus, setSaveStatus] = useState(null);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);

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
      setIsCommon(template.isCommon || false);
      setVersion(template.version);
      setAddApi(template.addApi || "");
      setUpdateApi(template.updateApi || "");
      setGetApi(template.getApi || "");
      setBulkApi(template.bulkApi || "");
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
    setEditingField(null);
    setFieldForm({
      name: "",
      label: "",
      type: "text",
      required: false,
      validation: "none",
      maxLength: "",
      placeholder: "",
      options: "",
      apiUrl: "",
      valueKey: "",
      labelKey: "",
      defaultValue: "",
      group: "",
      groupBackendKey: "",
      applicable: ["form", "upload"],
    });
    setIsFieldDialogOpen(true);
  };

  const handleEditField = (f) => {
    setEditingField(f);
    setFieldForm({
      name: f.name,
      label: f.label,
      type: f.type,
      required: f.required,
      validation: f.validation,
      maxLength: f.maxLength || "",
      placeholder: f.placeholder || "",
      options: f.options || "",
      apiUrl: f.apiUrl || "",
      valueKey: f.valueKey || "",
      labelKey: f.labelKey || "",
      defaultValue: f.defaultValue || "",
      group: f.group || "",
      groupBackendKey: f.groupBackendKey || "",
      applicable: f.applicable || [],
    });
    if (f.clientCode) dispatch(setSelectedClient(f.clientCode));
    setIsFieldDialogOpen(true);
  };

  // SAVE FIELD
  const handleSaveField = () => {
    if (!isCommon && !clientCode)
      return toast({
        title: "Client Missing",
        description: "Client code is required.",
        variant: "destructive",
      });

    if (!fieldForm.name || !fieldForm.label)
      return toast({
        title: "Required",
        description: "Field name & label required",
        variant: "destructive",
      });

    const obj = {
      id: editingField ? editingField.id : Date.now(),
      ...fieldForm,
      maxLength: fieldForm.maxLength ? parseInt(fieldForm.maxLength) : null,
    };

    setFields(
      editingField ? fields.map((x) => (x.id === editingField.id ? obj : x)) : [...fields, obj]
    );

    setIsFieldDialogOpen(false);
  };

  const handleDeleteField = (id) => {
    if (confirm("Delete field?")) setFields(fields.filter((x) => x.id !== id));
  };

  // SAVE TEMPLATE
  const handleSaveTemplate = async () => {
    if (!isCommon && !clientCode)
      return toast({
        title: "Client Missing",
        description: "Select a client first.",
        variant: "destructive",
      });

    if (!templateName.trim())
      return toast({
        title: "Missing",
        description: "Template name is required.",
        variant: "destructive",
      });

    try {
      setSaveStatus("saving");

      const payload = {
        clientCode: isCommon ? null : clientCode,
        name: templateName,
        description: templateDescription,
        status: isActive ? "active" : "inactive",
        isCommon,
        version,
        addApi,
        updateApi,
        getApi,
        bulkApi,
        groupSave,
        fields,
        createdBy: "currentUser",
      };

      const savedTemplate = templateId
        ? await templateService.update(templateId, payload)
        : await templateService.create(payload);

      toast({
        title: templateId ? "Updated" : "Created",
        description: `Template ${templateId ? "updated" : "created"}.`,
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
    return (
      <div className="p-2 flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );

  return (
    <div className="p-2">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <div className="flex items-center gap-2">
          <Settings size={22} />
          <h1 className="text-xl font-bold">{templateId ? "Edit Template" : "Create Template"}</h1>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsPreviewDialogOpen(true)}>
            <Eye size={16} className="mr-1" /> Preview
          </Button>

          <Button
          variant="success"
          className="bg-green-600/90 text-white"
            disabled={(!isCommon && !clientCode) || saveStatus === "saving"}
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
            <Input value={addApi} onChange={(e) => setAddApi(e.target.value)} />
          </div>

          <div>
            <Label>Update Api *</Label>
            <Input value={updateApi} onChange={(e) => setUpdateApi(e.target.value)} />
          </div>

          <div>
            <Label>Get Api *</Label>
            <Input value={getApi} onChange={(e) => setGetApi(e.target.value)} />
          </div>

          <div>
            <Label>Bulk Api <span className="text-red-500">*</span></Label>
            <Input value={bulkApi} onChange={(e) => setBulkApi(e.target.value)} />
          </div>

          <div className="md:col-span-2">
            <Label>Description</Label>
            <Textarea
              rows={2}
              value={templateDescription}
              onChange={(e) => setTemplateDescription(e.target.value)}
            />
          </div>

          <div className="md:col-span-2 flex flex-wrap gap-6">
            <div className="flex gap-2 items-center">
              <Switch checked={isActive} onCheckedChange={setIsActive} />
              <Label>Active</Label>
            </div>

            <div className="flex gap-2 items-center">
              <Switch checked={isCommon} onCheckedChange={setIsCommon} />
              <Label>Common Template</Label>
            </div>

            <div className="flex gap-2 items-center">
              <Switch checked={groupSave} onCheckedChange={setGroupSave} />
              <Label>Group Save</Label>
            </div>
          </div>

          <div>
            <Label>Client Code</Label>
            <Input value={clientCode || ""} disabled className="bg-gray-100" />
          </div>
        </CardContent>
      </Card>

      {/* FIELDS TABLE */}
      <AdvanceTable
        title="Fields"
        columns={[
          { key: "name", label: "Name" },
          { key: "label", label: "Label" },
          {
            key: "group",
            label: "Group",
            render: (value) => value || "General",
          },
          {
            key: "applicable",
            label: "Applicable",
            render: (value) =>
              Array.isArray(value) && value.length > 0
                ? value.join(", ").toUpperCase()
                : "-",
          },
          {
            key: "type",
            label: "Type",
            render: (value) => <Badge>{value}</Badge>,
          },
          {
            key: "required",
            label: "Required",
            render: (value) =>
              value ? (
                <Badge className="bg-red-100 text-red-800">Required</Badge>
              ) : (
                <Badge variant="outline">Optional</Badge>
              ),
          },
          {
            key: "validation",
            label: "Validation",
            render: (value) => (
              <Badge variant="secondary">{formatValidationDisplay(value)}</Badge>
            ),
          },
        ]}
        data={fields.map((f, i) => ({ ...f, index: i }))}
        renderActions={(row) => (
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
        )}
      />

      {/* FIELD DIALOG */}
      <Dialog open={isFieldDialogOpen} onOpenChange={setIsFieldDialogOpen}>
        <DialogContent
          className="max-w-4xl"
          header={
            <DialogHeader>
              <DialogTitle>{editingField ? "Edit Field" : "Add Field"}</DialogTitle>
            </DialogHeader>
          }
          body={
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">

              {/* NAME */}
              <div>
                <Label>Name <span className="text-red-500">*</span></Label>
                <Input
                  value={fieldForm.name}
                  onChange={(e) => setFieldForm({ ...fieldForm, name: e.target.value })}
                />
              </div>

              {/* LABEL */}
              <div>
                <Label>Label <span className="text-red-500">*</span></Label>
                <Input
                  value={fieldForm.label}
                  onChange={(e) => setFieldForm({ ...fieldForm, label: e.target.value })}
                />
              </div>

              {/* TYPE */}
              <div>
                <Label>Type <span className="text-red-500">*</span></Label>
                <Select
                  value={fieldForm.type}
                  onValueChange={(v) => setFieldForm({ ...fieldForm, type: v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="max-h-64 overflow-y-auto">
                    {[
                      "text", "textarea", "number", "email", "password", "tel", "url",
                      "select", "multi-select", "radio", "checkbox", "checkbox-group", "switch",
                      "date", "datetime", "time", "month", "year",
                      "file", "image", "document", "signature",
                      "autocomplete", "api-select", "api-multi-select", "richtext",
                      "color", "range", "rating", "currency", "percentage", "tags",
                    ].map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* validation */}
              <div>
                <Label>Validation <span className="text-red-500">*</span></Label>
                <Select
                  value={fieldForm.validation}
                  onValueChange={(v) => setFieldForm({ ...fieldForm, validation: v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="max-h-64 overflow-y-auto">
                    {ruleTypes.map((r) => (
                      <SelectItem key={r.id || r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* max length */}
              <div>
                <Label>Max Length</Label>
                <Input
                  type="number"
                  value={fieldForm.maxLength}
                  onChange={(e) => setFieldForm({ ...fieldForm, maxLength: e.target.value })}
                />
              </div>

              {/* placeholder */}
              <div>
                <Label>Placeholder <span className="text-red-500">*</span></Label>
                <Input
                  value={fieldForm.placeholder}
                  onChange={(e) => setFieldForm({ ...fieldForm, placeholder: e.target.value })}
                />
              </div>

              {/* group */}
              <div>
                <Label>Group</Label>
                <Input
                  value={fieldForm.group}
                  onChange={(e) => setFieldForm({ ...fieldForm, group: e.target.value })}
                />
              </div>

              {/* group backend */}
              <div>
                <Label>Group Backend Key</Label>
                <Input
                  value={fieldForm.groupBackendKey}
                  onChange={(e) => setFieldForm({ ...fieldForm, groupBackendKey: e.target.value })}
                />
              </div>

              {/* SELECT EXTRA OPTIONS */}
              {fieldForm.type === "select" && (
                <>
                  <div className="md:col-span-2">
                    <Label>Options <span className="text-red-500">*</span></Label>
                    <Input
                      value={fieldForm.options}
                      onChange={(e) => setFieldForm({ ...fieldForm, options: e.target.value })}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label>API URL</Label>
                    <Input
                      value={fieldForm.apiUrl}
                      onChange={(e) => setFieldForm({ ...fieldForm, apiUrl: e.target.value })}
                    />
                  </div>

                  {fieldForm.apiUrl && (
                    <>
                      <div>
                        <Label>Value Key {fieldForm.apiUrl && <span className="text-red-500">*</span>}</Label>
                        <Input
                          value={fieldForm.valueKey}
                          onChange={(e) => setFieldForm({ ...fieldForm, valueKey: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label>Label Key {fieldForm.apiUrl &&<span className="text-red-500">*</span>}</Label>
                        <Input
                          value={fieldForm.labelKey}
                          onChange={(e) => setFieldForm({ ...fieldForm, labelKey: e.target.value })}
                        />
                      </div>
                    </>
                  )}
                </>
              )}

              {/* default */}
              <div className="md:col-span-2">
                <Label>Default Value</Label>
                <Input
                  value={fieldForm.defaultValue}
                  onChange={(e) => setFieldForm({ ...fieldForm, defaultValue: e.target.value })}
                />
              </div>

              {/* applicable */}
              <div className="md:col-span-2">
                <Label>Applicable <span className="text-red-500">*</span></Label>
                <MultiSelect
                  options={[
                    { value: "form", label: "Form" },
                    { value: "upload", label: "Upload" },
                  ]}
                  value={fieldForm.applicable}
                  onChange={(v) => setFieldForm({ ...fieldForm, applicable: v })}
                />
              </div>

              {/* required */}
              <div className="flex gap-2 items-center md:col-span-2">
                <input
                  type="checkbox"
                  checked={fieldForm.required}
                  onChange={(e) => setFieldForm({ ...fieldForm, required: e.target.checked })}
                />
                <Label>Required</Label>
              </div>
            </div>
          }
          footer={
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsFieldDialogOpen(false)}>
                Cancel
              </Button>

              <Button onClick={handleSaveField}>
                {editingField ? "Update" : "Add"}
              </Button>
            </div>
          }
        />
      </Dialog>


      {/* Preview */}
      <TemplatePreviewDialog
        isOpen={isPreviewDialogOpen}
        onOpenChange={setIsPreviewDialogOpen}
        templateName={templateName}
        templateDescription={templateDescription}
        isActive={isActive}
        isCommon={isCommon}
        version={version}
        fields={fields}
        formatValidationDisplay={formatValidationDisplay}
      />
    </div>
  );
};

export default TemplateEdit;
