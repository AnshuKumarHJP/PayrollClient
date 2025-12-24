import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../Lib/card";
import { Button } from "../Lib/button";
import { Input } from "../Lib/input";
import { Label } from "../Lib/label";
import { Textarea } from "../Lib/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Lib/select";
import { Badge } from "../Lib/badge";
import { Alert, AlertDescription } from "../Lib/alert";
import { Separator } from "../Lib/separator";
import { CheckCircle, XCircle, Clock, MessageSquare, FileText, User, ArrowLeft } from "lucide-react";
import { useToast } from "../Lib/use-toast";
import taskActionService from "../../api/services/taskActionService";

const TaskActionScreen = () => {
  const [action, setAction] = useState("");
  const [comments, setComments] = useState("");
  const [sendBackReason, setSendBackReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTaskForAction();
  }, []);

  const fetchTaskForAction = async () => {
    try {
      setLoading(true);
      setError(null);
      // For now, using a hardcoded task ID. In a real app, this would come from URL params
      const taskData = await taskActionService.getTaskForAction(1);
      setTask(taskData);
    } catch (err) {
      setError('Failed to fetch task for action');
      toast({
        title: 'Error',
        description: 'Failed to fetch task for action. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const actionOptions = [
    { value: "approve", label: "Approve", icon: CheckCircle, color: "text-green-600", description: "Approve this task and move to next stage" },
    { value: "reject", label: "Reject", icon: XCircle, color: "text-red-600", description: "Reject this task with reason" },
    { value: "send_back", label: "Send Back", icon: Clock, color: "text-yellow-600", description: "Send back for corrections" }
  ];

  const sendBackReasons = [
    "Incomplete information",
    "Incorrect data format",
    "Missing required documents",
    "Data validation failed",
    "Policy violation",
    "Other (specify in comments)"
  ];

  const handleSubmit = useCallback(async () => {
    if (!action) {
      alert("Please select an action");
      return;
    }

    if (action === "reject" && !comments.trim()) {
      alert("Please provide rejection reason");
      return;
    }

    if (action === "send_back" && !sendBackReason) {
      alert("Please select a reason for sending back");
      return;
    }

    setIsSubmitting(true);

    try {
      const actionData = {
        action,
        comments,
        sendBackReason: action === "send_back" ? sendBackReason : null
      };

      await taskActionService.submitTaskAction(task.id, actionData);

      toast({
        title: 'Success',
        description: `Task ${action} action completed successfully!`,
      });

      // In a real app, this would redirect or update the task list
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to submit task action. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [action, comments, sendBackReason, task, toast]);

  const getValidationStatusColor = (status) => {
    switch (status) {
      case "valid": return "text-green-600";
      case "warning": return "text-yellow-600";
      case "error": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const selectedAction = actionOptions.find(opt => opt.value === action);

  if (loading) {
    return (
      <div className="p-2">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading task details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-2">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <XCircle size={48} className="text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Task</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchTaskForAction}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="p-2">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <FileText size={48} className="text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Task Not Found</h2>
            <p className="text-gray-600">The requested task could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="success">
          <ArrowLeft size={16} className="mr-2" />
          Back to Tasks
        </Button>
        <div className="flex items-center gap-2">
          <FileText size={24} />
          <h1 className="text-2xl font-bold">Task Action</h1>
        </div>
      </div>

      {/* Task Overview */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{task.title}</CardTitle>
            <Badge className="bg-yellow-100 text-yellow-800">
              <Clock size={12} className="mr-1" />
              Pending Action
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Task Type</p>
              <p className="font-medium capitalize">{task.type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Priority</p>
              <Badge className="bg-red-100 text-red-800">High Priority</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Due Date</p>
              <p className="font-medium">{task.dueDate}</p>
            </div>
          </div>
          <p className="text-gray-600">{task.description}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employee Data Review */}
        <Card>
          <CardHeader>
            <CardTitle>Employee Data Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(task.employeeData).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                  <span className="text-gray-700">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Validation Results */}
        <Card>
          <CardHeader>
            <CardTitle>Validation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {task.validationResults.checks.map((check, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle size={16} className={`flex-shrink-0 ${getValidationStatusColor(check.status)}`} />
                  <div>
                    <p className="font-medium">{check.field}</p>
                    <p className="text-sm text-gray-600">{check.message}</p>
                  </div>
                </div>
              ))}

              {task.validationResults.warnings.length > 0 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">Warnings:</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {task.validationResults.warnings.map((warning, index) => (
                      <li key={index}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Selection */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Select Action</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {actionOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = action === option.value;

              return (
                <div
                  key={option.value}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setAction(option.value)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon size={20} className={option.color} />
                    <span className="font-medium">{option.label}</span>
                  </div>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
              );
            })}
          </div>

          {selectedAction && (
            <div className="border-t pt-6">
              <div className="space-y-4">
                {action === "send_back" && (
                  <div>
                    <Label htmlFor="sendBackReason">Reason for sending back *</Label>
                    <Select value={sendBackReason} onValueChange={setSendBackReason}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a reason" />
                      </SelectTrigger>
                      <SelectContent>
                        {sendBackReasons.map((reason) => (
                          <SelectItem key={reason} value={reason}>
                            {reason}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label htmlFor="comments">
                    Comments {action === "reject" ? "*" : "(Optional)"}
                  </Label>
                  <Textarea
                    id="comments"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder={
                      action === "approve" ? "Add approval notes..." :
                      action === "reject" ? "Explain rejection reason..." :
                      "Add any additional comments..."
                    }
                    rows={4}
                    className="mt-1"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !action}
                    className="px-8"
                  >
                    {isSubmitting ? "Submitting..." : `Submit ${selectedAction.label}`}
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setAction("");
                    setComments("");
                    setSendBackReason("");
                  }}>
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Summary */}
      {selectedAction && (
        <Alert className="mt-6">
          <selectedAction.icon className={`h-4 w-4 ${selectedAction.color}`} />
          <AlertDescription>
            <strong>Action Preview:</strong> You are about to {selectedAction.label.toLowerCase()} this task.
            {action === "reject" && " This will stop the workflow and notify the requester."}
            {action === "send_back" && " This will return the task for corrections."}
            {action === "approve" && " This will move the task to the next stage in the workflow."}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default React.memo(TaskActionScreen);
