import React from "react";
import { ArrowUp, ArrowDown, Edit, Trash2 } from "lucide-react";
import { Card, CardContent } from "../../Library/Card";
import { Badge, IconButton } from "../../Component/CommonComponents";


function StepCard({ step, onEdit, onDelete, onMoveUp, onMoveDown, isFirst, isLast, getRoleName }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge>#{step.StepOrder}</Badge>
            <div>
              <div className="font-semibold text-foreground">{step.StepName}</div>
              <div className="text-sm text-muted-foreground">
                • {getRoleName(step.ApproverRoleCode)}
                {step.IsMandatory && <span className="ml-2 text-red-600">• Required</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <IconButton title="Move up" onClick={onMoveUp} className={isFirst ? "opacity-50 cursor-not-allowed" : ""}>
              <ArrowUp className="w-4 h-4" />
            </IconButton>
            <IconButton title="Move down" onClick={onMoveDown} className={isLast ? "opacity-50 cursor-not-allowed" : ""}>
              <ArrowDown className="w-4 h-4" />
            </IconButton>
            <IconButton title="Edit" onClick={onEdit}>
              <Edit className="w-4 h-4" />
            </IconButton>
            <IconButton title="Delete" onClick={onDelete} className="hover:bg-destructive hover:text-destructive-foreground">
              <Trash2 className="w-4 h-4" />
            </IconButton>
          </div>
        </div>

        {(step.Conditions || step.EscalationTo || step.EscalationHours) && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="text-xs text-muted-foreground space-y-1">
              {step.Conditions && <div>Conditions : {step.Conditions}</div>}
              {step.EscalationTo && <div>Escalation to Role : {getRoleName(step.EscalationTo)}</div>}
              {step.EscalationHours && <div>Escalation after : {step.EscalationHours} hours</div>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default StepCard;