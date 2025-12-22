import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "../../Lib/button";
import { Edit, Eye } from "lucide-react";
import { motion } from "framer-motion";

import AdvanceTable from "../../Component/AdvanceTable";
import DynamicForm from "../../Component/DynamicForm";
import BulkUpload from "../../Component/BulkUpload";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "../../Lib/select";

import { templateService } from "../../../api/services/templateService";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "../../Lib/dialog";

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 16 } }
};

const fadeInSlow = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4 } }
};

const PageBuilder = ({
  templateId = "",
  rows = [],
  AddMore = false,
  onCreate = () => {},
  onUpdate = () => {},
  onBulkSuccess = () => {}
}) => {
  const [activeTab, setActiveTab] = useState("single");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isEditing, setIsEditing] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [editId, setEditId] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewRecord, setViewRecord] = useState(null);

  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState(null);

  const loadTemplate = useCallback(async () => {
    try {
      setLoading(true);
      const templates = await templateService.getByStatus("active");
      const found = templates.find((t) => String(t.id).trim() === String(templateId).trim());
      setTemplate(found || null);
    } catch (err) {
      console.error("Template load failed:", err);
      setTemplate(null);
    } finally {
      setLoading(false);
    }
  }, [templateId]);

  useEffect(() => {
    loadTemplate();
  }, [loadTemplate]);

  const filteredFields = useMemo(() => {
    return template?.fields?.filter(
      (f) => Array.isArray(f.applicable) && f.applicable.includes("form")
    ) || [];
  }, [template]);

  const dynamicColumns = useMemo(() => {
    if (!filteredFields.length) return [];

    if (template?.groupSave === true) {
      return filteredFields.map((f) => ({
        key: `${f.groupBackendKey || "general"}.${f.name}`,
        label: f.label
      }));
    }

    return filteredFields.map((f) => ({ key: f.name, label: f.label }));
  }, [filteredFields, template?.groupSave]);

  const baseColumns = [
    {
      key: "createdAt",
      label: "Created",
      type: "date",
      render: (value) => {
        if (!value) return "-";
        const d = new Date(value);

        const day = d.getDate();
        const month = d.toLocaleString("en-US", { month: "short" });
        const year = d.getFullYear();

        let hours = d.getHours();
        const minutes = String(d.getMinutes()).padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";

        hours = hours % 12 || 12;

        return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
      }
    },
    { key: "status", label: "Status" }
  ];

  const actionColumn = {
    key: "action",
    label: "Action",
    render: (_, row) => (
      <div className="flex gap-2">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button size="sm" variant="outline" onClick={() => openView(row)}>
            <Eye />
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button size="sm" variant="warning" onClick={() => openEdit(row)}>
            <Edit />
          </Button>
        </motion.div>
      </div>
    )
  };

  const uniqueBaseColumns = baseColumns.filter(
    (baseCol) => !dynamicColumns.some((dynCol) => dynCol.key === baseCol.key)
  );

  const columns = [...dynamicColumns, ...uniqueBaseColumns, actionColumn];

  const openView = (row) => {
    setViewRecord(row);
    setDialogOpen(true);
  };

  const openEdit = (row) => {
    setIsEditing(true);
    setActiveTab("single");
    setEditId(row.id);
    setEditRecord(row);
  };

  const filteredRows = useMemo(() => {
    if (statusFilter === "all") return rows;
    return rows.filter((r) => r.status === statusFilter);
  }, [rows, statusFilter]);

  const handleSuccess = async (payload) => {
    try {
      if (payload.isEdit) {
        await onUpdate(payload.recordId, payload.data);
      } else {
        await onCreate(payload.data);
      }
      setIsEditing(false);
      setActiveTab("view");
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return (
    <div className="">

      {/* TABS */}
      <motion.div
        className="flex gap-4 border-b mb-5"
        variants={fadeIn}
        initial="hidden"
        animate="show"
      >
        {["single", "bulk", "view"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setIsEditing(false);
              setEditRecord(null);
            }}
            className={`pb-2 px-4 text-sm font-medium ${
              activeTab === tab
                ? "border-b-2 border-emerald-500 text-emerald-600"
                : "text-gray-500"
            }`}
          >
            {tab === "single"
              ? isEditing
                ? "Update Entry"
                : "Single Entry"
              : tab === "bulk"
              ? "Bulk Upload"
              : "View"}
          </button>
        ))}
      </motion.div>

      {/* SINGLE FORM */}
      {activeTab === "single" && (
        <motion.div variants={fadeIn} initial="hidden" animate="show">
          <DynamicForm
            templateId={templateId}
            GroupData={template?.groupSave || false}
            editId={isEditing ? editId : null}
            editData={isEditing ? editRecord : null}
            AddMore={AddMore}
            onSuccess={handleSuccess}
            onCancel={() => {
              setActiveTab("view");
              setIsEditing(false);
            }}
          />
        </motion.div>
      )}

      {/* BULK UPLOAD */}
      {activeTab === "bulk" && (
        <motion.div variants={fadeIn} initial="hidden" animate="show">
          <BulkUpload
            onSuccess={(res) => {
              onBulkSuccess(res);
              setActiveTab("view");
            }}
          />
        </motion.div>
      )}

      {/* VIEW TABLE */}
      {activeTab === "view" && (
        <>
          <motion.div
            className="flex justify-end mb-3"
            variants={fadeIn}
            initial="hidden"
            animate="show"
          >
            <Select defaultValue="all" onValueChange={setStatusFilter}>
              <SelectTrigger className="w-52 border-emerald-400">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div
            variants={fadeInSlow}
            initial="hidden"
            animate="show"
          >
            <AdvanceTable
              title="Records"
              columns={columns}
              data={filteredRows}
              loading={loading}
            />
          </motion.div>
        </>
      )}

      {/* VIEW MODAL */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
          >
            <DialogHeader>
              <DialogTitle>Details</DialogTitle>
            </DialogHeader>

            <pre className="bg-gray-100 p-4 rounded text-xs">
              {JSON.stringify(viewRecord, null, 2)}
            </pre>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PageBuilder;
