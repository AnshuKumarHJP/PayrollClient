import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../Library/Card";
import { Button } from "../Lib/button";
import { Input } from "../Library/Input";
import { Label } from "../Library/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Lib/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../Lib/table";
import { Badge } from "../Lib/badge";
import { Alert, AlertDescription } from "../Lib/alert";
import { FileText, Search, Filter, Download, Calendar, Loader2 } from "lucide-react";
import { auditLogService } from "../../api/services/auditLogService";
import { useToast } from "../Lib/use-toast";

const AuditLogView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statistics, setStatistics] = useState({
    success: 0,
    failure: 0,
    warning: 0,
    total: 0
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch audit logs with filters
      const filters = {};
      if (actionFilter !== "all") filters.action = actionFilter;
      if (userFilter !== "all") filters.userId = userFilter;

      // Handle date range
      if (dateFilter !== "all") {
        const now = new Date();
        let startDate, endDate;

        switch (dateFilter) {
          case "today":
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
            break;
          case "yesterday":
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
          case "last_7_days":
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            endDate = now;
            break;
          case "last_30_days":
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            endDate = now;
            break;
          default:
            break;
        }

        if (startDate && endDate) {
          filters.startDate = startDate.toISOString();
          filters.endDate = endDate.toISOString();
        }
      }

      const logs = await auditLogService.getFilteredLogs(filters);
      setAuditLogs(logs);

      // Calculate statistics
      const stats = logs.reduce((acc, log) => {
        acc[log.status] = (acc[log.status] || 0) + 1;
        acc.total += 1;
        return acc;
      }, { success: 0, failure: 0, warning: 0, total: 0 });

      setStatistics(stats);

    } catch (err) {
      setError("Failed to fetch audit logs");
      toast({
        title: "Error",
        description: "Failed to fetch audit logs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [actionFilter, userFilter, dateFilter]);

  const actionTypes = [
    { value: "all", label: "All Actions" },
    { value: "APPROVE_TASK", label: "Approve Task" },
    { value: "REJECT_TASK", label: "Reject Task" },
    { value: "UPDATE_EMPLOYEE", label: "Update Employee" },
    { value: "BULK_UPLOAD", label: "Bulk Upload" },
    { value: "CREATE_TEMPLATE", label: "Create Template" },
    { value: "LOGIN_FAILED", label: "Login Failed" },
    { value: "AUTO_ASSIGN", label: "Auto Assign" },
    { value: "VALIDATION_ERROR", label: "Validation Error" }
  ];

  const users = [
    { value: "all", label: "All Users" },
    { value: "HR Manager", label: "HR Manager" },
    { value: "Data Processor", label: "Data Processor" },
    { value: "Finance Manager", label: "Finance Manager" },
    { value: "Admin", label: "Admin" },
    { value: "Team Lead", label: "Team Lead" },
    { value: "System", label: "System" }
  ];

  const dateRanges = [
    { value: "all", label: "All Dates" },
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "last_7_days", label: "Last 7 Days" },
    { value: "last_30_days", label: "Last 30 Days" }
  ];

  const statusConfig = {
    success: { color: "bg-green-100 text-green-800", label: "Success" },
    failure: { color: "bg-red-100 text-red-800", label: "Failure" },
    warning: { color: "bg-yellow-100 text-yellow-800", label: "Warning" }
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.resource.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    const matchesUser = userFilter === "all" || log.user === userFilter;
    const matchesDate = dateFilter === "all" || true; // Simplified date filtering

    return matchesSearch && matchesAction && matchesUser && matchesDate;
  });

  const exportAuditLog = () => {
    const csvContent = [
      ["Timestamp", "User", "Action", "Resource", "Details", "Status", "IP Address"],
      ...filteredLogs.map(log => [
        log.timestamp,
        log.user,
        log.action,
        log.resource,
        log.details,
        log.status,
        log.ipAddress
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `audit_log_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-2">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText size={24} />
          <h1 className="text-2xl font-bold">Audit Log</h1>
        </div>
        <Button onClick={exportAuditLog}>
          <Download size={16} className="mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{statistics.success}</p>
              <p className="text-sm text-gray-600">Successful Actions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{statistics.failure}</p>
              <p className="text-sm text-gray-600">Failed Actions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{statistics.warning}</p>
              <p className="text-sm text-gray-600">Warnings</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{statistics.total}</p>
              <p className="text-sm text-gray-600">Total Entries</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="search"
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="action">Action</Label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {actionTypes.map(action => (
                    <SelectItem key={action.value} value={action.value}>
                      {action.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="user">User</Label>
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {users.map(user => (
                    <SelectItem key={user.value} value={user.value}>
                      {user.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="date">Date Range</Label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dateRanges.map(range => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setActionFilter("all");
                  setUserFilter("all");
                  setDateFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Entries ({filteredLogs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading audit logs...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              <p>{error}</p>
              <Button
                variant="outline"
                onClick={fetchAuditLogs}
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">
                        {log.timestamp}
                      </TableCell>
                      <TableCell className="font-medium">
                        {log.user}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {log.action.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {log.resource}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={log.details}>
                          {log.details}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusConfig[log.status].color}>
                          {statusConfig[log.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {log.ipAddress}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {!loading && !error && filteredLogs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No audit entries found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Alert className="mt-6">
        <FileText className="h-4 w-4" />
        <AlertDescription>
          <strong>Security Notice:</strong> This audit log contains sensitive system activity information.
          All entries are automatically logged and cannot be modified. Access to this log is restricted
          to authorized administrators only.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default AuditLogView;
