import React, { useState, useEffect } from "react";
import { Button } from "../../Lib/button";
import { Input } from "../../Library/Input";
import { Label } from "../../Library/Label";
import { Textarea } from "../../Lib/textarea";
import { Dialog, DialogContent, DialogTitle } from "../../Lib/dialog";
import { useToast } from "../../Lib/use-toast";
import RoleSelect from "../../Component/RoleSelect";
import { Switch } from "../../Library/Switch";

function StepFormModal({
  isOpen,
  onClose,
  initial = null,
  onSave,
  existingOrders = [],
  existingNames = [],
}) {
  const { toast } = useToast();

  const [stepOrder, setStepOrder] = useState("");
  const [stepName, setStepName] = useState("");
  const [ApproverRoleCode, setApproverRoleCode] = useState("");
  const [isMandatory, setIsMandatory] = useState(true);
  const [conditions, setConditions] = useState("");
  const [escalationTo, setEscalationTo] = useState("");
  const [escalationHours, setEscalationHours] = useState("");
  const [DisplayOrder, setDisplayOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    setStepOrder(initial?.StepOrder ?? "");
    setStepName(initial?.StepName ?? "");
    setApproverRoleCode(initial?.ApproverRoleCode ?? "");
    setIsMandatory(initial?.IsMandatory ?? true);
    setConditions(initial?.Conditions ?? "");
    setEscalationTo(initial?.EscalationTo ?? "");
    setEscalationHours(initial?.EscalationHours ?? "");
    setDisplayOrder(initial?.DisplayOrder ?? 1);
    setIsActive(initial?.IsActive ?? true);
  }, [initial]);

  const validateAndSave = () => {
    const orderNum = Number(stepOrder);

    if (!stepName.trim())
      return toast({
        title: "Validation Error",
        description: "Step name is required.",
        variant: "destructive",
      });

    if (!orderNum || orderNum <= 0)
      return toast({
        title: "Validation Error",
        description: "Step order must be greater than 0.",
        variant: "destructive",
      });

    if (!ApproverRoleCode)
      return toast({
        title: "Validation Error",
        description: "Approver role is required.",
        variant: "destructive",
      });

    if (
      existingOrders.includes(orderNum) &&
      initial?.StepOrder !== orderNum
    )
      return toast({
        title: "Validation Error",
        description: "Step order already used.",
        variant: "destructive",
      });

    if (
      existingNames.includes(stepName.trim()) &&
      initial?.StepName !== stepName.trim()
    )
      return toast({
        title: "Validation Error",
        description: "Step name already used.",
        variant: "destructive",
      });

    // escalation pair validation
    if (escalationTo && !escalationHours)
      return toast({
        title: "Validation Error",
        description:
          "Escalation hours are required when escalation role is selected.",
        variant: "destructive",
      });

    if (!escalationTo && escalationHours)
      return toast({
        title: "Validation Error",
        description:
          "Select escalation role before setting escalation hours.",
        variant: "destructive",
      });

    onSave({
      StepOrder: orderNum,
      StepName: stepName.trim(),
      ApproverRoleCode: Number(ApproverRoleCode),
      IsMandatory: !!isMandatory,
      Conditions: conditions || "",
      EscalationTo: escalationTo ? Number(escalationTo) : "",
      EscalationHours: escalationHours
        ? Number(escalationHours)
        : "",
      DisplayOrder: DisplayOrder,
      IsActive: isActive,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        header={<DialogTitle className="text-xl font-semibold">{initial ? "Edit Step" : "Add New Step"}</DialogTitle>}
        body={
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Step Order <span className="text-red-500"> *</span></Label>
                <Input
                  type="number"
                   placeholder="e.g. 1"
                  value={stepOrder}
                  onChange={(e) => setStepOrder(e.target.value)}
                />
              </div>

              <div>
                <Label>Step Name <span className="text-red-500"> *</span></Label>
                <Input
                  value={stepName}
                   placeholder="e.g. Manager Approval"
                  onChange={(e) => setStepName(e.target.value)}
                />
              </div>

              <div>
                <Label>Approver Role<span className="text-red-500"> *</span></Label>
                <RoleSelect
                  value={ApproverRoleCode}
                  onChange={setApproverRoleCode}
                />
              </div>

              <div>
                <Label>Escalation To</Label>
                <RoleSelect
                  value={escalationTo}
                  onChange={setEscalationTo}
                  allowNone={true}
                />
              </div>

              <div>
                <Label>Escalation Hours</Label>
                <Input
                  type="number"
                  value={escalationHours}
                  placeholder="e.g. 24"
                  onChange={(e) => setEscalationHours(e.target.value)}
                />
              </div>

              <div>
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={DisplayOrder}
                  placeholder="e.g. 1"
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="mt-4 flex gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <Label>Active</Label>
              </div>
            </div>

            <div className="mt-4">
              <Label>Conditions (JSON)</Label>
              <Textarea
               id="conditions"
                value={conditions}
                 placeholder='Optional JSON rules, e.g. {"minAmount":1000}'
                onChange={(e) => setConditions(e.target.value)}
                  className="min-h-[80px]"
              />
            </div>
          </>
        }
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={validateAndSave}>
              {initial ? "Update Step" : "Add Step"}
            </Button>
          </div>
        }
      />
    </Dialog>
  );
}

export default StepFormModal;
