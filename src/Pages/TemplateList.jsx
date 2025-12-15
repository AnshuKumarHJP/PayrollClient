import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../Lib/card";
import { Button } from "../Lib/button";
import { Input } from "../Lib/input";
import { Badge } from "../Lib/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../Lib/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Lib/select";
import { FileText, Plus, Search, Edit, Copy, Trash2, Eye, Loader2, Download, Upload } from "lucide-react";
import { templateService } from "../../api/services/templateService";
import { useToast } from "../Lib/use-toast";

const TemplateList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModule, setSelectedModule] = useState("all");
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await templateService.getAll();
      setTemplates(data);
    } catch (err) {
      setError('Failed to fetch templates');
      toast({
        title: 'Error',
        description: 'Failed to fetch templates. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter(template => template.name && template.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-800", label: "Active" },
      draft: { color: "bg-yellow-100 text-yellow-800", label: "Draft" },
      inactive: { color: "bg-red-200 text-red-800", label: "Inactive" }
    };
    return (
      <Badge className={statusConfig[status].color}>
        {statusConfig[status].label}
      </Badge>
    );
  };

  const handleEdit = (templateId) => {
    navigate(`/config/templates/edit/${templateId}`);
  };

  const handleDelete = async (templateId) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      try {
        await templateService.delete(templateId);
        fetchTemplates();
        toast({
          title: 'Success',
          description: 'Template deleted successfully.',
        });
      } catch (err) {
        toast({
          title: 'Error',
          description: 'Failed to delete template. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleExportTemplate = async (templateId, format = 'json') => {
    try {
      // Export functionality not implemented in templateService
      toast({
        title: 'Info',
        description: 'Export functionality is not yet implemented.',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to export template. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCreateNew = () => {
    navigate(`/config/templates/edit`);
  };

  const totalTemplates = templates.length;
  const activeTemplates = templates.filter(t => t.status === "active").length;
  const draftTemplates = templates.filter(t => t.status === "draft").length;
  const totalFields = templates.reduce((sum, t) => {
    if (Array.isArray(t.fields)) {
      return sum + t.fields.length;
    } else if (typeof t.fields === 'number' && !isNaN(t.fields)) {
      return sum + t.fields;
    }
    return sum;
  }, 0);

  if (loading) {
    return (
      <div className="p-2">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading templates...</span>
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
            <FileText className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Templates</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchTemplates}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="p-2">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText size={24} />
          <h1 className="text-xl font-bold">Template Management</h1>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus size={16} className="mr-2" />
          Create Template
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Templates</p>
                <p className="text-2xl font-bold">{totalTemplates}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Templates</p>
                <p className="text-2xl font-bold text-green-600">{activeTemplates}</p>
              </div>
              <FileText className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Draft Templates</p>
                <p className="text-2xl font-bold text-yellow-600">{draftTemplates}</p>
              </div>
              <FileText className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Fields</p>
                <p className="text-2xl font-bold">{totalFields}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search Templates</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search by template name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Template Name</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Fields</TableHead>
                  <TableHead>Last Modified</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTemplates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">{template.name}</TableCell>
                    <TableCell>{template.version}</TableCell>
                    <TableCell>{getStatusBadge(template.status)}</TableCell>
                    <TableCell>{Array.isArray(template.fields) ? template.fields.length : (typeof template.fields === 'number' && !isNaN(template.fields) ? template.fields : 0)}</TableCell>
                    <TableCell>
                      {template.lastModified
                        ? new Date(template.lastModified).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                        : "-"}
                    </TableCell>

                    <TableCell>{template.createdBy}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(template.id)}
                          title="Edit"
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleExportTemplate(template.id, 'json')}
                          title="Export JSON"
                        >
                          <Download size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(template.id)}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TemplateList;
