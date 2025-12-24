import React,{ useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../Lib/card";
import { Button } from "../Lib/button";
import { Input } from "../Lib/input";
import { Label } from "../Lib/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Lib/select";
import { Badge } from "../Lib/badge";
import { Alert, AlertDescription } from "../Lib/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../Lib/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../Lib/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../Lib/tabs";
import { UserPlus, Clock, AlertTriangle, CheckCircle, User, Users, Filter, Search } from "lucide-react";
import unclaimedTasksService from "../../api/services/unclaimedTasksService";
import { useToast } from "../Lib/use-toast";

const UnclaimedTasksView = () => {
  const [activeTab, setActiveTab] = useState("available");
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedTask, setSelectedTask] = useState(null);
  const [assignToUser, setAssignToUser] = useState("");
  const [unclaimedTasks, setUnclaimedTasks] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUnclaimedTasks();
    fetchAvailableUsers();
  }, []);

  const fetchUnclaimedTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const tasks = await unclaimedTasksService.getUnclaimedTasks();
      setUnclaimedTasks(tasks);
    } catch (err) {
      setError('Failed to fetch unclaimed tasks');
      toast({
        title: 'Error',
        description: 'Failed to fetch unclaimed tasks. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      const users = await unclaimedTasksService.getAvailableUsers();
      setAvailableUsers(users);
    } catch (err) {
      console.error('Failed to fetch available users:', err);
    }
  };

  const priorityConfig = {
    high: { color: "bg-red-100 text-red-800", icon: AlertTriangle, label: "High" },
    medium: { color: "bg-yellow-100 text-yellow-800", icon: Clock, label: "Medium" },
    low: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Low" }
  };

  const complexityConfig = {
    Low: { color: "bg-green-100 text-green-800" },
    Medium: { color: "bg-yellow-100 text-yellow-800" },
    High: { color: "bg-red-100 text-red-800" }
  };

  const filteredTasks = useMemo(() => {
    return unclaimedTasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.requester.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;

      return matchesSearch && matchesPriority;
    });
  }, [unclaimedTasks, searchTerm, priorityFilter]);

  const highPriorityCount = useMemo(() => {
    return unclaimedTasks.filter(t => t.priority === 'high').length;
  }, [unclaimedTasks]);

  const dueSoonCount = useMemo(() => {
    return unclaimedTasks.filter(t => getDaysUntilDue(t.dueDate) <= 2).length;
  }, [unclaimedTasks]);

  const totalHours = useMemo(() => {
    return unclaimedTasks.reduce((sum, t) => sum + t.estimatedHours, 0);
  }, [unclaimedTasks]);

  const handleSelfClaim = useCallback(async (taskId) => {
    try {
      await unclaimedTasksService.claimTask(taskId);
      toast({
        title: 'Success',
        description: 'Task claimed successfully!',
      });
      // Refresh the tasks list
      fetchUnclaimedTasks();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to claim task. Please try again.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const handleAssignToUser = useCallback(async (taskId, userId) => {
    try {
      await unclaimedTasksService.assignTask(taskId, userId);
      toast({
        title: 'Success',
        description: 'Task assigned successfully!',
      });
      setSelectedTask(null);
      setAssignToUser("");
      // Refresh the tasks list
      fetchUnclaimedTasks();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to assign task. Please try again.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const getDaysUntilDue = useCallback((dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, []);

  const getUrgencyColor = useCallback((dueDate) => {
    const days = getDaysUntilDue(dueDate);
    if (days < 0) return "text-red-600";
    if (days <= 2) return "text-orange-600";
    if (days <= 5) return "text-yellow-600";
    return "text-green-600";
  }, [getDaysUntilDue]);

  return (
    <div className="p-2">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <UserPlus size={24} />
          <h1 className="text-2xl font-bold">Unclaimed Tasks</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter size={16} className="mr-2" />
            Advanced Filters
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{unclaimedTasks.length}</p>
              <p className="text-sm text-gray-600">Total Unclaimed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {highPriorityCount}
              </p>
              <p className="text-sm text-gray-600">High Priority</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {dueSoonCount}
              </p>
              <p className="text-sm text-gray-600">Due Soon</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {totalHours}
              </p>
              <p className="text-sm text-gray-600">Total Hours</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Search Tasks</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="search"
                  placeholder="Search by title, description, or requester..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setPriorityFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Assignment Options */}
      <Alert className="mb-6">
        <Users className="h-4 w-4" />
        <AlertDescription>
          <strong>Task Assignment:</strong> You can claim tasks for yourself or assign them to other team members.
          Higher-level users can assign tasks to junior operators for better workload distribution.
        </AlertDescription>
      </Alert>

      {/* Tasks Table */}
      <Card>
        <CardHeader>
          <CardTitle>Available Tasks ({filteredTasks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task Details</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Complexity</TableHead>
                  <TableHead>Skills Required</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => {
                  const priorityInfo = priorityConfig[task.priority];
                  const PriorityIcon = priorityInfo.icon;
                  const daysUntilDue = getDaysUntilDue(task.dueDate);

                  return (
                    <TableRow key={task.id}>
                      <TableCell>
                        <div className="max-w-md">
                          <p className="font-medium text-sm">{task.title}</p>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>By: {task.requester}</span>
                            <span>Dept: {task.department}</span>
                            <span>{task.estimatedHours}h estimated</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={priorityInfo.color}>
                          <PriorityIcon size={12} className="mr-1" />
                          {priorityInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className={`text-sm ${getUrgencyColor(task.dueDate)}`}>
                          {task.dueDate}
                          <br />
                          <span className="text-xs">
                            {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` :
                             daysUntilDue === 0 ? 'Due today' :
                             `${daysUntilDue} days left`}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={complexityConfig[task.complexity].color}>
                          {task.complexity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {task.skills.slice(0, 2).map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {task.skills.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{task.skills.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSelfClaim(task.id)}
                          >
                            <User size={14} className="mr-1" />
                            Claim
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedTask(task)}
                              >
                                <Users size={14} className="mr-1" />
                                Assign
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Assign Task to Team Member</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <p className="font-medium">{task.title}</p>
                                  <p className="text-sm text-gray-600">{task.description}</p>
                                </div>
                                <div>
                                  <Label htmlFor="assignUser">Assign to:</Label>
                                  <Select value={assignToUser} onValueChange={setAssignToUser}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select team member" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {availableUsers.map(user => (
                                        <SelectItem key={user.id} value={user.id.toString()}>
                                          <div className="flex items-center justify-between w-full">
                                            <span>{user.name} - {user.role}</span>
                                            <Badge variant="outline" className="ml-2">
                                              {user.workload} tasks
                                            </Badge>
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => handleAssignToUser(task.id, assignToUser)}
                                    disabled={!assignToUser}
                                  >
                                    Assign Task
                                  </Button>
                                  <Button variant="outline" onClick={() => setSelectedTask(null)}>
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
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
              No unclaimed tasks found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assignment Guidelines */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Assignment Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Self-Assignment (Any User)</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Click "Claim" to assign task to yourself</li>
                <li>• Task moves to your personal queue</li>
                <li>• You become responsible for completion</li>
                <li>• Can be reassigned later if needed</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Manager Assignment (Higher Users)</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Click "Assign" to assign to team members</li>
                <li>• Consider workload and skill requirements</li>
                <li>• Balance team capacity and deadlines</li>
                <li>• Monitor assignment effectiveness</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default React.memo(UnclaimedTasksView);
