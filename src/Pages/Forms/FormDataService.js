import ClientAPI from "../../services/ClientApi";
import CryptoService from "../../Security/useCrypto";
import { toast } from "../../Library/use-toast";

/* =====================================================
   INITIATE CLIENT PORTAL WF BATCH (Service)
===================================================== */
export const InitiateClientPortalWFBatchService = async (payload, signal) => {
    const controller = new AbortController();
    try {
        const encryptedPayload = await CryptoService.encrypt(payload);
        const res = await ClientAPI("/api/ClientPortalWorkflow/InitiateClientPortalWFBatch", encryptedPayload, "POST", null, "normal", signal || controller.signal);
        const decrypted = CryptoService.decrypt(res?.data);

        if (!decrypted?.Status) {
            throw new Error(
                decrypted?.Message || "Failed to initiate client portal workflow batch"
            );
        }

        toast({
            title: "Success",
            description: decrypted?.Message || "Batch initiated successfully",
            variant: "success"
        });

        return decrypted;
    } catch (error) {
        toast({
            title: "Error",
            description: error.message,
            variant: "danger"
        });
        throw error;
    } finally {
        controller.abort();
    }
};

/* =====================================================
   GET CLIENT PORTAL WF DETAILS FOR LOGGED IN USER (Service)
===================================================== */
export const GetClientPortalWFDetailsForLoggedInUserService = async (url, payload, signal) => {
    const controller = new AbortController();
    try {
        const ModuleId = await CryptoService.encrypt(String(payload?.ModuleId));
        const Status = await CryptoService.encrypt(String(payload?.Status));

        let finalUrl = url.replace("${ModuleId}", encodeURIComponent(ModuleId))
            .replace("${Status}", encodeURIComponent(Status));

        const res = await ClientAPI(finalUrl, null, "GET", null, "normal", signal || controller.signal);
        const decrypted = CryptoService.decrypt(res?.data);

        if (!decrypted?.Status) {
            throw new Error(
                decrypted?.Message || "Failed to fetch client portal workflow details"
            );
        }

        let parsedResult = [];
        const resultData = decrypted.Result;

        if (typeof resultData === "string") {
            try {
                parsedResult = JSON.parse(resultData);
            } catch (e) {
                console.warn("JSON parse failed, attempting cleanup", e);
                try {
                    // Remove trailing comma if present
                    const sanitized = resultData.trim().replace(/,$/, '');
                    parsedResult = JSON.parse(sanitized);
                } catch (e2) {
                    console.error("Critical JSON parse error", e2);
                    // Fallback or rethrow? content is likely corrupted
                    parsedResult = [];
                }
            }
        } else {
            parsedResult = resultData ?? [];
        }

        return parsedResult;
    } catch (error) {
        toast({
            title: "Error",
            description: error.message,
            variant: "danger"
        });
        throw error;
    } finally {
        controller.abort();
    }
};

/* =====================================================
   UPDATE CLIENT PORTAL WF BATCH (Service)
   Used for Claim, Assign, Approve, Reject actions
===================================================== */
export const UpdateClientPortalWFBatchService = async (payload, signal) => {
    const controller = new AbortController();
    try {
        const encryptedPayload = await CryptoService.encrypt(payload);
        const res = await ClientAPI("/api/ClientPortalWorkflow/UpdateClientPortalWFBatch", encryptedPayload, "POST", null, "normal", signal || controller.signal);
        const decrypted = CryptoService.decrypt(res?.data);

        if (!decrypted?.Status) {
            throw new Error(
                decrypted?.Message || "Failed to update workflow batch"
            );
        }

        toast({
            title: "Success",
            description: decrypted?.Message || "Action completed successfully",
            variant: "success"
        });

        return decrypted;
    } catch (error) {
        toast({
            title: "Error",
            description: error.message || "Failed to update workflow batch",
            variant: "danger"
        });
        throw error;
    } finally {
        controller.abort();
    }
};
