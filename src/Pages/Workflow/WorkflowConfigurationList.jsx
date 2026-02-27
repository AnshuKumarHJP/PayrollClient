import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../Library/Button";
import { Badge } from "../../Library/Badge";
import { useToast } from "../../Library/use-toast";
import AppIcon from "../../Component/AppIcon";
import AdvanceTable from "../../Library/Table/AdvanceTable";
import { Settings2 } from "lucide-react";
import CryptoService from "../../Security/useCrypto";
import { useDispatch, useSelector } from "react-redux";
import { GetAllClientPortalWorkflowConfigurations, DeleteClientPortalWorkflowConfigurationById } from "../../Store/FormBuilder/Action";
import { Modules } from "../../Data/StaticData";
import { SweetConfirm } from "../../Component/SweetAlert";
import Loading from "../../Component/Loading";

/* ================= TABLE COLUMNS ================= */
const columns = [
  {
    key: "Name",
    label: "Name",
    minWidth: 220,
  },
  {
    key: "ModuleId",
    label: "Module",
    minWidth: 220,
    render: (v) => (
      <div className="font-medium text-foreground">{Modules.find(m => m.value === v)?.label || 'Unknown'}</div>
    ),
  },
  {
    key: "Description",
    label: "Title",
    minWidth: 220,
  },
];

/* ================= COMPONENT ================= */
const ConfigurationMenu = () => {
  const { toast } = useToast();
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { Common } = useSelector((s) => s.Auth);
  const { data: workflowData, isLoading } = useSelector((s) => s.FormBuilderStore.ClientPortalWorkflowConfiguration);


  const handleDelete = async (row) => {
    const result = await SweetConfirm({
      title: "Delete Configuration",
      text: `Are you sure you want to delete "${row.WorkflowName}"?`,
      confirmText: "Yes, Delete",
      cancelText: "Cancel"
    });

    if (!result.isConfirmed) return;

    try {
      const response = await dispatch(DeleteClientPortalWorkflowConfigurationById(row.Id));
      if (response?.Status) {
        dispatch(
          GetAllClientPortalWorkflowConfigurations({
            ClientId: Common?.SelectedClientCode,
            ClientContractId: Common?.SelectedClientContractCode,
          })
        );
      } else {
        toast({ title: "Error", description: response?.Message || "Failed to delete configuration", variant: "danger" });
      }
    } catch (error) {
      toast({ title: "Error", description: error.message || "An error occurred while deleting", variant: "danger" });
    }
  };

  /* =====================================================
     LOAD MASTER DATA
  ===================================================== */
  useEffect(() => {
    dispatch(
      GetAllClientPortalWorkflowConfigurations({
        ClientId: Common?.SelectedClientCode,
        ClientContractId: Common?.SelectedClientContractCode,
      })
    );
  }, [dispatch, Common]);

  if (isLoading) {
    <Loading />
  }

  return (
    <div className="space-y-6">
      {/* ================= HERO CARD ================= */}
      <div className="rounded-2xl border border-gray-100 dark:border-slate-700 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 p-6 flex flex-col lg:flex-row justify-between gap-4">
        <div className="flex gap-4">
          <div className="h-12 w-12 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/20 flex items-center justify-center">
            <Settings2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Configuration Menu Manager
            </h1>
            <p className="text-sm text-muted-foreground dark:text-gray-300 max-w-xl">
              Centralize and manage navigation items, templates and system
              configuration with full control over order, status and routing.
            </p>

            <div className="flex gap-4 mt-3 text-xs text-gray-600 dark:text-gray-200">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                {/* {data.filter(x => x.IsActive).length} Active */}
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                {/* {data.filter(x => !x.IsActive).length} Inactive */}
              </span>
              <span>Total : {workflowData.length}</span>
            </div>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<AppIcon name="Plus" />}
          onClick={() => {
            navigate("/workflow-config/add");
          }}
          className="self-start lg:self-center"
        >
          Add Configuration
        </Button>
      </div>
      {/* ================= TABLE ================= */}
      <AdvanceTable
        title=""
        columns={columns}
        data={workflowData}
        renderActions={(row) => (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="warning"
              onClick={() => {
                const encryptedId = CryptoService.encrypt(row.Id.toString());
                navigate(`/workflow-config/edit/${encryptedId}`);
              }}
            >
              <AppIcon name="Edit" />
            </Button>

            <Button
              size="sm"
              variant="danger"
              onClick={() => handleDelete(row)}
            >
              <AppIcon name="Trash" />
            </Button>
          </div>
        )}
        renderActionsWidth={110}
      />
    </div>
  );
};

export default ConfigurationMenu;
