import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "../../Lib/card";
import { Button } from "../../Lib/button";
import { Badge } from "../../Lib/badge";
import { GetFormBuilder, DeleteFormBuilder } from "../../Store/FormBuilder/Action";
import { useToast } from "../../Lib/use-toast";
import AdvanceTable from "../../Component/AdvanceTable";
import AppIcon from "../../Component/AppIcon";
import { SweetConfirm, SweetSuccess } from "../../Component/SweetAlert";

const FormBuilderList = ({ onAddEditMode }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { FormBuilder, isLoading: loading, error } = useSelector((state) => state.FormBuilderStore);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      dispatch(GetFormBuilder());
    }
  }, [dispatch]);

  const getStatusBadge = (active) => {
    return (
      <Badge className={active ? "bg-green-100 text-green-800" : "bg-red-200 text-red-800"}>
        {active ? "Active" : "Inactive"}
      </Badge>
    );
  };

  const columns = [
    { key: "Name", label: "Name", minWidth: 150, sticky: true },
    { key: "Description", label: "Description", minWidth: 200 },

    {
      key: "IsActive", label: "Status", minWidth: 80,
      render: (value) => getStatusBadge(value)
    },

    { key: "Version", label: "Version", minWidth: 80 },

    {
      key: "Icon", label: "Icon", minWidth: 50,
      render: (value) => <AppIcon name={value} className="text-emerald-600" />
    },
    { key: "DisplayOrder", label: "Display Order", minWidth: 80 },

    { key: "UpsertApi", label: "Add or Update API", minWidth: 150 },
    { key: "GetApi", label: "Get API", minWidth: 150 },
    { key: "BulkApi", label: "Bulk API", minWidth: 150 },
    {
      key: "GroupSave", label: "Group Save", minWidth: 100,
      render: (value) => value ? "Yes" : "No"
    },

  ];


  const renderActions = (row) => (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="warning"
        onClick={() => handleEdit(row.Id)}
        title="Edit"
      >
        <AppIcon name="Edit" size={14} />
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => handleDelete(row.Id)}
        title="Delete"
      >
        <AppIcon name="Trash2" size={14} />
      </Button>
    </div>
  );

  const handleEdit = (HeaderCode) => {
    if (onAddEditMode) {
      onAddEditMode(true, { id: HeaderCode, type: 'edit' });
    } else {
      navigate(`/config/forms/edit/${HeaderCode}`);
    }
  };

  const handleDelete = async (HeaderCode) => {
    SweetConfirm({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      onConfirm: async () => {
        try {
          await dispatch(DeleteFormBuilder(HeaderCode));
          dispatch(GetFormBuilder()); // Refresh list
          SweetSuccess({
            title: 'Deleted!',
            text: 'Form has been deleted.'
          });
        } catch (err) {
          toast({
            title: 'Error',
            description: 'Failed to delete form. Please try again.',
            variant: 'destructive',
          });
        }
      }
    });
  };

  const handleCreateNew = () => {
    if (onAddEditMode) {
      onAddEditMode(true, { type: 'add' });
    } else {
      navigate(`/config/forms/edit`);
    }
  };

  const data = Array.isArray(FormBuilder?.data) ? FormBuilder.data : [];
  const totalForms = data.length;
  const activeForms = data.filter(f => f.Active).length;
  const inactiveForms = data.filter(f => !f.Active).length;

  // console.log(FormBuilder?.data);


  if (loading) {
    return (
      <div className="p-2">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <AppIcon name="Loader2" className="h-6 w-6 animate-spin" />
            <span>Loading forms...</span>
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
            <AppIcon name="FileText" className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Forms</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => dispatch(GetForms())}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 w-full">
      <div className="md:flex space-y-3 items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <AppIcon name="FileText" size={24} />
          <h1 className="text-sm md:text-xl font-bold">Form Builder Management</h1>
        </div>
        <Button onClick={handleCreateNew}>
          <AppIcon name="Plus" size={16} className="mr-2" />
          Create Form
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Forms</p>
                <p className="text-2xl font-bold">{totalForms}</p>
              </div>
              <AppIcon name="FileText" className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Forms</p>
                <p className="text-2xl font-bold text-green-600">{activeForms}</p>
              </div>
              <AppIcon name="FileText" className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inactive Forms</p>
                <p className="text-2xl font-bold text-red-600">{inactiveForms}</p>
              </div>
              <AppIcon name="FileText" className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Fields</p>
                <p className="text-2xl font-bold text-indigo-600">{FormBuilder?.data[0]?.TotalField}</p>
              </div>
              <AppIcon name="Columns3Cog" className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forms Table */}
      <AdvanceTable
        // title="Forms"
        columns={columns}
        data={FormBuilder?.data || []}
        renderActions={renderActions}
        // icon={"FileText"}
        stickyRight={true}
        showIndex={true}
      />
    </div>
  );
};

export default FormBuilderList;
