/* ===================== StepFormModal.jsx ===================== */
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "../../Library/dialog";
import { Button } from "../../Library/Button";
import { Input } from "../../Library/Input";
import { Label } from "../../Library/Label";
import { Textarea } from "../../Library/Textarea";
import { Switch } from "../../Library/Switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../Library/Select";
import { useToast } from "../../Library/use-toast";
import AppIcon from "../../Component/AppIcon";
import { ClientPortalWorkflowStatus } from "../../Data/StaticData";
import { DEFAULT_STEP } from "./workflowDefaults";

function StepFormModal({
  isOpen,
  onClose,
  initial = null,
  onSave,
  existingOrders = [],
  roles = [],
  userGroups = [],
  emailTemplates = [],
  smsTemplates = [],
  letterTemplates = [],
  isLetterRequired,
  isSmsRequired,
  isEmailRequired
}) {
  const { toast } = useToast();
  const editingMode = !!initial;
  const [form, setForm] = useState(initial || DEFAULT_STEP);

  useEffect(() => {
    if (initial) {
      setForm({
        ...initial,
        FlowOrder: initial.FlowOrder ?? 0,
        CurrentRoleCode: initial.CurrentRoleCode ? String(initial.CurrentRoleCode) : 0,
        NextRoleCode: initial.NextRoleCode ? String(initial.NextRoleCode) : 0,
        UserGroupCode: initial.UserGroupCode ? String(initial.UserGroupCode) : 0,
        ActionProcessingStatus: initial.ActionProcessingStatus ? String(initial.ActionProcessingStatus) : "",
        NextActionProcessingStatus: initial.NextActionProcessingStatus ? String(initial.NextActionProcessingStatus) : "",
        FailureActionProcessingStatus: initial.FailureActionProcessingStatus ? String(initial.FailureActionProcessingStatus) : "",
        LetterTemplateId: initial.LetterTemplateId ? String(initial.LetterTemplateId) : 0,
        EmailTemplateId: initial.EmailTemplateId ? String(initial.EmailTemplateId) : 0,
        SmsTemplateId: initial.SmsTemplateId ? String(initial.SmsTemplateId) : 0,
        Metadata: typeof initial.Metadata === 'object' ? JSON.stringify(initial.Metadata, null, 2) : (initial.Metadata || ""),
      });
    } else {
      // Find next available order
      let nextOrder = 1;
      while (existingOrders.includes(nextOrder)) {
        nextOrder++;
      }
      setForm({ FlowOrder: nextOrder });
    }
  }, [initial, isOpen]);

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const validateAndSave = () => {
    const errors = [];
    if (!form.FlowOrder) errors.push("Flow Order is required");
    if (!form.IsUserGroupBased && !form.CurrentRoleCode) errors.push("Current Role is required when not User Group based");
    if (form.IsUserGroupBased && !form.UserGroupCode) errors.push("User Group is required when User Group based");
    if (!form.ActionProcessingStatus) errors.push("Action Processing Status is required");
    if (!form.NextActionProcessingStatus) errors.push("Next Action Processing Status is required");
    if (!form.FailureActionProcessingStatus) errors.push("Failure Action Processing Status is required");
    if (isLetterRequired && !form.LetterTemplateId) errors.push("Letter Template is required when Letter Generation is enabled");
    if (isSmsRequired && !form.SmsTemplateId) errors.push("SMS Template is required when SMS Notification is enabled");
    if (isEmailRequired && !form.EmailTemplateId) errors.push("Email Template is required when Email Notification is enabled");

    if (
      !initial &&
      existingOrders.includes(Number(form.FlowOrder))
    ) {
      errors.push(`Flow Order ${form.FlowOrder} already exists.`);
    }

    // Check if order changed and conflicts
    if (initial && initial.FlowOrder && Number(initial.FlowOrder) !== Number(form.FlowOrder) && existingOrders.includes(Number(form.FlowOrder))) {
      errors.push(`Flow Order ${form.FlowOrder} already exists.`);
    }


    if (errors.length > 0) {
      toast({ title: "Validation Error", description: errors.join(" ! ,  "), variant: "danger" });
      return;
    }

    let safeMetadata = {};

    try {
      safeMetadata =
        typeof form.Metadata === "string"
          ? JSON.parse(form.Metadata || "")
          : form.Metadata || "";
    } catch (e) {
      safeMetadata = "";
    }

    onSave({
      ...form,
      FlowOrder: Number(form.FlowOrder),
      CurrentRoleCode: form.CurrentRoleCode ? Number(form.CurrentRoleCode) : 0,
      NextRoleCode: form.NextRoleCode ? Number(form.NextRoleCode) : 0,
      UserGroupCode: form.IsUserGroupBased && form.UserGroupCode ? form.UserGroupCode : 0, // Assuming UserGroupCode is ID or String? Kept as is.
      LetterTemplateId: form.LetterTemplateId ? Number(form.LetterTemplateId) : 0,
      EmailTemplateId: form.EmailTemplateId ? Number(form.EmailTemplateId) : 0,
      SmsTemplateId: form.SmsTemplateId ? Number(form.SmsTemplateId) : 0,
      ActionProcessingStatus: form.ActionProcessingStatus ? Number(form.ActionProcessingStatus) : 0,
      NextActionProcessingStatus: form.NextActionProcessingStatus ? Number(form.NextActionProcessingStatus) : 0,
      FailureActionProcessingStatus: form.FailureActionProcessingStatus ? Number(form.FailureActionProcessingStatus) : 0,
      Metadata: safeMetadata,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        header={
          <div className="flex items-center gap-3 p-4 border-b bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-t-lg">
            <div className="p-2 rounded-lg bg-white/20">
              <AppIcon name={editingMode ? "Pencil" : "Plus"} size={20} className="text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-white">
                {editingMode ? "Edit Workflow Step" : "Add Workflow Step"}
              </DialogTitle>
              <p className="text-sm text-indigo-100 mt-1">
                Configure the flow, roles, and actions for this step.
              </p>
            </div>
          </div>
        }
        body={
          <div className="space-y-6 p-1">
            {/* MAIN SETTINGS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Flow Order */}
              <div>
                <Label>Flow Order <span className="text-red-600"> *</span></Label>
                <Input
                  type="number"
                  value={form.FlowOrder}
                  disabled={true}
                  onChange={(e) => update("FlowOrder", e.target.value)}
                  placeholder="e.g. 1"
                />
              </div>

              {/* User Group Switch */}
              <div className="flex flex-col justify-end pb-2">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.IsUserGroupBased}
                    onCheckedChange={(v) => update("IsUserGroupBased", v)}
                  />
                  <Label className="mb-0 cursor-pointer"
                    onClick={() => update("IsUserGroupBased", !form.IsUserGroupBased)}>User Group Based</Label>
                </div>
              </div>

              {/* Role / User Group Selection */}
              {!form.IsUserGroupBased ? (
                <>
                  <div>
                    <Label>Current Role {!form.IsUserGroupBased && <span className="text-red-600"> *</span>}</Label>
                    <Select
                      value={form.CurrentRoleCode}
                      onValueChange={(value) => update('CurrentRoleCode', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        {[{ Code: "None", Id: 0 }, ...(roles || [])].map(role => (
                          <SelectItem key={role.Id} value={role.Id.toString()}>
                            {typeof role.Code === 'object' ? JSON.stringify(role.Code) : (role.Code || 'Unknown')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Next Role {!form.IsUserGroupBased && <span className="text-red-600"> *</span>}</Label>
                    <Select
                      value={form.NextRoleCode}
                      onValueChange={(value) => update('NextRoleCode', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        {[{ Code: "None", Id: 0 }, ...(roles || [])].map(role => (
                          <SelectItem key={role.Id} value={role.Id.toString()}>
                            {typeof role.Code === 'object' ? JSON.stringify(role.Code) : (role.Code || 'Unknown')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : (
                <div className="md:col-span-2">
                  <Label>User Group <span className="text-red-600"> *</span></Label>
                  <Select
                    value={form.UserGroupCode}
                    onValueChange={(value) => update('UserGroupCode', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select User Group" />
                    </SelectTrigger>
                    <SelectContent>
                      {[{ Code: "None", Id: 0 }, ...(userGroups || [])].map(group => (
                        <SelectItem key={group.Id} value={group.Id.toString()}>
                          {group.Code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="h-px bg-gray-100 my-4"></div>

            {/* STATUS CONFIGURATION */}
            <h4 className="text-sm font-semibold text-gray-700">Status Configuration</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Action Processing Status <span className="text-red-600"> *</span></Label>
                <Select
                  value={form.ActionProcessingStatus}
                  onValueChange={(value) => update('ActionProcessingStatus', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {[{ label: "None", value: 0 }, ...(ClientPortalWorkflowStatus || [])].map(status => (
                      <SelectItem key={status.value} value={status.value.toString()}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Next Action Status <span className="text-red-600"> *</span></Label>
                <Select
                  value={form.NextActionProcessingStatus}
                  onValueChange={(value) => update('NextActionProcessingStatus', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {[{ label: "None", value: 0 }, ...(ClientPortalWorkflowStatus || [])].map(status => (
                      <SelectItem key={status.value} value={status.value.toString()}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Failure Action Status <span className="text-red-600"> *</span></Label>
                <Select
                  value={form.FailureActionProcessingStatus}
                  onValueChange={(value) => update('FailureActionProcessingStatus', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {[{ label: "None", value: 0 }, ...(ClientPortalWorkflowStatus || [])].map(status => (
                      <SelectItem key={status.value} value={status.value.toString()}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="h-px bg-gray-100 my-4"></div>

            {/* COMMUNICATIONS */}
            <h4 className="text-sm font-semibold text-gray-700">Communication Templates</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Letter Template {isLetterRequired && <span className="text-red-600"> *</span>}</Label>
                <Select
                  value={form.LetterTemplateId}
                  onValueChange={(value) => update('LetterTemplateId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Template" />
                  </SelectTrigger>
                  <SelectContent>
                    {[{ Name: "None", TemplateId: 0 }, ...(letterTemplates || [])].map(template => (
                      <SelectItem key={template.TemplateId} value={template.TemplateId.toString()}>
                        {typeof template.Name === 'object' ? JSON.stringify(template.Name) : (template.Name || 'Unknown')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Email Template {isEmailRequired && <span className="text-red-600"> *</span>}</Label>
                <Select
                  value={form.EmailTemplateId}
                  onValueChange={(value) => update('EmailTemplateId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Template" />
                  </SelectTrigger>
                  <SelectContent>
                    {[{ Name: "None", TemplateId: 0 }, ...(emailTemplates || [])].map(template => (
                      <SelectItem key={template.TemplateId} value={template.TemplateId.toString()}>
                        {template.Name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>SMS Template {isSmsRequired && <span className="text-red-600"> *</span>}</Label>
                <Select
                  value={form.SmsTemplateId}
                  onValueChange={(value) => update('SmsTemplateId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Template" />
                  </SelectTrigger>
                  <SelectContent>
                    {[{ Name: "None", TemplateId: 0 }, ...(smsTemplates || [])].map(template => (
                      <SelectItem key={template.TemplateId} value={template.TemplateId.toString()}>
                        {template.Name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* METADATA */}
            <div>
              <Label>Metadata ({`{JSON}`})</Label>
              <Textarea
                className="mt-1 font-mono text-xs h-24"
                placeholder='{"key": "value"}'
                value={form.Metadata}
                onChange={(e) => update("Metadata", e.target.value)}
              />
            </div>
          </div>
        }
        footer={
          <div className="flex justify-end items-center gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={validateAndSave}>
              {editingMode ? "Update Step" : "Add Step"}
            </Button>
          </div>
        }
      />
    </Dialog>
  );
}

export default StepFormModal;
