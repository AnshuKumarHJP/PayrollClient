import {
  GET_ALL_FIELDVALIDATIONRULES_REQUEST,
  GET_ALL_FIELDVALIDATIONRULES_SUCCESS,
  GET_ALL_FIELDVALIDATIONRULES_FAILURE,

  GET_FIELDVALIDATIONRULE_REQUEST,
  GET_FIELDVALIDATIONRULE_SUCCESS,
  GET_FIELDVALIDATIONRULE_FAILURE,

  UPSERT_FIELDVALIDATIONRULE_REQUEST,
  UPSERT_FIELDVALIDATIONRULE_SUCCESS,
  UPSERT_FIELDVALIDATIONRULE_FAILURE,

  DELETE_FIELDVALIDATIONRULE_REQUEST,
  DELETE_FIELDVALIDATIONRULE_SUCCESS,
  DELETE_FIELDVALIDATIONRULE_FAILURE,


  DELETE_FORMBUILDER_REQUEST,
  DELETE_FORMBUILDER_SUCCESS,
  DELETE_FORMBUILDER_FAILURE,

  UPSERT__FORMBUILDER_REQUEST,
  UPSERT__FORMBUILDER_SUCCESS,
  UPSERT__FORMBUILDER_FAILURE,

  GET_FORMBUILDER_REQUEST,
  GET_FORMBUILDER_SUCCESS,
  GET_FORMBUILDER_FAILURE,

  GET_FORMBUILDER_BY_ID_REQUEST,
  GET_FORMBUILDER_BY_ID_SUCCESS,
  GET_FORMBUILDER_BY_ID_FAILURE,

  INSERT_CLIENT_FORM_BUILDER_HEADER_MAPPING_REQUEST,
  INSERT_CLIENT_FORM_BUILDER_HEADER_MAPPING_SUCCESS,
  INSERT_CLIENT_FORM_BUILDER_HEADER_MAPPING_FAILURE,

  DELETE_CLIENT_FORM_BUILDER_HEADER_MAPPING_BY_ID_REQUEST,
  DELETE_CLIENT_FORM_BUILDER_HEADER_MAPPING_BY_ID_SUCCESS,
  DELETE_CLIENT_FORM_BUILDER_HEADER_MAPPING_BY_ID_FAILURE,

  GET_CLIENT_FORM_BUILDER_HEADER_MAPPINGS_BY_CLIENT_ID_REQUEST,
  GET_CLIENT_FORM_BUILDER_HEADER_MAPPINGS_BY_CLIENT_ID_SUCCESS,
  GET_CLIENT_FORM_BUILDER_HEADER_MAPPINGS_BY_CLIENT_ID_FAILURE,

  UPSERT_CLIENT_PORTAL_WORKFLOW_CONFIGURATION_REQUEST,
  UPSERT_CLIENT_PORTAL_WORKFLOW_CONFIGURATION_SUCCESS,
  UPSERT_CLIENT_PORTAL_WORKFLOW_CONFIGURATION_FAILURE,

  DELETE_CLIENT_PORTAL_WORKFLOW_CONFIGURATION_BY_ID_REQUEST,
  DELETE_CLIENT_PORTAL_WORKFLOW_CONFIGURATION_BY_ID_SUCCESS,
  DELETE_CLIENT_PORTAL_WORKFLOW_CONFIGURATION_BY_ID_FAILURE,

  GET_ALL_CLIENT_PORTAL_WORKFLOW_CONFIGURATIONS_REQUEST,
  GET_ALL_CLIENT_PORTAL_WORKFLOW_CONFIGURATIONS_SUCCESS,
  GET_ALL_CLIENT_PORTAL_WORKFLOW_CONFIGURATIONS_FAILURE,

  GET_MASTER_DATA_FOR_CLIENT_PORTAL_WORKFLOW_CREATION_REQUEST,
  GET_MASTER_DATA_FOR_CLIENT_PORTAL_WORKFLOW_CREATION_SUCCESS,
  GET_MASTER_DATA_FOR_CLIENT_PORTAL_WORKFLOW_CREATION_FAILURE,

} from "./ActionType";

import ClientAPI from "../../services/ClientApi";
import { toast } from "../../Library/use-toast";
import CryptoService from "../../Security/useCrypto";

/* =====================================================
   GET ALL – ONLY PLACE WHERE LIST DATA IS SET
===================================================== */
export const GetAllFieldValidationRules = (signal) => async (dispatch) => {
  const controller = new AbortController();
  dispatch({ type: GET_ALL_FIELDVALIDATIONRULES_REQUEST });

  try {
    const res = await ClientAPI("/api/FieldValidationRule/GetAllFieldValidationRules", null, "GET", null, "normal", signal || controller.signal);
    const decrypted = CryptoService.decrypt(res?.data);
    if (!decrypted?.Status) {
      throw new Error(
        decrypted?.Message || "Failed to fetch field validation rules"
      );
    }

    const parsedResult =
      typeof decrypted.Result === "string"
        ? JSON.parse(decrypted.Result)
        : decrypted.Result ?? [];
    dispatch({ type: GET_ALL_FIELDVALIDATIONRULES_SUCCESS, payload: parsedResult });
    return parsedResult;
  } catch (error) {
    dispatch({
      type: GET_ALL_FIELDVALIDATIONRULES_FAILURE, payload: error.message || "Failed to fetch field validation rules"
    });
    throw error;
  } finally {
    controller.abort(); // 🔥 API CANCELLED HERE
  }
};

/* =====================================================
   GET BY ID – DOES NOT TOUCH LIST
===================================================== */
export const GetFieldValidationRuleById = (id, signal) => async (dispatch) => {
  const controller = new AbortController();
  dispatch({ type: GET_FIELDVALIDATIONRULE_REQUEST });
  try {
    const decryptedId = CryptoService.decrypt(id);
    const res = await ClientAPI(`/api/FieldValidationRule/GetFieldValidationRuleById?Id=${decryptedId}`, null, "GET", null, "normal", signal || controller.signal);
    dispatch({
      type: GET_FIELDVALIDATIONRULE_SUCCESS,
      payload: res.data
    });

    return res.data;
  } catch (error) {
    dispatch({
      type: GET_FIELDVALIDATIONRULE_FAILURE,
      payload:
        error?.response?.data?.message ||
        "Failed to fetch field validation rule"
    });
    throw error;
  } finally {
    controller.abort(); // 🔥 API CANCELLED HERE
  }
};

/* =====================================================
   UPSERT – DOES NOT TOUCH LIST
===================================================== */
export const UpsertFieldValidationRule = (payload, signal) => async (dispatch) => {
  const controller = new AbortController();
  dispatch({ type: UPSERT_FIELDVALIDATIONRULE_REQUEST });

  try {
    const encryptedPayload = await CryptoService.encrypt(payload);
    const res = await ClientAPI("/api/FieldValidationRule/UpsertFieldValidationRule", encryptedPayload, "PUT", null, "normal", signal || controller.signal);
    const decrypted = CryptoService.decrypt(res?.data);
    if (!decrypted?.Status) {
      throw new Error(
        decrypted?.Message || "Failed to save field validation rule"
      );
    }
    dispatch({ type: UPSERT_FIELDVALIDATIONRULE_SUCCESS });
    toast({
      title: "Success",
      description: decrypted?.Message || "Saved successfully",
      variant: "success"
    });

    return decrypted;
  } catch (error) {
    dispatch({
      type: UPSERT_FIELDVALIDATIONRULE_FAILURE,
      payload: error.message || "Failed to save field validation rule",
    });

    toast({
      title: "Error",
      description: error.message,
      variant: "danger"
    });

    throw error;
  } finally {
    controller.abort(); // 🔥 API CANCELLED HERE
  }
};

/* =====================================================
   DELETE – DOES NOT TOUCH LIST
===================================================== */
export const DeleteFieldValidationRuleById = (id, signal) => async (dispatch) => {
  const controller = new AbortController();
  dispatch({ type: DELETE_FIELDVALIDATIONRULE_REQUEST });

  try {
    const encryptedPayload = await CryptoService.encrypt(id);

    const res = await ClientAPI("/api/FieldValidationRule/DeleteFieldValidationRuleById", encryptedPayload, "PUT", null, "normal", signal || controller.signal);
    const decrypted = CryptoService.decrypt(res?.data);
    if (!decrypted?.Status) {
      throw new Error(
        decrypted?.Message || "Failed to delete field validation rule"
      );
    }
    dispatch({ type: DELETE_FIELDVALIDATIONRULE_SUCCESS });
    toast({
      title: "Success",
      description: decrypted?.Message || "Deleted successfully",
      variant: "success"
    });
    return decrypted;
  } catch (error) {
    dispatch({
      type: DELETE_FIELDVALIDATIONRULE_FAILURE,
      payload: error.message || "Failed to delete field validation rule"
    });

    toast({
      title: "Error",
      description: error.message,
      variant: "danger"
    });

    throw error;
  } finally {
    controller.abort(); // 🔥 API CANCELLED HERE
  }
};





/* ===============================================================
// FormBuilder Actions
================================================================ */


/* ===============================================================
// GET ALL Forms
================================================================ */
export const GetFormBuilder = (signal) => async (dispatch) => {
  const controller = new AbortController();
  dispatch({ type: GET_FORMBUILDER_REQUEST });

  try {
    const res = await ClientAPI("/api/FormBuilder/GetAllFormBuilderHeader", null, "GET", null, "normal", signal || controller.signal);
    const decrypted = CryptoService.decrypt(res?.data);
    if (!decrypted?.Status) {
      throw new Error(
        decrypted?.Message || "Failed to fetch field validation rules"
      );
    }
    let parsed = [];
    try {
      parsed = JSON.parse(decrypted.Result || "[]");
    } catch (e) {
      parsed = [];
    }
    dispatch({ type: GET_FORMBUILDER_SUCCESS, payload: parsed });
  } catch (error) {
    dispatch({
      type: GET_FORMBUILDER_FAILURE,
      payload: error.response?.data?.message || "Failed to fetch forms",
    });
    toast({
      title: "Error",
      description: error.response?.data?.message || "Failed to fetch forms",
      variant: "danger"
    });
  } finally {
    controller.abort(); // 🔥 API CANCELLED HERE
  }
};

/* =====================================================
   UPSERT FORM BUILDER – DOES NOT TOUCH LIST
===================================================== */
export const UpsertFormBuilder = (payload, signal) => async (dispatch) => {
  const controller = new AbortController();
  dispatch({ type: UPSERT__FORMBUILDER_REQUEST });

  try {
    const encryptedPayload = await CryptoService.encrypt(payload);

    const res = await ClientAPI("/api/FormBuilder/UpsertFormBuilderHeader", encryptedPayload, "PUT", null, "normal", signal || controller.signal);
    const decrypted = CryptoService.decrypt(res?.data);
    if (!decrypted?.Status) {
      throw new Error(
        decrypted?.Message || "Failed to save form builder"
      );
    }
    dispatch({ type: UPSERT__FORMBUILDER_SUCCESS });
    toast({
      title: "Success",
      description: decrypted?.Message || "Saved successfully",
      variant: "success"
    });

    return decrypted;
  } catch (error) {
    dispatch({
      type: UPSERT__FORMBUILDER_FAILURE,
      payload: error.message || "Failed to save form builder"
    });

    toast({
      title: "Error",
      description: error.message,
      variant: "danger"
    });

    throw error;
  } finally {
    controller.abort(); // 🔥 API CANCELLED HERE
  }
};

/* ===============================================================
// DELETE Form
================================================================ */
export const DeleteFormBuilder = (id, signal) => async (dispatch) => {
  const controller = new AbortController();
  dispatch({ type: DELETE_FORMBUILDER_REQUEST });

  try {
    const encryptedPayload = await CryptoService.encrypt(id);

    const res = await ClientAPI("/api/FormBuilder/DeleteFormBuilderHeaderById", encryptedPayload, "PUT", null, "normal", signal || controller.signal);

    const decrypted = CryptoService.decrypt(res?.data);

    if (!decrypted?.Status) {
      throw new Error(
        decrypted?.Message || "Failed to delete form builder"
      );
    }

    dispatch({ type: DELETE_FORMBUILDER_SUCCESS });

    toast({
      title: "Success",
      description: decrypted?.Message || "Deleted successfully",
      variant: "success"
    });

    return decrypted;
  } catch (error) {
    const msg = error.response?.data?.message || "Failed to delete form";

    dispatch({ type: DELETE_FORMBUILDER_FAILURE, payload: msg });

    toast({ title: "Error", description: msg, variant: "danger" });
  } finally {
    controller.abort(); // 🔥 API CANCELLED HERE
  }
};

/* ===============================================================
// GET Form By ID
================================================================ */
export const GetFormBuilderById = (id, signal) => async (dispatch) => {
  const controller = new AbortController();
  dispatch({ type: GET_FORMBUILDER_BY_ID_REQUEST });
  try {
    const encryptedPayload = await CryptoService.encrypt(id);
    const res = await ClientAPI(`/api/FormBuilder/GetFormBuilderHeaderById?Id=${encryptedPayload}`, null, "GET", null, "normal", signal || controller.signal);
    const decrypted = CryptoService.decrypt(res?.data);
    if (!decrypted?.Status) {
      throw new Error(
        decrypted?.Message || "Failed to fetch form builder"
      );
    }

    let parsedResult = null;
    try {
      parsedResult =
        typeof decrypted.Result === "string"
          ? JSON.parse(decrypted.Result)
          : decrypted.Result ?? null;
    } catch (error) {
      try {
        if (typeof decrypted.Result === "string") {
          let depth = 0;
          let inString = false;
          let escape = false;
          let end = -1;
          let started = false;

          for (let i = 0; i < decrypted.Result.length; i++) {
            const char = decrypted.Result[i];

            if (!started) {
              if (char === '{' || char === '[') {
                started = true;
                depth = 1; // Start with depth 1 for the first brace
              }
              continue; // Skip everything until we find the start
            }

            if (escape) { escape = false; continue; }
            if (char === '\\') { escape = true; continue; }
            if (char === '"') { inString = !inString; continue; }

            if (!inString) {
              if (char === '{' || char === '[') depth++;
              if (char === '}' || char === ']') depth--;

              if (depth === 0) {
                end = i + 1;
                break;
              }
            }
          }

          if (end !== -1) {
            // Find the actual start index for substring extraction
            const startIndex = decrypted.Result.indexOf('{') !== -1
              ? Math.min(
                decrypted.Result.indexOf('{') === -1 ? Infinity : decrypted.Result.indexOf('{'),
                decrypted.Result.indexOf('[') === -1 ? Infinity : decrypted.Result.indexOf('[')
              )
              : 0;

            const cleanJson = decrypted.Result.substring(startIndex, end);
            parsedResult = JSON.parse(cleanJson);
          }
        }
      } catch (retryError) {
        console.error("Recovery parse failed:", retryError);
        parsedResult = null;
      }
    }

    if (parsedResult?.ClientPortalWorkflowConfiguration) {
      try {
        const config = JSON.parse(parsedResult.ClientPortalWorkflowConfiguration);
        parsedResult.ClientPortalWorkflowConfiguration = Array.isArray(config) ? config : [config];
      } catch (error) {
        console.warn("Error parsing ClientPortalWorkflowConfiguration", error);
        parsedResult.ClientPortalWorkflowConfiguration = [];
      }
    }
    dispatch({ type: GET_FORMBUILDER_BY_ID_SUCCESS, payload: parsedResult });
    return parsedResult;
  }
  catch (error) {
    dispatch({
      type: GET_FORMBUILDER_BY_ID_FAILURE,
      payload: error.response?.data?.message || "Failed to fetch form",
    });
    toast({
      title: "Error",
      description: error.message,
      variant: "danger"
    });
    throw error;
  } finally {
    controller.abort(); // 🔥 API CANCELLED HERE
  }
};




/* ===============================================================
   ClientFormBuilderHeaderMapping Actions
================================================================ */

/* =====================================================
   INSERT CLIENT FORM BUILDER HEADER MAPPING
===================================================== */
export const InsertClientFormBuilderHeaderMapping = (payload, signal) => async (dispatch) => {
  const controller = new AbortController();
  dispatch({ type: INSERT_CLIENT_FORM_BUILDER_HEADER_MAPPING_REQUEST });

  try {
    console.log(payload);
    const encryptedPayload = await CryptoService.encrypt(payload);
    const res = await ClientAPI("/api/FormBuilder/InsertClientFormBuilderHeaderMapping", encryptedPayload, "PUT", null, "normal", signal || controller.signal);
    const decrypted = CryptoService.decrypt(res?.data);
    if (!decrypted?.Status) {
      throw new Error(
        decrypted?.Message || "Failed to insert client form builder header mapping"
      );
    }
    dispatch({ type: INSERT_CLIENT_FORM_BUILDER_HEADER_MAPPING_SUCCESS });
    toast({
      title: "Success",
      description: decrypted?.Message || "Inserted successfully",
      variant: "success"
    });

    return decrypted;
  } catch (error) {
    dispatch({
      type: INSERT_CLIENT_FORM_BUILDER_HEADER_MAPPING_FAILURE,
      payload: error.message || "Failed to insert client form builder header mapping"
    });

    toast({
      title: "Error",
      description: error.message,
      variant: "danger"
    });

    throw error;
  } finally {
    controller.abort(); // 🔥 API CANCELLED HERE
  }
};

/* =====================================================
   DELETE CLIENT FORM BUILDER HEADER MAPPING BY ID
===================================================== */
export const DeleteClientFormBuilderHeaderMappingById = (id, signal) => async (dispatch) => {
  const controller = new AbortController();
  dispatch({ type: DELETE_CLIENT_FORM_BUILDER_HEADER_MAPPING_BY_ID_REQUEST });

  try {
    const encryptedPayload = await CryptoService.encrypt(id);
    const res = await ClientAPI("/api/FormBuilder/DeleteClientFormBuilderHeaderMappingById", encryptedPayload, "PUT", null, "normal", signal || controller.signal);
    const decrypted = CryptoService.decrypt(res?.data);
    if (!decrypted?.Status) {
      throw new Error(
        decrypted?.Message || "Failed to delete client form builder header mapping"
      );
    }
    dispatch({ type: DELETE_CLIENT_FORM_BUILDER_HEADER_MAPPING_BY_ID_SUCCESS });
    toast({
      title: "Success",
      description: decrypted?.Message || "Deleted successfully",
      variant: "success"
    });
    return decrypted;
  } catch (error) {
    dispatch({
      type: DELETE_CLIENT_FORM_BUILDER_HEADER_MAPPING_BY_ID_FAILURE,
      payload: error.message || "Failed to delete client form builder header mapping"
    });

    toast({
      title: "Error",
      description: error.message,
      variant: "danger"
    });

    throw error;
  } finally {
    controller.abort(); // 🔥 API CANCELLED HERE
  }
};

/* =====================================================
   GET CLIENT FORM BUILDER HEADER MAPPINGS BY CLIENT ID
===================================================== */
export const GetClientFormBuilderHeaderMappingsByClientId = (clientId, signal) => async (dispatch) => {
  const controller = new AbortController();
  dispatch({ type: GET_CLIENT_FORM_BUILDER_HEADER_MAPPINGS_BY_CLIENT_ID_REQUEST });

  try {
    const encryptedClientId = await CryptoService.encrypt(clientId);
    const res = await ClientAPI(`/api/FormBuilder/GetClientFormBuilderHeaderMappingsByClientId?ClientId=${encryptedClientId}`, null, "GET", null, "normal", signal || controller.signal);
    const decrypted = CryptoService.decrypt(res?.data);
    if (!decrypted?.Status) {
      throw new Error(
        decrypted?.Message || "Failed to fetch client form builder header mappings"
      );
    }
    const parsedResult =
      typeof decrypted.Result === "string"
        ? JSON.parse(decrypted.Result)
        : decrypted.Result ?? [];

    dispatch({ type: GET_CLIENT_FORM_BUILDER_HEADER_MAPPINGS_BY_CLIENT_ID_SUCCESS, payload: parsedResult });
    return parsedResult;
  } catch (error) {
    console.log(error);
    dispatch({
      type: GET_CLIENT_FORM_BUILDER_HEADER_MAPPINGS_BY_CLIENT_ID_FAILURE,
      payload: error.message || "Failed to fetch client form builder header mappings"
    });
    toast({
      title: "Error",
      description: error.message,
      variant: "danger"
    });
    throw error;
  } finally {
    controller.abort(); // 🔥 API CANCELLED HERE
  }
};



/* ===============================================================
   ClientPortalWorkflowConfiguration Actions
================================================================ */

/* =====================================================
   UPSERT CLIENT PORTAL WORKFLOW CONFIGURATION
===================================================== */
export const UpsertClientPortalWorkflowConfiguration = (payload, signal) => async (dispatch) => {
  const controller = new AbortController();
  dispatch({ type: UPSERT_CLIENT_PORTAL_WORKFLOW_CONFIGURATION_REQUEST });

  try {
    const encryptedPayload = await CryptoService.encrypt(payload);
    const res = await ClientAPI("/api/ClientPortalWorkflow/UpsertClientPortalWorkflowConfiguration", encryptedPayload, "PUT", null, "normal", signal || controller.signal);
    const decrypted = CryptoService.decrypt(res?.data);
    if (!decrypted?.Status) {
      throw new Error(
        decrypted?.Message || "Failed to upsert client portal workflow configuration"
      );
    }
    dispatch({ type: UPSERT_CLIENT_PORTAL_WORKFLOW_CONFIGURATION_SUCCESS });

    return decrypted;
  } catch (error) {
    dispatch({
      type: UPSERT_CLIENT_PORTAL_WORKFLOW_CONFIGURATION_FAILURE,
      payload: error.message || "Failed to upsert client portal workflow configuration"
    });

    toast({
      title: "Error",
      description: error.message,
      variant: "danger"
    });

    throw error;
  } finally {
    controller.abort(); // 🔥 API CANCELLED HERE
  }
};

/* =====================================================
   DELETE CLIENT PORTAL WORKFLOW CONFIGURATION BY ID
===================================================== */
export const DeleteClientPortalWorkflowConfigurationById = (id, signal) => async (dispatch) => {
  const controller = new AbortController();
  dispatch({ type: DELETE_CLIENT_PORTAL_WORKFLOW_CONFIGURATION_BY_ID_REQUEST });

  try {
    const encryptedPayload = await CryptoService.encrypt(id);
    const res = await ClientAPI("/api/ClientPortalWorkflow/DeleteClientPortalWorkflowConfigurationById", encryptedPayload, "PUT", null, "normal", signal || controller.signal);
    const decrypted = CryptoService.decrypt(res?.data);
    if (!decrypted?.Status) {
      throw new Error(
        decrypted?.Message || "Failed to delete client portal workflow configuration"
      );
    }
    dispatch({ type: DELETE_CLIENT_PORTAL_WORKFLOW_CONFIGURATION_BY_ID_SUCCESS });
    toast({
      title: "Success",
      description: decrypted?.Message || "Deleted successfully",
      variant: "success"
    });
    return decrypted;
  } catch (error) {
    dispatch({
      type: DELETE_CLIENT_PORTAL_WORKFLOW_CONFIGURATION_BY_ID_FAILURE,
      payload: error.message || "Failed to delete client portal workflow configuration"
    });

    toast({
      title: "Error",
      description: error.message,
      variant: "danger"
    });

    throw error;
  } finally {
    controller.abort(); // 🔥 API CANCELLED HERE
  }
};

/* =====================================================
   GET ALL CLIENT PORTAL WORKFLOW CONFIGURATIONS
===================================================== */
export const GetAllClientPortalWorkflowConfigurations = ({ ClientId, ClientContractId }, signal) => async (dispatch) => {
  const controller = new AbortController();
  dispatch({ type: GET_ALL_CLIENT_PORTAL_WORKFLOW_CONFIGURATIONS_REQUEST });

  try {
    const encryptedClientId = await CryptoService.encrypt(ClientId);
    const encryptedClientContractId = await CryptoService.encrypt(ClientContractId);
    const res = await ClientAPI(`/api/ClientPortalWorkflow/GetAllClientPortalWorkflowConfigurations?ClientId=${encryptedClientId}&ClientContractId=${encryptedClientContractId}`, null, "GET", null, "normal", signal || controller.signal);
    const decrypted = CryptoService.decrypt(res?.data);
    if (!decrypted?.Status) {
      throw new Error(
        decrypted?.Message || "Failed to fetch client portal workflow configurations"
      );
    }
    const parsedResult =
      typeof decrypted.Result === "string"
        ? JSON.parse(decrypted.Result)
        : decrypted.Result ?? [];
    dispatch({ type: GET_ALL_CLIENT_PORTAL_WORKFLOW_CONFIGURATIONS_SUCCESS, payload: parsedResult });
    return parsedResult;
  } catch (error) {
    dispatch({
      type: GET_ALL_CLIENT_PORTAL_WORKFLOW_CONFIGURATIONS_FAILURE,
      payload: error.message || "Failed to fetch client portal workflow configurations"
    });
    toast({
      title: "Error",
      description: error.message,
      variant: "danger"
    });
    throw error;
  } finally {
    controller.abort(); // 🔥 API CANCELLED HERE
  }
};

/* =====================================================
   GET MASTER DATA FOR CLIENT PORTAL WORKFLOW CREATION
===================================================== */
export const GetMasterDataForClientPortalWorkflowCreation = ({ ClientId, ClientContractId }, signal) => async (dispatch) => {
  const controller = new AbortController();
  dispatch({ type: GET_MASTER_DATA_FOR_CLIENT_PORTAL_WORKFLOW_CREATION_REQUEST });

  try {
    const encryptedClientId = await CryptoService.encrypt(ClientId);
    const encryptedClientContractId = await CryptoService.encrypt(ClientContractId);
    const res = await ClientAPI(`/api/ClientPortalWorkflow/GetMasterDataForClientPortalWorkflowCreation?ClientId=${encryptedClientId}&ClientContractId=${encryptedClientContractId}`, null, "GET", null, "normal", signal || controller.signal);
    const decrypted = CryptoService.decrypt(res?.data);
    if (!decrypted?.Status) {
      throw new Error(
        decrypted?.Message || "Failed to fetch master data for client portal workflow creation"
      );
    }
    const parsedResult =
      typeof decrypted.Result === "string"
        ? JSON.parse(decrypted.Result)
        : decrypted.Result ?? null;

    dispatch({ type: GET_MASTER_DATA_FOR_CLIENT_PORTAL_WORKFLOW_CREATION_SUCCESS, payload: parsedResult });
    return parsedResult;
  } catch (error) {
    dispatch({
      type: GET_MASTER_DATA_FOR_CLIENT_PORTAL_WORKFLOW_CREATION_FAILURE,
      payload: error.message || "Failed to fetch master data for client portal workflow creation"
    });
    toast({
      title: "Error",
      description: error.message,
      variant: "danger"
    });
    throw error;
  } finally {
    controller.abort(); // 🔥 API CANCELLED HERE
  }
};






