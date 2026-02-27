import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import AppIcon from "../../Component/AppIcon";
import Toast from "../../Component/Toast";
import useRole from "../../Hooks/useRole";

import { getCategories, createCategory, updateCategory, deleteCategory, getPayrollOpsTasks, createPayrollOpsTask, updatePayrollOpsTask, deletePayrollOpsTask } from "./PayrollChecklistService";
import ConfigHeader from "./components/ConfigHeader";
import ConfigCategoryManager from "./components/ConfigCategoryManager";

import ConfigTaskList from "./components/ConfigTaskList";
import { setSelectedMonth } from "../../Store/Auth/AuthSlice";
import MonthYearSelector from "../../Component/MonthYearSelector";

const PayrollChecklistConfig = () => {
    const { SelectedMonth } = useSelector((state) => state.Auth.Common);
    const { currentRole, isApprover, personal } = useRole();
    const [tasks, setTasks] = useState([]);
    const dispatch = useDispatch();
    const [categories, setCategories] = useState([]);
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [toastConfig, setToastConfig] = useState({
        message: '',
        type: 'success',
        isVisible: false
    });

    const showToast = (message, type = 'success') => {
        setToastConfig({
            message,
            type,
            isVisible: true
        });
    };

    // Manager Role Check (Provided by useRole hook)

    useEffect(() => {
        if (!isApprover && currentRole) {
            showToast("You don't have permission to access config.", "error");
        }
    }, [isApprover, currentRole]);

    if (!isApprover && currentRole) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="p-4 bg-rose-50 dark:bg-rose-900/20 rounded-2xl text-rose-500 mb-4">
                    <AppIcon name="ShieldAlert" size={48} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Unauthorized Access</h2>
                <p className="text-slate-500 max-w-sm mb-6">This section is restricted to Payroll Managers and Technical Leads only.</p>
                <button
                    onClick={() => window.location.hash = "/ops/checklist"}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all"
                >
                    Return to Dashboard
                </button>
            </div>
        );
    }

    // Fetch Tasks
    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const data = await getPayrollOpsTasks();
            setTasks(data);
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
        }
    };



    // Fetch Categories
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            const sortedData = data.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
            setCategories(sortedData);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };

    const handleAddCategory = async (catData) => {
        try {
            const savedCat = await createCategory(catData);
            setCategories((prev) => [...prev, savedCat]);
            showToast("Category added successfully", "success");
        } catch (error) {
            console.error(error);
            showToast("Failed to add category", "error");
        }
    };

    const handleEditCategory = async (id, catData) => {
        try {
            const updated = await updateCategory(id, catData);
            setCategories((prev) => prev.map(c => c.id === id ? updated : c));
            showToast("Category updated successfully", "success");
        } catch (error) {
            console.error(error);
            showToast("Failed to update category", "error");
        }
    };

    const handleDeleteCategory = async (id) => {
        try {
            await deleteCategory(id);
            setCategories((prev) => prev.filter(c => c.id !== id));
            showToast("Category deleted successfully", "success");
        } catch (error) {
            console.error(error);
            showToast("Failed to delete category", "error");
        }
    };

    const handleReorderCategories = async (newOrder) => {
        setCategories(newOrder);
        try {
            const updatePromises = newOrder.map((cat, index) => {
                const newDisplayOrder = index + 1;
                if (cat.displayOrder !== newDisplayOrder) {
                    return updateCategory(cat.id, { ...cat, displayOrder: newDisplayOrder });
                }
                return Promise.resolve();
            });
            await Promise.all(updatePromises);
        } catch (error) {
            console.error("Failed to save order:", error);
            showToast("Failed to save category order", "error");
            fetchCategories(); // Revert on error
        }
    };

    const handleAddTask = async (taskData) => {
        try {
            const newTask = {
                ...taskData,
                status: 'pending',
                createdOn: new Date().toISOString(),
                createdBy: personal
            };
            const savedTask = await createPayrollOpsTask(newTask);
            setTasks((prev) => [...prev, savedTask]);
            showToast("Task added successfully", "success");
        } catch (error) {
            console.error(error);
            showToast("Failed to add task", "error");
        }
    };

    const handleEditTask = async (taskData) => {
        try {
            const updated = await updatePayrollOpsTask(taskData.id, taskData);
            setTasks((prev) => prev.map(t => t.id === taskData.id ? updated : t));
            showToast("Task updated successfully", "success");
        } catch (error) {
            console.error(error);
            showToast("Failed to update task", "error");
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await deletePayrollOpsTask(taskId);
            setTasks((prev) => prev.filter(t => t.id !== taskId));
            showToast("Task has been deleted", "success");
        } catch (error) {
            console.error(error);
            showToast("Failed to delete task", "error");
        }
    };

    const monthTasks = tasks.filter(task => {
        if (!SelectedMonth) return true;

        // Category Filter
        const matchesCategory = !selectedCategoryId || task.category === selectedCategoryId;
        if (!matchesCategory) return false;

        if (!task.dueDate) return true;

        const taskDate = new Date(task.dueDate);
        if (isNaN(taskDate.getTime())) return true;

        const taskMonth = taskDate.getMonth() + 1;
        const taskYear = taskDate.getFullYear();

        return taskMonth === SelectedMonth.month && taskYear === SelectedMonth.year;
    });


    const isMonthPassed = () => {
        if (!SelectedMonth) return false;

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1; // 0-based index

        if (SelectedMonth.year < currentYear) return true;
        if (SelectedMonth.year === currentYear && SelectedMonth.month < currentMonth) return true;

        return false;
    };

    const isMonthLocked = isMonthPassed();
    const [isFinalized, setIsFinalized] = useState(false);
    const isLocked = isMonthLocked || isFinalized;


    const handleFinalizeChecklist = async () => {
        if (!tasks.length) return;
        try {
            const payload = {
                month: SelectedMonth?.monthLabel,
                year: SelectedMonth?.year,
                tasks: tasks,
                finalizedAt: new Date().toISOString()
            };
            // await finalizeChecklist(payload);
            setIsFinalized(true);
            showToast("All data has been moved to the main database.", "success");
        } catch (error) {
            showToast("Failed to finalize checklist.", "error");
        }
    };

    const handleRollbackChecklist = async () => {
        try {
            // await rollbackChecklist(SelectedMonth?.monthLabel, SelectedMonth?.year);
            setIsFinalized(false);
            showToast("Changes have been rolled back successfully.", "warning");
        } catch (error) {
            showToast("Rollback failed.", "error");
        }
    };

    const handleSaveConfiguration = () => {
        if (!SelectedMonth) {
            showToast("Please select a payroll month.", "error");
            return;
        }

        if (!categories || categories.length === 0) {
            showToast("Please add at least one category.", "error");
            return;
        }

        if (!tasks || tasks.length === 0) {
            showToast("Please add at least one task.", "error");
            return;
        }

        const payload = {
            month: SelectedMonth?.monthLabel,
            year: SelectedMonth?.year,
            tasks,
            categories
        }
        console.log("Payload:", payload);

        showToast("Configuration saved successfully!", "success");
    };

    return (
        <div className="min-h-screen space-y-4">
            {/* Header */}
            <ConfigHeader>
                <div className="flex flex-col sm:flex-row items-center justify-end w-full gap-2">
                    {/* Control Bar */}
                    <div className="flex items-center gap-2">
                        {!isLocked && !isFinalized ? (
                            <>
                                <button
                                    onClick={() => setIsAddingTask(true)}
                                    className="flex items-center whitespace-nowrap text-[13px] gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-bold shadow-md active:scale-95"
                                >
                                    <AppIcon name="Plus" size={16} />
                                    <span>New Task</span>
                                </button>
                                <button
                                    onClick={handleSaveConfiguration}
                                    className="flex items-center whitespace-nowrap text-[13px] gap-2 px-3 py-1.5 bg-white text-indigo-700 border border-indigo-100 rounded-lg hover:bg-indigo-50 transition-all font-bold active:scale-95"
                                >
                                    <AppIcon name="Save" size={16} />
                                    <span>Save</span>
                                </button>
                                <button
                                    onClick={handleFinalizeChecklist}
                                    className="flex items-center whitespace-nowrap text-[13px] gap-2 px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all shadow-md font-bold active:scale-95"
                                >
                                    <AppIcon name="Database" size={16} />
                                    <span>Finalize</span>
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-2 p-0.5">
                                <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase tracking-widest">
                                    <AppIcon name="Lock" size={12} />
                                    <span>{isFinalized ? "Finalized" : "Locked"}</span>
                                </div>
                                <button
                                    onClick={handleRollbackChecklist}
                                    className="flex items-center whitespace-nowrap text-[13px] gap-2 px-3 py-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg hover:bg-rose-100 transition-all font-bold active:scale-95"
                                >
                                    <AppIcon name="RotateCcw" size={16} />
                                    <span>Rollback</span>
                                </button>
                            </div>
                        )}
                    </div>
                    <span className="text-slate-300 h-full"> | </span>
                    {/* Month Context */}
                    <div className="w-[200px] shrink-0">
                        <MonthYearSelector
                            value={SelectedMonth}
                            onChange={(m) => dispatch(setSelectedMonth(m))}
                            className="w-full shadow-sm"
                            showMonthGrid={false}
                            showYear={false}
                            monthFormat="longYear"
                        />
                    </div>
                </div>
            </ConfigHeader>

            {/* Main Content Grid */}
            <div className="max-w-[1600px] mx-auto space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Manage Categories - Sidebar */}
                    <div className="w-full md:w-80">
                        <div className="sticky top-6 space-y-4">
                            <ConfigCategoryManager
                                categories={categories}
                                selectedCategory={selectedCategoryId}
                                onSelectCategory={setSelectedCategoryId}
                                onAddCategory={handleAddCategory}
                                onEditCategory={handleEditCategory}
                                onDeleteCategory={handleDeleteCategory}
                                onReorderCategories={handleReorderCategories}
                                isLocked={isLocked}
                            />
                        </div>
                    </div>

                    {/* Task List Management - Main Content */}
                    <div className="flex-1">
                        <ConfigTaskList
                            tasks={monthTasks}
                            activeCategory={selectedCategoryId}
                            onAddTask={handleAddTask}
                            onEditTask={handleEditTask}
                            onDeleteTask={handleDeleteTask}
                            categories={categories}
                            selectedPayrollMonth={SelectedMonth}
                            isAddingTask={isAddingTask}
                            setIsAddingTask={setIsAddingTask}
                            isLocked={isLocked}
                        />
                    </div>
                </div>
            </div>
            <Toast
                isVisible={toastConfig.isVisible}
                message={toastConfig.message}
                type={toastConfig.type}
                onClose={() => setToastConfig(prev => ({ ...prev, isVisible: false }))}
            />
        </div>
    );
};

export default PayrollChecklistConfig;
