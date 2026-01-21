import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../Library/Card";
import { Button } from "../Lib/button";
import { Input } from "../Library/Input";
import { Label } from "../Library/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Lib/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../Lib/table";
import { Badge } from "../Lib/badge";
import { History, Download, Search, Filter, Loader2 } from "lucide-react";
import { importHistoryService } from "../../api/services/importHistoryService";
import { useToast } from "../Lib/use-toast";

const ImportHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [importHistory, setImportHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchImportHistory();
  }, []);

  const fetchImportHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await importHistoryService.getAll();
      setImportHistory(data);
    } catch (err) {
      setError('Failed to fetch import history');
      toast({
        title: 'Error',
        description: 'Failed to fetch import history. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = importHistory.filter(item => {
    const matchesSearch = item.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.module.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesDate = !dateFilter || item.uploadDate === dateFilter;

    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { variant: "default", color: "bg-green-100 text-green-800" },
      processing: { variant: "secondary", color: "bg-yellow-100 text-yellow-800" },
      failed: { variant: "destructive", color: "bg-red-100 text-red-800" }
    };

    return (
      <Badge className={statusConfig[status]?.color || "bg-gray-100 text-gray-800"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const downloadErrorReport = (id) => {
    // Simulate downloading error report
    console.log(`Downloading error report for import ${id}`);
  };

  if (loading) {
    return (
      <div className="p-2">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading import history...</span>
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
            <History className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Import History</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchImportHistory}>
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
        <History size={24} />
        <h1 className="text-xl font-bold">Import History</h1>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter size={20} />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by file name, user, or module..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
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
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="date">Upload Date</Label>
              <Input
                id="date"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setDateFilter("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Import History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Import Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Records</TableHead>
                <TableHead>Success</TableHead>
                <TableHead>Failed</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.fileName}</TableCell>
                  <TableCell>{item.module}</TableCell>
                  <TableCell>{item.uploadedBy}</TableCell>
                  <TableCell>{item.uploadDate}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>{item.totalRecords}</TableCell>
                  <TableCell className="text-green-600">{item.successRecords}</TableCell>
                  <TableCell className="text-red-600">{item.failedRecords}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {item.failedRecords > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadErrorReport(item.id)}
                        >
                          <Download size={14} className="mr-1" />
                          Errors
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredHistory.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No import records found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{importHistory.length}</div>
            <div className="text-sm text-gray-600">Total Imports</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {importHistory.filter(item => item.status === "completed").length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {importHistory.filter(item => item.status === "processing").length}
            </div>
            <div className="text-sm text-gray-600">Processing</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {importHistory.filter(item => item.status === "failed").length}
            </div>
            <div className="text-sm text-gray-600">Failed</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImportHistory;
