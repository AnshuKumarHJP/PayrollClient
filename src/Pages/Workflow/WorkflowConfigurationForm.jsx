import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Button } from "../../Lib/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../Lib/card";
import { Input } from "../../Lib/input";
import { Label } from "../../Lib/label";
import { Textarea } from "../../Lib/textarea";
import { useToast } from "../../Lib/use-toast";
import AppIcon from "../../Component/AppIcon";
import RoleSelect from "../../Component/RoleSelect";
import { SweetSuccess } from "../../Component/SweetAlert";
import StepCard from "./StepCard";
import StepFormModal from "./StepFormModal";

import {
  STATIC_WORKFLOWS,
  STATIC_WORKFLOW_DETAILS,
  STATIC_ROLES,
} from "../../Data/StaticData";

/* =====================================================
   DEFAULT FORM
===================================================== */
const defaultForm = {
  WorkflowCode: null,
  WorkflowName: "",
  Description: "",
  Steps: [
    {
      StepOrder: 1,
      StepName: "",
      ApproverRoleCode: "",
      EscalationTo: "",
      EscalationHours: "",
    },
  ],
};

const WorkflowConfigurationForm = ({ id, onSave, onCancel }) => {
  const { toast } = useToast();
  const [form, setForm] = useState(defaultForm);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStep, setEditingStep] = useState(null);

  /* =====================================================
     LOAD DATA FOR EDIT (Id PRESENT)
  ===================================================== */
  useEffect(() => {
    if (!id) {
      setForm(defaultForm);
      return;
    }

    const workflow = STATIC_WORKFLOW_DETAILS[id];
    if (!workflow) return;

    setForm({
      WorkflowCode: workflow.Header.WorkflowCode ?? null,
      WorkflowName: workflow.Header.WorkflowName ?? "",
      Description: workflow.Header.Description ?? "",
      Steps: workflow.Details ?? [
        {
          StepOrder: 1,
          StepName: "",
          ApproverRoleCode: "",
          EscalationTo: "",
          EscalationHours: "",
        },
      ],
    });
  }, [id]);

  /* =====================================================
     HANDLERS
  ===================================================== */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }, []);

  const addStep = useCallback(() => {
    setEditingStep(null);
    setIsModalOpen(true);
  }, []);

  const updateStep = useCallback((index, key, value) => {
    setForm((p) => {
      const steps = [...p.Steps];
      steps[index] = { ...steps[index], [key]: value };
      return { ...p, Steps: steps };
    });
  }, []);

  const removeStep = useCallback((index) => {
    setForm((p) => ({
      ...p,
      Steps: p.Steps.filter((_, i) => i !== index).map((step, i) => ({
        ...step,
        StepOrder: i + 1,
      })),
    }));
  }, []);

  const moveStepUp = useCallback((index) => {
    if (index === 0) return;
    setForm((p) => {
      const steps = [...p.Steps];
      [steps[index - 1], steps[index]] = [steps[index], steps[index - 1]];
      steps[index - 1].StepOrder = index;
      steps[index].StepOrder = index + 1;
      return { ...p, Steps: steps };
    });
  }, []);

  const moveStepDown = useCallback((index) => {
    if (index === form.Steps.length - 1) return;
    setForm((p) => {
      const steps = [...p.Steps];
      [steps[index], steps[index + 1]] = [steps[index + 1], steps[index]];
      steps[index].StepOrder = index + 1;
      steps[index + 1].StepOrder = index + 2;
      return { ...p, Steps: steps };
    });
  }, []);

  /* =====================================================
     VALIDATION
  ===================================================== */
  const errors = useMemo(() => {
    const e = [];
    if (!form.WorkflowName.trim()) e.push("Workflow Name is required");

    form.Steps.forEach((step, i) => {
      if (!step.StepName.trim()) {
        e.push(`Step ${i + 1}: Step Name is required`);
      }
      if (!step.ApproverRoleCode) {
        e.push(`Step ${i + 1}: Approver Role is required`);
      }
      if ((step.EscalationTo && !step.EscalationHours) || (!step.EscalationTo && step.EscalationHours)) {
        e.push(`Step ${i + 1}: Both Escalation Role and Hours must be provided together`);
      }
    });

    // Check for duplicate step names
    const stepNames = form.Steps.map((s) => s.StepName.trim()).filter((name) => name);
    const duplicateNames = stepNames.filter((name, index) => stepNames.indexOf(name) !== index);
    if (duplicateNames.length > 0) {
      e.push(`Duplicate step names found: ${duplicateNames.join(", ")}`);
    }

    // Check for consecutive same roles
    for (let i = 1; i < form.Steps.length; i++) {
      if (form.Steps[i].ApproverRoleCode === form.Steps[i - 1].ApproverRoleCode) {
        e.push(`Step ${i + 1}: Same role cannot approve consecutively`);
      }
    }

    return e;
  }, [form]);

  /* =====================================================
     SUBMIT (UPSERT)
  ===================================================== */
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (errors.length) {
        toast({
          title: "Validation Error",
          description: errors.join(", "),
          variant: "destructive",
        });
        return;
      }

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        SweetSuccess({
          title: form.WorkflowCode ? "Updated" : "Created",
          text: `Workflow ${form.WorkflowCode ? "updated" : "created"} successfully.`,
        });
        onSave?.(form);
      } catch (err) {
        toast({
          title: "Error",
          description: err.message || "Save failed",
          variant: "destructive",
        });
      }
    },
    [form, errors, toast, onSave]
  );

  /* =====================================================
     MODAL HANDLERS
  ===================================================== */
  const openEditModal = useCallback((step) => {
    setEditingStep(step);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingStep(null);
  }, []);

  const handleSaveStep = useCallback((stepData) => {
    setForm((prev) => {
      const steps = [...prev.Steps];
      if (editingStep) {
        // Edit existing step
        const index = steps.findIndex((s) => s.StepOrder === editingStep.StepOrder);
        if (index !== -1) {
          steps[index] = { ...stepData };
        }
      } else {
        // Add new step at the end
        steps.push({
          ...stepData,
          StepOrder: steps.length + 1,
        });
      }
      return { ...prev, Steps: steps };
    });
    closeModal();
  }, [editingStep, closeModal]);

  const handleDeleteStep = useCallback((stepOrder) => {
    setForm((prev) => ({
      ...prev,
      Steps: prev.Steps.filter((s) => s.StepOrder !== stepOrder).map((step, i) => ({
        ...step,
        StepOrder: i + 1,
      })),
    }));
  }, []);

  /* =====================================================
     UTILITY FUNCTIONS
  ===================================================== */
  const getRoleName = useCallback((roleCode) => {
    const role = STATIC_ROLES.find((r) => r.RoleCode === roleCode);
    return role ? role.Role_Name : roleCode;
  }, []);

  /* =====================================================
     RENDER
  ===================================================== */
  return (
    <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between border-b bg-gradient-to-r from-blue-400 to-indigo-400">
        <div>
          <h2 className="text-sm sm:text-xl font-semibold text-white flex items-center gap-2">
            <AppIcon name={"Settings"} size={30} /> Workflow Configuration
          </h2>
          <p className="text-green-100 text-xs sm:text-sm">
            Configure workflow processes and approval steps
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="submit">
            {form.WorkflowCode ? "Update Workflow" : "Create Workflow"}
          </Button>
           <Button type="button" variant="outline" onClick={addStep}>
                <AppIcon name="Plus" className="w-4 h-4 mr-2" />
                Add Step
              </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 p-4 sm:p-6">
        {/* BASIC INFO */}
        <Card>
          <CardHeader>
            <CardTitle>
              {form.WorkflowCode ? "Edit Workflow" : "Create Workflow"}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Workflow Name</Label>
              <Input
                name="WorkflowName"
                placeholder="Enter workflow name"
                value={form.WorkflowName}
                onChange={handleChange}
              />
            </div>
            <div className="md:col-span-2">
              <Label>Description</Label>
              <Textarea
                name="Description"
                placeholder="Enter workflow description"
                value={form.Description}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* STEPS */}
        <div className="space-y-2">
          {form.Steps.map((step, i) => (
            <StepCard
              key={step.StepOrder}
              step={step}
              onEdit={() => openEditModal(step)}
              onDelete={() => handleDeleteStep(step.StepOrder)}
              onMoveUp={() => moveStepUp(i)}
              onMoveDown={() => moveStepDown(i)}
              isFirst={i === 0}
              isLast={i === form.Steps.length - 1}
              getRoleName={getRoleName}
            />
          ))}
        </div>

        {/* FOOTER */}

      </form>

      {/* STEP FORM MODAL */}
      <StepFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        initial={editingStep}
        onSave={handleSaveStep}
        existingOrders={form.Steps.map((s) => s.StepOrder)}
        existingNames={form.Steps.map((s) => s.StepName)}
      />
    </div>
  );
};

export default WorkflowConfigurationForm;
