import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../Lib/card";
import { Button } from "../Lib/button";
import { Badge } from "../Lib/badge";
import { Progress } from "../Lib/progress";
import { Alert, AlertDescription } from "../Lib/alert";
import { Users, Clock, CheckCircle, AlertTriangle, TrendingUp, Activity, BarChart3, Loader2 } from "lucide-react";
import opsDashboardService from "../../api/services/opsDashboardService";
import { useToast } from "../Lib/use-toast";

const OpsDashboard = () => {
  const [timeRange, setTimeRange] = useState("today");
  const [dashboardData, setDashboardData] = useState(null);
  const [operatorStats, setOperatorStats] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [dashboardResponse, statsResponse, alertsResponse] = await Promise.all([
        opsDashboardService.getAllDashboardData(),
        opsDashboardService.getOperatorStats(),
        opsDashboardService.getSystemAlerts()
      ]);

      // Assuming the dashboard data is in the opsDashboard array
      const dashboard = dashboardResponse[0] || {};
      setDashboardData({
        summary: {
          totalOperators: dashboard.totalOperators || 12,
          activeOperators: dashboard.activeOperators || 8,
          totalTasks: dashboard.totalTasks || 156,
          completedTasks: dashboard.completedTasks || 89,
          pendingTasks: dashboard.pendingTasks || 45,
          overdueTasks: dashboard.overdueTasks || 22
        },
        performance: {
          avgProcessingTime: dashboard.avgProcessingTime || "4.2 hours",
          slaCompliance: dashboard.slaCompliance || 87,
          qualityScore: dashboard.qualityScore || 94,
          throughput: dashboard.throughput || 23
        },
        taskDistribution: dashboard.taskDistribution || {
          onboarding: 35,
          attendance: 28,
          leave: 22,
          loans: 18,
          reimbursements: 15,
          other: 38
        }
      });
      setOperatorStats(statsResponse);
      setSystemAlerts(alertsResponse);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      toast({
        title: 'Error',
        description: 'Failed to fetch dashboard data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "break": return "bg-yellow-100 text-yellow-800";
      case "offline": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case "warning": return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "error": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "info": return <Activity className="h-4 w-4 text-blue-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="p-2">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading dashboard data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-2">
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription>
            {error}
            <Button
              variant="outline"
              size="sm"
              className="ml-4"
              onClick={fetchDashboardData}
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="p-2">
        <div className="flex items-center justify-center min-h-[400px]">
          <span>No dashboard data available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 size={24} />
          <h1 className="text-xl font-bold">Operations Dashboard</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant={timeRange === "today" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("today")}
          >
            Today
          </Button>
          <Button
            variant={timeRange === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("week")}
          >
            This Week
          </Button>
          <Button
            variant={timeRange === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("month")}
          >
            This Month
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Operators</p>
                <p className="text-2xl font-bold">{dashboardData.summary.activeOperators}/{dashboardData.summary.totalOperators}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tasks Completed</p>
                <p className="text-2xl font-bold text-green-600">{dashboardData.summary.completedTasks}</p>
                <p className="text-xs text-gray-600">of {dashboardData.summary.totalTasks} total</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
                <p className="text-2xl font-bold text-yellow-600">{dashboardData.summary.pendingTasks}</p>
                <p className="text-xs text-red-600">{dashboardData.summary.overdueTasks} overdue</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">SLA Compliance</p>
                <p className="text-2xl font-bold">{dashboardData.performance.slaCompliance}%</p>
                <Progress value={dashboardData.performance.slaCompliance} className="mt-2" />
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Average Processing Time</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{dashboardData.performance.avgProcessingTime}</p>
            <p className="text-sm text-gray-600 mt-1">Per task completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quality Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{dashboardData.performance.qualityScore}%</p>
            <Progress value={dashboardData.performance.qualityScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Daily Throughput</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">{dashboardData.performance.throughput}</p>
            <p className="text-sm text-gray-600 mt-1">Tasks per operator</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Operator Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Operator Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {operatorStats.map((operator) => (
                <div key={operator.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {operator.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{operator.name}</p>
                      <p className="text-sm text-gray-600">{operator.tasksCompleted} tasks completed</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(operator.status)}>
                      {operator.status}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-1">Avg: {operator.avgTime}</p>
                    <p className="text-sm text-green-600">Quality: {operator.qualityScore}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Task Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Task Distribution by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(dashboardData.taskDistribution).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="capitalize font-medium">{type}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(count / dashboardData.summary.totalTasks) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts & Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>System Alerts & Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {systemAlerts.map((alert) => (
              <Alert key={alert.id} className={
                alert.type === "error" ? "border-red-200 bg-red-50" :
                alert.type === "warning" ? "border-yellow-200 bg-yellow-50" :
                "border-blue-200 bg-blue-50"
              }>
                {getAlertIcon(alert.type)}
                <AlertDescription>
                  <strong>{alert.message}</strong>
                  <br />
                  <span className="text-sm text-gray-600">{alert.timestamp}</span>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OpsDashboard;
