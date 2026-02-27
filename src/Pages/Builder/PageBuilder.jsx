import React, { useState, useMemo } from "react";
import FormDataView from "./FormDataView";
import { motion } from "framer-motion";

import DynamicForm from "../../Component/DynamicForm";
import BulkUpload from "../BulkUpload/BulkUpload";

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 16 } }
};

const PageBuilder = ({
  Template = null,
  AddMore = false,
  onUpsert,          // SINGLE / EDIT only (UpsertApi)
  onBulkSave = () => { }
}) => {
  const [activeTab, setActiveTab] = useState("single");

  const [isEditing, setIsEditing] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [editId, setEditId] = useState(null);



  const openEdit = (row) => {
    setEditRecord(row);
    setEditId(row.Id || row.id);
    setIsEditing(true);
    setActiveTab("single");
  };



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
              className={`pb-2 px-4 text-xs md:text-sm ${activeTab === tab
                ? "border-b-2 border-indigo-800 text-indigo-700 font-semibold"
                : "text-gray-500 dark:text-white"
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
          onSuccess={async (bulkData) => {
            const ok = await onBulkSave(bulkData);
            if (ok) {
              setActiveTab("view");
            }
            return ok; // Indicate success to BulkUpload
          }}
          onCancel={() => {
            setActiveTab("view");
          }}
        />
      )}

      {/* VIEW TABLE */}
      {activeTab === "view" && (
        <>
          <FormDataView
            Template={Template}
            onEdit={openEdit}
          />
        </>
      )}
    </div>
  );
};

export default PageBuilder;
