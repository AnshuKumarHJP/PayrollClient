import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import PageBuilder from "./PageBuilder";
import Loading from "../../Component/Loading";
import CryptoService from "../../Security/useCrypto";
import { GetFormBuilderById } from "../../Store/FormBuilder/Action";
import { InitiateClientPortalWFBatchService } from "./FormDataService";
import { useToast } from "../../Library/use-toast";

const fadeInSlow = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4 } }
};

const Form = () => {
  const { templateID } = useParams();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const { data: template, isLoading, error } = useSelector(
    (state) => state.FormBuilderStore.FormBuilder
  );

  const [decryptedId, setDecryptedId] = useState(null);
  const [decryptDone, setDecryptDone] = useState(false);
  const [PayloadStatus, setPayloadStatus] = useState(1000);

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


  /* ---------------- UPSERT (ADD + UPDATE) ---------------- */
  const handleUpsert = useCallback(
    async ({ isEdit, recordId, data }) => {
      if (!template?.UpsertApi) return false;
      let ClientPortalWorkflowConfigurationId = null;
      let ModuleProcessActionId = null;
      if (template?.ClientPortalWorkflowConfiguration?.length > 0) {
        const properties = template.ClientPortalWorkflowConfiguration[0]?.ClientPortalWorkflowProperties;
        ClientPortalWorkflowConfigurationId = template.ClientPortalWorkflowConfiguration[0]?.Id;
        ModuleProcessActionId = template.ClientPortalWorkflowConfiguration[0]?.ModuleProcessActionId;
        if (Array.isArray(properties)) {
          const matchedProperty = properties.find(x => x.FlowOrder === 1);
          if (matchedProperty && matchedProperty.ActionProcessingStatus !== undefined) {
            setPayloadStatus(matchedProperty.ActionProcessingStatus);
          }
        }
      }

      try {
        const rawPayload = isEdit ? { ...data, id: recordId } : data;

        // Ensure payload is an array for batch processing
        const payloadArray = Array.isArray(rawPayload) ? rawPayload : [rawPayload];

        const finalPayload = {
          BatchName: `Batch-${template?.Name}-${Date.now()}`,
          ModuleId: template?.ModuleId,
          FormBuilderId: template?.Id,
          ClientPortalWorkflowConfigurationId: ClientPortalWorkflowConfigurationId,
          RequestCount: payloadArray.length,
          ObjectStorageId: 0,
          SearchCriteria: "",
          ModuleProcessId: template?.ModuleId,
          ModuleProcessActionId: ModuleProcessActionId,
          SourcePayload: JSON.stringify(payloadArray),
          Status: PayloadStatus
        }
        const res = await InitiateClientPortalWFBatchService(finalPayload)
        if (res?.Status) {
          toast({
            title: "Success",
            description: res.Message || "Form submitted successfully",
            variant: "success"
          });
          return true;
        } else {
          toast({
            title: "Error",
            description: res.Message || "Form submitted failed",
            variant: "error"
          });
          return false;
        }
      } catch (err) {
        console.error("Upsert failed", err);
        return false;
      }
    },
    [template]
  );

  const handleBulkSave = async (bulkData) => {
    console.log("Bulk save data:", bulkData);
    if (!template?.UpsertApi) return false;
    let ClientPortalWorkflowConfigurationId = null;
    let ModuleProcessActionId = null;
    if (template?.ClientPortalWorkflowConfiguration?.length > 0) {
      const properties = template.ClientPortalWorkflowConfiguration[0]?.ClientPortalWorkflowProperties;
      ClientPortalWorkflowConfigurationId = template.ClientPortalWorkflowConfiguration[0]?.Id;
      ModuleProcessActionId = template.ClientPortalWorkflowConfiguration[0]?.ModuleProcessActionId;
      if (Array.isArray(properties)) {
        const matchedProperty = properties.find(x => x.FlowOrder === 1);
        if (matchedProperty && matchedProperty.ActionProcessingStatus !== undefined) {
          setPayloadStatus(matchedProperty.ActionProcessingStatus);
        }
      }
    }
    try {
      // Fix: rows are inside excelData
      const { excelData, ...rest } = bulkData;
      const rows = excelData?.rows || [];

      const payloadArray = rows.map(row => ({
        ...rest,
        ...row
      }));
      const finalPayload = {
        BatchName: `Batch-${template?.Name}-${Date.now()}`,
        ModuleId: template?.ModuleId,
        FormBuilderId: template?.Id,
        ClientPortalWorkflowConfigurationId: ClientPortalWorkflowConfigurationId,
        RequestCount: payloadArray.length,
        ObjectStorageId: 0,
        SearchCriteria: "",
        ModuleProcessId: template?.ModuleId,
        ModuleProcessActionId: ModuleProcessActionId,
        SourcePayload: JSON.stringify(payloadArray),
        Status: PayloadStatus
      }
      console.log("finalPayload", finalPayload);
      return true;
      const res = await InitiateClientPortalWFBatchService(finalPayload)
      if (res?.Status) {
        toast({
          title: "Success",
          description: res.Message || "Form submitted successfully",
          variant: "success"
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: res.Message || "Form submitted failed",
          variant: "error"
        });
        return false;
      }
    } catch (error) {
      console.error("Bulk save failed", error);
      return false;
    }
  }

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
        AddMore
        onUpsert={handleUpsert}
        onBulkSave={handleBulkSave}
      />
    </motion.div>
  );
};

export default Form;
