// PageBuilder.jsx
import React, { useState, useMemo } from "react";
import { Button } from "../../Lib/button";
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

import AppIcon from "../../Component/AppIcon";

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 16 } }
};

const PageBuilder = ({
  Template = null,
  rows = [],
  AddMore = false,
  onUpsert,          // SINGLE / EDIT only (UpsertApi)
  onBulkSuccess = () => {}
}) => {
  const [activeTab, setActiveTab] = useState("single");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isEditing, setIsEditing] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [editId, setEditId] = useState(null);

  /* -------------------------------------------------
     FIELDS FOR TABLE
  ------------------------------------------------- */
  const filteredFields = useMemo(() => {
    if (!Template?.FieldsConfigurations) return [];
    return Template.FieldsConfigurations
      .map((f) => {
        let applicable = [];
        try { applicable = JSON.parse(f.ApplicableJson || "[]"); } catch {}
        return { ...f, applicable };
      })
      .filter((f) => f.applicable.includes("form"));
  }, [Template]);

  const dynamicColumns = useMemo(() => {
    if (!filteredFields.length) return [];
    if (Template?.GroupSave === true) {
      return filteredFields.map((f) => ({
        key: `${f.GroupBackendKey || "general"}.${f.Name}`,
        label: f.Label
      }));
    }
    return filteredFields.map((f) => ({
      key: f.Name,
      label: f.Label
    }));
  }, [filteredFields, Template?.GroupSave]);

  const baseColumns = useMemo(
    () => [
      {
        key: "createdAt",
        label: "Created",
        render: (value) => {
          if (!value) return "-";
          return new Date(value).toLocaleString();
        }
      },
      { key: "status", label: "Status" }
    ],
    []
  );

  const openEdit = (row) => {
    setEditRecord(row);
    setEditId(row.id);
    setIsEditing(true);
    setActiveTab("single");
  };

  const actionColumn = {
    key: "action",
    label: "Action",
    render: (_, row) => (
      <div className="flex gap-2">
        <Button size="sm" variant="outline">
          <AppIcon name="Eye" />
        </Button>
        <Button size="sm" variant="warning" onClick={() => openEdit(row)}>
          <AppIcon name="Edit" />
        </Button>
      </div>
    )
  };

  const columns = useMemo(
    () => [...dynamicColumns, ...baseColumns, actionColumn],
    [dynamicColumns, baseColumns]
  );

  const filteredRows = useMemo(() => {
    if (statusFilter === "all") return rows;
    return rows.filter((r) => r.status === statusFilter);
  }, [rows, statusFilter]);

  /* -------------------------------------------------
     SINGLE FORM SUCCESS HANDLER (UpsertApi)
  ------------------------------------------------- */
  const handleSingleSuccess = async (payload) => {
    const ok = await onUpsert(payload);
    if (ok) {
      setIsEditing(false);
      setActiveTab("view");
      return true;
    }
    return false;
  };

  return (
    <div>
      {/* TABS */}
      <motion.div className="flex gap-4 border-b mb-5" variants={fadeIn}>
        {["single", "bulk", "view"].map((tab) => {
          if (tab === "bulk" && !Template?.BulkApi) return null;
          return (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setIsEditing(false);
                setEditRecord(null);
              }}
              className={`pb-2 px-4 text-xs md:text-sm ${
                activeTab === tab
                  ? "border-b-2 border-emerald-500 text-emerald-600"
                  : "text-gray-500"
              }`}
            >
              {tab === "single"
                ? isEditing ? "Update Entry" : "Single Entry"
                : tab === "bulk"
                ? "Bulk Upload"
                : "View"}
            </button>
          );
        })}
      </motion.div>

      {/* SINGLE FORM */}
      {activeTab === "single" && (
        <DynamicForm
          Template={Template}
          editId={isEditing ? editId : null}
          editData={isEditing ? editRecord : null}
          AddMore={AddMore}
          onSuccess={handleSingleSuccess}
          onCancel={() => {
            setIsEditing(false);
            setActiveTab("view");
          }}
        />
      )}

      {/* BULK UPLOAD (BulkApi only) */}
      {activeTab === "bulk" && (
        <BulkUpload
          Template={Template}
          onSuccess={() => {
            onBulkSuccess();
            setActiveTab("view");
          }}
        />
      )}

      {/* VIEW TABLE */}
      {activeTab === "view" && (
        <>
          <Select defaultValue="all" onValueChange={setStatusFilter}>
            <SelectTrigger className="w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <AdvanceTable
            title={Template?.Name}
            columns={columns}
            data={filteredRows}
            loading={false}
          />
        </>
      )}
    </div>
  );
};

export default PageBuilder;
