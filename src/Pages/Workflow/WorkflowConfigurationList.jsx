import React, { useState, useEffect } from "react";
import { Button } from "../../Library/Button";
import { Badge } from "../../Library/Badge";
import { useToast } from "../../Library/use-toast";
import AppIcon from "../../Component/AppIcon";
import AdvanceTable from "../../Component/AdvanceTable";
import { Settings2 } from "lucide-react";

import { STATIC_WORKFLOWS } from "../../Data/StaticData";

/* ================= TABLE COLUMNS ================= */
const columns = [
  {
    key: "WorkflowName",
    label: "Title",
    minWidth: 220,
    render: (v) => (
      <div className="font-medium text-foreground">{v}</div>
    ),
  },
  {
    key: "Icon",
    label: "Icon",
    minWidth: 80,
    render: (v) => (
      <div className="flex justify-center">
        <AppIcon name={v} className="text-indigo-600" />
      </div>
    ),
  },
  {
    key: "PagePath",
    label: "Page Path",
    minWidth: 260,
    render: (v) => (
      <span className="text-xs text-muted-foreground truncate block max-w-[240px]">
        {v}
      </span>
    ),
  },
  {
    key: "PageEditPath",
    label: "Edit Path",
    minWidth: 260,
    render: (v) => (
      <span className="text-xs text-muted-foreground truncate block max-w-[240px]">
        {v}
      </span>
    ),
  },
  {
    key: "DisplayOrder",
    label: "Order",
    minWidth: 80,
  },
  {
    key: "IsActive",
    label: "Status",
    minWidth: 110,
    render: (v) => (
      <Badge variant={v ? "success" : "destructive"} size="sm">
        {v ? "Active" : "Inactive"}
      </Badge>
    ),
  },
];

/* ================= COMPONENT ================= */
const ConfigurationMenu = ({ onAddEditMode }) => {
  const { toast } = useToast();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setData(STATIC_WORKFLOWS);
  }, []);

  const filtered = data.filter(
    (d) =>
      d.WorkflowName.toLowerCase().includes(search.toLowerCase()) ||
      d.Description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (row) => {
    if (!confirm(`Delete "${row.WorkflowName}"?`)) return;
    setData((p) => p.filter((x) => x.WorkflowCode !== row.WorkflowCode));
    toast({ title: "Deleted", description: "Configuration removed",variant:"success" });
  };

  return (
    <div className="space-y-6">

      {/* ================= HERO CARD ================= */}
      <div className="rounded-2xl border bg-gradient-to-br from-indigo-50 to-blue-50 p-6 flex flex-col lg:flex-row justify-between gap-4">
        <div className="flex gap-4">
          <div className="h-12 w-12 rounded-xl bg-indigo-600/10 flex items-center justify-center">
            <Settings2 className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">
              Configuration Menu Manager
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl">
              Centralize and manage navigation items, templates and system
              configuration with full control over order, status and routing.
            </p>

            <div className="flex gap-4 mt-3 text-xs">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                {data.filter(x => x.IsActive).length} Active
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                {data.filter(x => !x.IsActive).length} Inactive
              </span>
              <span>Total: {data.length}</span>
            </div>
          </div>
        </div>

        <Button
          variant="primary"
          icon={<AppIcon name="Plus" />}
          onClick={() => onAddEditMode?.(true, { type: "add" })}
          className="self-start lg:self-center"
        >
          Add Configuration
        </Button>
      </div>
      {/* ================= TABLE ================= */}
      <AdvanceTable
        title=""
        columns={columns}
        data={filtered}
        renderActions={(row) => (
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="warning"
              onClick={() =>
                onAddEditMode?.(true, {
                  id: row.WorkflowCode,
                  type: "edit",
                })
              }
            >
              <AppIcon name="Edit" />
            </Button>

            <Button
              size="icon"
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
