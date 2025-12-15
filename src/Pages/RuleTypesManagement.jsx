import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "../Lib/dialog";
import { Button } from "../Lib/button";
import { Input } from "../Lib/input";
import { Label } from "../Lib/label";
import { Textarea } from "../Lib/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Lib/select";
import { Badge } from "../Lib/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../Lib/dropdown-menu";
import { Plus, Edit, Trash2, MoreHorizontal, Play } from "lucide-react";
import { useToast } from "../Lib/use-toast";
import ruleTypesService from "../../api/services/ruleTypesService";
import AdvanceTable from "../Component/AdvanceTable";
import ValidationEngine from "../services/ValidationEngine";

/* -------------------------------------------------------
   FORM FIELDS COMPONENT (REUSED FOR CREATE & EDIT)
------------------------------------------------------- */
const FormFields = ({ data, setData, isEdit = false }) => {
  const field = (name) => ({
    id: (isEdit ? "edit-" : "") + name,
    value: data[name] ?? "",
    onChange: (e) => setData({ ...data, [name]: e.target.value }),
  });

  return (
    <div className="grid grid-cols-2 gap-4 py-4">

      {/* VALUE */}
      <div>
        <Label htmlFor={field("value").id}>Value *</Label>
        <Input {...field("value")} placeholder="Enter rule value" />
      </div>

      {/* LABEL */}
      <div>
        <Label htmlFor={field("label").id}>Label *</Label>
        <Input {...field("label")} placeholder="Enter rule label" />
      </div>

      {/* DESCRIPTION */}
      <div className="col-span-2">
        <Label htmlFor={field("description").id}>Description</Label>
        <Textarea {...field("description")} placeholder="Enter rule description" />
      </div>

      {/* CATEGORY */}
      <div>
        <Label htmlFor={field("category").id}>Category</Label>
        <Input {...field("category")} placeholder="Enter category" />
      </div>

      {/* SEVERITY */}
      <div>
        <Label>Severity</Label>
        <Select
          value={data.severity}
          onValueChange={(value) => setData({ ...data, severity: value })}
        >
          <SelectTrigger><SelectValue placeholder="Select severity" /></SelectTrigger>
          <SelectContent>
            {["low", "medium", "high"].map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* TYPE */}
      <div>
        <Label htmlFor={field("type").id}>Type</Label>
        <Input {...field("type")} placeholder="Enter rule type (regex, number...)" />
      </div>

      {/* CONDITION */}
      <div>
        <Label htmlFor={field("condition").id}>Condition</Label>
        <Input {...field("condition")} placeholder="Enter condition (^test$)" />
      </div>

    </div>
  );
};

/* -------------------------------------------------------
   MAIN MODULE
------------------------------------------------------- */
const RuleTypesManagement = () => {
  const { toast } = useToast();

  const [ruleTypes, setRuleTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dialogMode, setDialogMode] = useState(null); // null | "create" | "edit" | "test"
  const [selectedRule, setSelectedRule] = useState(null);
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [testInput, setTestInput] = useState("");
  const [testResult, setTestResult] = useState(null);

  const emptyForm = useMemo(
    () => ({
      value: "",
      label: "",
      description: "",
      category: "",
      severity: "medium",
      type: "",
      condition: "",
    }),
    []
  );

  const [formData, setFormData] = useState(emptyForm);

  /* -------------------------------------------------------
      TABLE COLUMNS
  ------------------------------------------------------- */
  const columns = useMemo(
    () => [
      { key: "label", label: "Label" },
      { key: "value", label: "Value" },
      { key: "type", label: "Type" },
      { key: "category", label: "Category" },
      { key: "condition", label: "Condition" },
      { key: "description", label: "Description" },
      {
        key: "severity",
        label: "Severity",
        render: (v) => (
          <Badge className={getSeverityColor(v)}>{v}</Badge>
        ),
      },
    ],
    []
  );

  /* -------------------------------------------------------
      LOAD RULE TYPES
  ------------------------------------------------------- */
  const fetchRuleTypes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ruleTypesService.getAllRuleTypes();
      setRuleTypes(data);
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch rule types.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRuleTypes();
  }, []);

  /* -------------------------------------------------------
      VALIDATOR
  ------------------------------------------------------- */
  const validateForm = () => {
    if (!formData.value.trim() || !formData.label.trim()) {
      toast({
        title: "Validation Error",
        description: "Value and Label are required fields.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  /* -------------------------------------------------------
      CREATE RULE TYPE
  ------------------------------------------------------- */
  const handleCreate = async () => {
    if (!validateForm()) return;

    try {
      await ruleTypesService.createRuleType(formData);

      toast({ title: "Success", description: "Rule type created." });

      closeDialog();
      fetchRuleTypes();
    } catch {
      toast({
        title: "Error",
        description: "Failed to create rule type.",
        variant: "destructive",
      });
    }
  };

  /* -------------------------------------------------------
      EDIT RULE TYPE
  ------------------------------------------------------- */
  const handleEdit = async () => {
    if (!validateForm()) return;

    try {
      await ruleTypesService.updateRuleType(selectedRule.id, formData);

      toast({ title: "Success", description: "Rule type updated." });

      closeDialog();
      fetchRuleTypes();
    } catch {
      toast({
        title: "Error",
        description: "Failed to update rule type.",
        variant: "destructive",
      });
    }
  };

  /* -------------------------------------------------------
      DELETE RULE TYPE
  ------------------------------------------------------- */
  const handleDelete = async (id) => {
    try {
      await ruleTypesService.deleteRuleType(id);

      toast({ title: "Success", description: "Rule type deleted." });

      fetchRuleTypes();
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete rule type.",
        variant: "destructive",
      });
    }
  };

  /* -------------------------------------------------------
      OPEN / CLOSE DIALOG HELPERS
  ------------------------------------------------------- */
  const openDialog = (mode, rule = null) => {
    setDialogMode(mode);
    setSelectedRule(rule);
    setFormData(rule ? { ...rule } : emptyForm);
  };

  const closeDialog = () => {
    setDialogMode(null);
    setSelectedRule(null);
    setFormData(emptyForm);
  };

  /* -------------------------------------------------------
      SEVERITY COLOR
  ------------------------------------------------------- */
  const getSeverityColor = (sev) =>
    ({
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800",
    }[sev] || "bg-gray-100 text-gray-800");

  /* -------------------------------------------------------
      TEST RULE FUNCTION
  ------------------------------------------------------- */
  const handleTestRule = (rule) => {
    setSelectedRule(rule);
    setTestInput("");
    setTestResult(null);
    setTestDialogOpen(true);
  };

  const runTest = () => {
    if (!selectedRule) return;
    if (!testInput) {
      toast({
        title: "Input Required",
        description: "Please enter a test input value.",
        variant: "destructive",
      });
      return;
    }
    try {
      // Create a mock template with a single field using this rule
      const mockTemplate = {
        fields: [{
          name: "testField",
          label: "Test Field",
          applicable: ["form"],
          validation: {
            type: selectedRule.type || selectedRule.value,
            condition: selectedRule.condition
          }
        }]
      };

      const mockFormData = { testField: testInput };

      const result = ValidationEngine.validate({ template: mockTemplate, formData: mockFormData });

      setTestResult({
        valid: result.valid,
        errors: result.errors,
        input: testInput
      });
    } catch (error) {
      setTestResult({
        valid: false,
        errors: { testField: "Test execution failed: " + error.message },
        input: testInput
      });
    }
  };

  /* -------------------------------------------------------
      ROW ACTIONS
  ------------------------------------------------------- */
  const renderActions = (row) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleTestRule(row)}>
          <Play className="mr-2 h-4 w-4" />
          Test Rule
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => openDialog("edit", row)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleDelete(row.id)}
          className="text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  /* -------------------------------------------------------
      MAIN UI
  ------------------------------------------------------- */
  return (
    <div className="p-4">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Rule Types Management</h1>
          <p className="text-muted-foreground">Manage validation rule types for the system</p>
        </div>

        <Button onClick={() => openDialog("create")}>
          <Plus className="mr-2 h-4 w-4" /> Add Rule Type
        </Button>
      </div>

      {/* TABLE */}
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
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "create" ? "Create Rule Type" : "Edit Rule Type"}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "create"
                ? "Add a new validation rule type."
                : "Modify the selected rule type."}
            </DialogDescription>
          </DialogHeader>

          <FormFields
            data={formData}
            setData={setFormData}
            isEdit={dialogMode === "edit"}
          />

          <DialogFooter>
            <Button onClick={dialogMode === "create" ? handleCreate : handleEdit}>
              {dialogMode === "create" ? "Create" : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* TEST RULE DIALOG */}
      <Dialog open={testDialogOpen} onOpenChange={setTestDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Test Rule: {selectedRule?.label}</DialogTitle>
            <DialogDescription>
              Enter test data to validate against the rule "{selectedRule?.value}".
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="test-input">Test Input</Label>
              <Input
                id="test-input"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                placeholder="Enter value to test..."
              />
            </div>

            <Button onClick={runTest} className="w-full">
              <Play className="mr-2 h-4 w-4" />
              Run Test
            </Button>

            {testResult && (
              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className={testResult.valid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {testResult.valid ? "PASS" : "FAIL"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Input: "{testResult.input}"
                  </span>
                </div>

                {!testResult.valid && testResult.errors?.testField && (
                  <div className="text-sm text-red-600">
                    Error: {testResult.errors.testField}
                  </div>
                )}

                {testResult.valid && (
                  <div className="text-sm text-green-600">
                    ✓ Validation passed successfully
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setTestDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RuleTypesManagement;
