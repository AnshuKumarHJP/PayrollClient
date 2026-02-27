import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    setSelectedClient,
    setSelectedClientLabel,
    setSelectedClientContract,
    setSelectedClientContractLabel
} from "../Store/Auth/AuthSlice";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/Library/Select";
import AppIcon from "./AppIcon";
import useRole from "../Hooks/useRole";
import { useToast } from "../Library/use-toast";
import Button from "../Library/Button";

/**
 * ContextGate Component
 * Wraps content and displays a beautiful selection UI if Client or Contract is not selected.
 * Specifically handled for SuperAdmins who have the global selectors hidden in the sidebar.
 */
const ContextGate = ({ children, title = "Configuration Hub", icon = "Settings2" }) => {
    const dispatch = useDispatch();
    const { toast } = useToast();

    // Redux State
    const {
        SelectedClientCode,
        SelectedClientLabel,
        SelectedClientContractCode,
        SelectedClientContractLabel
    } = useSelector((state) => state.Auth.Common);

    const AUTH_DATA = useSelector((state) => state.Auth.LogResponce.data);
    const clients = AUTH_DATA?.ClientList || [];
    const contracts = AUTH_DATA?.ClientContractList || [];

    const [isRevealed, setIsRevealed] = React.useState(!!(SelectedClientCode && SelectedClientContractCode));
    const { isSuperAdmin } = useRole();

    const handleLaunch = () => {
        toast({
            title: "Workspace Activated",
            description: `Now synchronized with ${SelectedClientLabel || 'Selected Client'}.`,
            variant: "success",
        });
        setIsRevealed(true);
    };

    useEffect(() => {
        if ((SelectedClientCode && SelectedClientContractCode) && isSuperAdmin) {
            handleReset()
        }
    }, []);

    const handleReset = () => {
        dispatch(setSelectedClient(""));
        dispatch(setSelectedClientLabel(""));
        dispatch(setSelectedClientContract(""));
        dispatch(setSelectedClientContractLabel(""));
        setIsRevealed(false);
    };

    const handleClientChange = (val) => {
        const selected = clients.find(c => String(c.Id) === String(val));
        dispatch(setSelectedClient(val));
        if (selected) {
            dispatch(setSelectedClientLabel(selected.Name));
        }
    };

    const handleContractChange = (val) => {
        const selected = contracts.find(c => String(c.Id) === String(val));
        dispatch(setSelectedClientContract(val));
        if (selected) {
            dispatch(setSelectedClientContractLabel(selected.Name));
        }
    };

    // If context is present and we are revealed, show children
    if (SelectedClientCode && SelectedClientContractCode && isRevealed) {
        return (
            <>
                <div className="sticky top-0 z-[40] w-full animate-in fade-in slide-in-from-top-4 duration-500 space-y-4">
                    <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-lg px-2 py-2.5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 md:gap-8 overflow-hidden">
                            {/* Client Identity */}
                            <div className="flex items-center gap-3 shrink-0">
                                <div className="size-8 md:size-9 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-inner">
                                    <AppIcon name="Building2" size={16} className="text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div className="hidden sm:block min-w-0">
                                    <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">Partition</p>
                                    <h4 className="text-sm font-semibold text-slate-800 dark:text-white truncate max-w-[120px] md:max-w-[300px] leading-none">{SelectedClientLabel}</h4>
                                </div>
                            </div>

                            {/* Separator */}
                            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block opacity-50"></div>

                            {/* Contract Identity */}
                            <div className="flex items-center gap-3 shrink-0">
                                <div className="size-8 md:size-9 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-inner">
                                    <AppIcon name="FileText" size={16} className="text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div className="hidden sm:block min-w-0">
                                    <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">Contract</p>
                                    <h4 className="text-sm font-semibold text-slate-800 dark:text-white truncate max-w-[120px] md:max-w-[300px] leading-none">{SelectedClientContractLabel}</h4>
                                </div>
                            </div>
                        </div>

                        {/* Switch Action */}
                        <Button
                            onClick={handleReset}
                            variant="outline"
                            size="sm"
                            icon={<AppIcon name="RefreshCw" size={14} className="text-indigo-500" />}
                            className="rounded-lg border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-[11px] font-semibold uppercase tracking-wider gap-2 active:scale-95 transition-all h-9 px-4 shrink-0 shadow-sm"
                        >
                            <span className="hidden md:inline">Change Context</span>
                            <span className="md:hidden">Change</span>
                        </Button>
                    </div>
                </div>
                <div className="w-full h-full mt-6">
                    {children}
                </div>
            </>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 animate-in fade-in zoom-in duration-500">
            <div className="w-full bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Left Panel: Visual/Context */}
                    <div className="p-10 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white flex flex-col justify-between relative overflow-hidden">
                        {/* Decorative Gradient Blob */}
                        <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>

                        <div className="relative z-10">
                            <div className="p-3 bg-white/10 w-fit rounded-2xl backdrop-blur-md mb-6 border border-white/20">
                                <AppIcon name={icon} size={25} className="text-white" />
                            </div>
                            <h2 className="text-xl font-black uppercase tracking-tight leading-tight">
                                {title}
                            </h2>
                            <p className="mt-4 text-indigo-100 font-medium text-sm leading-relaxed">
                                To proceed with management and operations, please define your operational parameters.
                            </p>

                            {/* --- ENVIRONMENT SUMMARY --- */}

                            <div className="mt-8 p-6 bg-white/10 rounded-[2rem] border border-white/20 backdrop-blur-lg animate-in fade-in slide-in-from-left-4 duration-500">
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200 opacity-80">Selected Environment</span>
                                <div className="mt-3 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-lg bg-indigo-500/30 flex items-center justify-center border border-indigo-400/30">
                                            <AppIcon name="Building2" size={14} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-indigo-200 leading-none">Client :</p>
                                            {SelectedClientCode && (<p className="text-sm font-black text-white truncate max-w-[180px]">{SelectedClientLabel || "System Client"}</p>)}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                        <div className="size-8 rounded-lg bg-emerald-500/30 flex items-center justify-center border border-emerald-400/30">
                                            <AppIcon name="FileText" size={14} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-indigo-200 leading-none">Active Contract :</p>
                                            {SelectedClientContractCode && (<p className="text-sm font-black text-white">{SelectedClientContractLabel || SelectedClientContractCode}</p>)}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-10 border-t border-white/10 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/20"></div>
                                <span className="text-sm font-bold uppercase tracking-widest text-indigo-200">System Ready</span>
                            </div>
                            <p className="text-xs text-indigo-200/60 font-medium italic leading-relaxed">
                                Your data partition will be strictly scoped to the selected context for maximum security.
                            </p>
                        </div>
                    </div>

                    {/* Right Panel: Selectors */}
                    <div className="p-10 flex flex-col justify-center space-y-8 bg-slate-50/30 dark:bg-slate-900/50">
                        <div className="space-y-6">

                            {/* Client Selection */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 flex items-center gap-2">
                                    <AppIcon name="Building2" size={12} />
                                    Select Client Organization
                                </label>
                                <Select value={String(SelectedClientCode || "")} onValueChange={handleClientChange}>
                                    <SelectTrigger className="h-14 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm rounded-xl px-5 text-gray-700 dark:text-slate-200 font-medium">
                                        <div className="flex items-center gap-3">
                                            <AppIcon name="Building2" size={18} className="text-gray-400 dark:text-slate-500" />
                                            <SelectValue placeholder="Select Client" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-1">
                                        {clients.length === 0 && (
                                            <div className="text-center text-gray-400 py-2 text-sm">No clients found</div>
                                        )}
                                        {clients.map(c => (
                                            <SelectItem
                                                key={c.Id}
                                                value={String(c.Id)}
                                                className="py-3.5 pl-10 pr-4 rounded-lg focus:bg-indigo-50 dark:focus:bg-indigo-900/30 data-[state=checked]:bg-indigo-600 data-[state=checked]:text-white transition-colors"
                                            >
                                                <div className="flex items-center justify-between w-full gap-4">
                                                    <span className="font-semibold truncate">{c.Name}</span>
                                                    <span className="shrink-0 text-[10px] bg-white/10 border border-white/20 px-2 py-0.5 rounded font-mono tracking-tighter opacity-80">{c.Code}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Contract Selection */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 flex items-center gap-2">
                                    <AppIcon name="FileText" size={12} />
                                    Define Service Contract
                                </label>
                                <Select value={String(SelectedClientContractCode || "")} onValueChange={handleContractChange} disabled={!SelectedClientCode}>
                                    <SelectTrigger className="h-14 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm rounded-xl px-5 text-gray-700 dark:text-slate-200 font-medium">
                                        <div className="flex items-center gap-3">
                                            <AppIcon name="FileText" size={18} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                                            <SelectValue placeholder="Select Contract" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-1.5 min-w-[320px]">
                                        {contracts.length === 0 && (
                                            <div className="text-center text-gray-400 py-2 text-sm">No contracts found</div>
                                        )}
                                        {contracts.map(cnt => (
                                            <SelectItem
                                                key={cnt.Id}
                                                value={String(cnt.Id)}
                                                className="py-3 pl-10 pr-4 rounded-xl focus:bg-indigo-50 dark:focus:bg-indigo-900/30 data-[state=checked]:bg-indigo-600 data-[state=checked]:text-white transition-colors group"
                                            >
                                                <div className="flex flex-col gap-1 w-full">
                                                    <div className="flex items-center justify-between gap-4">
                                                        <span className="font-bold text-sm truncate">{cnt.Name}</span>
                                                        <span className="shrink-0 text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded bg-emerald-500 text-white dark:bg-emerald-600">Active</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-[10px] font-medium italic opacity-70">
                                                        <AppIcon name="Calendar" size={10} />
                                                        {cnt.StartDate || 'N/A'} — {cnt.EndDate || 'N/A'}
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-6">
                            <button
                                onClick={handleLaunch}
                                disabled={!SelectedClientCode || !SelectedClientContractCode}
                                className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white disabled:text-slate-400 font-black uppercase tracking-[0.15em] rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 active:scale-[0.98]"
                            >
                                <AppIcon name="Rocket" size={18} />
                                Launch Workspace
                            </button>

                            <div className="flex items-center gap-4 text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest justify-center">
                                <div className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                                Secure Context Initialization
                                <div className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContextGate;
