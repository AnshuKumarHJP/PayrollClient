import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import OffCanvas from '../../../../Component/OffCanvas';
import { Switch } from '../../../../Library/Switch';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedRole, setTheme } from '../../../../Store/Auth/AuthSlice';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../../Library/Select";
import AppIcon from '../../../../Component/AppIcon';

const PRESETS = {
    DEFAULT: "default",
    MINIMAL: "minimal",
    EXECUTIVE: "executive"
};

// Map categories to icons
const CATEGORY_ICONS = {
    "Overview": "LayoutTemplate",
    "Personnel & Attendance": "Users",
    "Recruitment & Teams": "Briefcase",
    "Business & Projects": "PieChart",
    "Other": "Calendar"
};

const MODE_TABS = [
    { id: 'layout', label: 'Layout & Widgets', icon: "Grid" },
    { id: 'appearance', label: 'Appearance', icon: "Palette" },
    { id: 'advanced', label: 'Advanced', icon: "Code" },
];

// Color Palettes
const ACCENT_COLORS = [
    { id: 'orange', label: 'Sunrise', bg: 'bg-orange-500', ring: 'ring-orange-500' },
    { id: 'blue', label: 'Ocean', bg: 'bg-blue-600', ring: 'ring-blue-600' },
    { id: 'violet', label: 'Royal', bg: 'bg-violet-600', ring: 'ring-violet-600' },
    { id: 'emerald', label: 'Forest', bg: 'bg-emerald-600', ring: 'ring-emerald-600' },
    { id: 'rose', label: 'Rose', bg: 'bg-rose-500', ring: 'ring-rose-500' },
];

const DashboardSettings = ({
    isOpen,
    onClose,
    config,
    setConfig,
    widgetSchema,
}) => {
    const dispatch = useDispatch();
    const globalTheme = useSelector(state => state.Auth.Common?.theme || 'light');
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("All");
    const [activeMode, setActiveMode] = useState("layout");
    const [showCopied, setShowCopied] = useState(false);
    const { data } = useSelector((s) => s.Auth.LogResponce);
    const rolesRaw = useMemo(() => data?.UIRoles || [], []);
    const selectedRole = useSelector((state) => state.Auth.Common.SelectedRole);
    const roles = useMemo(() => rolesRaw.map((r) => r.Role), [rolesRaw]);


    // --- Helpers for Structured Config ---
    const getWidgetState = (id) => config.widgets ? config.widgets[id] : config[id]; // Fallback for old structure
    const getDensity = () => config.preferences ? config.preferences.density : config.density;
    const getColorTheme = () => config.preferences ? config.preferences.colorTheme : config.colorTheme;

    // --- Actions ---

    const handleToggle = (id) => {
        setConfig(prev => ({
            ...prev,
            widgets: {
                ...prev.widgets,
                [id]: !prev.widgets[id]
            }
        }));
    };

    const handleDensityChange = (density) => {
        setConfig(prev => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                density
            }
        }));
    };

    const handleColorChange = (colorTheme) => {
        setConfig(prev => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                colorTheme
            }
        }));
    };

    const handleThemeChange = (theme) => {
        dispatch(setTheme(theme));
    };

    const handleGlobalToggle = (enable) => {
        const newWidgets = { ...config.widgets };
        widgetSchema.forEach(group => {
            group.items.forEach(widget => {
                newWidgets[widget.id] = enable;
            });
        });
        setConfig(prev => ({ ...prev, widgets: newWidgets }));
    };

    const applyPreset = (preset) => {
        const newWidgets = { ...config.widgets };
        widgetSchema.forEach(group => {
            group.items.forEach(widget => {
                switch (preset) {
                    case PRESETS.MINIMAL:
                        newWidgets[widget.id] = ['welcome', 'statsRow1', 'todoList'].includes(widget.id);
                        break;
                    case PRESETS.EXECUTIVE:
                        newWidgets[widget.id] = ['financialStats', 'salesOverview', 'invoices', 'statsRow1'].includes(widget.id);
                        break;
                    case PRESETS.DEFAULT:
                    default:
                        newWidgets[widget.id] = widget.default;
                        break;
                }
            });
        });
        setConfig(prev => ({ ...prev, widgets: newWidgets }));
    };

    const copyConfig = () => {
        navigator.clipboard.writeText(JSON.stringify(config, null, 2));
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
    };

    // --- Derived State ---

    const categories = useMemo(() => ["All", ...widgetSchema.map(g => g.category)], [widgetSchema]);

    const filteredSchema = useMemo(() => {
        let schema = activeTab === "All"
            ? widgetSchema
            : widgetSchema.filter(g => g.category === activeTab);

        if (searchQuery) {
            const lowerQ = searchQuery.toLowerCase();
            return schema.map(group => {
                const matches = group.items.filter(w =>
                    w.label.toLowerCase().includes(lowerQ) ||
                    (w.description && w.description.toLowerCase().includes(lowerQ))
                );
                if (matches.length === 0) return null;
                return { ...group, items: matches };
            }).filter(Boolean);
        }
        return schema;
    }, [widgetSchema, searchQuery, activeTab]);

    // --- Render Helpers ---

    return (
        <OffCanvas
            isOpen={isOpen}
            onClose={onClose}
            position="right"
            title="Dashboard Configuration"
            size="w-[600px]"
        >
            <div className="flex flex-col min-h-full bg-slate-50/50 dark:bg-slate-950 font-sans transition-colors duration-300">
                {/* === HEADER === */}
                <div className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 shadow-sm transition-all">

                    {/* Top Bar */}
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-lg shadow-sm">
                                <AppIcon name="Sliders" size={18} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">Dashboard Studio</h2>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Configure global or role-based views</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 p-1 rounded-lg">
                            <AppIcon name="Shield" size={14} className="ml-2 text-gray-500 dark:text-gray-400" />
                            {/* Replaced native select with Custom Select */}
                            <Select value={selectedRole} onValueChange={(v) => { dispatch(setSelectedRole(v)); navigate('/'); }}>
                                <SelectTrigger className="bg-transparent border-none shadow-none focus:ring-0 h-auto py-1 px-2 text-xs font-semibold text-gray-700 dark:text-gray-200 min-w-[100px]">
                                    <SelectValue placeholder="Select Role" />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                                    {roles.map(r => (
                                        <SelectItem key={r.Code} value={r.Code} className="dark:text-gray-200 dark:focus:bg-slate-700">
                                            {r.Name} View
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="px-6 pt-2 flex gap-6 text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-slate-800">
                        {MODE_TABS.map(tab => {
                            const isActive = activeMode === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveMode(tab.id)}
                                    className={`
                                        flex items-center gap-2 py-3 px-1 border-b-2 transition-all
                                        ${isActive
                                            ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                                            : 'border-transparent hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-slate-600'}
                                    `}
                                >
                                    <AppIcon name={tab.icon} size={16} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Sub-Header Actions (Layout Mode Only) */}
                    {activeMode === 'layout' && (
                        <div className="px-6 py-3 bg-gray-50/50 dark:bg-slate-900/50 flex flex-col gap-3">
                            <div className="flex gap-2">
                                <div className="relative flex-1 group">
                                    <AppIcon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={14} />
                                    <input
                                        type="text"
                                        placeholder="Find widgets..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 rounded-md text-sm transition-all outline-none dark:text-gray-200 dark:placeholder-gray-500"
                                    />
                                </div>
                                <button onClick={() => handleGlobalToggle(true)} className="p-2 text-gray-600 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md hover:border-blue-400 hover:text-blue-600 transition" title="Enable All">
                                    <AppIcon name="CheckCheck" size={16} />
                                </button>
                                <button onClick={() => handleGlobalToggle(false)} className="p-2 text-gray-600 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md hover:border-red-400 hover:text-red-600 transition" title="Disable All">
                                    <AppIcon name="Filter" size={16} />
                                </button>
                            </div>

                            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveTab(cat)}
                                        className={`
                                            px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap border transition-all
                                            ${activeTab === cat
                                                ? 'bg-gray-800 dark:bg-slate-200 text-white dark:text-slate-900 border-gray-800 dark:border-slate-200 shadow-sm'
                                                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700'}
                                        `}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* === CONTENT === */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50 dark:bg-slate-950">

                    {/* LAYOUT MODE */}
                    {activeMode === 'layout' && (
                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                            {activeTab === "All" && !searchQuery && (
                                <div className="mb-8">
                                    <div className="flex items-center justify-between mb-3 px-1">
                                        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Quick Presets</h3>
                                        <span className="text-[10px] text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-slate-900 px-2 py-0.5 rounded-full">One-click apply</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <PresetCard icon="LayoutTemplate" label="Standard" sub="Balanced" onClick={() => applyPreset(PRESETS.DEFAULT)} />
                                        <PresetCard icon="Zap" label="Minimal" sub="Focus" onClick={() => applyPreset(PRESETS.MINIMAL)} />
                                        <PresetCard icon="Monitor" label="Executive" sub="High-level" onClick={() => applyPreset(PRESETS.EXECUTIVE)} />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-8">
                                {filteredSchema.map((group) => (
                                    <div key={group.category} className="space-y-3">
                                        <div className="flex items-center gap-2 px-1">
                                            <span className="p-1.5 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-md shadow-sm text-gray-600 dark:text-gray-300">
                                                <AppIcon name={CATEGORY_ICONS[group.category] || "Layers"} size={14} />
                                            </span>
                                            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">{group.category}</h3>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3">
                                            {group.items.map((widget) => {
                                                const isActive = getWidgetState(widget.id);
                                                return (
                                                    <div
                                                        key={widget.id}
                                                        className={`
                                                            group flex items-center justify-between p-4 rounded-xl border transition-all duration-200
                                                            ${isActive
                                                                ? 'bg-white dark:bg-slate-800 border-blue-200 dark:border-blue-900 shadow-sm'
                                                                : 'bg-gray-50/50 dark:bg-slate-900/50 border-gray-200 dark:border-slate-700 opacity-70 hover:opacity-100'}
                                                        `}
                                                    >
                                                        <div className="flex items-start gap-4">
                                                            <div className={`mt-1 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-slate-600'}`}>
                                                                <AppIcon name="Grid" size={18} />
                                                            </div>
                                                            <div>
                                                                <h4 className={`text-sm font-bold ${isActive ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-500'}`}>{widget.label}</h4>
                                                                {widget.description && <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">{widget.description}</p>}
                                                            </div>
                                                        </div>
                                                        <Switch checked={isActive ?? false} onCheckedChange={() => handleToggle(widget.id)} />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* APPEARANCE MODE */}
                    {activeMode === 'appearance' && (
                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

                            {/* Color Theme */}
                            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
                                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">Color Theme</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Choose the primary accent color for your dashboard.</p>
                                <div className="flex gap-4">
                                    {ACCENT_COLORS.map(color => {
                                        const currentTheme = getColorTheme();
                                        return (
                                            <button
                                                key={color.id}
                                                onClick={() => handleColorChange(color.id)}
                                                className={`
                                                    w-8 h-8 rounded-full ${color.bg} ring-2 ring-offset-2 transition-all hover:scale-110
                                                    ${(currentTheme === color.id || (!currentTheme && color.id === 'orange')) ? color.ring : 'ring-transparent'}
                                                `}
                                                title={color.label}
                                            />
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Density */}
                            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
                                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">Density</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Adjust the information density of the dashboard.</p>
                                <div className="flex gap-3">
                                    <DensityOption
                                        label="Comfortable"
                                        active={!getDensity() || getDensity() === 'comfortable'}
                                        onClick={() => handleDensityChange('comfortable')}
                                    />
                                    <DensityOption
                                        label="Compact"
                                        active={getDensity() === 'compact'}
                                        onClick={() => handleDensityChange('compact')}
                                    />
                                </div>
                            </div>

                            {/* Interface Mode */}
                            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
                                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">Interface Mode</h3>
                                <div className="flex gap-3">
                                    <DensityOption
                                        label="Light"
                                        icon="Sun"
                                        active={globalTheme === 'light'}
                                        onClick={() => handleThemeChange('light')}
                                    />
                                    <DensityOption
                                        label="Dark"
                                        icon="Moon"
                                        active={globalTheme === 'dark'}
                                        onClick={() => handleThemeChange('dark')}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ADVANCED MODE (JSON) */}
                    {activeMode === 'advanced' && (
                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-100 dark:border-blue-800">
                                <div className="flex gap-3 items-start">
                                    <AppIcon name="Globe" className="text-blue-600 dark:text-blue-400 mt-1" size={20} />
                                    <div>
                                        <h3 className="font-bold text-blue-900 dark:text-blue-200">Global Configuration</h3>
                                        <p className="text-xs text-blue-700 dark:text-blue-300 mt-1 leading-relaxed">
                                            This JSON defines the complete state of the dashboard, including user preferences, widget visibility, and role-based overrides.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
                                <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-800">
                                    <h3 className="font-bold text-gray-700 dark:text-gray-200 text-sm">config.json</h3>
                                    <button
                                        onClick={copyConfig}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 bg-white dark:bg-slate-700 border dark:border-slate-600 rounded shadow-sm hover:bg-gray-50 dark:hover:bg-slate-600 active:scale-95 transition"
                                    >
                                        {showCopied ? <AppIcon name="CheckCheck" size={12} className="text-green-600 dark:text-green-400" /> : <AppIcon name="Copy" size={12} />}
                                        {showCopied ? "Copied!" : "Copy Config"}
                                    </button>
                                </div>
                                <div className="bg-slate-900 p-4 overflow-x-auto">
                                    <pre className="text-[10px] leading-4 font-mono text-green-400">
                                        {JSON.stringify(config, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* === FOOTER === */}
                <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 p-4 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
                    <div className="flex items-center gap-2">
                        <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Auto-saving...</span>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">
                            Close
                        </button>
                        <button onClick={onClose} className="px-6 py-2 text-sm font-bold text-white bg-gradient-to-r from-gray-900 to-gray-800 dark:from-slate-700 dark:to-slate-800 rounded-lg shadow-lg shadow-gray-200 dark:shadow-none hover:shadow-xl hover:-translate-y-0.5 transition-all">
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </OffCanvas>
    );
};

// --- Sub-Components ---

const PresetCard = ({ icon, label, sub, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center p-3 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all bg-white dark:bg-slate-800 group">
        <AppIcon name={icon} size={20} className="text-gray-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 mb-2 transition-colors" />
        <span className="text-xs font-bold text-gray-700 dark:text-gray-200 group-hover:text-blue-700 dark:group-hover:text-blue-300">{label}</span>
        <span className="text-[10px] text-gray-400 dark:text-gray-500">{sub}</span>
    </button>
);

const DensityOption = ({ label, active, onClick, icon }) => (
    <div
        onClick={onClick}
        className={`
            flex-1 p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-center gap-2
            ${active
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 text-gray-600 dark:text-gray-400'}
        `}
    >
        {icon ? <AppIcon name={icon} size={14} /> : (active && <AppIcon name="CheckCheck" size={14} />)}
        <span className="text-xs font-bold">{label}</span>
    </div>
);

export default DashboardSettings;

