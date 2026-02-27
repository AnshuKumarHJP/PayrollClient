
import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "../../Library/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../../Library/Card";
import { Label } from "../../Library/Label";
import { Textarea } from "../../Library/Textarea";
import { Switch } from "../../Library/Switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../Library/Select";
import { useToast } from "../../Library/use-toast";

import AppIcon from "../../Component/AppIcon";
import StepCard from "./StepCard";
import StepFormModal from "./StepFormModal";
import CryptoService from "../../Security/useCrypto";

import {
  Modules,
} from "../../Data/StaticData";
import { GetMasterDataForClientPortalWorkflowCreation, UpsertClientPortalWorkflowConfiguration } from "../../Store/FormBuilder/Action";
import { DEFAULT_STEP, DEFAULT_WORKFLOW_FORM } from "./workflowDefaults";
import Input from "../../Library/Input";
import { SweetSuccess } from "../../Component/SweetAlert";

/* =====================================================
   COMPONENT
===================================================== */
const WorkflowConfigurationForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const decryptedId = useMemo(
    () => (id ? CryptoService.decrypt(id) : null),
    [id]
  );

  const { Common } = useSelector((s) => s.Auth);
  const { data: workflowMasterData } = useSelector((s) => s.FormBuilderStore.ClientPortalWorkflowConfigurationMaster);
  const { data: workflowData, isLoading: workflowLoading } = useSelector((s) => s.FormBuilderStore.ClientPortalWorkflowConfiguration);


  const [form, setForm] = useState({
    ...DEFAULT_WORKFLOW_FORM,
    ClientPortalWorkflowProperties: [{ ...DEFAULT_STEP }],
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingStep, setEditingStep] = useState(null);

  /* =====================================================
     LOAD MASTER DATA
  ===================================================== */
  useEffect(() => {
    dispatch(
      GetMasterDataForClientPortalWorkflowCreation({
        ClientId: Common?.SelectedClientCode,
        ClientContractId: Common?.SelectedClientContractCode,
      })
    );
  }, [dispatch, Common]);

  /* =====================================================
     LOAD WORKFLOW DATA FOR EDITING
  ===================================================== */

  useEffect(() => {
    if (workflowData && workflowData.length > 0 && workflowMasterData && decryptedId) {
      const existingWorkflow = workflowData.find(w => w && w.Id === Number(decryptedId));
      if (existingWorkflow && (form.ModuleId === null || form.ModuleId === 0)) { // Only set if form is not already populated with existing data (Description is empty for new forms)
        setForm({
          Id: existingWorkflow?.Id || "",
          Name: existingWorkflow?.Name || "",
          Description: existingWorkflow?.Description || "",
          ModuleId: existingWorkflow?.ModuleId || 0,
          ModuleProcessId: existingWorkflow?.ModuleProcessId || 0,
          ModuleProcessActionId: existingWorkflow?.ModuleProcessActionId || 0,
          IsRuleBased: existingWorkflow?.IsRuleBased || false,
          IsRuleSetBased: existingWorkflow?.IsRuleSetBased || false,
          RuleId: existingWorkflow?.RuleId || 0,
          ActionBasedRuleSetId: existingWorkflow?.ActionBasedRuleSetId || 0,
          IsLetterGenerationRequired: existingWorkflow?.IsLetterGenerationRequired || false,
          IsEmailNotificationRequired: existingWorkflow?.IsEmailNotificationRequired || false,
          IsSmsNotificationRequired: existingWorkflow?.IsSmsNotificationRequired || false,
          ClientPortalWorkflowProperties: existingWorkflow?.ClientPortalWorkflowProperties || [],
          ClientId: existingWorkflow?.ClientId || Number(Common?.SelectedClientCode),
          ClientContractId: existingWorkflow?.ClientContractId || Number(Common?.SelectedClientContractCode),
        });
      }
      // console.log("existingWorkflow", existingWorkflow);
    } else if (!decryptedId) {
      // For new workflows, ensure form is reset to default
      setForm({
        ...DEFAULT_WORKFLOW_FORM,
        ClientId: Number(Common?.SelectedClientCode),
        ClientContractId: Number(Common?.SelectedClientContractCode),
      });
    } else {
      navigate("/workflow-config");
    }
  }, [workflowData, workflowMasterData, decryptedId, Common]);

  /* =====================================================
     HANDLERS
  ===================================================== */
  const updateForm = useCallback((key, value) => {
    setForm((p) => ({ ...p, [key]: value }));
  }, []);

  const moveStep = useCallback((from, to) => {
    setForm((p) => {
      const steps = [...p.ClientPortalWorkflowProperties];
      const temp = steps[from];
      steps[from] = steps[to];
      steps[to] = temp;

      return {
        ...p,
        ClientPortalWorkflowProperties: steps.map((s, i) => ({ ...s, FlowOrder: i + 1 })),
      };
    });
  }, []);

  /* =====================================================
     VALIDATION
  ===================================================== */
  const errors = useMemo(() => {
    const e = [];
    if (!form.Name) e.push("Name * required");
    if (!form.Description) e.push("Description * required");
    if (!form.ModuleId) e.push("Module * required");
    if (!form.ModuleProcessActionId) e.push("Module Process Action * required");

    if (form.IsRuleBased && !form.RuleId) e.push("Rule * required when Rule Based is enabled");
    if (form.IsRuleSetBased && !form.ActionBasedRuleSetId) e.push("Action Based Rule Set * required when Rule Set Based is enabled");

    if (!form.ClientPortalWorkflowProperties.length) e.push("At least one step required");

    form.ClientPortalWorkflowProperties.forEach((s, i) => {
      if (s.IsUserGroupBased) {
        if (!s.UserGroupCode) e.push(`Step ${i + 1}: User Group * required when User Group Based is enabled`);
      } else {
        if (!s.CurrentRoleCode) e.push(`Step ${i + 1}: Current Role * required`);
      }
      if (!s.ActionProcessingStatus) e.push(`Step ${i + 1}: Action Processing Status required`);
    });
    return e;
  }, [form]);

  /* =====================================================
     SUBMIT
  ===================================================== */
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (errors.length) {
        toast({
          title: "Validation Error",
          description: errors.join(", "),
          variant: "danger",
        });
        return;
      }
      try {
        const response = await dispatch(
          UpsertClientPortalWorkflowConfiguration(form)
        );
        if (response?.Status) {
          SweetSuccess({
            title: "Success",
            text: decryptedId ? "Workflow updated successfully!" : "Workflow created successfully!",
          });
          navigate("/workflow-config");
        } else {
          toast({
            title: "Error",
            description: response?.Message || "Save failed",
            variant: "danger",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Save failed",
          variant: "danger",
        });
      }
    },
    [errors, form, dispatch, toast, navigate]
  );

  /* =====================================================
     STEP CRUD
  ===================================================== */
  const saveStep = useCallback(
    (step) => {
      setForm((p) => {
        const steps = [...p.ClientPortalWorkflowProperties];
        if (editingStep) {
          const idx = steps.findIndex(
            (s) => s.FlowOrder === editingStep.FlowOrder
          );
          steps[idx] = step;
        } else {
          steps.push({ ...step, FlowOrder: steps.length + 1 });
        }
        return { ...p, ClientPortalWorkflowProperties: steps };
      });
      setModalOpen(false);
      setEditingStep(null);
    },
    [editingStep]
  );

  /* =====================================================
     RENDER
  ===================================================== */
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {/* HEADER */}
      <div className="md:flex space-y-4 items-center justify-between px-6 py-2 bg-gradient-to-r from-primary-500 to-indigo-600 rounded-t-2xl">
        <div className="flex items-center gap-3 text-white">
          <AppIcon name="Settings" size={26} />
          <div>
            <h2 className="text-lg font-semibold">Workflow Configuration</h2>
            <p className="text-xs opacity-80">
              Define workflow rules & approvals
            </p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <Button type="submit" disabled={workflowLoading}>Save</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setModalOpen(true)}
            icon={<AppIcon name={"Plus"} />}
          >
            New Step
          </Button>
          <Button type="button"
            variant="outline"
            onClick={() => navigate("/workflow-config")} >
            Cancel
          </Button>
        </div>
      </div>

      {/* FORM */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Basic Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={form.Name}
                  onChange={(e) => updateForm("Name", e.target.value)}
                  placeholder="Enter workflow name"
                />
              </div>
              {/* Module */}
              <div className="space-y-2">
                <Label className="">Module <span className="text-red-600"> *</span></Label>
                <Select
                  value={form.ModuleId?.toString() || ""}
                  onValueChange={(v) => {
                    updateForm("ModuleId", Number(v));
                    updateForm("ModuleProcessId", Number(v))
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select module" />
                  </SelectTrigger>
                  <SelectContent>
                    {Modules?.map((m) => (
                      <SelectItem key={`module-${m.value}`} value={m.value.toString()}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Module */}
              <div className="space-y-2">
                <Label className="">Module Process Action <span className="text-red-600"> *</span></Label>
                <Select
                  value={form.ModuleProcessActionId?.toString() || ""}
                  onValueChange={(v) => {
                    updateForm("ModuleProcessActionId", Number(v))
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select module" />
                  </SelectTrigger>
                  <SelectContent>
                    {[{ label: "None", value: 0 }, ...(workflowMasterData?.ModuleProcessActionDetailsList || [])].map((m) => (
                      <SelectItem key={`ModuleProcessActionDetailsList-${m.Id || m.value}`} value={(m.Id || m.value).toString()}>
                        {m.Description || m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Description */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Description <span className="text-red-600"> *</span></Label>
              <Textarea
                className="min-h-[110px] rounded-xl shadow-sm resize-none"
                value={form.Description}
                onChange={(e) => updateForm("Description", e.target.value)}
                placeholder="Enter workflow description..."
              />
            </div>

            {/* Feature Toggles Section */}
            <div className="">
              <h3 className="text-sm font-semibold mb-4 tracking-wide">
                Workflow Options
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {[
                  ["IsRuleBased", "Rule Based"],
                  ["IsRuleSetBased", "Rule Set Based"],
                  ["IsLetterGenerationRequired", "Letter Generation Required"],
                  ["IsSmsNotificationRequired", "SMS Notification Required"],
                  ["IsEmailNotificationRequired", "Email Notification Required"],
                ].map(([key, label]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between rounded-xl border bg-background px-4 py-2 hover:shadow-sm transition"
                  >
                    <Label className="text-sm font-medium">{label} {(key === "IsRuleBased" && form.IsRuleBased) || (key === "IsRuleSetBased" && form.IsRuleSetBased) ? <span className="text-red-600"> *</span> : null}</Label>
                    <Switch
                      checked={form[key]}
                      onCheckedChange={(v) => {
                        if (key === "IsRuleBased") {
                          setForm((p) => ({ ...p, IsRuleBased: v, IsRuleSetBased: v ? false : p.IsRuleSetBased, ActionBasedRuleSetId: v ? 0 : p.ActionBasedRuleSetId }));
                        } else if (key === "IsRuleSetBased") {
                          setForm((p) => ({ ...p, IsRuleSetBased: v, IsRuleBased: v ? false : p.IsRuleBased, RuleId: v ? 0 : p.RuleId }));
                        } else {
                          updateForm(key, v);
                        }
                      }}
                    />
                  </div>

                ))}
              </div>
              {form.IsRuleBased && (
                <div className="mt-2 space-y-1">
                  <Label>Rule {form.IsRuleBased && !form.IsRuleSetBased && <span className="text-red-600"> *</span>}</Label>
                  <Select
                    value={form.RuleId?.toString() || ""}
                    onValueChange={(value) => updateForm("RuleId", value ? Number(value) : 0)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Rule" />
                    </SelectTrigger>
                    <SelectContent>
                      {[{ label: "None", value: 0 }, ...(workflowMasterData?.RuleDetails || [])].map((ruleDetails) => (
                        <SelectItem key={`rule-${ruleDetails.RuleId || ruleDetails.value}`} value={(ruleDetails.RuleId || ruleDetails.value).toString()}>
                          {ruleDetails.Code || ruleDetails.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {form.IsRuleSetBased && (
                <div className="mt-2 space-y-1">
                  <Label>Action Based Rule Set {!form.IsRuleBased && form.IsRuleSetBased && <span className="text-red-600"> *</span>}</Label>
                  <Select
                    value={form.ActionBasedRuleSetId?.toString() || ""}
                    onValueChange={(value) => updateForm("ActionBasedRuleSetId", value ? Number(value) : 0)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Rule Set" />
                    </SelectTrigger>
                    <SelectContent>
                      {[{ Name: "None", RulesetId: 0 }, ...(workflowMasterData?.RuleSetDetails || [])]?.map((ruleSet) => (
                        <SelectItem key={`ruleset-${ruleSet.RulesetId}`} value={ruleSet?.RulesetId.toString()}>
                          {ruleSet.Name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

            </div>

          </CardContent>

        </Card>

        {/* STEPS */}
        {form.ClientPortalWorkflowProperties.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Workflow Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {form.ClientPortalWorkflowProperties.map((step, i) => (
                <StepCard
                  key={i}
                  step={step}
                  roles={workflowMasterData?.Roles || []}
                  userGroups={workflowMasterData?.UserGroups || []}
                  emailTemplates={workflowMasterData?.EmailTemplateDetails || []}
                  smsTemplates={workflowMasterData?.SMSTemplateDetails || []}
                  letterTemplates={workflowMasterData?.TemplateDetails || []}
                  isFirst={i === 0}
                  isLast={i === form.ClientPortalWorkflowProperties.length - 1}
                  onEdit={() => {
                    setEditingStep(step);
                    setModalOpen(true);
                  }}
                  onDelete={() =>
                    setForm((p) => ({
                      ...p,
                      ClientPortalWorkflowProperties: p.ClientPortalWorkflowProperties.filter((_, x) => x !== i),
                    }))
                  }
                  onMoveUp={() => moveStep(i, i - 1)}
                  onMoveDown={() => moveStep(i, i + 1)}
                />
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* MODAL */}
      <StepFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingStep(null);
        }}
        initial={editingStep}
        onSave={saveStep}
        existingOrders={form.ClientPortalWorkflowProperties.map((s) => s.FlowOrder)}
        roles={workflowMasterData?.Roles || []}
        userGroups={workflowMasterData?.UserGroups || []}
        emailTemplates={workflowMasterData?.EmailTemplateDetails || []}
        smsTemplates={workflowMasterData?.SMSTemplateDetails || []}
        letterTemplates={workflowMasterData?.TemplateDetails || []}
        isLetterRequired={form.IsLetterGenerationRequired}
        isSmsRequired={form.IsSmsNotificationRequired}
        isEmailRequired={form.IsEmailNotificationRequired}
      />
    </form>
  );
};

export default WorkflowConfigurationForm;
