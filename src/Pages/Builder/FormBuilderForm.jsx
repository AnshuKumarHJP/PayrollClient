import { useState, useEffect, useId } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "../../Library/Card";

import { Button } from "../../Library/Button";
import { Input } from "../../Library/Input";
import { Label } from "../../Library/Label";
import { Textarea } from "../../Library/Textarea";
import { Switch } from "../../Library/Switch";
import { Badge } from "../../Library/Badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../Library/Select";

import AdvanceTable from "../../Library/Table/AdvanceTable";
import AppIcon from "../../Component/AppIcon";
import Loading from '../../Component/Loading'

import { useToast } from "../../Library/use-toast";

// Field Dialog Component
import FieldDialog from "./BuilderComponents/FieldDialog";

// Preview Dialog Component
import FormBuilderPreviewDialog from "./FormBuilderPreviewDialog";

// Redux
import { useDispatch, useSelector } from "react-redux";
import {
  UpsertFormBuilder,
  GetFormBuilder,
  GetFormBuilderById,
  GetAllFieldValidationRules,
  GetAllClientPortalWorkflowConfigurations,
} from "../../Store/FormBuilder/Action";


// Static Data
import { Modules } from "../../Data/StaticData";
import { SweetSuccess, SweetConfirm } from "../../Component/SweetAlert";
import CryptoService from "../../Security/useCrypto";


// ------------------------------------------------
// DEFAULT DETAILS (FormBuilderDetails)
// ------------------------------------------------
const emptyField = {
  DetailsCode: crypto.randomUUID(),
  Name: "",
  Label: "",
  Type: "text",
  Required: false,
  ValidationRuleId: null,
  Placeholder: "",
  OptionsJson: "",
  ApplicableJson: ["form"],
  ApiUrl: "",
  ValueKey: "",
  LabelKey: "",
  DefaultValue: "",
  FieldGroup: "",
  GroupBackendKey: "",
  DisplayOrder: 1,
  Active: true,

};



// ------------------------------------------------
// MAIN COMPONENT
// ------------------------------------------------
const FormBuilderForm = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { id } = useParams();
  const navigate = useNavigate();

  const HeaderCode = id ? Number(CryptoService.decrypt(id)) : null;

  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState([]);

  const [formHeader, setFormHeader] = useState({
    Id: HeaderCode || 0,
    Name: "",
    ModuleId: 0,
    Description: "",
    Version: "1.0",
    Icon: "",
    DisplayOrder: 1,
    IsActive: true,
    UpsertApi: "",
    GetApi: "",
    BulkApi: "",
    IsGroupSaveEnabled: false,
    FieldsConfigurations: [],
    ClientPortalWCId: 0
  });

  const [isFieldDialogOpen, setIsFieldDialogOpen] = useState(false);
  const [initialFieldForm, setInitialFieldForm] = useState(emptyField);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const { Common } = useSelector((s) => s.Auth);
  const { FormBuilder, FieldValidationRule, ClientPortalWorkflowConfiguration } = useSelector((state) => state.FormBuilderStore);
  const { data: workflowData } = ClientPortalWorkflowConfiguration;

  useEffect(() => {
    dispatch(
      GetAllClientPortalWorkflowConfigurations({
        ClientId: Common?.SelectedClientCode,
        ClientContractId: Common?.SelectedClientContractCode,
      })
    );
  }, [dispatch, Common]);

  // ------------------------------------------------
  // LOAD RULES + FORM
  // ------------------------------------------------
  useEffect(() => {
    if (HeaderCode) {
      if (FormBuilder?.data) {
        // Data is available, load the form
        loadForm();
      } else {
        // No data, fetch by ID
        dispatch(GetFormBuilderById(HeaderCode));
      }
    }

    // Load field validation rules if not available
    if (!FieldValidationRule?.data || FieldValidationRule.data.length === 0) {
      dispatch(GetAllFieldValidationRules());
    }
  }, [HeaderCode, FormBuilder?.data, FieldValidationRule?.data]);

  // ------------------------------------------------
  // LOAD FORM (HEADER + DETAILS)
  // ------------------------------------------------
  const loadForm = async () => {
    try {
      setLoading(true);
      let form;

      if (Array.isArray(FormBuilder?.data)) {
        form = FormBuilder.data.find(f => f.Id === HeaderCode);
      } else if (FormBuilder?.data && typeof FormBuilder.data === 'object') {
        // Handle case where data is a single object from GetFormBuilderById
        form = FormBuilder.data.Id === HeaderCode ? FormBuilder.data : null;
      }
      if (!form) {
        toast({
          title: "Error",
          description: "Form not found.",
          variant: "danger",
        });
        navigate("/formbuilder");
        return;
      }
      // HEADER
      setFormHeader({
        Id: HeaderCode || 0,
        Name: form.Name || "",
        ModuleId: form.ModuleId || 0,
        Description: form.Description || "",
        Version: form.Version || "1.0",
        Icon: form.Icon || "",
        DisplayOrder: form.DisplayOrder || 1,
        IsActive: form.IsActive ?? true,
        UpsertApi: form.UpsertApi || "",
        GetApi: form.GetApi || "",
        BulkApi: form.BulkApi || "",
        IsGroupSaveEnabled: form.IsGroupSaveEnabled || false,
        FieldsConfigurations: [],
        ClientPortalWCId: form.ClientPortalWCId
      });

      // DETAILS - Parse FieldsConfigurations JSON string
      let parsed = [];
      if (form.FieldsConfigurations) {
        try {
          const fieldsConfig = typeof form.FieldsConfigurations === "string"
            ? JSON.parse(form.FieldsConfigurations)
            : form.FieldsConfigurations;

          parsed = Array.isArray(fieldsConfig) ? fieldsConfig : [];
        } catch (parseError) {
          console.error("Error parsing FieldsConfigurations:", parseError);
          console.error("Invalid JSON string:", form.FieldsConfigurations);
          parsed = [];
        }
      }

      setFields(
        parsed.map((f, i) => ({
          ...f,
          ApplicableJson:
            typeof f.ApplicableJson === "string"
              ? (() => {
                try {
                  return JSON.parse(f.ApplicableJson);
                } catch {
                  return ["form"];
                }
              })()
              : f.ApplicableJson || ["form"],
        }))
      );

    } catch (err) {
      console.error("Error loading form:", err);
      toast({
        title: "Error",
        description: "Failed to load form.",
        variant: "danger",
      });
      onCancel?.();
    } finally {
      setLoading(false);
    }
  };


  // ------------------------------------------------
  // OPEN ADD FIELD
  // ------------------------------------------------
  const openAddField = () => {
    setInitialFieldForm(emptyField);
    setIsFieldDialogOpen(true);
  };


  // ------------------------------------------------
  // OPEN EDIT FIELD
  // ------------------------------------------------
  const openEditField = (row) => {
    setInitialFieldForm(JSON.parse(JSON.stringify(row))); // Deep clone to avoid shared references
    setIsFieldDialogOpen(true);
  };

  // ------------------------------------------------
  // HANDLE FIELD SAVE
  // ------------------------------------------------
  const handleFieldSave = (processedField) => {
    setFields((prev) => {
      let isEdit = false;

      /* ----------------------------------
         EDIT MODE (match by DetailsCode)
      ---------------------------------- */
      const updated = prev.map((f) => {
        if (
          processedField.DetailsCode &&
          f.DetailsCode === processedField.DetailsCode
        ) {
          isEdit = true;
          return {
            ...f,
            ...processedField, // ✅ safe merge
          };
        }
        return f;
      });

      if (isEdit) {
        return updated; // ✅ edit done
      }

      /* ----------------------------------
         ADD MODE (no DetailsCode match)
      ---------------------------------- */

      // prevent duplicate Name
      const duplicate = prev.some(
        (f) =>
          f.Name?.trim().toLowerCase() ===
          processedField.Name?.trim().toLowerCase()
      );

      if (duplicate) {
        toast({
          title: "Duplicate Field Name",
          description: `Field "${processedField.Name}" already exists`,
          variant: "danger",
        });
        return prev; // ❌ stop add
      }

      return [
        ...prev,
        {
          ...processedField,
          DetailsCode: processedField.DetailsCode || crypto.randomUUID(), // ✅ ensure unique
          DisplayOrder: prev.length + 1,
          Active: true,
        },
      ];
    });

    setIsFieldDialogOpen(false);
    setInitialFieldForm(emptyField);
  };




  // ------------------------------------------------
  // DELETE FIELD
  // ------------------------------------------------
  const deleteField = (detailsCode) => {
    SweetConfirm({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      onConfirm: () => {
        setFields(fields.filter((f) => f.DetailsCode !== detailsCode));
        SweetSuccess({
          title: 'Deleted!',
          text: 'Field has been deleted.'
        });
      }
    });
  };


  // ------------------------------------------------
  // MOVE FIELD
  // ------------------------------------------------
  const moveField = (i, direction) => {
    const newIndex = direction === "up" ? i - 1 : i + 1;
    if (newIndex < 0 || newIndex >= fields.length) return;

    const arr = [...fields];
    [arr[i], arr[newIndex]] = [arr[newIndex], arr[i]];
    setFields(arr.map((f, idx) => ({ ...f, DisplayOrder: idx + 1 })));
  };


  // ------------------------------------------------
  // SAVE FORM OR UPDATE (HEADER + DETAILS)
  // ------------------------------------------------
  const handleSaveForm = async () => {
    if (!formHeader.Name.trim()) {
      return toast({
        title: "Missing",
        description: "Form Name Required",
        variant: "danger",
      });
    }

    try {
      setSaveStatus("saving");

      const FormBuilderHeader = {
        Id: HeaderCode || 0,
        Name: formHeader.Name,
        ModuleId: formHeader.ModuleId,
        Description: formHeader.Description,
        Version: formHeader.Version,
        Icon: formHeader.Icon,
        DisplayOrder: formHeader.DisplayOrder,
        IsActive: formHeader.IsActive,
        UpsertApi: formHeader.UpsertApi,
        GetApi: formHeader.GetApi,
        BulkApi: formHeader.BulkApi,
        IsGroupSaveEnabled: formHeader.IsGroupSaveEnabled,
        ClientPortalWCId: formHeader.ClientPortalWCId,
        FieldsConfigurations: fields.map(f => ({ ...f, ApplicableJson: JSON.stringify(f.ApplicableJson || []) })),
      };


      const res = await dispatch(UpsertFormBuilder(FormBuilderHeader));

      if (res?.Status) {
        dispatch(GetFormBuilder());
        SweetSuccess({
          title: HeaderCode ? "Updated" : "Created",
          text: `Form  ${HeaderCode ? "updated" : "created"} successfully.`,
        });
        onCancel();
      }

    } catch {
      toast({
        title: "Failed",
        description: "Unable to save",
        variant: "danger",
      });
    } finally {
      setSaveStatus(null);
    }
  };

  const onCancel = () => {
    navigate("/formbuilder");
  }

  // ------------------------------------------------
  // TABLE COLUMNS
  // ------------------------------------------------
  const columns = [
    { key: "Label", label: "Label", minWidth: 140, sticky: true },
    { key: "Name", label: "Name", minWidth: 140 },

    {
      key: "Type", label: "Type", minWidth: 120,
      render: (v) => <Badge className="text-xs">{v}</Badge>
    },

    {
      key: "Required",
      label: "Required",
      minWidth: 120,
      render: (v) =>
        v ? (
          <Badge className="bg-red-200 text-red-800">Required</Badge>
        ) : (
          <Badge variant="outline">Optional</Badge>
        )
    },

    {
      key: "Active",
      label: "Status",
      minWidth: 120,
      render: (v) =>
        v ? (
          <Badge className="bg-green-200 text-green-800">Active</Badge>
        ) : (
          <Badge className="bg-gray-200 text-gray-700">Inactive</Badge>
        )
    },

    {
      key: "ValidationRuleId",
      label: "Validation",
      minWidth: 150,
      render: (v) => {
        const validationRule = FieldValidationRule?.data?.find(rule => rule.Id === v);
        return <Badge variant="secondary">{validationRule?.RuleName || "None"}</Badge>;
      }
    },

    { key: "Placeholder", label: "Placeholder", minWidth: 150 },

    { key: "OptionsJson", label: "Options", minWidth: 160 },

    {
      key: "ApplicableJson",
      label: "Applicable",
      minWidth: 160,
      render: (v) =>
        Array.isArray(v) ? v.join(", ").toUpperCase() : "-"
    },

    { key: "ApiUrl", label: "API URL", minWidth: 180 },

    { key: "ValueKey", label: "Value Key", minWidth: 130 },

    { key: "LabelKey", label: "Label Key", minWidth: 130 },

    { key: "DefaultValue", label: "Default Value", minWidth: 140 },

    { key: "FieldGroup", label: "Group", minWidth: 120 },

    { key: "GroupBackendKey", label: "Backend Group", minWidth: 150 },

    { key: "DisplayOrder", label: "Order", minWidth: 100 },

  ];

  // ------------------------------------------------
  // LOADING UI
  // ------------------------------------------------
  if (loading) {
    <Loading />
  }

  // ------------------------------------------------
  // MAIN UI
  // ------------------------------------------------
  return (
    <>
      <div className="bg-white dark:bg-slate-800 shadow-xl rounded-2xl overflow-hidden ">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center
         px-4 sm:px-6 py-3 sm:py-2 bg-gradient-to-r from-blue-400 to-indigo-400">
          {/* LEFT CONTENT */}
          <div className="items-start gap-3">
            <h2 className="text-sm sm:text-lg font-semibold text-white flex items-center gap-2">
              <AppIcon name="Settings" size={20} /> {HeaderCode ? "Edit Form" : "Create Form"}
            </h2>
            <p className="text-green-100 text-xs sm:text-sm">
              Create and manage custom forms for data collection and user interaction.
            </p>
          </div>

          {/* RIGHT ACTIONS */}
          <div className=" flex flex-col gap-2 sm:flex-row sm:gap-3 w-full sm:w-auto ">
            <Button
              variant="primary"
              size="sm"
              disabled={saveStatus === "saving"}
              onClick={handleSaveForm}
              icon={<AppIcon name="Save" size={16} />}
            >
              {saveStatus === "saving" ? "Saving…" : "Save"}
            </Button>

            <Button
              variant="primary"
              size="sm"
              icon={<AppIcon name="Plus" size={16} />}
              onClick={openAddField}>
              Add Field
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<AppIcon name="Eye" size={16} />}
              onClick={() => setIsPreviewDialogOpen(true)}
            >
              Preview
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>

        <div className="space-y-6 p-2 md:p-4">
          {/* FORM HEADER */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Form Settings</CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ["Name", "Form Name *", "text"],
                ["UpsertApi", "Upsert API *", "text"],
                ["GetApi", "Get API *", "text"],
                ["BulkApi", "Bulk API * ", "text"],
                ["Icon", "Icon", "text"],
                ["Version", "Version", "text"],
                ["DisplayOrder", "Display Order", "number"],
                ["ModuleId", "Module *", "select"], // data source Modules
                ["ClientPortalWCId", "Form Workflow *", "select"],  // data source workflowData
              ].map(([key, fullLabel, type]) => {
                const isRequired = fullLabel.includes('*');
                const labelText = fullLabel.replace('*', '').trim();
                const placeholder = type === "select" ? `Select ${labelText}` : `Enter ${labelText}`;

                if (type === "select") {
                  let dataSource = [];
                  if (key === "ModuleId") {
                    dataSource = Modules;
                  } else if (key === "ClientPortalWCId") {
                    dataSource = [
                      { value: 0, label: "None" },
                      ...(workflowData?.map(item => ({
                        value: item.Id,
                        label: item.Name || item.WorkflowName
                      })) || [])
                    ];
                  }

                  return (
                    <div key={key}>
                      <Label>
                        {labelText}
                        {isRequired && <span className="text-red-500"> *</span>}
                      </Label>
                      <Select
                        value={formHeader[key]?.toString()}
                        onValueChange={(value) =>
                          setFormHeader({ ...formHeader, [key]: Number(value) })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                          {dataSource.map((item) => (
                            <SelectItem key={item.value} value={item.value.toString()}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  );
                }

                return (
                  <div key={key}>
                    <Label>
                      {labelText}
                      {isRequired && <span className="text-red-500"> *</span>}
                    </Label>
                    <Input
                      placeholder={placeholder}
                      value={formHeader[key]}
                      type={type}
                      onChange={(e) =>
                        setFormHeader({ ...formHeader, [key]: type === "number" ? Number(e.target.value) : e.target.value })
                      }
                    />
                  </div>
                );
              })}

              <div className="md:col-span-2">
                <Label>Description</Label>
                <Textarea
                  value={formHeader.Description}
                  placeholder="Enter Description"
                  onChange={(e) =>
                    setFormHeader({
                      ...formHeader,
                      Description: e.target.value,
                    })
                  }
                />
              </div>



              <div className="flex gap-4 md:col-span-2">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formHeader.IsActive}
                    onCheckedChange={(v) =>
                      setFormHeader({ ...formHeader, IsActive: v })
                    }
                  />
                  <Label>Active</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={formHeader.IsGroupSaveEnabled}
                    onCheckedChange={(v) =>
                      setFormHeader({ ...formHeader, IsGroupSaveEnabled: v })
                    }
                  />
                  <Label>Group Save</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* DETAILS TABLE */}
          {fields.length > 0 && (
            <AdvanceTable
              title="Fields"
              data={fields.sort((a, b) => a.DisplayOrder - b.DisplayOrder)}
              columns={columns}
              stickyRight={true}
              showIndex={true}
              renderActions={(row) => {
                const sortedFields = fields.sort((a, b) => a.DisplayOrder - b.DisplayOrder);
                const currentIndex = sortedFields.findIndex(f => f.DetailsCode === row.DetailsCode);
                return (
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={currentIndex === 0}
                      onClick={() => moveField(currentIndex, "up")}
                    >
                      ↑
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      disabled={currentIndex === sortedFields.length - 1}
                      onClick={() => moveField(currentIndex, "down")}
                    >
                      ↓
                    </Button>

                    <Button size="sm" variant="outline" onClick={() => openEditField(row)}>
                      <AppIcon name="Edit" size={14} />
                    </Button>

                    <Button size="sm" variant="outline" onClick={() => deleteField(row.DetailsCode)}>
                      <AppIcon name="Trash2" size={14} />
                    </Button>
                  </div>
                );
              }}
            />
          )}
        </div>



        {/* FIELD DIALOG */}
        <FieldDialog
          isOpen={isFieldDialogOpen}
          onClose={() => setIsFieldDialogOpen(false)}
          initialFieldForm={initialFieldForm}
          onSave={handleFieldSave}
          setFields={setFields}
          fields={fields}
        />

        {/* PREVIEW DIALOG */}
        <FormBuilderPreviewDialog
          isOpen={isPreviewDialogOpen}
          onOpenChange={setIsPreviewDialogOpen}
          formName={formHeader.Name}
          formDescription={formHeader.Description}
          isActive={formHeader.IsActive}
          version={formHeader.Version}
          fields={fields}
          FieldValidationRule={FieldValidationRule}
        />
      </div>
    </>
  );
};

export default FormBuilderForm;
