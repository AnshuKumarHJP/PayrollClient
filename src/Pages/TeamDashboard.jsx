import React,{ useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../Library/Card";
import { Button } from "../Lib/button";
import { Badge } from "../Lib/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../Lib/avatar";
import { Progress } from "../Lib/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../Lib/tabs";
import { Users, Clock, CheckCircle, AlertTriangle, TrendingUp, UserCheck, Loader2 } from "lucide-react";
import teamDashboardService from "../../api/services/teamDashboardService";
import { useToast } from "../Lib/use-toast";

const TeamDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamTasks, setTeamTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [membersResponse, tasksResponse] = await Promise.all([
        teamDashboardService.getAllTeamMembers(),
        teamDashboardService.getAllTeamTasks()
      ]);
      setTeamMembers(membersResponse);
      setTeamTasks(tasksResponse);
    } catch (err) {
      setError('Failed to fetch team data');
      toast({
        title: 'Error',
        description: 'Failed to fetch team data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-800", icon: UserCheck },
      away: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      offline: { color: "bg-gray-100 text-gray-800", icon: Users }
    };

    const config = statusConfig[status] || statusConfig.active;
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon size={12} className="mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTaskStatusBadge = (status) => {
    const statusConfig = {
      pending: "bg-yellow-100 text-yellow-800",
      "in-progress": "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      overdue: "bg-red-100 text-red-800"
    };

    return (
      <Badge className={statusConfig[status] || statusConfig.pending}>
        {status.replace("-", " ").charAt(0).toUpperCase() + status.replace("-", " ").slice(1)}
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

  const summaryStats = useMemo(() => ({
    activeMembers: teamMembers.filter(member => member.status === "active"),
    totalTasks: teamTasks.length,
    completedTasks: teamTasks.filter(task => task.status === "completed").length,
    pendingTasks: teamTasks.filter(task => task.status === "pending").length
  }), [teamMembers, teamTasks]);

  if (loading) {
    return (
      <div className="p-2">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading team data...</span>
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
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Team Data</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchTeamData}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="flex items-center gap-2 mb-6">
        <Users size={24} />
        <h1 className="text-2xl font-bold">Team Dashboard</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Members</p>
                <p className="text-2xl font-bold">{summaryStats.activeMembers.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold">{summaryStats.totalTasks}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{summaryStats.completedTasks}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{summaryStats.pendingTasks}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Team Overview</TabsTrigger>
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="tasks">Team Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMembers.map((member) => {
                    const tasksAssigned = teamTasks.filter(task => task.assignedTo === member.id).length;
                    const tasksCompleted = teamTasks.filter(task => task.assignedTo === member.id && task.status === "completed").length;
                    const efficiency = member.performance.rating * 20; // Convert rating to percentage
                    return (
                      <div key={member.id} className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium">{member.name}</p>
                            <span className="text-sm text-gray-600">{Math.round(efficiency)}%</span>
                          </div>
                          <Progress value={efficiency} className="h-2" />
                          <p className="text-sm text-gray-500 mt-1">
                            {tasksCompleted}/{tasksAssigned} tasks completed
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm">Alice Johnson completed "Process Q4 Payroll"</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="text-sm">Bob Smith started "Review Leave Requests"</p>
                      <p className="text-xs text-gray-500">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="text-sm">Task "Process Reimbursements" is overdue</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.role}</p>
                        <p className="text-sm text-gray-500">{member.currentTask}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Efficiency</p>
                        <p className="font-medium">{Math.round(member.performance.rating * 20)}%</p>
                      </div>
                      {getStatusBadge(member.status)}
                      <Button size="sm" variant="outline">View Profile</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-gray-600">Assigned to: {task.assignedTo}</p>
                        <p className="text-sm text-gray-500">Due: {task.dueDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getPriorityBadge(task.priority)}
                      {getTaskStatusBadge(task.status)}
                      <Button size="sm">View Details</Button>
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

export default React.memo(TeamDashboard);
