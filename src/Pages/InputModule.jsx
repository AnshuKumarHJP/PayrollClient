import { useEffect, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Card, CardContent, CardHeader, CardTitle } from "../Lib/card";
import { Button } from "../Lib/button";
import { Badge } from "../Lib/badge";
import Loading from "../Component/Loading";
import AppIcon from "../Component/AppIcon";
import CryptoService from '../Security/useCrypto'

import { motion } from "framer-motion";
import {
  GetClientFormBuilderHeaderMappingsByClientId,
  GetFormBuilder,
} from "../Store/FormBuilder/Action";

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

  const selectedClientId = sessionStorage.getItem("activeClient") || null;

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
    return <Loading />;
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

  console.log(mappedForms);
  const handleNavigate = async (Id) => {
    const encryptedId = CryptoService.EncryptWithAES(Id.toString());
    navigate(`/inputs/${encryptedId}`);

  }

  /* -------------------------------------------------------
     RENDER
  ------------------------------------------------------- */
  return (
    <div className="p-4 sm:p-6">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
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
              whileHover={
                !isInactive
                  ? { y: -4, scale: 1.02, transition: { type: "spring", stiffness: 200 } }
                  : {}
              }
              className={isInactive ? "opacity-10 blur-[0.5px] pointer-events-none" : ""}
            >
              <Card
                className="
                  group relative rounded-2xl
                  overflow-hidden
                  backdrop-blur-xl
                  bg-white/70 dark:bg-gray-900/40
                  border border-gray-200 dark:border-gray-700
                  shadow-[0_4px_15px_rgba(0,0,0,0.08)]
                  transition-all duration-300
                "
              >
                {/* TOP STRIP */}
                <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-300 via-emerald-200 to-teal-300 opacity-70" />

                {/* BADGES */}
                <div className="absolute right-2 top-2 space-x-1">
                  <Badge variant="info">{m.Version}</Badge>
                  <Badge variant={m.IsActive ? "success" : "destructive"}>
                    {m.IsActive ? "Active" : "In Active"}
                  </Badge>
                </div>

                <CardHeader className="text-center pb-4 pt-6">
                  {/* ICON */}
                  <motion.div
                    className="flex justify-center mb-4"
                    whileHover={!isInactive ? { scale: 1.1 } : {}}
                  >
                    <div
                      className="
                        h-14 w-14 rounded-2xl
                        bg-emerald-100/60 dark:bg-emerald-900/40
                        border border-emerald-300 dark:border-emerald-700
                        flex items-center justify-center
                        text-emerald-700 dark:text-emerald-200
                        transition-all
                        group-hover:bg-emerald-600 group-hover:text-white
                        group-hover:border-emerald-600
                      "
                    >
                      <AppIcon name={m.Icon} />
                    </div>
                  </motion.div>

                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {m.Name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="text-center pb-6 px-6">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-5 line-clamp-3">
                    {m.Description}
                  </p>

                  {isInactive ? (
                    <Button
                      disabled
                      className="
                        w-full py-2.5 text-sm
                        rounded-xl
                        bg-gray-400 text-white
                        cursor-not-allowed
                        opacity-60
                      "
                    >
                      Not Available
                    </Button>
                  ) : (
                    <Link
                      onClick={() => { handleNavigate(m.Id) }}
                    >
                      <motion.div whileTap={{ scale: 0.97 }}>
                        <Button
                          className="
                            w-full py-2.5 text-sm
                            rounded-xl
                            bg-emerald-600 text-white
                            hover:bg-emerald-700
                            transition-all
                          "
                        >
                          Open {m.Name}
                        </Button>
                      </motion.div>
                    </Link>
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
