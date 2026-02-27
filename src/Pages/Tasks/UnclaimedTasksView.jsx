import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../Library/Card";
import Button from "../../Library/Button";
import { Input } from "../../Library/Input";
import { Label } from "../../Library/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../Library/Select";
import { Badge } from "../../Library/Badge";
import { Alert } from "../../Library/Alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../Library/table";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../../Library/dialog";
import { UserPlus, Clock, AlertTriangle, CheckCircle, User, Users, Filter, Search, ShieldAlert } from "lucide-react";
// import unclaimedTasksService from "../../api/services/unclaimedTasksService";
import { useToast } from "../../Library/use-toast";
import useRole from "../../Hooks/useRole";
import { useNavigate } from "react-router-dom";
import WorkQueue from "./WorkQueue";

const UnclaimedTasksView = () => {
  const navigate = useNavigate();
  const { isPayrollUser, isSuperAdmin, isPayrollAdmin, currentRole } = useRole();
  const canClaim = isPayrollUser || isSuperAdmin;
  const canAssign = isSuperAdmin || ['PayrollAdmin', 'PayrollILTechnicalLead'].includes(currentRole);

  // if (!isPayrollUser && !isSuperAdmin) {
  //   return (
  //     <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6 bg-white dark:bg-slate-900 rounded-xl m-4 shadow-sm border border-slate-200 dark:border-slate-800">
  //       <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mb-6">
  //         <ShieldAlert className="text-rose-600" size={40} />
  //       </div>
  //       <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Access Restricted</h1>
  //       <p className="text-slate-500 dark:text-slate-400 max-w-sm">This page is reserved for Payroll Operations staff. If you need to check the status of your requests, please visit the Client Dashboard.</p>
  //       <button onClick={() => navigate('/')} className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold shadow-lg shadow-indigo-500/30">Back to Home</button>
  //     </div>
  //   );
  // }
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedTask, setSelectedTask] = useState(null);
  const [assignToUser, setAssignToUser] = useState("");
  const [unclaimedTasks, setUnclaimedTasks] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  /* =========================================================
     MOCK DATA (For demonstration)
  ========================================================= */
  const mockTasks = [
    { id: 1, title: 'Employee Verification - Batch A', description: 'Verify primary documents for batch A employees.', requester: 'HR Dept', department: 'Operations', estimatedHours: 4, priority: 'high', dueDate: '2026-02-25', complexity: 'Medium', skills: ['Document Verification', 'Compliance'] },
    { id: 2, title: 'Payroll Run - February 2026', description: 'Process payroll for the current month.', requester: 'Finance', department: 'Payroll', estimatedHours: 8, priority: 'medium', dueDate: '2026-02-28', complexity: 'High', skills: ['Tax Calculation', 'Audit'] },
    { id: 3, title: 'Query Resolution - Client X', description: 'Address pending payroll queries for Client X.', requester: 'Support', department: 'Client Success', estimatedHours: 2, priority: 'low', dueDate: '2026-03-05', complexity: 'Low', skills: ['Communication', 'Query Handling'] }
  ];

  const mockUsers = [
    { id: 101, name: 'Arun Kumar', role: 'Operator', workload: 2 },
    { id: 102, name: 'Sita Dev', role: 'Operator', workload: 5 },
    { id: 103, name: 'Rajesh Singh', role: 'Junior Lead', workload: 1 }
  ];

  /* =========================================================
     FETCH FUNCTIONS
  ========================================================= */
  const fetchUnclaimedTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Simulating API call
      setTimeout(() => {
        setUnclaimedTasks(mockTasks);
        setLoading(false);
      }, 800);
    } catch (err) {
      setError('Failed to fetch unclaimed tasks');
      toast({
        title: 'Error',
        description: 'Failed to fetch unclaimed tasks. Please try again.',
        variant: 'danger',
      });
      setLoading(false);
    }
  }, [toast]);

  const fetchAvailableUsers = useCallback(async () => {
    try {
      // Simulating API call
      setTimeout(() => {
        setAvailableUsers(mockUsers);
      }, 500);
    } catch (err) {
      console.error('Failed to fetch available users:', err);
    }
  }, []);

  useEffect(() => {
    fetchUnclaimedTasks();
    fetchAvailableUsers();
  }, [fetchUnclaimedTasks, fetchAvailableUsers]);

  /* =========================================================
     ACTION HANDLERS
  ========================================================= */
  const handleSelfClaim = useCallback(async (taskId) => {
    try {
      toast({
        title: 'Success',
        description: 'Task claimed successfully!',
        variant: "success"
      });
      // Refresh or filter out locally
      setUnclaimedTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to claim task. Please try again.',
        variant: 'danger',
      });
    }
  }, [toast]);

  const handleAssignToUser = useCallback(async (taskId, userId) => {
    try {
      const user = availableUsers.find(u => String(u.id) === String(userId));
      toast({
        title: 'Success',
        description: `Task assigned successfully to ${user?.name || 'team member'}!`,
        variant: "success"
      });
      setSelectedTask(null);
      setAssignToUser("");
      // Refresh or filter out locally
      setUnclaimedTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to assign task. Please try again.',
        variant: 'danger',
      });
    }
  }, [toast, availableUsers]);

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

  const getDaysUntilDue = useCallback((dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, []);

  const filteredTasks = useMemo(() => {
    return unclaimedTasks.filter(task => {
      const title = task.title || "";
      const description = task.description || "";
      const requester = task.requester || "";

      const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        requester.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;

      return matchesSearch && matchesPriority;
    });
  }, [unclaimedTasks, searchTerm, priorityFilter]);

  const highPriorityCount = useMemo(() => {
    return unclaimedTasks.filter(t => t.priority === 'high').length;
  }, [unclaimedTasks]);

  const dueSoonCount = useMemo(() => {
    return unclaimedTasks.filter(t => getDaysUntilDue(t.dueDate) <= 2).length;
  }, [unclaimedTasks, getDaysUntilDue]);

  const totalHours = useMemo(() => {
    return unclaimedTasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
  }, [unclaimedTasks]);

  const getUrgencyColor = useCallback((dueDate) => {
    const days = getDaysUntilDue(dueDate);
    if (days < 0) return "text-red-600";
    if (days <= 2) return "text-orange-600";
    if (days <= 5) return "text-yellow-600";
    return "text-green-600";
  }, [getDaysUntilDue]);

  return (
    <>
      <WorkQueue />
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
        <Alert className="mb-6" variant="info">
          <Users className="h-4 w-4" />
          <strong>Task Assignment:</strong> You can claim tasks for yourself or assign them to other team members.
          Higher-level users can assign tasks to junior operators for better workload distribution.
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
                            {canClaim && (
                              <Button
                                size="sm"
                                onClick={() => handleSelfClaim(task.id)}
                              >
                                <User size={14} className="mr-1" />
                                Claim
                              </Button>
                            )}

                            {canAssign && (
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
                                <DialogContent
                                  header={<DialogTitle>Assign Task to Team Member</DialogTitle>}
                                  body={
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
                                    </div>
                                  }
                                  footer={
                                    <div className="flex gap-2">
                                      <Button
                                        onClick={() => handleAssignToUser(task.id, assignToUser)}
                                        disabled={!assignToUser}
                                      >
                                        Assign Task
                                      </Button>
                                      <Button variant="outline" onClick={() => { setSelectedTask(null) }}>
                                        Cancel
                                      </Button>
                                    </div>
                                  }
                                />
                              </Dialog>
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
    </>
  );
};

export default React.memo(UnclaimedTasksView);
