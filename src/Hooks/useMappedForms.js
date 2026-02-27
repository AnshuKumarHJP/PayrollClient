import { useMemo, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetClientFormBuilderHeaderMappingsByClientId, GetFormBuilder } from "../Store/FormBuilder/Action";
import CryptoService from "../Security/useCrypto";
import { Modules } from "../Data/StaticData";

/**
 * Hook to fetch and return forms mapped to the current selected client.
 * Returns forms formatted for the sidebar menu.
 */
export const useMappedForms = () => {
    const dispatch = useDispatch();

    // Store Data
    const { FormBuilder, ClientFormBuilderHeaderMapping } = useSelector((s) => s.FormBuilderStore);
    const selectedClientId = useSelector((s) => s.Auth?.Common?.SelectedClientCode);
    const AUTH_DATA = useSelector((state) => state.Auth.LogResponce?.data);

    const lastFetchedClientRef = useRef(null);

    /* =====================================================
       DATA FETCHING
       ===================================================== */
    useEffect(() => {
        // Fetch base form definitions if not already present
        if (!FormBuilder?.data?.length && !FormBuilder.isLoading) {
            dispatch(GetFormBuilder());
        }
    }, [dispatch, FormBuilder]);

    useEffect(() => {
        // Fetch client-specific mappings when client changes
        if (!selectedClientId) return;
        if (lastFetchedClientRef.current === selectedClientId) return;

        lastFetchedClientRef.current = selectedClientId;
        dispatch(GetClientFormBuilderHeaderMappingsByClientId(selectedClientId));
    }, [dispatch, selectedClientId]);

    /* =====================================================
       MAPPING LOGIC
       ===================================================== */
    const mappedForms = useMemo(() => {
        // Ensure we have data
        const formData = Array.isArray(FormBuilder?.data) ? FormBuilder.data : [];
        const mappingResults = ClientFormBuilderHeaderMapping?.data || [];

        // Key/Vector must be available for encryption
        const hasCrypto = AUTH_DATA?.Key && AUTH_DATA?.Vector;
        if (!hasCrypto) return [];

        // Map FormBuilder ID to Mapping ID
        const mappingByFormBuilderId = new Map();
        mappingResults.forEach((m) => mappingByFormBuilderId.set(m.FormBuilderId, m.Id));

        // Filter and Format for Sidebar
        return formData
            .filter((f) => mappingByFormBuilderId.has(f.Id) && f.IsActive !== false)
            .map((f) => ({
                id: `dynamic-form-${f.Id}`,
                label: f.Name,
                icon: f.Icon || "FileText",
                // Route updated to /form?id= for consistent professional context
                route: `/form?id=${CryptoService.EncryptWithAES(f.Id.toString())}`,
                moduleCode: "APPI_PAYROLL",
                isDynamic: true,
                ModuleId: f.ModuleId,
                ModuleLabel: Modules.find(m => m.value === f.ModuleId)?.label || "Other"
            }));
    }, [FormBuilder?.data, ClientFormBuilderHeaderMapping?.data, AUTH_DATA]);

    return {
        forms: mappedForms,
        isLoading: FormBuilder.isLoading || ClientFormBuilderHeaderMapping.isLoading
    };
};
