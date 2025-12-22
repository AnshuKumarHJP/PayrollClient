import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "../../Lib/card";
import { Button } from "../../Lib/button";
import { Input } from "../../Lib/input";
import { Label } from "../../Lib/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../Lib/select";
import { Textarea } from "../../Lib/textarea";
import { Switch } from "../../Lib/switch";
import { MultiSelect } from "../../Lib/MultiSelect";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../Lib/table";
import { Badge } from "../../Lib/badge";

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
import TemplatePreviewDialog from "../TemplatePreviewDialog";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { setSelectedClient } from "../../Store/Slices/GlobalSaveSlice";

const TemplateEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch();

  // GLOBAL Redux Client
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
    applicable: ["form", "upload"]
  });

  const [saveStatus, setSaveStatus] = useState(null);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);

  useEffect(() => {
    if (id) loadTemplate(id);
    loadRuleTypes();
  }, [id]);

  const loadRuleTypes = async () => {
    try {
      const data = await ruleTypesService.getAllRuleTypes();
      setRuleTypes([{ id: 'none', value: 'none', label: 'No Validation' }, ...(data || [])]);
    } catch (error) {
      console.error('Failed to load rule types:', error);
      // Fallback to basic validation types
      setRuleTypes([
        { id: 'none', value: 'none', label: 'No Validation' },
        { id: 'required', value: 'required', label: 'Required' },
        { id: 'email', value: 'email', label: 'Email' },
        { id: 'alphabetic', value: 'alphabetic', label: 'Alphabetic' },
        { id: 'alphanumeric', value: 'alphanumeric', label: 'Alphanumeric' },
        { id: 'numeric', value: 'numeric', label: 'Numeric' },
        { id: 'date', value: 'date', label: 'Date' },
        { id: 'phone', value: 'phone', label: 'Phone' }
      ]);
    }
  };

  const loadTemplate = async (templateId) => {
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

      const formattedFields = (template.fields || []).map((f, i) => ({
        ...f,
        id: f.id || Date.now() + i,
        validation: f.validation || "none",
      }));

      setFields(formattedFields);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load template.",
        variant: "destructive",
      });
      navigate("/config/templates");
    } finally {
      setLoading(false);
    }
  };

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
      applicable: ["form", "upload"]
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
      applicable: f.applicable || ""
    });

    if (f.clientCode) {
      dispatch(setSelectedClient(f.clientCode));
    }

    setIsFieldDialogOpen(true);
  };

  const handleSaveField = () => {
    if (!isCommon && !clientCode) {
      toast({
        title: "Client Missing",
        description: "Client code is required.",
        variant: "destructive",
      });
      return;
    }
    if (!fieldForm.name || !fieldForm.label) {
      toast({
        title: "Required",
        description: "Field name & label required",
        variant: "destructive",
      });
      return;
    }

    const obj = {
      id: editingField ? editingField.id : Date.now(),
      ...fieldForm,
      maxLength: fieldForm.maxLength ? parseInt(fieldForm.maxLength) : null,
    };

    if (editingField) {
      setFields(fields.map((x) => (x.id === editingField.id ? obj : x)));
    } else {
      setFields([...fields, obj]);
    }

    setIsFieldDialogOpen(false);
  };

  const handleDeleteField = (id) => {
    if (confirm("Delete field?")) {
      setFields(fields.filter((x) => x.id !== id));
    }
  };

  const handleSaveTemplate = async () => {
    if (!isCommon && !clientCode) {
      toast({
        title: "Client Missing",
        description: "Select a client first.",
        variant: "destructive",
      });
      return;
    }

    if (!templateName.trim()) {
      toast({
        title: "Missing",
        description: "Template name is required.",
        variant: "destructive",
      });
      return;
    }

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

      if (id) {
        await templateService.update(id, payload);
        toast({ title: "Updated", description: "Template updated." });
      } else {
        await templateService.create(payload);
        toast({ title: "Created", description: "Template created." });
      }

      navigate("/config/templates");
    } catch (err) {
      toast({
        title: "Failed",
        description: "Unable to save template.",
        variant: "destructive",
      });
    } finally {
      setSaveStatus(null);
    }
  };

  const moveField = (i, dir) => {
    const copy = [...fields];
    const ni = dir === "up" ? i - 1 : i + 1;
    if (ni < 0 || ni >= copy.length) return;
    [copy[i], copy[ni]] = [copy[ni], copy[i]];
    setFields(copy);
  };

  const formatValidationDisplay = (v) => {
    if (!v || v === "none") return "No Validation";
    if (typeof v === "string") return v;

    if (typeof v === "object") {
      const arr = [];
      if (v.minLength || v.maxLength)
        arr.push(`Length: ${v.minLength || ""}-${v.maxLength || ""}`);
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

      {/* Header */}
      <div className="flex justify-between mb-6">
        <div className="flex items-center gap-2">
          <Settings size={22} />
          <h1 className="text-xl font-bold">
            {id ? "Edit Template" : "Create Template"}
          </h1>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsPreviewDialogOpen(true)}>
            <Eye size={16} className="mr-1" /> Preview
          </Button>

          <Button
            disabled={(!isCommon && !clientCode) || saveStatus === "saving"}
            onClick={handleSaveTemplate}
          >
            <Save size={16} className="mr-1" />
            {saveStatus === "saving" ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {saveStatus === "success" && (
        <Alert className="mb-4 border-green-500">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>Template saved successfully!</AlertDescription>
        </Alert>
      )}

      {/* Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Template Settings</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Template Name *</Label>
            <Input value={templateName} onChange={(e) => setTemplateName(e.target.value)} placeholder="Enter template name" />
          </div>
          <div>
            <Label>Add Api *</Label>
            <Input value={addApi} onChange={(e) => setAddApi(e.target.value)} placeholder="Enter Add API URL" />
          </div>
          <div>
            <Label>Update Api *</Label>
            <Input value={updateApi} onChange={(e) => setUpdateApi(e.target.value)} placeholder="Enter Update API URL" />
          </div>
          <div>
            <Label>Get Api *</Label>
            <Input value={getApi} onChange={(e) => setGetApi(e.target.value)} placeholder="Enter Get API URL" />
          </div>
          <div>
            <Label>Bulk Api *</Label>
            <Input value={bulkApi} onChange={(e) => setBulkApi(e.target.value)} placeholder="Enter Bulk API URL" />
          </div>

          <div className="md:col-span-2">
            <Label>Description</Label>
            <Textarea
              rows={2}
              value={templateDescription}
              onChange={(e) => setTemplateDescription(e.target.value)}
            />
          </div>
          <div className="md:col-span-2 flex gap-4">
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

      {/* Fields Table */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>Fields</CardTitle>
            <Button onClick={handleAddField}>
              <Plus size={16} className="mr-1" /> Add Field
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Label</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Applicable</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Required</TableHead>
                <TableHead>Validation</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {fields.map((f, i) => (
                <TableRow key={f.id}>
                  <TableCell>{f.name}</TableCell>
                  <TableCell>{f.label}</TableCell>
                  <TableCell>{f.group || "General"}</TableCell>
                  <TableCell>
                    {Array.isArray(f.applicable) && f.applicable.length > 0
                      ? f.applicable.join(", ").toUpperCase()
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge>{f.type}</Badge>
                  </TableCell>

                  <TableCell>
                    {f.required ? (
                      <Badge className="bg-red-100 text-red-800">Required</Badge>
                    ) : (
                      <Badge variant="outline">Optional</Badge>
                    )}
                  </TableCell>

                  <TableCell>
                    <Badge variant="secondary">
                      {formatValidationDisplay(f.validation)}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={i === 0}
                        onClick={() => moveField(i, "up")}
                      >
                        ↑
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        disabled={i === fields.length - 1}
                        onClick={() => moveField(i, "down")}
                      >
                        ↓
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditField(f)}
                      >
                        <Edit size={14} />
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteField(f.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </CardContent>
      </Card>

      {/* Field Dialog */}
      <Dialog open={isFieldDialogOpen} onOpenChange={setIsFieldDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingField ? "Edit Field" : "Add Field"}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <Label>Name *</Label>
              <Input
                value={fieldForm.name}
                onChange={(e) => setFieldForm({ ...fieldForm, name: e.target.value })}
              />
            </div>

            <div>
              <Label>Label *</Label>
              <Input
                value={fieldForm.label}
                onChange={(e) => setFieldForm({ ...fieldForm, label: e.target.value })}
              />
            </div>

            <div>
              <Label>Type</Label>
              <Select
                value={fieldForm.type}
                onValueChange={(v) => setFieldForm({ ...fieldForm, type: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {/* BASIC INPUTS */}
                  {[
                    "text",
                    "textarea",
                    "number",
                    "email",
                    "password",
                    "tel",
                    "url"
                  ].map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}

                  <SelectItem disabled className="text-muted-foreground">──────────</SelectItem>

                  {/* SELECTION INPUTS */}
                  {[
                    "select",
                    "multi-select",
                    "radio",
                    "checkbox",
                    "checkbox-group",
                    "switch"
                  ].map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}

                  <SelectItem disabled className="text-muted-foreground">──────────</SelectItem>

                  {/* DATE / TIME */}
                  {[
                    "date",
                    "datetime",
                    "time",
                    "month",
                    "year"
                  ].map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}

                  <SelectItem disabled className="text-muted-foreground">──────────</SelectItem>

                  {/* FILES */}
                  {[
                    "file",
                    "image",
                    "document",
                    "signature"
                  ].map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}

                  <SelectItem disabled className="text-muted-foreground">──────────</SelectItem>

                  {/* ADVANCED */}
                  {[
                    "autocomplete",
                    "api-select",
                    "api-multi-select",
                    "richtext",
                    "color",
                    "range",
                    "rating",
                    "currency",
                    "percentage",
                    "tags"
                  ].map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}

                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Validation</Label>
              <Select
                value={fieldForm.validation}
                onValueChange={(v) => setFieldForm({ ...fieldForm, validation: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ruleTypes.map(rule => (
                    <SelectItem key={rule.id || rule.value} value={rule.value}>
                      {rule.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Max Length</Label>
              <Input
                type="number"
                value={fieldForm.maxLength}
                onChange={(e) => setFieldForm({ ...fieldForm, maxLength: e.target.value })}
              />
            </div>

            <div>
              <Label>Placeholder</Label>
              <Input
                value={fieldForm.placeholder}
                onChange={(e) => setFieldForm({ ...fieldForm, placeholder: e.target.value })}
              />
            </div>

            <div>
              <Label>Group</Label>
              <Input
                value={fieldForm.group}
                onChange={(e) => setFieldForm({ ...fieldForm, group: e.target.value })}
                placeholder="General"
              />
            </div>
            <div>
              <Label>Group Backend Key</Label>
              <Input
                value={fieldForm.groupBackendKey}
                onChange={(e) => setFieldForm({ ...fieldForm, groupBackendKey: e.target.value })}
                placeholder="general"
              />
            </div>

            {fieldForm.type === "select" && (
              <>
                <div className="md:col-span-2">
                  <Label>Options (comma separated)</Label>
                  <Input
                    value={fieldForm.options}
                    onChange={(e) => setFieldForm({ ...fieldForm, options: e.target.value })}
                    placeholder="Option1,Option2,Option3"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label>API URL (optional)</Label>
                  <Input
                    value={fieldForm.apiUrl}
                    onChange={(e) => setFieldForm({ ...fieldForm, apiUrl: e.target.value })}
                    placeholder="https://api.example.com/options"
                  />
                </div>

                {fieldForm.apiUrl && (
                  <>
                    <div>
                      <Label>Value Key</Label>
                      <Input
                        value={fieldForm.valueKey}
                        onChange={(e) => setFieldForm({ ...fieldForm, valueKey: e.target.value })}
                        placeholder="id"
                      />
                    </div>

                    <div>
                      <Label>Label Key</Label>
                      <Input
                        value={fieldForm.labelKey}
                        onChange={(e) => setFieldForm({ ...fieldForm, labelKey: e.target.value })}
                        placeholder="name"
                      />
                    </div>
                  </>
                )}
              </>
            )}

            <div className="md:col-span-2">
              <Label>Default Value</Label>
              <Input
                value={fieldForm.defaultValue}
                onChange={(e) => setFieldForm({ ...fieldForm, defaultValue: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <Label>Applicable</Label>
              <MultiSelect
                options={[
                  { value: "form", label: "Form" },
                  { value: "upload", label: "Upload" },
                ]}
                value={fieldForm.applicable}
                onChange={(v) => setFieldForm({ ...fieldForm, applicable: v })}
                placeholder="Select applicable options"
              />
            </div>

            <div className="flex gap-2 items-center md:col-span-2">
              <input
                type="checkbox"
                checked={fieldForm.required}
                onChange={(e) => setFieldForm({ ...fieldForm, required: e.target.checked })}
              />
              <Label>Required</Label>
            </div>

          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsFieldDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveField}>
              {editingField ? "Update" : "Add"}
            </Button>
          </div>

        </DialogContent>
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
