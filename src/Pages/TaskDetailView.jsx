import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../Lib/card";
import { Button } from "../Lib/button";
import { Badge } from "../Lib/badge";
import { Textarea } from "../Lib/textarea";
import { Alert, AlertDescription } from "../Lib/alert";
import { Separator } from "../Lib/separator";
import { CheckCircle, Clock, AlertTriangle, User, FileText, MessageSquare, ArrowLeft,Loader2 } from "lucide-react";
import { useToast } from "../Lib/use-toast";
import { workflowService } from "../../api/services/workflowService";

const TaskDetailView = () => {
  const { id } = useParams();
  const [comments, setComments] = useState("");
  const [action, setAction] = useState("");
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchTaskDetails();
    }
  }, [id]);

  const fetchTaskDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const taskData = await workflowService.getTaskById(id);
      setTask(taskData);
    } catch (err) {
      setError('Failed to fetch task details');
      toast({
        title: 'Error',
        description: 'Failed to fetch task details. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  const statusConfig = {
    pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock, label: "Pending" },
    pending_action: { color: "bg-yellow-100 text-yellow-800", icon: Clock, label: "Pending Action" },
    in_review: { color: "bg-blue-100 text-blue-800", icon: User, label: "In Review" },
    approved: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Approved" },
    rejected: { color: "bg-red-100 text-red-800", icon: AlertTriangle, label: "Rejected" }
  };

  const priorityConfig = {
    high: { color: "bg-red-100 text-red-800", label: "High" },
    medium: { color: "bg-yellow-100 text-yellow-800", label: "Medium" },
    low: { color: "bg-green-100 text-green-800", label: "Low" }
  };

  const handleAction = useCallback((actionType) => {
    setAction(actionType);
    // In a real app, this would submit the action
    alert(`Task ${actionType} action would be processed with comments: ${comments}`);
  }, [comments]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading task details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchTaskDetails}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">Task not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const taskInfo = useMemo(() => {
    if (!task) return null;
    const statusInfo = statusConfig[task.status];
    const priorityInfo = priorityConfig[task.priority];
    const validationPercentage = Math.round((task.validationResults.checks.filter(check => check.status === 'valid').length / task.validationResults.checks.length) * 100);
    return {
      statusInfo,
      priorityInfo,
      StatusIcon: statusInfo.icon,
      validationPercentage
    };
  }, [task]);

  return (
    <div className="p-2">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="success"  onClick={() => navigate('/workflow/tasks')}>
          <ArrowLeft size={16} className="mr-2" />
          Back to Tasks
        </Button>
        <div className="flex items-center gap-2">
          <FileText size={24} />
          <h1 className="text-2xl font-bold">Task Details</h1>
        </div>
      </div>

      {/* Task Overview */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{task.title}</CardTitle>
            <div className="flex gap-2">
              <Badge className={taskInfo.priorityInfo.color}>
                {taskInfo.priorityInfo.label} Priority
              </Badge>
              <Badge className={taskInfo.statusInfo.color}>
                <taskInfo.StatusIcon size={12} className="mr-1" />
                {taskInfo.statusInfo.label}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Task Type</p>
              <p className="font-medium capitalize">{task.type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Due Date</p>
              <p className="font-medium">{task.dueDate}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Created Date</p>
              <p className="font-medium">{new Date(task.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Validation Status</p>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${taskInfo.validationPercentage}%` }}
                  ></div>
                </div>
                <span className="text-sm">{taskInfo.validationPercentage}%</span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">Description</p>
            <p>{task.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Employee Data */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Employee Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(task.employeeData).map(([key, value]) => (
              <div key={key}>
                <p className="text-sm font-medium text-gray-600 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="font-medium">{value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Validation Results */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Validation Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {task.validationResults.checks.map((check, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`w-3 h-3 rounded-full mt-1 ${
                  check.status === 'valid' ? 'bg-green-500' :
                  check.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{check.field}</span>
                    <Badge className={`text-xs ${
                      check.status === 'valid' ? 'bg-green-100 text-green-800' :
                      check.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {check.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{check.message}</p>
                </div>
              </div>
            ))}
          </div>
          {task.validationResults.warnings && task.validationResults.warnings.length > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="text-sm font-medium text-yellow-800 mb-2">Warnings:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                {task.validationResults.warnings.map((warning, index) => (
                  <li key={index}>• {warning}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Panel */}
      {task.status === "pending" && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Take Action</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comments (Optional)
                </label>
                <Textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Add any comments or notes about this task..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => handleAction("approve")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle size={16} className="mr-2" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleAction("reject")}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <AlertTriangle size={16} className="mr-2" />
                  Reject
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleAction("send_back")}
                >
                  <Clock size={16} className="mr-2" />
                  Send Back
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare size={20} />
            Comments & Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <User size={16} className="text-gray-500" />
                <span className="font-medium">HR Manager</span>
                <span className="text-sm text-gray-500">2 hours ago</span>
              </div>
              <p className="text-gray-700">Employee data looks good. All required fields are filled and information appears accurate.</p>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <User size={16} className="text-gray-500" />
                <span className="font-medium">Data Processor</span>
                <span className="text-sm text-gray-500">1 day ago</span>
              </div>
              <p className="text-gray-700">Validated employee information against HR system. No discrepancies found.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default React.memo(TaskDetailView);
