import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppIcon from "../../Component/AppIcon";
import Toast from "../../Component/Toast";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "../../Library/Select";

// --- Service layer ---
import {
    getClients,
    getClientChecklistMappings,
    createClientChecklistMapping,
    deleteClientChecklistMapping,
    getClientContracts,
    getPayrollOpsTasks,
    getCategories
} from "./PayrollChecklistService";

// --- Components ---
import GlassCard from "./components/GlassCard";
import MetricPill from "./components/MetricPill";
import TemplateCard from "./components/TemplateCard";
import AssignmentOverview from "./components/AssignmentOverview";
import PaginationAdvance from "../../Library/Table/PaginationAdvance";

// --- Main Component ────────────────────────────────────────────────────────────

const ClientChecklistMapping = () => {
    const [clients, setClients] = useState([]);
    const [contracts, setContracts] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [dbCategories, setDbCategories] = useState([]);
    const [mappings, setMappings] = useState([]);
    const [checklistTasks, setChecklistTasks] = useState([]);
    const [selectedClientId, setSelectedClientId] = useState("");
    const [selectedContractId, setSelectedContractId] = useState("");
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("assign");
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");
    const [toast, setToast] = useState(null);
    const [isLoadingInitial, setIsLoadingInitial] = useState(true);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(6);

    const selectedClient = useMemo(() => clients.find(c => String(c.id) === selectedClientId), [clients, selectedClientId]);

    useEffect(() => {
        const init = async () => {
            try {
                const [clientsData, tasksData, categoriesData] = await Promise.all([
                    getClients(),
                    getPayrollOpsTasks(),
                    getCategories()
                ]);

                // Map task category IDs to names for the UI to handle correctly
                const enrichedTasks = tasksData.map(task => {
                    const cat = categoriesData.find(c => c.id === task.category);
                    return {
                        ...task,
                        category: cat ? cat.name : "Uncategorized",
                        complexity: task.priority ? (task.priority.charAt(0).toUpperCase() + task.priority.slice(1)) : "Medium",
                        tasksCount: 1 // Individual task node
                    };
                });

                setClients(clientsData);
                setTemplates(enrichedTasks); // Using payrollOpsTasks as the library units
                setDbCategories(categoriesData);
                if (clientsData.length > 0) setSelectedClientId(String(clientsData[0].id));
            } catch (err) { console.error("Init failed", err); }
            finally { setIsLoadingInitial(false); }
        };
        init();
    }, []);

    useEffect(() => {
        if (selectedClientId) {
            fetchContracts(selectedClientId);
            fetchMappings(selectedClientId);
            fetchTasks(selectedClientId);
        }
    }, [selectedClientId]);

    const fetchContracts = async (clientId) => {
        try {
            const data = await getClientContracts(clientId);
            setContracts(data);
            if (data.length > 0) setSelectedContractId(String(data[0].id));
            else setSelectedContractId("");
        } catch (err) { console.error(err); }
    };

    const fetchMappings = async (clientId) => {
        try {
            const data = await getClientChecklistMappings(clientId);
            setMappings(data);
        } catch (err) { console.error(err); }
    };

    const fetchTasks = async (clientId) => {
        try {
            const allTasks = await getPayrollOpsTasks();
            const clientObj = clients.find(c => String(c.id) === clientId);
            setChecklistTasks(allTasks.filter(t => t.client === clientObj?.name));
        } catch (err) { console.error(err); }
    };

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 5000);
    };

    const handleToggleMapping = async (template) => {
        if (isActionLoading) return;
        setIsActionLoading(true);

        const existingMapping = mappings.find(m => String(m.templateId) === String(template.id));

        try {
            if (existingMapping) {
                await deleteClientChecklistMapping(existingMapping.id);
                setMappings(prev => prev.filter(m => m.id !== existingMapping.id));
                showToast(`Removed "${template.title}"`, "info");
            } else {
                const newMapping = {
                    clientId: parseInt(selectedClientId),
                    contractId: selectedContractId ? parseInt(selectedContractId) : null,
                    templateId: template.id,
                    type: "global"
                };
                const savedMapping = await createClientChecklistMapping(newMapping);
                setMappings(prev => [...prev, savedMapping]);
                showToast(`Assigned "${template.title}" to ${selectedClient?.name}`);
            }
        } catch (err) {
            showToast("Operation failed", "error");
        } finally {
            setIsActionLoading(false);
        }
    };

    const mappedTemplateIds = mappings.filter(m => m.type === "global").map(m => String(m.templateId));
    const categories = ["All", ...dbCategories.map(c => c.name)];

    const filteredTemplates = templates.filter(t => {
        const matchSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchCat = filterCategory === "All" || t.category === filterCategory;
        return matchSearch && matchCat;
    });

    const totalPages = Math.ceil(filteredTemplates.length / rowsPerPage);
    const paginatedTemplates = filteredTemplates.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filterCategory]);

    if (isLoadingInitial) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#F8F9FB] dark:bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <AppIcon name="Loader2" size={40} className="animate-spin text-indigo-500" />
                    <span className="text-xs  uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold">Initializing Lab...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F9FB] dark:bg-slate-950 overflow-x-hidden" >

            {/* Global Toast Notification */}
            <Toast
                isVisible={!!toast}
                message={toast?.msg}
                type={toast?.type}
                onClose={() => setToast(null)}
            />

            <div className="max-w-[1440px] mx-auto relative px-4 sm:px-6 py-4 sm:py-8 space-y-6">

                {/* ── Header Section ── */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
                    <div className="relative">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="size-2 rounded-full bg-indigo-500 animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-500">Checklist Operations</span>
                        </div>
                        <h1 style={{ fontFamily: "'Syne', 'DM Sans', sans-serif" }}
                            className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white tracking-tight leading-none">
                            Checklist Mapping to Client
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 font-medium mt-1.5">
                            Assign operational blueprints to clients and track execution
                        </p>
                    </div>

                    {/* Client + Contract selectors */}
                    <div className="flex flex-col sm:flex-row items-stretch gap-4 lg:flex-1 lg:max-w-4xl lg:justify-end">
                        {/* Client selector */}
                        <GlassCard className="flex-1 bg-white/50 dark:bg-slate-900/50 border-white/40 dark:border-slate-800/40 w-full md:min-w-[280px] overflow-hidden group transition-all">
                            <div className="px-4 py-3 sm:px-4 sm:py-4 transition-all">
                                <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600 mb-1.5 ml-1 group-hover:text-indigo-500 transition-colors">Enterprise Entity</div>
                                <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                                    <SelectTrigger className="h-10 border-none bg-indigo-50/30 dark:bg-indigo-500/10 shadow-none hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all focus:ring-0 px-3 rounded-2xl w-full">
                                        <div className="flex items-center gap-3 text-left w-full min-w-0 overflow-hidden">
                                            {selectedClient && (
                                                <div className="size-8 shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-[11px] text-white uppercase shadow-lg shadow-indigo-500/20">
                                                    {selectedClient.avatar || selectedClient.name?.slice(0, 2)}
                                                </div>
                                            )}
                                            <div className="font-semibold text-slate-800 dark:text-slate-200 text-sm sm:text-[13px] truncate flex-1 min-w-0">
                                                <SelectValue placeholder="Select Client" />
                                            </div>
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="rounded-lg border-slate-100 dark:border-slate-800 shadow-2xl min-w-[280px] bg-white dark:bg-slate-900">
                                        {clients.map(c => (
                                            <SelectItem key={c.id} value={String(c.id)} className="text-[12px] text-slate-700 dark:text-slate-300 py-2 rounded-lg focus:bg-indigo-50 dark:focus:bg-indigo-500/20 focus:text-indigo-600 dark:focus:text-indigo-400">
                                                {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </GlassCard>

                        {/* Contract selector */}
                        <GlassCard className="flex-1 bg-white/50 dark:bg-slate-900/50 border-white/40 dark:border-slate-800/40 w-full md:min-w-[300px] overflow-hidden group transition-all">
                            <div className="px-4 py-3 sm:px-4 sm:py-4 transition-all">
                                <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600 mb-1.5 ml-1 group-hover:text-amber-500 transition-colors">Active Agreement</div>
                                <Select
                                    value={selectedContractId}
                                    onValueChange={setSelectedContractId}
                                    disabled={!contracts.length}
                                >
                                    <SelectTrigger className="border-none bg-amber-50/30 dark:bg-amber-500/10 shadow-none hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all focus:ring-0 px-3 rounded-xl w-full disabled:opacity-30">
                                        <div className="flex items-center gap-3 text-left w-full min-w-0 overflow-hidden">
                                            <div className="size-8 shrink-0 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-amber-500 group-hover:bg-amber-50 dark:group-hover:bg-amber-900/20 transition-all border border-amber-100/50 dark:border-amber-900/50 shadow-sm">
                                                <AppIcon name="FileText" size={16} />
                                            </div>
                                            <div className="font-semibold text-slate-800 dark:text-slate-200 text-sm sm:text-[13px] truncate flex-1 min-w-0">
                                                <SelectValue placeholder="Select Contract" />
                                            </div>
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="rounded-lg border-slate-100 dark:border-slate-800 shadow-2xl min-w-[300px] bg-white dark:bg-slate-900">
                                        {contracts.map(c => (
                                            <SelectItem key={c.id} value={String(c.id)} className="text-[12px] text-slate-700 dark:text-slate-300 py-2 rounded-lg focus:bg-amber-50 dark:focus:bg-amber-500/20 focus:text-amber-600 dark:focus:text-amber-400">
                                                {c.contractName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </GlassCard>
                    </div>
                </div>

                {/* ── Metrics ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <MetricPill label="Library Total" value={templates.length} icon="📂" accent="indigo" />
                    <MetricPill label="Mapped Units" value={mappedTemplateIds.length} icon="🔗" accent="emerald" />
                    <MetricPill label="Pending Sync" value={templates.length - mappedTemplateIds.length} icon="⏳" accent="amber" />
                    <MetricPill label="Operational Nodes" value={
                        templates.filter(t => mappedTemplateIds.includes(String(t.id))).reduce((s, t) => s + t.tasksCount, 0)
                    } icon="⚡" accent="rose" />
                </div>

                {/* ── Tabs ── */}
                <div className="flex items-center gap-1 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm p-0 rounded-xl border border-white/80 dark:border-slate-800/80 shadow-sm w-full sm:w-fit overflow-x-auto no-scrollbar">
                    {[
                        { id: "assign", label: "Assign Templates" },
                        { id: "overview", label: "Assignment Overview" },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 sm:flex-none whitespace-nowrap px-4 sm:px-5 py-2 rounded-lg text-[8px] sm:text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${activeTab === tab.id
                                ? "bg-indigo-600 text-white shadow-sm"
                                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800/60"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ── Tab Content ── */}
                <AnimatePresence mode="wait">
                    {activeTab === "assign" && (
                        <motion.div
                            key="assign"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-5"
                        >
                            {/* Search & filter bar */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <GlassCard className="flex items-center gap-2.5 px-4 py-2.5 flex-1 rounded-xl">
                                    <AppIcon name="Search" size={16} className="text-slate-400 dark:text-slate-600" />
                                    <input
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        placeholder="Search templates…"
                                        className="flex-1 text-[13px] font-medium text-slate-700 dark:text-slate-200 bg-transparent border-none outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600"
                                    />
                                </GlassCard>

                                <div className="min-w-[200px]">
                                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                                        <SelectTrigger className="h-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border-white/80 dark:border-slate-800/80 rounded-2xl shadow-sm text-[12px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 px-4 hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                                            <div className="flex items-center gap-2">
                                                <AppIcon name="Filter" size={14} className="text-slate-400 dark:text-slate-600" />
                                                <SelectValue placeholder="All Categories" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-slate-100 dark:border-slate-800 shadow-xl p-1 bg-white dark:bg-slate-900">
                                            {categories.map(cat => (
                                                <SelectItem key={cat} value={cat} className="text-[12px] font-bold text-slate-600 dark:text-slate-400 rounded-xl focus:bg-indigo-50 dark:focus:bg-indigo-500/10 focus:text-indigo-600 dark:focus:text-indigo-400 py-2.5">
                                                    {cat}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Template Grid */}
                            {filteredTemplates.length === 0 ? (
                                <GlassCard className="py-20 text-center">
                                    <p className="text-slate-400 text-sm font-medium uppercase font-bold tracking-widest">No templates match your search criteria.</p>
                                </GlassCard>
                            ) : (
                                <div className="space-y-6">
                                    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                        <AnimatePresence>
                                            {paginatedTemplates.map(template => (
                                                <TemplateCard
                                                    key={template.id}
                                                    template={template}
                                                    isMapped={mappedTemplateIds.includes(String(template.id))}
                                                    onToggle={handleToggleMapping}
                                                    isLoading={isActionLoading}
                                                />
                                            ))}
                                        </AnimatePresence>
                                    </motion.div>

                                    {/* Pagination Component */}
                                    {filteredTemplates.length > 0 && (
                                        <div className="pt-4">
                                            <PaginationAdvance
                                                count={totalPages}
                                                page={currentPage}
                                                rowsPerPage={rowsPerPage}
                                                onChangePage={setCurrentPage}
                                                onChangePageSize={setRowsPerPage}
                                                rowsPerPageOptions={[6, 12, 24, 48]}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === "overview" && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-4"
                        >
                            {mappedTemplateIds.length === 0 ? (
                                <GlassCard className="py-24 text-center space-y-3">
                                    <div className="text-4xl">📭</div>
                                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">No Templates Assigned</h4>
                                    <p className="text-[12px] text-slate-400 font-medium max-w-xs mx-auto italic uppercase opacity-60">
                                        Assign a blueprint below to initialize the operational queue for {selectedClient?.name}.
                                    </p>
                                    <button
                                        onClick={() => setActiveTab("assign")}
                                        className="mt-2 px-6 py-3 bg-indigo-600 text-white text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                                    >
                                        Browse Library
                                    </button>
                                </GlassCard>
                            ) : (
                                <AssignmentOverview
                                    selectedClient={selectedClient}
                                    mappedTemplateIds={mappedTemplateIds}
                                    templates={templates}
                                    onToggle={handleToggleMapping}
                                />
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ClientChecklistMapping;
