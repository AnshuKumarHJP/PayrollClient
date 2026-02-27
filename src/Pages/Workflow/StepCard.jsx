
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../Library/Card";
import { Badge } from "../../Library/Badge";
import { Button } from "../../Library/Button";
import AppIcon from "../../Component/AppIcon";
import { ClientPortalWorkflowStatus } from "../../Data/StaticData";


const PropertyItem = ({ label, value, icon, variant = "default" }) => (
  <div className="flex items-center gap-2 text-sm">
    {icon && <AppIcon name={icon} className="w-4 h-4 text-muted-foreground dark:text-muted-foreground" />}
    <span className="text-muted-foreground dark:text-muted-foreground font-medium">{label} :</span>
    <span className={`px-2 py-0.5 rounded-full font-medium ${variant === "success" ? "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-xs" : variant === "warning" ? "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-xs" : variant === "danger" ? "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-xs" : "text-gray-900 dark:text-gray-100 text-[13px]"}`}>
      {value}
    </span>
  </div>
);

function StepCard({
  step,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  roles = [],
  userGroups = [],
  emailTemplates = [],
  smsTemplates = [],
  letterTemplates = []
}) {
  const isGroup = step.IsUserGroupBased;

  const nextRoleLabel =
    roles?.find((r) => r.Id === Number(step.NextRoleCode))?.Code ||
    step.NextRoleCode;

  const currentEntity =
    roles?.find((r) => r.Id === Number(step.CurrentRoleCode))?.Code ||
    step.CurrentRoleCode;

  const userGroupLabel =
    userGroups?.find((r) => r.Id === Number(step.UserGroupCode))?.Code ||
    step.UserGroupCode;

  const ClientPortalWorkflowLabel = (code) => {
    const status = ClientPortalWorkflowStatus?.find(s => s.value === code)?.label;
    return status || code;
  }

  const letterTemplatesLabel =
    letterTemplates?.find((r) => r.TemplateId === Number(step.LetterTemplateId))?.Name ||
    "No Template Selected";

  const emailTemplatesLabel =
    emailTemplates?.find((r) => r.TemplateId === Number(step.EmailTemplateId))?.Name ||
    "No Template Selected";

  const SmsTemplatesLabel =
    smsTemplates?.find((r) => r.TemplateId === Number(step.SmsTemplateId))?.Code ||
    "No Template Selected";

  return (
    <Card className="relative rounded border-0 bg-white dark:bg-gray-800 hover:shadow-lg dark:hover:shadow-xl transition-all duration-200">
      {/* LEFT TIMELINE BAR */}
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-l-xl" />

      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* STEP NUMBER */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-200 dark:border-indigo-700 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-lg">
                {step.FlowOrder}
              </div>

            </div>

            {/* MAIN INFO */}
            <div className="space-y-1">
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                {currentEntity || "Unassigned"}
                {isGroup ? (
                  <>
                    <AppIcon name="Users" className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <Badge variant="info" size="xs" className="text-xs px-2 py-0.5">
                      Group Based
                    </Badge>
                  </>
                ) : (
                  <>
                    <AppIcon name="User" className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <Badge variant="info" size="xs" className="text-xs px-2 py-0.5">
                      Indivisual
                    </Badge>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              title="Move up"
              type="button"
              onClick={onMoveUp}
              disabled={isFirst}
              className={`p-2 ${isFirst ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
            >
              <AppIcon name="ArrowUp" className="w-4 h-4" />
            </Button>

            <Button
              size="sm"
              variant="ghost"
              title="Move down"
              type="button"
              onClick={onMoveDown}
              disabled={isLast}
              className={`p-2 ${isLast ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
            >
              <AppIcon name="ArrowDown" className="w-4 h-4" />
            </Button>

            <div className="w-px h-6 bg-gray-200 dark:bg-gray-600 mx-2" />

            <Button
              size="sm"
              variant="ghost"
              title="Edit"
              type="button"
              onClick={onEdit}
              className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
            >
              <AppIcon name="Edit" className="w-4 h-4" />
            </Button>

            <Button
              size="sm"
              variant="ghost"
              title="Delete"
              type="button"
              onClick={onDelete}
              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
            >
              <AppIcon name="Trash2" className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* ROLE INFORMATION */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <AppIcon name="UserCheck" className="w-4 h-4" />
              Role Information
            </h4>
            <div className="space-y-2">
              <PropertyItem
                label="Current Role"
                value={currentEntity}
                icon={"User"}
              />
              <PropertyItem
                label="Next Role"
                value={nextRoleLabel}
                icon={"ArrowRight"}
              />
              <PropertyItem
                label="Is User Group Based"
                value={step.IsUserGroupBased ? "Yes" : "No"}
                icon={"Users"}
                variant={step.IsUserGroupBased ? "success" : "default"}
              />
              {step.IsUserGroupBased && (
                <PropertyItem
                  label="User Group"
                  value={userGroupLabel}
                  icon={"Users"}
                />
              )}
            </div>
          </div>

          {/* STATUS INFORMATION */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <AppIcon name="Info" className="w-4 h-4" />
              Status Information
            </h4>
            <div className="space-y-2">
              <PropertyItem
                label="Action Processing Status"
                value={ClientPortalWorkflowLabel(step?.ActionProcessingStatus)}
                icon={"CheckCircle"}
                variant="success"
              />
              <PropertyItem
                label="Next Action Status"
                value={ClientPortalWorkflowLabel(step?.NextActionProcessingStatus)}
                icon={"CheckCircle"}
                variant="warning"
              />
              <PropertyItem
                label="Failure Action Status"
                value={ClientPortalWorkflowLabel(step?.FailureActionProcessingStatus)}
                icon={"XCircle"}
                variant="danger"
              />
            </div>
          </div>

          {/* COMMUNICATION & TEMPLATES */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <AppIcon name="Mail" className="w-4 h-4" />
              Communication
            </h4>
            <div className="space-y-2">
              {step.LetterTemplateId && (
                <div className="grid grid-cols-[auto_auto_1fr] items-start gap-x-2 text-sm">
                  <AppIcon name="FileText" className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />

                  {/* LABEL (NO WRAP EVER) */}
                  <span className="text-muted-foreground dark:text-muted-foreground whitespace-nowrap">
                    Letter Template :
                  </span>

                  {/* VALUE (CAN WRAP) */}
                  <span className="font-semibold text-blue-600 dark:text-blue-400 break-words min-w-0">
                    {letterTemplatesLabel}
                  </span>
                </div>
              )}

              {step.EmailTemplateId && (
                <div className="grid grid-cols-[auto_auto_1fr] items-start gap-x-2 text-sm">
                  <AppIcon name="Mail" className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5" />
                  <span className="text-muted-foreground dark:text-muted-foreground whitespace-nowrap">
                    Email Template :
                  </span>
                  <span className="font-semibold text-green-600 dark:text-green-400 break-words min-w-0">
                    {emailTemplatesLabel}
                  </span>
                </div>
              )}

              {step.SmsTemplateId && (
                <div className="grid grid-cols-[auto_auto_1fr] items-start gap-x-2 text-sm">
                  <AppIcon name="MessageSquare" className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5" />
                  <span className="text-muted-foreground dark:text-muted-foreground whitespace-nowrap">
                    SMS Template :
                  </span>
                  <span className="font-semibold text-purple-600 dark:text-purple-400 break-words min-w-0">
                    {SmsTemplatesLabel}
                  </span>
                </div>
              )}

              {step.Metadata && (
                <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-xs text-muted-foreground dark:text-muted-foreground font-medium mb-1 whitespace-nowrap">
                    Metadata :
                  </div>
                  <div className="text-xs font-mono text-gray-700 dark:text-gray-300 break-all">
                    {typeof step.Metadata === "string"
                      ? step.Metadata
                      : JSON.stringify(step.Metadata, null, 2)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* NEXT ENTITY */}
        {nextRoleLabel && (
          <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-700">
            <div className="flex items-center gap-2 text-sm">
              <AppIcon name="ArrowRight" className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-muted-foreground dark:text-muted-foreground font-medium">Next Entity:</span>
              <span className="font-semibold text-indigo-700 dark:text-indigo-300">{nextRoleLabel}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default StepCard;
