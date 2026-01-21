import { useEffect, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Card, CardContent, CardHeader, CardTitle } from "../Library/Card";
import { Button } from "../Lib/button";
import { Badge } from "../Lib/badge";
import { Skeleton } from "../Lib/skeleton";
import Loading from "../Component/Loading";
import AppIcon from "../Component/AppIcon";
import CryptoService from '../Security/useCrypto'

import { motion } from "framer-motion";
import {
  GetClientFormBuilderHeaderMappingsByClientId,
  GetFormBuilder,
} from "../Store/FormBuilder/Action";
import { Modules } from "../Data/StaticData";

/* =========================================================
   COMPONENT
========================================================= */
const InputModule = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  /* -------------------------------------------------------
     REDUX STATE
  ------------------------------------------------------- */
  const { FormBuilder, ClientFormBuilderHeaderMapping } = useSelector(
    (s) => s.FormBuilderStore
  );

  const formBuilders = Array.isArray(FormBuilder?.data) ? FormBuilder.data : [];
  const mappings = Array.isArray(ClientFormBuilderHeaderMapping?.data) ? ClientFormBuilderHeaderMapping.data : [];

  const selectedClientId =  useSelector((state) => state.Auth?.Common?.SelectedClient || "");

  const lastFetchedClientRef = useRef(null);

  /* -------------------------------------------------------
     LOAD DATA (NO DOUBLE CALLS)
  ------------------------------------------------------- */
  useEffect(() => {
    if (!FormBuilder?.data?.length) {
      dispatch(GetFormBuilder());
    }
  }, [dispatch]);

  useEffect(() => {
    if (!selectedClientId) return;

    if (lastFetchedClientRef.current === selectedClientId) return;
    lastFetchedClientRef.current = selectedClientId;

    dispatch(
      GetClientFormBuilderHeaderMappingsByClientId(selectedClientId)
    );
  }, [dispatch, selectedClientId]);

  /* -------------------------------------------------------
     BUILD LOOKUP MAP (FormBuilderId → MappingId)
  ------------------------------------------------------- */
  const mappingByFormBuilderId = useMemo(() => {
    const map = new Map();
    mappings.forEach((m) => {
      map.set(m.FormBuilderId, m.Id);
    });
    return map;
  }, [mappings]);

  /* -------------------------------------------------------
     FINAL MAPPED FORMS (🔥 THIS IS WHAT YOU WANT)
  ------------------------------------------------------- */
  const mappedForms = useMemo(() => {
    return formBuilders
      ?.filter((f) => mappingByFormBuilderId.has(f.Id))
      ?.map((f) => ({
        ...f,
        mappingId: mappingByFormBuilderId.get(f.Id),
      }));
  }, [formBuilders, mappingByFormBuilderId]);

  /* -------------------------------------------------------
     LOADING STATE
  ------------------------------------------------------- */
  if (FormBuilder.isLoading || ClientFormBuilderHeaderMapping.isLoading) {
    return (
      <div className="p-4 sm:p-6">
        {/* HEADER SKELETON */}
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>

        {/* MODULE GRID SKELETON */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="rounded-2xl overflow-hidden">
              {/* TOP STRIP */}
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 opacity-70" />

              {/* BADGES SKELETON */}
              <div className="absolute right-2 top-2 space-x-1">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-5 w-16" />
              </div>

              <CardHeader className="text-center pb-4 pt-6">
                {/* ICON SKELETON */}
                <Skeleton className="h-14 w-14 rounded-2xl mx-auto mb-4" />

                <Skeleton className="h-6 w-32 mx-auto" />
              </CardHeader>

              <CardContent className="text-center pb-6 px-6">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mx-auto mb-5" />

                <Skeleton className="h-10 w-full rounded-xl" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------
     FRAMER MOTION
  ------------------------------------------------------- */
  const containerAnim = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const cardAnim = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 14 },
    },
  };

  const handleNavigate = async (Id) => {
    const encryptedId = CryptoService.EncryptWithAES(Id.toString());
    navigate(`/inputs/${encryptedId}`);

  }

  console.log(mappedForms);


  /* -------------------------------------------------------
     RENDER
  ------------------------------------------------------- */
  return (
    <div className="">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold">
          Payroll Input Modules
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          Forms enabled for the selected client
        </p>
      </div>

      {/* MODULE GRID */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
        variants={containerAnim}
        initial="hidden"
        animate="show"
      >
        {mappedForms.map((m, index) => {
          const isInactive = m.IsActive === false;
          return (
            <motion.div
              key={index}
              variants={cardAnim}
              whileHover={!isInactive ? { y: -2, scale: 1.01 } : {}}
              className={isInactive ? "opacity-30 pointer-events-none" : ""}
            >
              <Card
                className=" relative rounded-xl overflow-hidden bg-white dark:bg-gray-900 border border-emerald-200/60 dark:border-gray-700 
                 shadow-sm hover:shadow-md transition-all"
              >
                {/* TOP STRIP */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-400" />

                {/* STATUS */}
                <div className="absolute right-3 top-3 flex gap-1 text-[10px]">
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                    v{m.Version}
                  </span>
                  <span
                    className={`px-2 py-1 font-semibold rounded-full ${m.IsActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-600"
                      }`}
                  >
                    {m.IsActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* HEADER */}
                <CardHeader className="pt-5 pb-3 text-center">
                  <div className="flex justify-center mb-2">
                    <div
                      className=" h-10 w-10 rounded-lg  bg-emerald-100  border border-emerald-300 flex items-center justify-center
                        text-emerald-700"
                    >
                      <AppIcon name={m.Icon} size={18} />
                    </div>
                  </div>

                  <CardTitle className="text-sm font-semibold text-gray-900">
                    {m.Name}
                  </CardTitle>

                  <div className="mt-1 flex flex-wrap items-center justify-center gap-2 text-[11px] text-gray-500">
                    {/* MODULE */}
                    <div className="flex items-center gap-1.5">
                      <AppIcon name="Layers" size={11} />
                      <span>Module</span>
                      <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
                        {Modules.find((mo) => mo.value === m.ModuleId)?.label || m.ModuleId}
                      </Badge>
                    </div>

                    {/* SEPARATOR */}
                    <span className="opacity-40">|</span>

                    {/* MODE */}
                    <div className="flex items-center gap-1.5">
                      <AppIcon name="GitMerge" size={11} />
                      <span className="font-medium">
                        {m.IsGroupSaveEnabled ? "Grouped" : "Flat"}
                      </span>
                    </div>
                  </div>

                </CardHeader>

                {/* CONTENT */}
                <CardContent className="px-4 pb-4 text-center">
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                    {m.Description}
                  </p>

                  {/* STATS */}
                  <div className="grid grid-cols-3 gap-2 mb-3 text-[11px]">
                    <div className="rounded-md bg-emerald-50 py-2">
                      <div className="text-emerald-700 font-medium">Fields</div>
                      <div>{JSON.parse(m.FieldsConfigurations || "[]").length}</div>
                    </div>
                    <div className="rounded-md bg-blue-50 py-2">
                      <div className="text-blue-700 font-medium">Upload</div>
                      <div>{m.BulkApi ? "Yes" : "No"}</div>
                    </div>
                    <div className="rounded-md bg-purple-50 py-2">
                      <div className="text-purple-700 font-medium">Mode</div>
                      <div>{m.UpsertApi ? "Upsert" : "Read"}</div>
                    </div>
                  </div>

                  {/* ACTION */}
                  {isInactive ? (
                    <Button
                      disabled
                      size="md"
                      className="w-full text-xs bg-gray-300 text-gray-600"
                    >
                      Not Available
                    </Button>
                  ) : (
                    <Button
                      size="md"
                      onClick={() => handleNavigate(m.Id)}
                      className=" w-full text-xs  bg-emerald-600 hover:bg-emerald-700  text-white"
                    >
                      Open
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>

          )
        })}

        {mappedForms.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            No forms mapped for this client
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default InputModule;
