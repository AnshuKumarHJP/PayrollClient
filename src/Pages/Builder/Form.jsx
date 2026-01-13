import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import axios from "axios";

import PageBuilder from "./PageBuilder";
import Loading from "../../Component/Loading";
import CryptoService from "../../Security/useCrypto";
import { GetFormBuilderById } from "../../Store/FormBuilder/Action";

const fadeInSlow = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4 } }
};

const Form = () => {
  const { templateID } = useParams();
  const dispatch = useDispatch();

  const { data: template, isLoading, error } = useSelector(
    (state) => state.FormBuilderStore.FormBuilder
  );

  const [decryptedId, setDecryptedId] = useState(null);
  const [decryptDone, setDecryptDone] = useState(false);
  const [tableData, setTableData] = useState([]);

  /* ---------------- DECRYPT ---------------- */
  useEffect(() => {
    const id = CryptoService.DecryptWithAES(templateID);
    setDecryptedId(id || null);
    setDecryptDone(true);
  }, [templateID]);

  /* ---------------- FETCH TEMPLATE ---------------- */
  useEffect(() => {
    if (decryptDone && decryptedId) {
      dispatch(GetFormBuilderById(decryptedId));
    }
  }, [decryptDone, decryptedId, dispatch]);

  /* ---------------- GET TABLE DATA ---------------- */
  const getTableData = useCallback(async () => {
    if (!template?.GetApi) return;

    try {
      const res = await axios.get(template.GetApi);
      setTableData(res.data ?? []);
    } catch (err) {
      console.error("GetApi failed", err);
    }
  }, [template]);

  useEffect(() => {
    if (template?.GetApi) {
      getTableData();
    }
  }, [template, getTableData]);

  /* ---------------- UPSERT (ADD + UPDATE) ---------------- */
  const handleUpsert = useCallback(
    async ({ isEdit, recordId, data }) => {
      if (!template?.UpsertApi) return false;
      console.log(data);
      
      try {
        const payload = isEdit ? { ...data, id: recordId } : data;
        // await axios.post(template.UpsertApi, payload);
        // await getTableData();
        return true;
      } catch (err) {
        console.error("Upsert failed", err);
        return false;
      }
    },
    [template, getTableData]
  );

  /* ---------------- UI STATES ---------------- */
  if (!decryptDone) return <div className="p-10">Validating link…</div>;
  if (!decryptedId) return <div className="p-10 text-red-600">Invalid URL</div>;
  if (isLoading) return <Loading />;
  if (error) return <div className="p-10 text-red-600">{error}</div>;
  if (!template) return null;

  return (
    <motion.div variants={fadeInSlow} initial="hidden" animate="show">
      <PageBuilder
        Template={template}
        rows={tableData}
        AddMore
        onUpsert={handleUpsert}
        onBulkSuccess={getTableData}
      />
    </motion.div>
  );
};

export default Form;
