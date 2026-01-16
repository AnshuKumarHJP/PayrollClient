import React from "react";
import { ClipboardList } from "lucide-react";
import { Button } from "../Lib/button";
import { Card, CardContent, CardHeader, CardTitle } from "../Lib/card";
import { Label } from "../Lib/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../Lib/dialog";
import StepCard from "./StepCard";

function ViewWorkflowModal({ isOpen, onClose, viewingWorkflow, getRoleName }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>View Workflow: {viewingWorkflow?.WorkflowName}</DialogTitle>
        </DialogHeader>

        {viewingWorkflow && (
          <div className="space-y-6">
            {/* Workflow Header */}
            <Card>
              <CardHeader>
                <CardTitle>Workflow Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Workflow Code</Label>
                    <p className="text-sm text-muted-foreground">{viewingWorkflow.WorkflowCode}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Workflow Name</Label>
                    <p className="text-sm text-muted-foreground">{viewingWorkflow.WorkflowName}</p>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-sm font-medium">Description</Label>
                    <p className="text-sm text-muted-foreground">{viewingWorkflow.Description || 'No description'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Workflow Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Workflow Steps ({viewingWorkflow.steps?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent>
                {viewingWorkflow.steps && viewingWorkflow.steps.length > 0 ? (
                  <div className="space-y-4">
                    {viewingWorkflow.steps.map((step, index) => (
                      <StepCard
                        key={`${step.StepOrder}-${index}`}
                        step={step}
                        onEdit={() => {}} // Disabled in view mode
                        onDelete={() => {}} // Disabled in view mode
                        onMoveUp={() => {}} // Disabled in view mode
                        onMoveDown={() => {}} // Disabled in view mode
                        isFirst={index === 0}
                        isLast={index === viewingWorkflow.steps.length - 1}
                        getRoleName={getRoleName}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ClipboardList className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No steps defined for this workflow.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex gap-3 justify-end pt-4">
          <Button onClick={onClose} variant="outline">Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ViewWorkflowModal;