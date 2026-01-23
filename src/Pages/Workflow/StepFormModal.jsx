

/* ===================== StepFormModal.jsx ===================== */
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "../../Library/dialog";
import { Button } from "../../Library/Button";
import { Input } from "../../Library/Input";
import { Label } from "../../Library/Label";
import { Textarea } from "../../Library/Textarea";
import { Switch } from "../../Library/Switch";
import RoleSelect from "../../Component/RoleSelect";
import { useToast } from "../../Library/use-toast";
import AppIcon from "../../Component/AppIcon";

function StepFormModal({
  isOpen,
  onClose,
  initial = null,
  onSave,
  existingOrders = [],
  existingNames = [],
}) {
  const { toast } = useToast();
  const editingMode = initial;

  const [form, setForm] = useState({
    StepOrder: "",
    StepName: "",
    ApproverRoleCode: "",
    EscalationTo: "",
    EscalationHours: "",
    DisplayOrder: 1,
    Conditions: "",
    IsActive: true,
  });

  useEffect(() => {
    if (initial) {
      setForm({
        StepOrder: initial.StepOrder ?? "",
        StepName: initial.StepName ?? "",
        ApproverRoleCode: initial.ApproverRoleCode ?? "",
        EscalationTo: initial.EscalationTo ?? "",
        EscalationHours: initial.EscalationHours ?? "",
        DisplayOrder: initial.DisplayOrder ?? 1,
        Conditions: initial.Conditions ?? "",
        IsActive: initial.IsActive ?? true,
      });
    }
  }, [initial]);

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const validateAndSave = () => {
    if (!form.StepName.trim())
      return toast({ title: "Step name required", variant: "danger" });

    if (!form.StepOrder || Number(form.StepOrder) <= 0)
      return toast({ title: "Invalid step order", variant: "danger" });

    if (!form.ApproverRoleCode)
      return toast({ title: "Approver role required", variant: "danger" });

    if (
      existingOrders.includes(form.StepOrder) &&
      initial?.StepOrder !== form.StepOrder
    )
      return toast({
        title: "Validation Error",
        description: "Step order already used.",
        variant: "danger",
      });

    if (
      existingNames.includes(form.StepName.trim()) &&
      initial?.StepName !== form.StepName.trim()
    )
      return toast({
        title: "Validation Error",
        description: "Step name already used.",
        variant: "danger",
      });

    // escalation pair validation
    if (form.EscalationTo && !form.EscalationHours)
      return toast({
        title: "Validation Error",
        description:
          "Escalation hours are required when escalation role is selected.",
        variant: "danger",
      });

    if (!form.EscalationTo && form.EscalationHours)
      return toast({
        title: "Validation Error",
        description:
          "Select escalation role before setting escalation hours.",
        variant: "danger",
      });


    onSave({
      ...form,
      StepOrder: Number(form.StepOrder),
      EscalationHours: form.EscalationHours
        ? Number(form.EscalationHours)
        : "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-1/2"
        header={
          <div className="flex items-center gap-3 p-2 border-b bg-gradient-to-r from-indigo-600 to-indigo-500 text-white">
            <div className="p-2 rounded-lg text-white">
              <AppIcon
                name={editingMode !== null ? "Pencil" : "Plus"}
                size={20}
              />
            </div>
            <div>
              <DialogTitle className="text-md font-semibold text-white">
                {editingMode !== null
                  ? "Edit Configuration Item"
                  : "Add New Configuration Item"}
              </DialogTitle>
              <p className="text-[12px] text-gray-100 mt-1">
                {editingMode !== null
                  ? "Update the configuration details below"
                  : "Fill in the details to create a new configuration item"}
              </p>
            </div>
          </div>
        }
        body={
          <div className="space-y-6">
            {/* STEP DETAILS */}
            <section>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Step Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Step Order *</Label>
                  <Input
                    type="number"
                    value={form.StepOrder}
                    onChange={(e) => update("StepOrder", e.target.value)}
                    placeholder="e.g. 1"
                  />
                </div>
                <div>
                  <Label>Step Name *</Label>
                  <Input
                    value={form.StepName}
                    onChange={(e) => update("StepName", e.target.value)}
                    placeholder="e.g. Manager Approval"
                  />
                </div>
              </div>
            </section>

            {/* APPROVAL */}
            <section className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
              <h4 className="text-sm font-semibold text-indigo-700 mb-3">
                Approval Configuration
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Approver Role *</Label>
                  <RoleSelect
                    value={form.ApproverRoleCode}
                    onChange={(v) => update("ApproverRoleCode", v)}
                  />
                </div>
                <div className="flex items-center gap-3 mt-6">
                  <Switch
                    checked={form.IsActive}
                    onCheckedChange={(v) => update("IsActive", v)}
                  />
                  <Label>Active Step</Label>
                </div>
              </div>
            </section>

            {/* ESCALATION */}
            <section className="rounded-xl border border-amber-100 bg-amber-50/40 p-4">
              <h4 className="text-sm font-semibold text-amber-700 mb-3">
                Escalation (Optional)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RoleSelect
                  value={form.EscalationTo}
                  allowNone
                  onChange={(v) => update("EscalationTo", v)}
                />
                <Input
                  type="number"
                  value={form.EscalationHours}
                  placeholder="Hours"
                  onChange={(e) =>
                    update("EscalationHours", e.target.value)
                  }
                />
              </div>
            </section>

            {/* ADVANCED */}
            <details>
              <summary className="cursor-pointer text-sm font-medium text-gray-600">
                Advanced Conditions (JSON)
              </summary>
              <Textarea
                className="mt-3 min-h-[90px] font-mono text-xs"
                placeholder='{"minAmount":1000}'
                value={form.Conditions}
                onChange={(e) => update("Conditions", e.target.value)}
              />
            </details>
          </div>
        }
        footer={
          <div className="flex justify-end items-center">
            <div className="flex gap-2">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" onClick={validateAndSave}>
                {initial ? "Update Step" : "Add Step"}
              </Button>
            </div>
          </div>
        }
      />
    </Dialog>
  );
}

export default StepFormModal;
