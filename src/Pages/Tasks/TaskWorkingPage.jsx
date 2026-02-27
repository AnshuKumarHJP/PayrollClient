import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

import AppIcon from "../../Component/AppIcon";
import TaskHeader from "./TaskHeader";
import TaskDataTable from "./TaskDataTable";
import Button from "../../Library/Button";
import { useToast } from "../../Library/use-toast";

import { initialTasks } from "../../Data/StaticData";
import { fetchExcelData, sanitizeData } from "../../services/TaskDataService";
import useRole from "../../Hooks/useRole";

/* =========================================================
   CONSTANTS (stable across renders)
========================================================= */

const EXCEL_URL = "https://res.cloudinary.com/der9mzuum/raw/upload/v1764227881/PayrollHR/ExcelFiles/s2ep9nkl31okuthuyg7i.xlsx";
/* ========================================================= */

const TaskWorkingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { isSuperAdmin, isPayrollUser, currentRole } = useRole();

    const isReviewer = isSuperAdmin || ['PayrollAdmin', 'PayrollILTechnicalLead'].includes(currentRole);
    const isOperator = isPayrollUser || isSuperAdmin;

    /* ---------------- State ---------------- */
    const [tasks, setTasks] = useState(() =>
        initialTasks.filter((t) =>
            t.assignees.some((a) => a.includes("current"))
        )
    );
    const [activeTask, setActiveTask] = useState(null);
    const [taskData, setTaskData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [dataSource, setDataSource] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [seconds, setSeconds] = useState(0);
    const [selectedRows, setSelectedRows] = useState(new Set());

    /* =========================================================
       TIMER (runs only when task is active)
    ========================================================= */
    useEffect(() => {
        if (!activeTask) {
            setSeconds(0);
            return;
        }

        const timer = setInterval(() => {
            setSeconds((s) => s + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [activeTask]);

    /* =========================================================
       FORMAT TIME (memoized)
    ========================================================= */
    const elapsedTime = useMemo(() => {
        const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
        const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
        const s = String(seconds % 60).padStart(2, "0");
        return `${h}:${m}:${s}`;
    }, [seconds]);

    /* =========================================================
       START WORKING (MAIN ASYNC FLOW)
    ========================================================= */
    const startWorking = useCallback(async (task) => {
        if (!task) return;

        setActiveTask(task);
        setIsLoading(true);
        setTaskData([]);
        setColumns([]);
        setDataSource("Analyzing Remote Structure...");

        try {
            const { rows, columns: dynamicColumns } =
                await fetchExcelData(EXCEL_URL);

            setColumns(dynamicColumns);
            setTaskData(sanitizeData(rows, dynamicColumns));
            setDataSource(`Dynamic Source: ${EXCEL_URL.split("/").pop()}`);
        } catch (err) {
            console.error("Discovery Error:", err);
            setDataSource("Error: Remote structure discovery failed");
        } finally {
            setIsLoading(false);
        }
    }, []);

    /* =========================================================
       AUTO START TASK FROM URL
    ========================================================= */
    useEffect(() => {
        if (!id) return;
        const task = initialTasks.find((t) => t.id === id);
        if (task) startWorking(task);
    }, [id, startWorking]);

    /* =========================================================
       UPDATE HANDLERS
    ========================================================= */
    const handleUpdateRow = useCallback((index, updatedRow) => {
        setTaskData((prev) => {
            const next = [...prev];
            next[index] = updatedRow;
            return next;
        });
    }, []);

    const handleBulkUpdate = useCallback((indices, status) => {
        setTaskData((prev) => {
            const next = [...prev];
            indices.forEach((i) => {
                next[i] = { ...next[i], status };
            });
            return next;
        });
    }, []);

    const filteredData = useMemo(() => {
        if (!searchTerm) return taskData;
        const search = searchTerm.toLowerCase();
        return taskData.filter((row) =>
            Object.values(row).some(
                (v) => v && v.toString().toLowerCase().includes(search)
            )
        );
    }, [taskData, searchTerm]);

    /* =========================================================
       ACTION HANDLER
    ========================================================= */
    const handleAction = useCallback((actionType) => {
        if (!activeTask) return;

        if (selectedRows.size === 0 && actionType !== 'Reject') {
            toast({
                title: "No records selected",
                description: `Please select records to ${actionType.toLowerCase()}.`,
                variant: "danger",
            });
            return;
        }

        const selectedData = Array.from(selectedRows).map((index) => taskData[index]);
        console.log(`Action: ${actionType}`, selectedData);

        let title = "Task Updated";
        let message = `Task ${activeTask.id} has been ${actionType === 'Submit' ? 'submitted' : actionType + 'ed'}.`;

        if (actionType === 'Approve') {
            title = "Task Approved";
            message = "Batch has been successfully approved.";
        } else if (actionType === 'Reject') {
            title = "Task Rejected";
            message = "Batch has been rejected.";
        }

        toast({
            title: title,
            description: message,
            variant: actionType === 'Reject' ? "danger" : "success",
        });

        setTimeout(() => {
            setTasks((prev) => prev.filter((t) => t.id !== activeTask.id));
            setActiveTask(null);
            setTaskData([]);
            setSelectedRows(new Set());
            navigate("/tasks/my");
        }, 1200);
    }, [activeTask, selectedRows, taskData, toast, navigate]);

    /* =========================================================
       RENDER
    ========================================================= */
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <TaskHeader
                activeTask={activeTask && { ...activeTask, source: dataSource }}
                navigate={navigate}
                isLoading={isLoading}
                startWorking={startWorking}
                onAction={handleAction}
                elapsedTime={elapsedTime}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                isReviewer={isReviewer}
                isOperator={isOperator}
            />

            {activeTask &&
                <TaskDataTable
                    column={columns}
                    data={filteredData}
                    onUpdateRow={handleUpdateRow}
                    onBulkUpdate={handleBulkUpdate}
                    disabled={isLoading}
                    searchTerm={searchTerm}
                    onSelectedRows={setSelectedRows}
                />
            }
        </div>
    );
};

export default TaskWorkingPage;
