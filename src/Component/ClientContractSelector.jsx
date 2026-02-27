import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from "@/Library/Select";
import {
    getClients,
    getClientContracts,
    getNavigationMenus
} from "../Pages/PayrollOpsChecklist/PayrollChecklistService";
import AppIcon from './AppIcon';

/**
 * ClientContractLocator (Enterprise Edition)
 * 
 * A clean, high-density operational locator for SaaS context switching.
 * Full support for Light and Dark modes.
 */
const ClientContractSelector = ({ className = "", MenuId }) => {
    const navigate = useNavigate();

    // Data State
    const [clients, setClients] = useState([]);
    const [contracts, setContracts] = useState([]);
    const [menus, setMenus] = useState([]);

    // Selection State
    const [selectedClient, setSelectedClient] = useState("");
    const [selectedContract, setSelectedContract] = useState("");

    // Loading State
    const [loading, setLoading] = useState({
        clients: false,
        contracts: false
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(prev => ({ ...prev, clients: true }));
            try {
                const [clientData, menuData] = await Promise.all([
                    getClients(),
                    getNavigationMenus()
                ]);
                setClients(clientData);
                setMenus(menuData);
            } catch (error) {
                console.error("Locator lookup failed:", error);
            } finally {
                setLoading(prev => ({ ...prev, clients: false }));
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        const fetchContracts = async () => {
            if (!selectedClient) {
                setContracts([]);
                setSelectedContract("");
                return;
            }

            setLoading(prev => ({ ...prev, contracts: true }));
            try {
                const data = await getClientContracts(selectedClient);
                setContracts(data);
                if (data.length > 0) setSelectedContract(String(data[0].id));
                else setSelectedContract("");
            } catch (error) {
                console.error("Contract fetch error:", error);
            } finally {
                setLoading(prev => ({ ...prev, contracts: false }));
            }
        };
        fetchContracts();
    }, [selectedClient]);

    const handleAcessWorkspace = () => {
        const target = menus.find(m => m.id === MenuId);
        if (!target) {
            console.error("Navigation failed: MenuId not found in menus list", MenuId);
            return;
        }

        const params = new URLSearchParams();
        if (selectedClient) params.append('clientId', selectedClient);
        if (selectedContract) params.append('contractId', selectedContract);

        // navigate(`/${target.path}?${params.toString()}`);
        navigate(`/${target.path}`);
    };

    return (
        <div className={`w-full pt-4 ${className}`}>
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">

                {/* Decorative Accent Bar */}
                <div className="h-1 w-full bg-indigo-600" />

                <div className="p-10">
                    <div className="flex flex-col md:flex-row gap-12">

                        {/* Info Section */}
                        <div className="md:w-1/3 flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl w-fit">
                                        <AppIcon name="Compass" size={24} className="text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                                        Workspace Locator
                                    </h2>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
                                    Authenticate and select your environment context to launch the dedicated workstation.
                                </p>
                            </div>

                            <div className="hidden md:block pt-8 border-t border-gray-50 dark:border-slate-800">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                                    <AppIcon name="ShieldCheck" size={12} className="text-emerald-500" />
                                    Security Isolation Active
                                </div>
                            </div>
                        </div>

                        {/* Selection Controls */}
                        <div className="flex-1 space-y-8">

                            <div className="grid grid-cols-1 gap-6">
                                {/* Client Selection */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide ml-1">Parent Entity / Client</label>
                                    <Select value={selectedClient} onValueChange={setSelectedClient}>
                                        <SelectTrigger className="h-14 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-white dark:hover:bg-slate-750 transition-all rounded-xl px-5 text-gray-700 dark:text-slate-200 font-medium">
                                            <div className="flex items-center gap-3">
                                                <AppIcon name="Building2" size={18} className="text-gray-400 dark:text-slate-500" />
                                                <SelectValue placeholder={loading.clients ? "Syncing clients..." : "Select Client"} />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-1">
                                            {clients.map(c => (
                                                <SelectItem key={c.id} value={String(c.id)} className="py-3.5 pl-10 pr-4 rounded-lg focus:bg-indigo-50 dark:focus:bg-indigo-900/30 data-[state=checked]:bg-indigo-50 dark:data-[state=checked]:bg-indigo-900/30 transition-colors">
                                                    <div className="flex items-center justify-between w-full gap-4">
                                                        <span className="font-semibold text-gray-900 dark:text-white truncate">{c.name}</span>
                                                        <span className="shrink-0 text-[10px] bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 px-2 py-0.5 rounded text-gray-400 dark:text-slate-500 font-mono tracking-tighter">{c.code}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Contract Selection */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide ml-1">Active Service Agreement</label>
                                    <Select
                                        value={selectedContract}
                                        onValueChange={setSelectedContract}
                                        disabled={!selectedClient}
                                    >
                                        <SelectTrigger className="h-14 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 disabled:opacity-50 transition-all rounded-xl px-5 text-gray-900 dark:text-white font-bold">
                                            <div className="flex items-center gap-3 truncate">
                                                <AppIcon name="FileText" size={18} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                                                <SelectValue placeholder={!selectedClient ? "N/A" : "Select Agreement"} />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-1.5 min-w-[320px]">
                                            {contracts.map(cnt => (
                                                <SelectItem key={cnt.id} value={String(cnt.id)} className="py-3 pl-10 pr-4 rounded-xl focus:bg-indigo-50 dark:focus:bg-indigo-900/30 data-[state=checked]:bg-indigo-50 dark:data-[state=checked]:bg-indigo-900/30 mb-1 last:mb-0 transition-colors">
                                                    <div className="flex flex-col gap-1 w-full">
                                                        <div className="flex items-center justify-between gap-4">
                                                            <span className="font-bold text-gray-900 dark:text-white text-sm truncate">{cnt.contractName}</span>
                                                            <span className="shrink-0 text-[9px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded uppercase tracking-tighter">Active</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-slate-500 font-medium italic">
                                                            <AppIcon name="Calendar" size={10} />
                                                            {cnt.startDate} — {cnt.endDate}
                                                        </div>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Action Area */}
                            <div className="pt-4">
                                <button
                                    onClick={handleAcessWorkspace}
                                    disabled={!selectedClient || !selectedContract}
                                    className={`w-full h-14 rounded-xl font-bold flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] ${selectedClient && selectedContract
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-indigo-900/40 hover:bg-indigo-700'
                                        : 'bg-gray-100 dark:bg-slate-800 text-gray-300 dark:text-slate-600 cursor-not-allowed border border-gray-50 dark:border-slate-750'
                                        }`}
                                >
                                    <span>Access Operations</span>
                                    <AppIcon name="ArrowRight" size={18} />
                                </button>
                                <div className="flex items-center justify-center gap-6 mt-6">
                                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-slate-500 font-medium">
                                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                                        Context Switching
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-slate-500 font-medium">
                                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                                        Auto-routing
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientContractSelector;
