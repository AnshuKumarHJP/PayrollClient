import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { GetFormBuilderById } from '../../Store/FormBuilder/Action';
import AppIcon from '../../Component/AppIcon';
import PageLoading from '../../Component/PageLoading';
import Button from '../../Library/Button';
import CryptoService from '../../Security/useCrypto';
import useScreen from '../../Hooks/useScreen';
import FormBuilder from './PageBuilder';
import { InitiateClientPortalWFBatchService } from './FormDataService';
import { toast } from '../../Library/use-toast';

const Forms = () => {
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const { isMobile } = useScreen();
    const formId = searchParams.get('id');
    const [decryptedId, setDecryptedId] = useState(null);
    const [decryptDone, setDecryptDone] = useState(false);
    const [PayloadStatus, setPayloadStatus] = useState(null);

    const { currentForm, isLoading, error } = useSelector((s) => s.FormBuilderStore.FormBuilder);

    /* ---------------- DECRYPT ---------------- */
    useEffect(() => {
        const id = CryptoService.DecryptWithAES(formId);
        setDecryptedId(id || null);
        setDecryptDone(true);
    }, [formId]);

    /* ---------------- FETCH TEMPLATE ---------------- */
    useEffect(() => {
        if (decryptDone && decryptedId) {
            dispatch(GetFormBuilderById(decryptedId));
        }
    }, [decryptDone, decryptedId, dispatch]);

    /* ---------------- UPSERT (ADD + UPDATE) ---------------- */
    const handleUpsert = useCallback(
        async ({ isEdit, recordId, data }) => {
            if (!currentForm?.UpsertApi) return false;
            let ClientPortalWorkflowConfigurationId = null;
            let ModuleProcessActionId = null;
            if (currentForm?.ClientPortalWorkflowConfiguration?.length > 0) {
                const properties = currentForm.ClientPortalWorkflowConfiguration[0]?.ClientPortalWorkflowProperties;
                ClientPortalWorkflowConfigurationId = currentForm.ClientPortalWorkflowConfiguration[0]?.Id;
                ModuleProcessActionId = currentForm.ClientPortalWorkflowConfiguration[0]?.ModuleProcessActionId;
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
                    BatchName: `Batch-${currentForm?.Name}-${Date.now()}`,
                    ModuleId: currentForm?.ModuleId,
                    FormBuilderId: currentForm?.Id,
                    ClientPortalWorkflowConfigurationId: ClientPortalWorkflowConfigurationId,
                    RequestCount: payloadArray.length,
                    ObjectStorageId: 0,
                    SearchCriteria: "",
                    ModuleProcessId: currentForm?.ModuleId,
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
        [currentForm, PayloadStatus]
    );

    const handleBulkSave = async (bulkData) => {
        console.log("Bulk save data:", bulkData);
        if (!currentForm?.UpsertApi) return false;
        let ClientPortalWorkflowConfigurationId = null;
        let ModuleProcessActionId = null;
        if (currentForm?.ClientPortalWorkflowConfiguration?.length > 0) {
            const properties = currentForm.ClientPortalWorkflowConfiguration[0]?.ClientPortalWorkflowProperties;
            ClientPortalWorkflowConfigurationId = currentForm.ClientPortalWorkflowConfiguration[0]?.Id;
            ModuleProcessActionId = currentForm.ClientPortalWorkflowConfiguration[0]?.ModuleProcessActionId;
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
                BatchName: `Batch-${currentForm?.Name}-${Date.now()}`,
                ModuleId: currentForm?.ModuleId,
                FormBuilderId: currentForm?.Id,
                ClientPortalWorkflowConfigurationId: ClientPortalWorkflowConfigurationId,
                RequestCount: payloadArray.length,
                ObjectStorageId: 0,
                SearchCriteria: "",
                ModuleProcessId: currentForm?.ModuleId,
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
    if (!decryptDone || isLoading) return <PageLoading />;

    if (!decryptedId || error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
                <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-800 text-center">
                    <div className="h-16 w-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 mx-auto mb-6">
                        <AppIcon name="ShieldAlert" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        {!decryptedId ? "Invalid Access Link" : "System Error"}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">
                        {!decryptedId
                            ? "The link you followed may be broken or expired. Please contact support if you believe this is an error."
                            : error}
                    </p>
                    <Button
                        variant="primary"
                        onClick={() => window.history.back()}
                        icon={<AppIcon name="ArrowLeft" size={16} />}
                        className="w-full justify-center"
                    >
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }
    if (!currentForm) return null;

    return (
        <div className="min-h-screen pb-12 bg-slate-50/50 dark:bg-slate-950/20">
            <FormBuilder
                Template={currentForm}
                AddMore
                onUpsert={handleUpsert}
                onBulkSave={handleBulkSave}
            />
        </div>
    );
};

export default Forms;

