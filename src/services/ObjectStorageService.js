import ClientApi from "./ClientApi";
import { store } from "../Store/Store";
import CryptoService from "../Security/useCrypto";
import JSZip from 'jszip';

const API_ENDPOINTS = {
    POST_OBJECTSTORAGE: '/api/ObjectStorage/StoreObject',
    GET_OBJECT_BY_ID: '/api/ObjectStorage/GetStoredObjectById',
    DELETE_OBJECTSTORAGE: '/api/ObjectStorage/DeleteStoredObjectById',
};

/**
 * Helper to check if an object is empty
 */
const isObjectEmpty = (obj) => {
    return !obj || Object.keys(obj).length === 0;
};

/**
 * Constructs the ObjectStorageDetails object for the API payload
 */
const getObjectStorageInfo = async (documentFileObj, candidateId = 0, isCandidate = false, extraProps = {}) => {
    if (isObjectEmpty(documentFileObj)) return null;

    const state = store.getState();
    const loginSessionDetails = state.Auth?.LogResponce?.data;

    // get company code and id from session storage
    const companyId = extraProps.CompanyId || loginSessionDetails?.Company?.Id || 0;
    const companyCode = extraProps.CompanyCode || loginSessionDetails?.Company?.Code || '';

    // Robust retrieval of Client and Contract
    const selectedClientId = state.Auth?.Common?.SelectedClientCode;
    const selectedClientObj = loginSessionDetails?.ClientList?.find(x => x.Id == selectedClientId);

    const clientId = extraProps.ClientId || selectedClientObj?.Id || loginSessionDetails?.Client?.Id || 0;
    const clientCode = extraProps.ClientCode || selectedClientObj?.Code || loginSessionDetails?.Client?.Code || '';

    const selectedContractId = state.Auth?.Common?.SelectedClientContractCode;
    const selectedContractObj = loginSessionDetails?.ClientContractList?.find(x => x.Id == selectedContractId);

    const contractId = extraProps.ClientContractId || selectedContractObj?.Id || loginSessionDetails?.ClientContract?.Id || 0;
    const clientContractCode = extraProps.ClientContractCode || selectedContractObj?.Code || loginSessionDetails?.ClientContract?.Code || '';

    const docObjStorage = {
        Id: extraProps.Id || 0,
        ClientCode: clientCode || '',
        ClientId: Number(clientId) || 0,
        CompanyCode: companyCode || '',
        CompanyId: Number(companyId) || 0,
        ClientContractId: Number(contractId) || 0,
        ClientContractCode: clientContractCode || '',
        CandidateId: Number(candidateId) || 0,
        Status: true,
        Content: documentFileObj.base64,
        SizeInKB: documentFileObj.size ? Math.round(documentFileObj.size / 1024) : 0,
        ObjectName: documentFileObj.filename || '',
        OriginalObjectName: documentFileObj.filename || '',
        Type: extraProps.Type || 0,
        EmployeeId: 0,
        ObjectCategoryName: isCandidate ? "Proofs" : "EmpTransactions",
        DocumentRepositoryID: extraProps.DocumentRepositoryID || '',
    };

    return docObjStorage;
};

/**
 * Upload a file to Object Storage
 * @param {Object} documentFileObj - Object containing base64, filename, size
 * @param {number} candidateId - Candidate ID (optional)
 * @param {boolean} isCandidate - Is candidate flag (optional)
 * @param {Object} extraProps - Additional properties to override/add to payload (optional)
 * @returns {Promise} Axios response
 */
export const storeObject = async (documentFileObj, candidateId = 0, isCandidate = false, extraProps = {}) => {
    const payload = await getObjectStorageInfo(documentFileObj, candidateId, isCandidate, extraProps);

    if (!payload) {
        return Promise.reject("Invalid file object");
    }

    console.log("Sending payload to ObjectStorage API");
    const encryptedPayload = CryptoService.encrypt(payload);

    const response = await ClientApi(API_ENDPOINTS.POST_OBJECTSTORAGE, JSON.stringify(encryptedPayload), "POST", null, "objectStorage", null);
    return response;
};

/**
 * Get a stored object by ID
 * @param {number} id - Object ID
 * @returns {Promise} Axios response containing the object details
 */
export const getStoredObjectById = async (id) => {
    if (!id) return Promise.reject("Invalid ID");
    // Wrap ID in object, assuming standard POST body convention
    const payload = { Id: id };

    const encryptedPayload = CryptoService.encrypt(payload);
    const response = await ClientApi(`${API_ENDPOINTS.GET_OBJECT_BY_ID}`, encryptedPayload, "POST", null, "objectStorage", null);
    return response;
};

/**
 * Delete a stored object by ID
 * @param {number} id - Object ID
 * @returns {Promise} Axios response
 */
export const deleteStoredObjectById = async (id) => {
    if (!id) return Promise.reject("Invalid ID");
    const payload = { Id: id };

    const encryptedPayload = CryptoService.encrypt(payload);
    const response = await ClientApi(API_ENDPOINTS.DELETE_OBJECTSTORAGE, encryptedPayload, "POST", null, "objectStorage", null);
    return response;
};

/**
 * Helper to convert File object to base64
 * @param {File} file - The file to convert
 * @returns {Promise<{base64: string, filename: string, size: number}>}
 */
export const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        if (file && file.size > 2200000) {
            reject("Please choose file below 2MB");
            return;
        }

        const reader = new FileReader();

        reader.onloadend = () => {
            resolve({
                base64: reader.result.split(",")[1],
                filename: file.name,
                size: file.size,
            });
        };

        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};
/**
 * Helper to zip multiple files and convert to base64
 * @param {File[]} files - Array of File objects
 * @returns {Promise<{base64: string, filename: string, size: number}>}
 */
export const convertFilesToZipBase64 = async (files) => {
    if (!files || files.length === 0) return Promise.reject("No files provided");

    const zip = new JSZip();
    let totalSize = 0;

    files.forEach(file => {
        totalSize += file.size;
        zip.file(file.name, file);
    });

    if (totalSize > 2200000) {
        return Promise.reject("Total file size must be below 2MB");
    }

    const content = await zip.generateAsync({ type: "base64" });
    return {
        base64: content,
        filename: "files.zip",
        size: totalSize
    };
};

const ObjectStorageService = {
    storeObject,
    getStoredObjectById,
    deleteStoredObjectById,
    convertFileToBase64,
    convertFilesToZipBase64
};

export default ObjectStorageService;
