import React, { useState, useEffect } from "react";
import { Button } from "../../Lib/button";
import { useToast } from "../../Lib/use-toast";
import AppIcon from "../../Component/AppIcon";
import AdvanceTable from "../../Component/AdvanceTable";

import {
  STATIC_WORKFLOWS,
  STATIC_WORKFLOW_DETAILS,
} from "../../Data/StaticData";

// Define table columns
const columns = [
  {
    key: "WorkflowName",
    label: "Workflow Name",
    minWidth: 200,
  },
  {
    key: "Description",
    label: "Description",
    minWidth: 300,
  },
];

const WorkflowConfigurationList = ({ onAddEditMode }) => {
  const { toast } = useToast();
  const [workflows, setWorkflows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setWorkflows(STATIC_WORKFLOWS);
  }, []);

  const filteredWorkflows = workflows.filter(
    (workflow) =>
      workflow.WorkflowName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workflow.Description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (workflow) => {
    onAddEditMode?.(true, { id: workflow.WorkflowCode, type: "edit" });
  };

  const handleDelete = (workflow) => {
    if (!confirm(`Delete workflow "${workflow.WorkflowName}"?`)) return;

    setWorkflows((prev) => prev.filter((w) => w.WorkflowCode !== workflow.WorkflowCode));
    toast({
      title: "Success",
      description: "Workflow deleted successfully",
    });
  };

  const handleAdd = () => {
    onAddEditMode?.(true, { type: "add" });
  };

  return (
      <div className="space-y-4">
        {/* Search and Add Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="w-full sm:w-80">
          </div>
          <Button onClick={handleAdd} className="w-full sm:w-auto">
            <AppIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Workflow
          </Button>
        </div>

        {/* Table */}
        <AdvanceTable
          title="Workflow List"
          columns={columns}
          data={filteredWorkflows}
          renderActions={(workflow) => (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEdit(workflow)}
              >
                <AppIcon name="Edit" className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(workflow)}
              >
                <AppIcon name="Trash" className="w-4 h-4" />
              </Button>
            </div>
          )}
          renderActionsWidth={90}
          icon="Settings"
        />
      </div>
  );
};

export default WorkflowConfigurationList;
