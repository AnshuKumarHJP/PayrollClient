import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageBuilder from "./PageBuilder";
import { templateService } from "../../../api/services/templateService";
import axios from "axios";

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
        GET TABLE DATA FROM TEMPLATE API
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
        CREATE NEW RECORD
  ---------------------------------------------- */
  const handleCreate = useCallback(
    async (payload) => {
      try {
        if (!template?.addApi) {
          console.error("Add API missing");
          return false;
        }

        await axios.post(template.addApi, payload);
        await handleGetData(template); // reload table

        return true;
      } catch (err) {
        console.error("Create failed:", err);
        return false;
      }
    },
    [template, handleGetData]
  );

  /* ----------------------------------------------
        UPDATE EXISTING RECORD
  ---------------------------------------------- */
  const handleUpdate = useCallback(
    async (id, payload) => {
      console.log(payload);
      try {
        if (!template?.updateApi) {
          console.error("Update API missing");
          return false;
        }

        // PUT or PATCH depending on your API preference
        await axios.patch(`${template.updateApi}/${id}`, payload);

        await handleGetData(template); // refresh table

        return true;
      } catch (err) {
        console.error("Update failed:", err);
        return false;
      }
    },
    [template, handleGetData]
  );

  /* ----------------------------------------------
        LOAD TEMPLATE INITIALLY
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
    <div className="p-4">
      {/* HEADER */}
      <h2 className="text-lg font-bold mb-4">
        Form: {template?.name} ({templateID})
      </h2>

      {/* PAGE BUILDER */}
      <PageBuilder
        moduleName={template?.name}
        templateId={template?.id}
        rows={tableData}
        AddMore={true}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onBulkSuccess={() => handleGetData(template)}
      />
    </div>
  );
};

export default Form;
