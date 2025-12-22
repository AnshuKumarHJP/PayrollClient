import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageBuilder from "./PageBuilder";
import { templateService } from "../../../api/services/templateService";
import axios from "axios";

// 🟢 Add Framer Motion
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 16 }
  }
};

const fadeInSlow = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5 } }
};

const Form = () => {
  const { templateID } = useParams();
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState(null);
  const [tableData, setTableData] = useState([]);

  /* ----------------------------------------------
        LOAD TEMPLATE BY ID
  ---------------------------------------------- */
  const loadTemplate = useCallback(async () => {
    try {
      setLoading(true);

      const templates = await templateService.getByStatus("active");

      const formTemplate = templates.find(
        (t) => String(t.id) === String(templateID)
      );

      setTemplate(formTemplate || null);
    } catch (err) {
      console.error("Template load failed:", err);
    } finally {
      setLoading(false);
    }
  }, [templateID]);

  /* ----------------------------------------------
        GET TABLE DATA
  ---------------------------------------------- */
  const handleGetData = useCallback(async (temp) => {
    try {
      if (!temp?.getApi) return;

      const res = await axios.get(temp.getApi);
      setTableData(res.data || []);
    } catch (err) {
      console.error("Failed to load table data:", err);
    }
  }, []);

  /* ----------------------------------------------
        CREATE
  ---------------------------------------------- */
  const handleCreate = useCallback(
    async (payload) => {
      try {
        if (!template?.addApi) return false;

        await axios.post(template.addApi, payload);
        await handleGetData(template);
        return true;
      } catch (err) {
        console.error("Create failed:", err);
        return false;
      }
    },
    [template, handleGetData]
  );

  /* ----------------------------------------------
        UPDATE
  ---------------------------------------------- */
  const handleUpdate = useCallback(
    async (id, payload) => {
      try {
        if (!template?.updateApi) return false;

        await axios.patch(`${template.updateApi}/${id}`, payload);
        await handleGetData(template);

        return true;
      } catch (err) {
        console.error("Update failed:", err);
        return false;
      }
    },
    [template, handleGetData]
  );

  /* ----------------------------------------------
        INIT LOAD
  ---------------------------------------------- */
  useEffect(() => {
    loadTemplate();
  }, [loadTemplate]);

  /* ----------------------------------------------
        LOAD GRID DATA AFTER TEMPLATE ARRIVES
  ---------------------------------------------- */
  useEffect(() => {
    if (template) handleGetData(template);
  }, [template, handleGetData]);

  return (
    <motion.div
      variants={fadeInSlow}
      initial="hidden"
      animate="show"
    >
      {/* HEADER */}
      <motion.h2
        className="text-lg font-bold mb-4"
        variants={fadeIn}
      >
        Form : {template?.name} ({templateID})
      </motion.h2>

      {/* PAGE BUILDER */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="show"
      >
        <PageBuilder
          moduleName={template?.name}
          templateId={template?.id}
          rows={tableData}
          AddMore={true}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onBulkSuccess={() => handleGetData(template)}
        />
      </motion.div>
    </motion.div>
  );
};

export default Form;
