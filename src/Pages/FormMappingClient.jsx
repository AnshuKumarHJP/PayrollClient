import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../Library/Card";
import Button from "../Library/Button";
import { Badge } from "../Library/Badge";
import { Modules } from "../Data/StaticData";
import {
    InsertClientFormBuilderHeaderMapping,
    DeleteClientFormBuilderHeaderMappingById,
    GetClientFormBuilderHeaderMappingsByClientId,
    GetFormBuilder,
} from "../Store/FormBuilder/Action";
import AppIcon from "../Component/AppIcon";
import { SkeletonCard } from "../Skeleton/Skeletons";
import ContextGate from "../Component/ContextGate";

const FormMappingClient = () => {
    const dispatch = useDispatch();

    /* =====================================================
        🔐 SESSION AUTH & CONTEXT
    ===================================================== */
    const AUTH_DATA = useSelector((state) => state.Auth.LogResponce.data);
    const selectedClientCode = useSelector((state) => state.Auth?.Common?.SelectedClientCode || "");
    const selectedClientContractCode = useSelector((state) => state.Auth?.Common?.SelectedClientContractCode || "");

    /* ===================== REDUX STORE ===================== */
    const { FormBuilder, ClientFormBuilderHeaderMapping } = useSelector((s) => s.FormBuilderStore);

    const clients = AUTH_DATA?.ClientList || [];
    const formBuilders = Array.isArray(FormBuilder?.data) ? FormBuilder?.data : [];
    const mappings = ClientFormBuilderHeaderMapping?.data || [];

    /* ===================== LOCAL STATE ===================== */
    const [searchQuery, setSearchQuery] = useState("");
    const [draggingId, setDraggingId] = useState(null);
    const [dropTarget, setDropTarget] = useState(null);

    const TeamId = 0;

    /* ===================== SELECTED CLIENT LOGIC ===================== */
    const selectedClient = useMemo(
        () => clients.find((c) => String(c.Id) === String(selectedClientCode)),
        [clients, selectedClientCode]
    );

    const selectedClientId = useMemo(
        () => selectedClient?.Id ?? null,
        [selectedClient?.Id]
    );

    /* ===================== API FETCHING ===================== */
    const lastFetchedClientIdRef = useRef(null);

    useEffect(() => {
        const controller = new AbortController();
        dispatch(GetFormBuilder(controller.signal));
        return () => controller.abort();
    }, [dispatch]);

    useEffect(() => {
        if (!selectedClientId) return;
        if (lastFetchedClientIdRef.current === selectedClientId) return;
        lastFetchedClientIdRef.current = selectedClientId;
        dispatch(GetClientFormBuilderHeaderMappingsByClientId(selectedClientId));
    }, [dispatch, selectedClientId]);

    /* ===================== DATA PROCESSING ===================== */
    const processTemplateData = useCallback((template) => {
        let fieldCount = 0;
        try {
            if (template.FieldsConfigurations) {
                const configs = typeof template.FieldsConfigurations === 'string'
                    ? JSON.parse(template.FieldsConfigurations)
                    : template.FieldsConfigurations;
                fieldCount = Array.isArray(configs) ? configs.length : 0;
            }
        } catch (e) {
            console.warn("Could not parse fields for", template.Name);
        }

        const formatDate = (dateStr) => {
            if (!dateStr) return "N/A";
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
        };

        return {
            ...template,
            displayVersion: template.Version || "1.0",
            fieldCount: fieldCount,
            formattedDate: formatDate(template.LastUpdatedOn || template.CreatedOn),
            creator: template.CreatedBy || "Admin",
            description: template.Description || "Standard system workflow configuration.",
            isInteractive: template.IsGroupSaveEnabled ?? false
        };
    }, []);

    const mappedTemplateIds = useMemo(() => {
        if (!selectedClientId) return [];
        return mappings
            ?.filter((m) => m.ClientId === selectedClientId)
            ?.map((m) => m.FormBuilderId);
    }, [mappings, selectedClientId]);

    const clientTemplates = useMemo(
        () => formBuilders
            .filter((f) => mappedTemplateIds.includes(f.Id))
            .filter(f => f.Name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(processTemplateData),
        [formBuilders, mappedTemplateIds, searchQuery, processTemplateData]
    );

    const availableTemplates = useMemo(
        () => formBuilders
            .filter((f) => !mappedTemplateIds.includes(f.Id))
            .filter(f => f.Name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(processTemplateData),
        [formBuilders, mappedTemplateIds, searchQuery, processTemplateData]
    );

    /* ===================== ACTIONS ===================== */
    const handleMap = useCallback((formBuilderId) => {
        if (!selectedClientId) return;
        dispatch(InsertClientFormBuilderHeaderMapping({
            ClientId: selectedClientId,
            ClientContractId: selectedClientContractCode,
            TeamId,
            FormBuilderId: formBuilderId,
            IsActive: true,
        })).then(() => {
            dispatch(GetClientFormBuilderHeaderMappingsByClientId(selectedClientId));
        });
    }, [dispatch, selectedClientId, selectedClientContractCode]);

    const handleUnmap = useCallback((formBuilderId) => {
        if (!selectedClientId) return;
        const existing = mappings.find(m => m.ClientId === selectedClientId && m.FormBuilderId === formBuilderId);
        if (!existing) return;
        dispatch(DeleteClientFormBuilderHeaderMappingById(existing.Id)).then(() => {
            dispatch(GetClientFormBuilderHeaderMappingsByClientId(selectedClientId));
        });
    }, [dispatch, mappings, selectedClientId]);

    /* ===================== DRAG & DROP HANDLERS ===================== */
    const handleDragStart = (e, id, source) => {
        setDraggingId(id);
        e.dataTransfer.setData("formId", id);
        e.dataTransfer.setData("source", source);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e, target) => {
        e.preventDefault();
        setDropTarget(target);
    };

    const handleDrop = (e, target) => {
        e.preventDefault();
        const id = Number(e.dataTransfer.getData("formId"));
        const source = e.dataTransfer.getData("source");

        if (source !== target) {
            if (target === "right") handleMap(id);
            else handleUnmap(id);
        }
        setDraggingId(null);
        setDropTarget(null);
    };

    return (
        <>
            <ContextGate title="Form Mapping to Client" icon="Layout">

                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

                    {/* Header Dashboard */}
                    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200/60 dark:border-slate-800/60 shadow-sm p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/20">
                                    <AppIcon name="Layout" className="text-white" size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Mapping Strategizer</h2>
                                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                                        <AppIcon name="Activity" size={12} className="animate-pulse" />
                                        Active Partition: {selectedClient?.Name}
                                    </p>
                                </div>
                            </div>

                            <div className="relative group">
                                <AppIcon name="Search" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
                                <input
                                    type="text"
                                    placeholder="Locate template by name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-11 pr-5 h-12 w-full md:w-72 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/50">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Inventory</span>
                                <div className="text-lg font-black text-slate-900 dark:text-white">{formBuilders.length}</div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Available</span>
                                <div className="text-lg font-black text-indigo-600">{availableTemplates.length}</div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Allocated</span>
                                <div className="text-lg font-black text-emerald-500">{clientTemplates.length}</div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Efficiency</span>
                                <div className="text-lg font-black text-slate-900 dark:text-white">
                                    {Math.round((clientTemplates.length / formBuilders.length) * 100) || 0}%
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Interactive Deck */}
                    <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto_1fr] gap-3">

                        {/* Available Section */}
                        <div
                            className={`flex flex-col h-[600px] bg-white dark:bg-slate-900/40 rounded-lg border transition-all duration-300 ${dropTarget === 'left' ? 'border-indigo-500 bg-indigo-50/10 shadow-lg' : 'border-slate-200 dark:border-slate-800'}`}
                            onDragOver={(e) => handleDragOver(e, 'left')}
                            onDrop={(e) => handleDrop(e, 'left')}
                            onDragLeave={() => setDropTarget(null)}
                        >
                            <div className="px-5 py-4 border-b border-indigo-100/50 dark:border-slate-800 flex items-center justify-between bg-indigo-600 rounded-t-lg shadow-sm">
                                <div className="flex items-center gap-2">
                                    <AppIcon name="Database" size={16} className="text-white" />
                                    <h3 className="font-black text-white text-xs uppercase tracking-tight">Resource Catalogue</h3>
                                </div>
                                <Badge className="bg-slate-900 text-white dark:bg-slate-700 text-[10px] h-5 px-1.5">{availableTemplates.length}</Badge>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                                <AnimatePresence mode="popLayout">
                                    {availableTemplates.map((template) => (
                                        <motion.div
                                            key={template.Id}
                                            layout
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, template.Id, 'left')}
                                            className={`group relative p-4 bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-400 transition-all cursor-grab active:cursor-grabbing ${draggingId === template.Id ? 'opacity-20 scale-95' : ''}`}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="mt-1 text-slate-200 group-hover:text-indigo-400 transition-colors">
                                                    <AppIcon name="GripVertical" size={16} />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div className="flex items-center gap-2 text-[9px] font-black uppercase">
                                                            <span className="text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-1 rounded">v{template.displayVersion}</span>
                                                            {template.isInteractive && <span className="text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-1 rounded flex items-center gap-1"><AppIcon name="Cpu" size={10} /> Batch-Enabled</span>}
                                                        </div>
                                                        <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1">
                                                            <AppIcon name="Calendar" size={10} /> {template.formattedDate}
                                                        </span>
                                                    </div>

                                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm md:text-sm truncate leading-tight">{template.Name}</h4>

                                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 italic font-medium">
                                                        {template.description}
                                                    </p>

                                                    <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-50 dark:border-slate-700/30">
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase">
                                                                <AppIcon name="Layers" size={12} className="text-indigo-400" />
                                                                {template.fieldCount} Data Pts
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase">
                                                            <AppIcon name="UserCheck" size={12} className="text-slate-300" />
                                                            {template.creator}
                                                        </div>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => handleMap(template.Id)}
                                                    className="w-8 h-8 flex-shrink-0 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-indigo-600 hover:text-white mt-4"
                                                >
                                                    <AppIcon name="ChevronRight" size={16} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Transfer Divider */}
                        <div className="hidden xl:flex flex-col items-center justify-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center shadow-sm">
                                <AppIcon name="ArrowRightLeft" size={18} className="text-slate-300" />
                            </div>
                            <div className="w-px h-24 bg-gradient-to-b from-transparent via-slate-100 dark:via-slate-800 to-transparent" />
                        </div>

                        {/* Mapped Section */}
                        <div
                            className={`flex flex-col h-[600px] bg-slate-50/30 dark:bg-indigo-950/5 rounded-lg border transition-all duration-300 ${dropTarget === 'right' ? 'border-emerald-500 bg-emerald-50/10 shadow-lg' : 'border-dashed border-slate-200 dark:border-slate-800'}`}
                            onDragOver={(e) => handleDragOver(e, 'right')}
                            onDrop={(e) => handleDrop(e, 'right')}
                            onDragLeave={() => setDropTarget(null)}
                        >
                            <div className="px-5 py-4 border-b border-indigo-100/50 dark:border-slate-800 flex items-center justify-between bg-indigo-600 rounded-t-lg shadow-sm">
                                <div className="flex items-center gap-2">
                                    <AppIcon name="Link" size={16} className="text-white/80" />
                                    <h3 className="font-black text-white text-xs uppercase tracking-tight">Active Deployment</h3>
                                </div>
                                <Badge className="bg-white text-indigo-600 border-none font-black text-[10px] h-5 px-1.5">{clientTemplates.length}</Badge>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                                <AnimatePresence mode="popLayout">
                                    {clientTemplates.map((template) => (
                                        <motion.div
                                            key={template.Id}
                                            layout
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, template.Id, 'right')}
                                            className={`group relative p-4 bg-white dark:bg-slate-800 border border-emerald-100/50 dark:border-emerald-900/20 rounded-xl shadow-sm hover:shadow-md hover:border-emerald-500 transition-all cursor-grab active:cursor-grabbing ${draggingId === template.Id ? 'opacity-20 scale-95' : ''}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => handleUnmap(template.Id)}
                                                    className="w-8 h-8 flex-shrink-0 rounded-lg bg-rose-50 dark:bg-rose-900/30 text-rose-500 flex items-center justify-center opacity-10 sm:opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-600 hover:text-white"
                                                >
                                                    <AppIcon name="ChevronLeft" size={16} />
                                                </button>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1.5">
                                                        <div className="flex items-center gap-2 text-[9px] font-black text-emerald-500 uppercase">
                                                            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                                            Synchronized
                                                        </div>
                                                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 text-[9px] h-4 px-1 border-none font-bold">v{template.displayVersion}</Badge>
                                                    </div>

                                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm md:text-sm truncate leading-tight">{template.Name}</h4>

                                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-1 italic font-medium">
                                                        {template.description}
                                                    </p>

                                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50 dark:border-slate-700/30">
                                                        <div className="flex items-center gap-2">
                                                            <AppIcon name={template.Icon || "FileText"} size={12} className="text-indigo-600 opacity-60" />
                                                            <span className="text-[9px] font-black text-slate-400 truncate uppercase">
                                                                {Modules.find((m) => m.value === template.ModuleId)?.label || "Stream " + template.ModuleId}
                                                            </span>
                                                        </div>
                                                        <div className="text-[9px] font-bold text-slate-300 uppercase">ID: {template.Id}</div>
                                                    </div>
                                                </div>

                                                <AppIcon name="Unlink" size={16} className="text-slate-200 group-hover:text-rose-400 transition-colors flex-shrink-0" />
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>

                    </div>
                </div>

            </ContextGate>
        </>
    );
};

export default FormMappingClient;