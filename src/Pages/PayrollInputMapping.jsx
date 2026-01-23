import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "../Library/Card";
import  Button  from "../Library/Button";
import { Badge } from "../Library/Badge";
import { Modules } from "../Data/StaticData";
import {
  CheckCircle,
  FileText,
  Link,
} from "lucide-react";
import {
  InsertClientFormBuilderHeaderMapping,
  DeleteClientFormBuilderHeaderMappingById,
  GetClientFormBuilderHeaderMappingsByClientId,
  GetFormBuilder,
} from "../Store/FormBuilder/Action";
import AppIcon from "../Component/AppIcon";
import { SkeletonCard } from "../Skeleton/Skeletons";

const PayrollInputMapping = () => {
  const dispatch = useDispatch();

  /* ===================== REDUX ===================== */
  const { LogResponce } = useSelector((s) => s.Auth);
  const { FormBuilder, ClientFormBuilderHeaderMapping } =
    useSelector((s) => s.FormBuilderStore);

  const clients = LogResponce?.data?.ClientList || [];
  const formBuilders = FormBuilder?.data || [];
  const mappings = ClientFormBuilderHeaderMapping?.data || [];

  /* ===================== LOCAL STATE ===================== */
  const selectedClientCode = useSelector((state) => state.Auth?.Common?.SelectedClient || "");
  const selectedClientContractCode = useSelector((state) => state.Auth?.Common?.SelectedClientContract || "");
  const [selectedClientContracCode, setSelectedClientContracCode] = useState(selectedClientContractCode);

  const TeamId = 0;

  /* ===================== SELECTED CLIENT ===================== */
  const selectedClient = useMemo(
    () => clients.find((c) => String(c.Id) === String(selectedClientCode)),
    [clients, selectedClientCode]
  );

  const selectedClientId = useMemo(
    () => selectedClient?.Id ?? null,
    [selectedClient?.Id]
  );

  /* ===================== API GUARD ===================== */
  const lastFetchedClientIdRef = useRef(null);

  /* ===================== LOAD FORM BUILDERS (ONCE) ===================== */
  useEffect(() => {
    const controller = new AbortController();
    dispatch(GetFormBuilder(controller.signal));
    return () => {
      controller.abort(); // 🔥 API CANCELLED HERE
    };

  }, [dispatch]);

  /* ===================== LOAD MAPPINGS (ONCE PER CLIENT) ===================== */
  useEffect(() => {
    if (!selectedClientId) return;

    if (lastFetchedClientIdRef.current === selectedClientId) return;

    lastFetchedClientIdRef.current = selectedClientId;

    dispatch(GetClientFormBuilderHeaderMappingsByClientId(selectedClientId));
  }, [dispatch, selectedClientId]);

  /* ===================== DERIVED DATA ===================== */
  const mappedTemplateIds = useMemo(() => {
    if (!selectedClientId) return [];
    return mappings
      .filter((m) => m.ClientId === selectedClientId)
      .map((m) => m.FormBuilderId);
  }, [mappings, selectedClientId]);

  const clientTemplates = useMemo(
    () => formBuilders.filter((f) => mappedTemplateIds.includes(f.Id)),
    [formBuilders, mappedTemplateIds]
  );

  const availableTemplates = useMemo(
    () => formBuilders.filter((f) => !mappedTemplateIds.includes(f.Id)),
    [formBuilders, mappedTemplateIds]
  );

  const handleMap = useCallback(
    (formBuilderId) => {
      if (!selectedClientId) return;

      dispatch(
        InsertClientFormBuilderHeaderMapping({
          ClientId: selectedClientId,
          ClientContractId: selectedClientContracCode,
          TeamId,
          FormBuilderId: formBuilderId,
          IsActive: true,
        })
      ).then(() => {
        dispatch(GetClientFormBuilderHeaderMappingsByClientId(selectedClientId));
      });
    },
    [dispatch, selectedClientId, selectedClientContracCode]
  );

  const handleUnmap = useCallback(
    (formBuilderId) => {
      if (!selectedClientId) return;

      const existing = mappings.find(
        (m) =>
          m.ClientId === selectedClientId &&
          m.FormBuilderId === formBuilderId
      );

      if (!existing) return;

      dispatch(DeleteClientFormBuilderHeaderMappingById(existing.Id)).then(() => {
        dispatch(GetClientFormBuilderHeaderMappingsByClientId(selectedClientId));
      });
    },
    [dispatch, mappings, selectedClientId]
  );

  /* ===================== RENDER ===================== */
  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div>
        <h1 className="text-base sm:text-xl md:text-2xl font-bold">
          Payroll Input Mapping
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          Map templates to clients for payroll workflows
        </p>
      </div>

      {/* CLIENT SELECT */}

      {selectedClientId && (
        <>
          {/* ===================== MAPPED ===================== */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                <FileText size={16} /> Mapped Forms
              </CardTitle>
            </CardHeader>
            <CardContent>
              {ClientFormBuilderHeaderMapping.isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : clientTemplates.length === 0 ? (
                <p className="text-center text-gray-500 py-6 text-sm">
                  No forms mapped
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clientTemplates.map((t) => (
                    <div
                      key={t.Id}
                      className="border rounded-lg p-4 bg-green-50 border-green-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-green-800 flex gap-2 items-center">
                          <AppIcon name={t.Icon} />
                          {t.Name}
                        </h4>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle size={12} className="mr-1" />
                          Mapped
                        </Badge>
                      </div>

                      <p className="text-sm text-green-600 mb-3">
                        {t.Description}
                      </p>

                      <div className="flex items-center justify-between">
                        <Badge variant="success" className="text-[10px]">
                          {Modules.find((m) => m.value === t.ModuleId)?.label ||
                            t.ModuleId}
                        </Badge>

                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleUnmap(t.Id)}
                          icon={<AppIcon name={"Unlink"} size={14} />}
                        >
                          Unmap
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* ===================== AVAILABLE ===================== */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                <Link size={16} /> Available Forms
              </CardTitle>
            </CardHeader>
            <CardContent>
              {FormBuilder.isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : availableTemplates.length === 0 ? (
                <p className="text-center text-gray-500 py-6 text-sm">
                  All forms are mapped
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableTemplates.map((t) => (
                    <div
                      key={t.Id}
                      className="border rounded-lg p-3 sm:p-4 bg-blue-50 hover:bg-blue-100/70 transition-colors flex flex-col gap-3"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-medium text-gray-800 flex items-center gap-2 text-sm sm:text-base">
                          <AppIcon name={t.Icon} />
                          {t.Name}
                        </h4>
                        <Badge
                          variant={t.IsActive ? "success" : "destructive"}
                        >
                          {t.IsActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-600">
                        {t.Description || "Form builder template"}
                      </p>

                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <Badge variant="purple" className="text-[10px]">
                          {Modules.find((m) => m.value === t.ModuleId)?.label ||
                            t.ModuleId}
                        </Badge>

                        <Button
                          size="sm"
                          variant="successSoft"
                          onClick={() => handleMap(t.Id)}
                          className="text-xs sm:text-sm"
                          icon={ <AppIcon name={"Link"} size={14} />}
                        >
                         
                          <span className="hidden sm:inline">
                            Map to Client
                          </span>
                          <span className="sm:hidden">Map</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default PayrollInputMapping;
