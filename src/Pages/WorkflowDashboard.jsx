import { useState, useEffect, useMemo, useCallback } from "react";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../Lib/card";
import { Button } from "../Lib/button";
import { Badge } from "../Lib/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../Lib/tabs";
import { Workflow, Clock, CheckCircle, AlertCircle, Users, Loader2 } from "lucide-react";
import workflowDashboardService from "../../api/services/workflowDashboardService";
import { useToast } from "../Lib/use-toast";

const WorkflowDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchWorkflowTasks();
  }, []);

  const fetchWorkflowTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await workflowDashboardService.getAllWorkflowTasks();
      setTasks(data);
    } catch (err) {
      setError('Failed to fetch workflow tasks');
      toast({
        title: 'Error',
        description: 'Failed to fetch workflow tasks. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: "secondary", color: "bg-yellow-100 text-yellow-800", icon: Clock },
      approved: { variant: "default", color: "bg-green-100 text-green-800", icon: CheckCircle },
      rejected: { variant: "destructive", color: "bg-red-100 text-red-800", icon: AlertCircle }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon size={12} className="mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800"
    };

    return (
      <Badge className={priorityConfig[priority] || priorityConfig.medium}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const pendingTasks = tasks.filter(task => task.status === "pending");
  const approvedTasks = tasks.filter(task => task.status === "approved");
  const rejectedTasks = tasks.filter(task => task.status === "rejected");

  return (
    <div className="p-2">
      <div className="flex items-center gap-2 mb-6">
        <Workflow size={24} />
        <h1 className="text-2xl font-bold">Workflow Dashboard</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold">{tasks.length}</p>
              </div>
              <Workflow className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingTasks.length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{approvedTasks.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{rejectedTasks.length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingTasks.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedTasks.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedTasks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium">{task.employeeName}</p>
                        <p className="text-sm text-gray-600">{task.type} - {task.employeeId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{task.stage}</p>
                        <p className="text-sm text-gray-500">{task.submittedDate}</p>
                      </div>
                      {getStatusBadge(task.status)}
                      {getPriorityBadge(task.priority)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Users className="h-8 w-8 text-gray-400" />
                      <div>
                        <p className="font-medium">{task.employeeName}</p>
                        <p className="text-sm text-gray-600">{task.type} - {task.employeeId}</p>
                        <p className="text-sm text-gray-500">Assigned to: {task.assignedTo}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{task.stage}</p>
                        <p className="text-sm text-gray-500">{task.submittedDate}</p>
                      </div>
                      {getPriorityBadge(task.priority)}
                      <Button size="sm">Review</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Approved Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {approvedTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                    <div className="flex items-center gap-4">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                      <div>
                        <p className="font-medium">{task.employeeName}</p>
                        <p className="text-sm text-gray-600">{task.type} - {task.employeeId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{task.stage}</p>
                        <p className="text-sm text-gray-500">{task.submittedDate}</p>
                      </div>
                      {getStatusBadge(task.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rejectedTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg bg-red-50">
                    <div className="flex items-center gap-4">
                      <AlertCircle className="h-8 w-8 text-red-500" />
                      <div>
                        <p className="font-medium">{task.employeeName}</p>
                        <p className="text-sm text-gray-600">{task.type} - {task.employeeId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{task.stage}</p>
                        <p className="text-sm text-gray-500">{task.submittedDate}</p>
                      </div>
                      {getStatusBadge(task.status)}
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default React.memo(WorkflowDashboard);
