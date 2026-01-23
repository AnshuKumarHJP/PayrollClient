import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";

import { Card, CardContent, CardHeader, CardTitle } from "../Library/Card";
import Button from "../Library/Button";
import { Badge } from "../Library/Badge";
import { SkeletonCard } from "../Skeleton/Skeletons";
import AppIcon from "../Component/AppIcon";
import CryptoService from "../Security/useCrypto";

import {
  GetClientFormBuilderHeaderMappingsByClientId,
  GetFormBuilder,
} from "../Store/FormBuilder/Action";
import { Modules } from "../Data/StaticData";

/* =====================================================
   COMPONENT
===================================================== */
const InputModule = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { FormBuilder, ClientFormBuilderHeaderMapping } = useSelector(
    (s) => s.FormBuilderStore
  );

  const selectedClientId = useSelector(
    (s) => s.Auth?.Common?.SelectedClient
  );

  const lastFetchedClientRef = useRef(null);
  const [openingFormId, setOpeningFormId] = useState(null);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (!FormBuilder?.data?.length) {
      dispatch(GetFormBuilder());
    }
  }, [dispatch]);

  useEffect(() => {
    if (!selectedClientId) return;
    if (lastFetchedClientRef.current === selectedClientId) return;

    lastFetchedClientRef.current = selectedClientId;
    dispatch(GetClientFormBuilderHeaderMappingsByClientId(selectedClientId));
  }, [dispatch, selectedClientId]);

  /* ================= MAP DATA ================= */
  const mappingByFormBuilderId = useMemo(() => {
    const map = new Map();
    (ClientFormBuilderHeaderMapping?.data || []).forEach((m) =>
      map.set(m.FormBuilderId, m.Id)
    );
    return map;
  }, [ClientFormBuilderHeaderMapping?.data]);

  const mappedForms = useMemo(() => {
    const formData = Array.isArray(FormBuilder?.data) ? FormBuilder.data : [];
    return formData
      .filter((f) => mappingByFormBuilderId.has(f.Id))
      .map((f) => ({
        ...f,
        mappingId: mappingByFormBuilderId.get(f.Id),
      }));
  }, [FormBuilder?.data, mappingByFormBuilderId]);

  /* ================= NAVIGATION ================= */
  const handleNavigate = async (id) => {
    setOpeningFormId(id);
    try {
      // Simulate loading delay for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      const encryptedId = CryptoService.EncryptWithAES(id.toString());
      navigate(`/inputs/${encryptedId}`);
    } finally {
      setOpeningFormId(null);
    }
  };

  /* ================= LOADING ================= */
  if (FormBuilder.isLoading || ClientFormBuilderHeaderMapping.isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} className="h-64 rounded-xl" />
        ))}
      </div>
    );
  }

  /* ================= ANIMATION ================= */
  const containerAnim = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const cardAnim = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0 },
  };

  console.log(mappedForms);


  /* ================= RENDER ================= */
  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div>
        <h1 className="text-xl font-semibold text-foreground">
          Payroll Input Modules
        </h1>
        <p className="text-sm text-muted-foreground">
          Forms enabled for the selected client
        </p>
      </div>

      {/* GRID */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
        variants={containerAnim}
        initial="hidden"
        animate="show"
      >
        {mappedForms.map((m) => {
          const inactive = m.IsActive === false;

          let fields = [];
          try {
            fields = JSON.parse(m.FieldsConfigurations || "[]");
          } catch { }

          const groupedCount = fields.filter((f) => f.FieldGroup).length;

          return (
            <motion.div key={m.Id} variants={cardAnim}>
              <Card
                className={`group relative rounded border bg-slate-100/50 transition
                ${inactive ? "opacity-40 pointer-events-none" : "hover:shadow-lg"}`}
              >
                 {/* GRADIENT STRIP */}
                <div className="absolute rounded-t inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600" />

                {/* STATUS BADGES */}
                <div className="absolute right-3 top-3 flex gap-1 text-[10px]">
                  <Badge variant="warning">v{m.Version}</Badge>
                  <Badge variant={m.IsActive ? "success" : "danger"}>
                    {m.IsActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                {/* HEADER */}
                <CardHeader className="pt-6 pb-3 text-center">
                  <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                    <AppIcon name={m.Icon} size={18} />
                  </div>

                  <CardTitle className="text-sm font-semibold">
                    {m.Name}
                  </CardTitle>

                  <div className="mt-1 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="muted">
                      {
                        Modules.find((x) => x.value === m.ModuleId)
                          ?.label
                      }
                    </Badge>
                    <AppIcon name={"Layers"} size={14} />
                    <span>
                      {m.IsGroupSaveEnabled ? "Grouped" : "Flat"}
                    </span>
                  </div>
                </CardHeader>

                {/* CONTENT */}
                <CardContent className="space-y-4 px-5 pb-5 text-center">
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {m.Description}
                  </p>

                  {/* STATS */}
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="rounded-md bg-muted py-2">
                      <div className="font-medium">Fields</div>
                      <div>
                        {JSON.parse(m.FieldsConfigurations || "[]").length}
                      </div>
                    </div>
                    <div className="rounded-md bg-muted py-2">
                      <div className="font-medium">Upload</div>
                      <div>{m.BulkApi ? "Yes" : "No"}</div>
                    </div>
                    <div className="rounded-md bg-muted py-2">
                      <div className="font-medium">Mode</div>
                      <div>{m.UpsertApi ? "Upsert" : "Read"}</div>
                    </div>
                  </div>
                  {/* METRICS */}

                  {/* META LINE */}
                  <div className="flex justify-center gap-4 text-[11px] text-muted-foreground">
                    <span>Grouped Fields: {groupedCount}</span>
                    <span>Order: {m.DisplayOrder}</span>
                  </div>

                  {/* ACTION */}
                  <Button
                    size="md"
                    variant={inactive ? "outline" : "primary"}
                    className="w-full"
                    onClick={() => handleNavigate(m.Id)}
                    disabled={inactive || openingFormId === m.Id}
                    loading={openingFormId === m.Id}
                  >
                    {inactive ? "Not Available" : openingFormId === m.Id ? "Opening…" : "Open"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}

        {mappedForms.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground">
            No forms mapped for this client
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default InputModule;
