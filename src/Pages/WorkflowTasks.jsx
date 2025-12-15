import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../Lib/card";
import { Button } from "../Lib/button";
import { Input } from "../Lib/input";
import { Label } from "../Lib/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Lib/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../Lib/table";
import { Badge } from "../Lib/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../Lib/tabs";
import { Alert, AlertDescription } from "../Lib/alert";
import { CheckCircle, Clock, AlertTriangle, User, Filter, Search, Loader2 } from "lucide-react";
import { workflowService } from "../../api/services/workflowService";
import { useToast } from "../Lib/use-toast";

const WorkflowTasks = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
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
      const data = await workflowService.getAllTasks();
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

  const statusConfig = {
    pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock, label: "Pending" },
    in_review: { color: "bg-blue-100 text-blue-800", icon: User, label: "In Review" },
    approved: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Approved" },
    rejected: { color: "bg-red-100 text-red-800", icon: AlertTriangle, label: "Rejected" }
  };

  const priorityConfig = {
    high: { color: "bg-red-100 text-red-800", label: "High" },
    medium: { color: "bg-yellow-100 text-yellow-800", label: "Medium" },
    low: { color: "bg-green-100 text-green-800", label: "Low" }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    const matchesTab = activeTab === "all" || task.status === activeTab;

    return matchesSearch && matchesStatus && matchesPriority && matchesTab;
  });

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status).length;
  };

  const handleTaskAction = async (taskId, action) => {
    if (action === "view") {
      navigate(`/workflow/tasks/${taskId}`);
    } else if (action === "approve") {
      try {
        await workflowService.approveTask(taskId, {});
        toast({
          title: 'Success',
          description: 'Task approved successfully.',
        });
        // Refresh the task list
        fetchWorkflowTasks();
      } catch (err) {
        toast({
          title: 'Error',
          description: 'Failed to approve task. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className="p-2">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CheckCircle size={24} />
          <h1 className="text-xl font-bold">Workflow Tasks</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter size={16} className="mr-2" />
            Advanced Filters
          </Button>
        </div>
      </div>

      {/* Task Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{getTasksByStatus("pending")}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Review</p>
                <p className="text-2xl font-bold text-blue-600">{getTasksByStatus("in_review")}</p>
              </div>
              <User className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{getTasksByStatus("approved")}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{getTasksByStatus("rejected")}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search Tasks</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="search"
                  placeholder="Search by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_review">In Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setPriorityFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Table */}
      <Card>
        <CardHeader>
          <CardTitle>Task List</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All ({tasks.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({getTasksByStatus("pending")})</TabsTrigger>
              <TabsTrigger value="in_review">In Review ({getTasksByStatus("in_review")})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({getTasksByStatus("approved")})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({getTasksByStatus("rejected")})</TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Task</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTasks.map((task) => {
                      const statusInfo = statusConfig[task.status] || {
                        color: "bg-gray-100 text-gray-800",
                        icon: Clock,
                        label: task.status || "Unknown"
                      };
                      const priorityInfo = priorityConfig[task.priority] || {
                        color: "bg-gray-100 text-gray-800",
                        label: task.priority || "Unknown"
                      };
                      const StatusIcon = statusInfo.icon;

                      return (
                        <TableRow key={task.id}>
                          <TableCell>
                            <p className="font-medium">{task.id}</p>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{task.title}</p>
                              <p className="text-sm text-gray-600">{task.description}</p>
                              <p className="text-xs text-gray-500">Stage: {task.stage}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{task.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={priorityInfo.color}>
                              {priorityInfo.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={statusInfo.color}>
                              <StatusIcon size={12} className="mr-1" />
                              {statusInfo.label}
                            </Badge>
                          </TableCell>
                          <TableCell>{task.assignedTo}</TableCell>
                          <TableCell>{task.dueDate}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${task.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-sm">{task.progress}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleTaskAction(task.id, "view")}
                              >
                                View
                              </Button>
                              {task.status === "pending" && (
                                <Button
                                  size="sm"
                                  onClick={() => handleTaskAction(task.id, "approve")}
                                >
                                  Approve
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {filteredTasks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No tasks found matching your criteria.
                </div>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowTasks;
