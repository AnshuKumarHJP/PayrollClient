import React, { useState, useEffect, useCallback } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../Lib/dialog";

import { Button } from "../Lib/button";
import { Input } from "../Lib/input";
import { Label } from "../Lib/label";
import { Textarea } from "../Lib/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../Lib/select";

import { Badge } from "../Lib/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../Lib/dropdown-menu";

import { Plus, Edit, Trash2, MoreHorizontal, Play } from "lucide-react";
import { useToast } from "../Lib/use-toast";

import ruleTypesService from "../../api/services/ruleTypesService";
import AdvanceTable from "../Component/AdvanceTable";
import ValidationEngine from "../services/ValidationEngine";

/* ============================================================
   FORM FIELDS COMPONENT
============================================================ */
const FormFields = ({ data, setData, availableTypes }) => {
  const field = (name) => ({
    id: name,
    value: data[name] ?? "",
    onChange: (e) => setData({ ...data, [name]: e.target.value }),
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
      {/* VALUE */}
      <div>
        <Label>
          Value <span className="text-red-500">*</span>
        </Label>
        <Input {...field("value")} placeholder="e.g., salary-range" />
      </div>

      {/* LABEL */}
      <div>
        <Label>
          Label <span className="text-red-500">*</span>
        </Label>
        <Input {...field("label")} placeholder="Readable label" />
      </div>

      {/* DESCRIPTION */}
      <div className="md:col-span-2">
        <Label>Description</Label>
        <Textarea {...field("description")} placeholder="Explain rule logic" />
      </div>

      {/* CATEGORY */}
      <div>
        <Label>Category</Label>
        <Input {...field("category")} placeholder="Validation, HR, Finance…" />
      </div>

      {/* SEVERITY */}
      <div>
        <Label>Severity</Label>
        <Select
          value={data.severity}
          onValueChange={(v) => setData({ ...data, severity: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* HANDLER TYPE */}
      <div>
        <Label>Validation Type</Label>
        <Select
          value={data.type}
          onValueChange={(v) => setData({ ...data, type: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select handler type" />
          </SelectTrigger>

          <SelectContent>
            {availableTypes.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* MANUAL CUSTOM TYPE */}
        <Input
          className="mt-2"
          value={data.type}
          onChange={(e) => setData({ ...data, type: e.target.value })}
          placeholder="OR type custom handler"
        />
      </div>

      {/* CONDITION */}
      <div>
        <Label>Condition</Label>
        <Input {...field("condition")} placeholder="Regex, min-max, list…" />
      </div>
    </div>
  );
};

/* ============================================================
   MAIN COMPONENT
============================================================ */
const RuleTypesManagement = () => {
  const { toast } = useToast();

  const [ruleTypes, setRuleTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dialogMode, setDialogMode] = useState(null);
  const [selectedRule, setSelectedRule] = useState(null);

  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [testInput, setTestInput] = useState("");
  const [testResult, setTestResult] = useState(null);

  const emptyForm = {
    value: "",
    label: "",
    description: "",
    category: "",
    severity: "medium",
    type: "",
    condition: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  /* ============================================================
      FETCH RULE TYPES
  ============================================================ */
  const fetchRuleTypes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ruleTypesService.getAllRuleTypes();
      setRuleTypes(data || []);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load rule types.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRuleTypes();
  }, []);

  /* ============================================================
      OPEN / CLOSE DIALOG
  ============================================================ */
  const openDialog = (mode, rule = null) => {
    const availableTypes = [
      ...new Set(ruleTypes.map((r) => r.type).filter(Boolean)),
    ];

    setDialogMode(mode);
    setSelectedRule(rule);

    setFormData(rule ? { ...rule } : emptyForm);
    setFormData((prev) => ({ ...prev, availableTypes }));
  };

  const closeDialog = () => {
    setDialogMode(null);
    setSelectedRule(null);
    setFormData(emptyForm);
  };

  /* ============================================================
      VALIDATE FORM
  ============================================================ */
  const validateForm = () => {
    if (!formData.value.trim() || !formData.label.trim()) {
      toast({
        title: "Required",
        description: "Value and Label are required.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  /* ============================================================
      CREATE RULE
  ============================================================ */
  const handleCreate = async () => {
    if (!validateForm()) return;

    const payload = { ...formData };
    delete payload.availableTypes;

    try {
      await ruleTypesService.createRuleType(payload);
      toast({ title: "Success", description: "Rule created." });
      closeDialog();
      fetchRuleTypes();
    } catch {
      toast({
        title: "Error",
        description: "Failed to create rule.",
        variant: "destructive",
      });
    }
  };

  /* ============================================================
      EDIT RULE
  ============================================================ */
  const handleEdit = async () => {
    if (!validateForm()) return;

    const payload = { ...formData };
    delete payload.availableTypes;

    try {
      await ruleTypesService.updateRuleType(selectedRule.id, payload);
      toast({ title: "Success", description: "Rule updated." });
      closeDialog();
      fetchRuleTypes();
    } catch {
      toast({
        title: "Error",
        description: "Failed to update rule.",
        variant: "destructive",
      });
    }
  };

  /* ============================================================
      DELETE
  ============================================================ */
  const handleDelete = async (id) => {
    try {
      await ruleTypesService.deleteRuleType(id);
      toast({ title: "Deleted", description: "Rule removed." });
      fetchRuleTypes();
    } catch {
      toast({
        title: "Error",
        description: "Delete failed.",
        variant: "destructive",
      });
    }
  };

  /* ============================================================
      TEST RULE
  ============================================================ */
  const handleTestRule = (rule) => {
    setSelectedRule(rule);
    setTestInput("");
    setTestResult(null);
    setTestDialogOpen(true);
  };

  const runTest = () => {
    if (!testInput) {
      toast({
        title: "Error",
        description: "Enter a value to test.",
        variant: "destructive",
      });
      return;
    }

    const mockTemplate = {
      fields: [
        {
          name: "testField",
          label: "Test Field",
          applicable: ["form"],
          validation: {
            type: selectedRule.type,
            condition: selectedRule.condition,
          },
        },
      ],
    };

    const result = ValidationEngine.validate({
      template: mockTemplate,
      formData: { testField: testInput },
      ruleTypes,
    });

    setTestResult(result);
  };

  /* ============================================================
      TABLE COLUMNS
  ============================================================ */
  const columns = [
    { key: "label", label: "Label" },
    { key: "value", label: "Key" },
    { key: "type", label: "Type" },
    { key: "category", label: "Category" },
    { key: "condition", label: "Condition" },
    { key: "description", label: "Description" },
    {
      key: "severity",
      label: "Severity",
      render: (v) => (
        <Badge
          className={
            v === "high"
              ? "bg-red-100 text-red-800"
              : v === "medium"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-800"
          }
        >
          {v}
        </Badge>
      ),
    },
  ];

  const renderActions = (row) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleTestRule(row)}>
          <Play className="mr-2 h-4 w-4" /> Test
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => openDialog("edit", row)}>
          <Edit className="mr-2 h-4 w-4" /> Edit
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleDelete(row.id)}
          className="text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  /* ============================================================
      MAIN UI
  ============================================================ */
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Rule Types Management</h1>
          <p className="text-muted-foreground">Manage validation rules</p>
        </div>

        <Button onClick={() => openDialog("create")}>
          <Plus className="mr-2 h-4 w-4" /> Add Rule Type
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <AdvanceTable
          title="Rule Types"
          data={ruleTypes}
          columns={columns}
          renderActions={renderActions}
        />
      )}

      {/* CREATE / EDIT DIALOG */}
      <Dialog open={!!dialogMode} onOpenChange={closeDialog}>
        <DialogContent
          className="max-w-3xl"
          header={
            <DialogHeader>
              <DialogTitle>
                {dialogMode === "create"
                  ? "Create Rule Type"
                  : "Edit Rule Type"}
              </DialogTitle>
              <DialogDescription>
                {dialogMode === "create"
                  ? "Add new rule definition"
                  : "Update rule definition"}
              </DialogDescription>
            </DialogHeader>
          }
          body={
            <FormFields
              data={formData}
              setData={setFormData}
              availableTypes={[
                ...new Set(ruleTypes.map((r) => r.type).filter(Boolean)),
              ]}
            />
          }
          footer={
            <DialogFooter>
              <Button variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button
                onClick={
                  dialogMode === "create" ? handleCreate : handleEdit
                }
              >
                {dialogMode === "create" ? "Create" : "Update"}
              </Button>
            </DialogFooter>
          }
        />
      </Dialog>

      {/* TEST DIALOG */}
      <Dialog open={testDialogOpen} onOpenChange={setTestDialogOpen}>
        <DialogContent
          className="max-w-md"
          header={
            <DialogHeader>
              <DialogTitle>Test Rule</DialogTitle>
              <DialogDescription>
                Testing rule: {selectedRule?.label}
              </DialogDescription>
            </DialogHeader>
          }
          body={
            <div className="space-y-4">
              <div>
                <Label>Test Input</Label>
                <Input
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  placeholder="Enter value"
                />
              </div>

              <Button className="w-full" onClick={runTest}>
                <Play className="h-4 w-4 mr-2" />
                Run Test
              </Button>

              {testResult && (
                <div className="border rounded p-4">
                  <Badge
                    className={
                      testResult.valid
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {testResult.valid ? "PASS" : "FAIL"}
                  </Badge>

                  {!testResult.valid && (
                    <p className="text-red-600 mt-2 text-sm">
                      {testResult.errors?.testField}
                    </p>
                  )}

                  {testResult.valid && (
                    <p className="text-green-600 mt-2 text-sm">
                      ✓ Validation passed
                    </p>
                  )}
                </div>
              )}
            </div>
          }
          footer={
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setTestDialogOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          }
        />
      </Dialog>
    </div>
  );
};

export default RuleTypesManagement;
