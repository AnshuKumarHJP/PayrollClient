import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageBuilder from "./PageBuilder";
import { templateService } from "../../../api/services/templateService";
import axios from "axios";
import { motion } from "framer-motion";
import useCrypto from "../../Security/useCrypto";
import Loading from "../../Component/Loading";

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
  const { decrypt } = useCrypto();

  const [decryptDone, setDecryptDone] = useState(false);
  const [decryptedId, setDecryptedId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState("");

  /* ----------------------------------------------
      DECRYPT TEMPLATE ID
  ---------------------------------------------- */
  useEffect(() => {
    const d = decrypt(templateID);

    if (!d) {
      setError("Invalid or tampered URL. Template ID could not be verified.");
      setDecryptedId(null);
    } else {
      setDecryptedId(d);
    }

    setDecryptDone(true);
  }, [templateID, decrypt]);

  /* ----------------------------------------------
      LOAD TEMPLATE AFTER DECRYPT
  ---------------------------------------------- */
  const loadTemplate = useCallback(async () => {
    if (!decryptDone) return;       // wait for decrypt
    if (!decryptedId) return;       // decrypt failed → skip

    try {
      setLoading(true);

      const templates = await templateService.getByStatus("active");

      const found = templates.find(
        (t) => String(t.id) === String(decryptedId)
      );

      if (!found) {
        setError("Template not found or inactive.");
        setTemplate(null);
      } else {
        setTemplate(found);
      }
    } catch {
      setError("Failed to load template.");
    } finally {
      setLoading(false);
    }
  }, [decryptDone, decryptedId]);

  useEffect(() => {
    loadTemplate();
  }, [loadTemplate]);

  /* ----------------------------------------------
      LOAD TABLE DATA
  ---------------------------------------------- */
  const handleGetData = useCallback(async (temp) => {
    if (!temp?.getApi || temp.getApi.trim() === "") return;

    try {
      const res = await axios.get(temp.getApi);
      setTableData(res.data || []);
    } catch {
      setError("Failed to load table data.");
    }
  }, []);

  useEffect(() => {
    if (template?.getApi && template.getApi.trim() !== "") {
      handleGetData(template);
    }
  }, [template, handleGetData]);

  /* ----------------------------------------------
      FORM ACTION HANDLERS
  ---------------------------------------------- */
  const handleCreate = useCallback(
    async (payload) => {
      if (!template?.addApi) return false;

      try {
        await axios.post(template.addApi, payload);
        await handleGetData(template);
        return true;
      } catch {
        setError("Create failed.");
        return false;
      }
    },
    [template, handleGetData]
  );

  const handleUpdate = useCallback(
    async (id, payload) => {
      if (!template?.updateApi) return false;

      try {
        await axios.patch(`${template.updateApi}/${id}`, payload);
        await handleGetData(template);
        return true;
      } catch {
        setError("Update failed.");
        return false;
      }
    },
    [template, handleGetData]
  );

  /* ----------------------------------------------
      ERROR STATES (TOP PRIORITY)
  ---------------------------------------------- */

  // 1️⃣ still decrypting
  if (!decryptDone) {
    return <div className="p-10 text-center text-gray-500">Validating link...</div>;
  }

  // 2️⃣ decrypt failed
  if (decryptDone && !decryptedId) {
    return (
      <div className="p-10 text-center text-red-600 font-bold text-xl">
        ❌ Invalid or Tampered URL  
        <div className="mt-2 text-gray-600 text-sm">
          The link you used is broken or modified.  
        </div>
      </div>
    );
  }

  // 3️⃣ any error message
  if (error) {
    return (
      <div className="p-10 text-center text-red-600 font-bold text-xl">
        ❌ {error}
      </div>
    );
  }

  // 4️⃣ loading template
  if (loading || !template) {
    return <Loading />;
  }


  /* ----------------------------------------------
      SUCCESS — SHOW PAGE
  ---------------------------------------------- */
  return (
    <motion.div variants={fadeInSlow} initial="hidden" animate="show">
      {/* <motion.h2 className="text-lg font-bold mb-4" variants={fadeIn}>
        Form : {template.name}
      </motion.h2> */}

      <PageBuilder
        moduleName={template.name}
        templateId={template.id}
        rows={tableData}
        AddMore={true}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onBulkSuccess={() => handleGetData(template)}
      />
    </motion.div>
  );
};

export default Form;
