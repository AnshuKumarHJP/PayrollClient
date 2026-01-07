import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../Lib/card";
import { Button } from "../../Lib/button";
import { Badge } from "../../Lib/badge";
import { FileText, Plus, Edit, Trash2, Download } from "lucide-react";
import { templateService } from "../../../api/services/templateService";
import { useToast } from "../../Lib/use-toast";
import AdvanceTable from "../../Component/AdvanceTable";

const TemplateList = ({ onAddEditMode }) => {
  const navigate = useNavigate();
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
    // Check if onAddEditMode prop exists (when used in Configuration.jsx)
    if (onAddEditMode) {
      onAddEditMode(true, { id: templateId, type: 'edit' });
    } else {
      // Default navigation for standalone usage
      navigate(`/config/templates/edit/${templateId}`);
    }
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
    // Check if onAddEditMode prop exists (when used in Configuration.jsx)
    if (onAddEditMode) {
      onAddEditMode(true, { type: 'add' });
    } else {
      // Default navigation for standalone usage
      navigate(`/config/templates/edit`);
    }
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

  // Define columns for AdvanceTable
  const columns = [
    {
      key: "name",
      label: "Template Name",
      minWidth: 200,
      render: (value) => <span className="font-medium">{value}</span>
    },
    {
      key: "version",
      label: "Version",
      minWidth: 100
    },
    {
      key: "status",
      label: "Status",
      minWidth: 120,
      render: (value) => getStatusBadge(value)
    },
    {
      key: "fields",
      label: "Fields",
      minWidth: 100,
      render: (value) => {
        if (Array.isArray(value)) return value.length;
        if (typeof value === 'number' && !isNaN(value)) return value;
        return 0;
      }
    },
    {
      key: "Icon",
      label: "Icon",
      minWidth: 100
    },
    {
      key: "lastModified",
      label: "Last Modified",
      minWidth: 150,
      type: "date",
      render: (value) => {
        if (!value) return "-";
        return new Date(value).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    },
    {
      key: "createdBy",
      label: "Created By",
      minWidth: 120
    }
  ];

  // Define renderActions for AdvanceTable
  const renderActions = (row) => (
     <div className="inline-flex items-center gap-1">
      <Button
        size="sm"
        variant="warning"
        onClick={() => handleEdit(row.id)}
        title="Edit"
      >
        <Edit size={14} />
      </Button>
      <Button
        size="sm"
        variant="purple"
        onClick={() => handleExportTemplate(row.id, 'json')}
        title="Export JSON"
      >
        <Download size={14} />
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => handleDelete(row.id)}
        title="Delete"
      >
        <Trash2 size={14} />
      </Button>
    </div>
  );

  if (loading) {
    return (
      <div className="p-2">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 animate-spin" />
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
      <div className="md:flex space-y-3 items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText size={24} />
          <h1 className="text-sm md:text-xl font-bold">Template Management</h1>
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



      {/* Templates Table */}
      <AdvanceTable
        title="Templates"
        columns={columns}
        data={templates}
        renderActions={renderActions}
        renderActionsWidth={120}
        stickyRight={true}
        isLoading={loading}
        icon="FileText"
        // showIndex={true}
      />
    </div>
  );
};

export default TemplateList;
