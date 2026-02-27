import React, { useState, useMemo, useCallback } from "react";
import FormDataView from "./FormDataView";
import { motion, AnimatePresence } from "framer-motion";

import DynamicForm from "../../Component/DynamicForm";
import BulkUpload from "../BulkUpload/BulkUpload";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "../../Library/Tab";
import AppIcon from "../../Component/AppIcon";
import Button from "../../Library/Button";
import { Badge } from "../../Library/Badge";
import useScreen from "../../Hooks/useScreen";

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 16 } }
};

const PageBuilder = ({
  Template = null,
  AddMore = false,
  onUpsert,          // SINGLE / EDIT only (UpsertApi)
  onBulkSave = () => { }
}) => {
  const [activeTab, setActiveTab] = useState("entry");
  const { isMobile } = useScreen();
  const [isEditing, setIsEditing] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [editId, setEditId] = useState(null);

  const openEdit = (row) => {
    setEditRecord(row);
    setEditId(row.Id || row.id);
    setIsEditing(true);
    setActiveTab("entry");
  };

  /* -------------------------------------------------
     SINGLE FORM SUCCESS HANDLER (UpsertApi)
  ------------------------------------------------- */
  const handleSingleSuccess = async (payload) => {
    const ok = await onUpsert(payload);
    if (ok) {
      setIsEditing(false);
      setActiveTab("history");
      return true;
    }
    return false;
  };

  const tabs = useMemo(() => [
    { id: 'entry', label: isEditing ? 'Update Entry' : 'Data Entry', icon: 'FilePlus2', desc: 'Add or modify records' },
    { id: 'bulk', label: 'Bulk Transactions', icon: 'Database', desc: 'View processed batches' },
    { id: 'rejected', label: 'Validation Errors', icon: 'ShieldAlert', desc: 'Review failed records' },
    { id: 'history', label: 'Activity Log', icon: 'Clock', desc: 'Full audit trail' },
  ], [isEditing]);

  return (
    <div className="mt-1">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6 md:space-y-8">
        {/* PREMIUM TABS LIST */}
        <div className="relative border-b border-slate-200 dark:border-slate-800 overflow-hidden">
          <TabsList className="bg-transparent h-auto p-0 gap-4 md:gap-8 justify-start overflow-x-auto scrollbar-none flex-nowrap whitespace-nowrap pb-px">
            {tabs.map((tab) => {
              if (tab.id === 'bulk' && !Template?.BulkApi) return null;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="relative py-3 md:py-4 px-1 rounded-none bg-transparent border-b-2 border-transparent data-[state=active]:bg-transparent data-[state=active]:border-primary-500 data-[state=active]:text-primary-600 data-[state=active]:shadow-none font-semibold text-xs md:text-sm text-slate-500 dark:text-slate-400 transition-all hover:text-slate-900 dark:hover:text-white flex-shrink-0"
                  onClick={() => {
                    if (tab.id !== 'entry') {
                      setIsEditing(false);
                      setEditRecord(null);
                    }
                  }}
                >
                  <div className="flex items-center gap-2 md:gap-2.5">
                    <AppIcon name={tab.icon} size={isMobile ? 16 : 18} />
                    <span>{tab.label}</span>
                  </div>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {/* CONTENT AREA WITH ANIMATIONS */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="entry" className="mt-0 focus-visible:ring-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-3">
                    <DynamicForm
                      Template={Template}
                      editId={isEditing ? editId : null}
                      editData={isEditing ? editRecord : null}
                      AddMore={AddMore}
                      onSuccess={handleSingleSuccess}
                      onCancel={() => {
                        setIsEditing(false);
                        setActiveTab("history");
                      }}
                    />
                  </div>


                </div>
              </TabsContent>

              <TabsContent value="bulk" className="mt-0 focus-visible:ring-0">
                <BulkUpload
                  Template={Template}
                  onSuccess={async (bulkData) => {
                    const ok = await onBulkSave(bulkData);
                    if (ok) {
                      setActiveTab("history");
                    }
                    return ok;
                  }}
                  onCancel={() => {
                    setActiveTab("history");
                  }}
                />
              </TabsContent>

              <TabsContent value="rejected" className="mt-0 focus-visible:ring-0">
                <div className="bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/30 rounded-2xl p-12 text-center">
                  <div className="h-16 w-16 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center text-rose-600 mx-auto mb-6">
                    <AppIcon name="ShieldAlert" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-rose-900 dark:text-rose-400 mb-2">No Errors Found</h3>
                  <p className="text-rose-700/70 dark:text-rose-500/70 max-w-sm mx-auto mb-8 text-sm">
                    All records for this period have passed validation. Any future errors will appear here for correction.
                  </p>
                  <Badge variant="danger" className="py-1 px-4 text-xs font-bold ring-4 ring-rose-500/10 uppercase tracking-wide">Clean Slate</Badge>
                </div>
              </TabsContent>

              <TabsContent value="history" className="mt-0 focus-visible:ring-0">
                <FormDataView
                  Template={Template}
                  onEdit={openEdit}
                />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </div>
      </Tabs>
    </div>
  );
};

export default PageBuilder;
