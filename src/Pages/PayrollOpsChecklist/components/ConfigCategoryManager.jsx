import React, { useState } from 'react';
import AppIcon from "../../../Component/AppIcon";
import { motion, AnimatePresence, Reorder } from "framer-motion";

const ConfigCategoryManager = ({ categories, selectedCategory, onSelectCategory, onAddCategory, onEditCategory, onDeleteCategory, onReorderCategories, isLocked }) => {
    // ... (state remains same)
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [tempName, setTempName] = useState('');

    const handleAddClick = () => {
        setIsAdding(true);
        setTempName('');
    };

    const handleSaveNew = () => {
        if (tempName) {
            // Calculate next displayOrder
            const maxOrder = categories.reduce((max, c) => Math.max(max, c.displayOrder || 0), 0);
            onAddCategory({
                name: tempName,
                status: 'active',
                color: 'blue',
                icon: 'Folder',
                description: 'New Category',
                displayOrder: maxOrder + 1
            });
            setIsAdding(false);
        }
    };

    // ... (handleEditClick, handleSaveEdit remain same)
    const handleEditClick = (category) => {
        setEditingId(category.id);
        setTempName(category.name);
    };

    const handleSaveEdit = (id) => {
        if (tempName) {
            const cat = categories.find(c => c.id === id);
            if (cat) {
                onEditCategory(id, { ...cat, name: tempName });
            }
            setEditingId(null);
        }
    };


    // Icons pool unused
    const icons = ['FileText', 'Zap', 'ShieldCheck', 'Users', 'Target'];

    return (
        <div className="w-full lg:w-80 bg-white dark:bg-slate-800 rounded-[28px] border border-slate-200/60 dark:border-slate-700/50 h-fit lg:sticky lg:top-6 shadow-sm overflow-hidden transition-all hover:shadow-xl hover:shadow-indigo-500/5 duration-500">
            {/* Header ... remains same */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100/30 dark:from-slate-900/40 dark:to-slate-900/10 p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg shadow-black/5 border border-slate-100 dark:border-slate-700 text-indigo-600 rotate-3 group-hover:rotate-0 transition-transform">
                        <AppIcon name="Folder" size={18} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-[15px] tracking-tight">Categories</h3>
                        <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-1 pr-2 border-b-2 border-indigo-500/30 w-fit">by Module</p>
                    </div>
                </div>
                {!isAdding && !isLocked && (
                    <button
                        onClick={handleAddClick}
                        className="w-8 h-8 flex items-center justify-center bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all active:scale-90 shadow-lg shadow-indigo-500/20"
                        title="Add Category"
                    >
                        <AppIcon name="Plus" size={16} strokeWidth={3} />
                    </button>
                )}
            </div>

            <div className="p-4 space-y-1.5">
                {/* All Categories Option */}
                <button
                    onClick={() => onSelectCategory(null)}
                    className={`group w-full flex items-center justify-between p-2 rounded-2xl transition-all duration-300 ${!selectedCategory
                        ? 'bg-indigo-50/50 dark:bg-indigo-900/10 shadow-sm shadow-indigo-100 dark:shadow-none translate-x-1'
                        : 'bg-transparent hover:bg-slate-50/80 dark:hover:bg-slate-700/40'
                        }`}
                >
                    <div className="flex items-center gap-3.5">
                        <div className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-300 ${!selectedCategory
                            ? 'bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none scale-110 rotate-3'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:scale-105'
                            }`}>
                            <AppIcon name="LayoutGrid" size={16} strokeWidth={2.5} />
                        </div>
                        <span className={`text-[13px] font-bold transition-all ${!selectedCategory ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}>
                            Overview
                        </span>
                    </div>
                </button>

                {/* Adding State */}
                <AnimatePresence>
                    {isAdding && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-indigo-50/30 dark:bg-indigo-900/10 p-4 rounded-[20px] border border-indigo-100/50 dark:border-indigo-800/30 space-y-3"
                        >
                            <input
                                type="text"
                                placeholder="Category Name..."
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-indigo-200/50 dark:border-slate-700 focus:ring-4 focus:ring-indigo-500/10 outline-none bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200"
                                autoFocus
                            />
                            <div className="flex justify-end gap-2">
                                <button onClick={() => setIsAdding(false)} className="px-3 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600">Cancel</button>
                                <button onClick={handleSaveNew} className="px-4 py-1.5 text-[10px] font-black bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/20 uppercase tracking-widest active:scale-95">Add</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Categories List with Drag and Drop */}
                <Reorder.Group axis="y" values={categories} onReorder={onReorderCategories || (() => { })} className="space-y-1.5">
                    {categories.map((category) => {
                        const isActive = selectedCategory === category.id;
                        const isEditing = editingId === category.id;
                        const iconName = category.icon || 'Folder';

                        return (
                            <Reorder.Item key={category.id} value={category} as="div" dragListener={!isEditing}>
                                <div
                                    onClick={() => !isEditing && onSelectCategory(category.id)}
                                    className={`group relative w-full flex items-center justify-between p-2 rounded-2xl transition-all duration-300 border-2 select-none ${isActive && !isEditing
                                        ? 'bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-100/30 dark:border-indigo-800/20 translate-x-1'
                                        : 'bg-transparent border-transparent hover:bg-slate-50/80 dark:hover:bg-slate-700/40'
                                        } ${isEditing ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}`}
                                >
                                    {isEditing ? (
                                        <div className="flex-1 flex gap-2 p-1">
                                            <input
                                                type="text"
                                                value={tempName}
                                                onChange={(e) => setTempName(e.target.value)}
                                                className="flex-1 px-3 py-1.5 text-xs font-bold rounded-xl border border-indigo-200/50 dark:border-slate-700 focus:ring-4 focus:ring-indigo-500/10 outline-none bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200"
                                                autoFocus
                                            />
                                            <div className="flex gap-1">
                                                <button onClick={() => handleSaveEdit(category.id)} className="w-8 h-8 flex items-center justify-center text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-colors"><AppIcon name="Check" size={16} strokeWidth={3} /></button>
                                                <button onClick={() => setEditingId(null)} className="w-8 h-8 flex items-center justify-center text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"><AppIcon name="X" size={16} strokeWidth={3} /></button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-3.5">
                                                <div className="text-slate-300 dark:text-slate-600 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <AppIcon name="GripVertical" size={14} />
                                                </div>
                                                <div className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-300 ${isActive
                                                    ? 'bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none scale-110 rotate-3'
                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                                    }`}>
                                                    <AppIcon name={iconName} size={16} strokeWidth={2.5} />
                                                </div>
                                                <span className={`text-[13px] font-bold transition-all ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900'}`}>
                                                    {category.name}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleEditClick(category); }}
                                                    className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                                                >
                                                    <AppIcon name="Edit3" size={14} />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onDeleteCategory(category.id); }}
                                                    className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                >
                                                    <AppIcon name="Trash2" size={14} />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </Reorder.Item>
                        );
                    })}
                </Reorder.Group>
            </div>

            {/* Configuration Guide / Suggestions */}
            <div className="p-5 mt-auto border-t border-slate-50 dark:border-slate-700/50">
                <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-[24px] border border-slate-100 dark:border-slate-800 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                            <AppIcon name="Compass" size={16} />
                        </div>
                        <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">Config Guide</h4>
                    </div>

                    <div className="space-y-3">
                        <div className="group/item flex gap-3 cursor-default">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1 shrink-0 group-hover/item:scale-150 transition-transform" />
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                <span className="text-slate-900 dark:text-slate-100 font-bold block mb-0.5">Hierarchy Logic</span>
                                Linked subtasks automatically move with the parent task during reordering.
                            </p>
                        </div>

                        <div className="group/item flex gap-3 cursor-default">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 shrink-0 group-hover/item:scale-150 transition-transform" />
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                <span className="text-slate-900 dark:text-slate-100 font-bold block mb-0.5">Auto-Assignment</span>
                                Toggle 'Auto-Assign' to mirror the current task structure into the next month.
                            </p>
                        </div>

                        <div className="group/item flex gap-3 cursor-default">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1 shrink-0 group-hover/item:scale-150 transition-transform" />
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                <span className="text-slate-900 dark:text-slate-100 font-bold block mb-0.5">Finalize Sequence</span>
                                Always 'Save' your changes before 'Finalizing' the database for the selected month.
                            </p>
                        </div>
                    </div>

                    <button className="w-full py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95">
                        View Full Documentation
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfigCategoryManager;
