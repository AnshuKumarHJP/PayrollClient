import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { GetClientPortalWFDetailsForLoggedInUserService } from './FormDataService';
import AdvanceTable from '../../Library/Table/AdvanceTable';
import { ClientPortalWorkflowStatus } from '../../Data/StaticData';
import AppIcon from '../../Component/AppIcon';
import Button from '../../Library/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../Library/Select';

const FormDataView = ({ Template, onEdit }) => {
    const [selectedStatus, setSelectedStatus] = useState(1000);
    const [isLoading, setIsLoading] = useState(false);
    const [batchDetails, setBatchDetails] = useState([]);
    const [batchDetailsTransation, setBatchDetailsTransation] = useState([]);
    const [viewBatchId, setViewBatchId] = useState(null);

    const handleViewBatch = useCallback((batchId) => {
        setViewBatchId(batchId);
    }, []);

    const handleBackToBatchList = useCallback(() => {
        setViewBatchId(null);
    }, []);

    const finalBatchDetailsTransation = useMemo(() => {
        if (!viewBatchId || !batchDetailsTransation?.length) return [];

        // Find parent batch to get Status
        const parentBatch = batchDetails.find(b => String(b.Id) === String(viewBatchId));
        // If parent batch not found (e.g. filtered out), return empty to show list
        if (!parentBatch) return [];

        const parentStatus = parentBatch?.Status;

        const relatedDetails = batchDetailsTransation.filter(
            d => String(d.BatchId).trim() === String(viewBatchId).trim()
        );

        if (!relatedDetails.length) return [];

        const allRecords = relatedDetails.flatMap(detail => {
            try {
                let parsed;
                if (typeof detail.SourcePayload === "string") {
                    parsed = JSON.parse(detail.SourcePayload || "[]");
                } else {
                    parsed = detail.SourcePayload || [];
                }

                const records = Array.isArray(parsed) ? parsed : [parsed];

                return records.map(rec => ({
                    ...detail,
                    ...rec,
                    // Use record status if available, else batch status
                    Status: rec.Status || rec.BatchStatus || parentStatus
                }));

            } catch (e) {
                console.error("Parse Error", e);
                return [];
            }
        });

        // Filter records by the global selected status if applicable
        // This ensures the view matches the dropdown even if the API data contains mixed statuses
        return allRecords.filter(r => Number(r.Status) === Number(selectedStatus));

    }, [viewBatchId, batchDetailsTransation, batchDetails, selectedStatus]);

    // Initial Status Configuration
    useEffect(() => {
        if (Template?.ClientPortalWorkflowConfiguration?.length > 0) {
            const properties = Template.ClientPortalWorkflowConfiguration[0]?.ClientPortalWorkflowProperties;
            if (Array.isArray(properties)) {
                const matchedProperty = properties.find(x => x.FlowOrder === 1);
                if (matchedProperty && matchedProperty.ActionProcessingStatus !== undefined) {
                    setSelectedStatus(matchedProperty.ActionProcessingStatus);
                }
            }
        }
    }, [Template]);


    const getTableData = useCallback(async () => {
        if (!Template?.GetApi || !Template?.ModuleId) return;
        setIsLoading(true);

        const payload = {
            ModuleId: Template?.ModuleId,
            Status: selectedStatus
        }
        try {
            const res = await GetClientPortalWFDetailsForLoggedInUserService(Template?.GetApi, payload)
            // console.log("res", res);
            // Handle if response is array (List of Batches) or Object (Single Batch)
            let batchesList = Array.isArray(res) ? res : (res ? [res] : []);

            // Filter by FormBuilderId if Template?.Id is available
            if (Template?.Id) {
                batchesList = batchesList.filter(b => String(b.FormBuilderId) === String(Template.Id));
            }

            const mappedBatches = batchesList.map(b => ({
                ...b,
                Status: b.BatchStatus
            }));

            setBatchDetails(mappedBatches);
            // 1. Separate Array of BatchDetails
            const allBatchDetails = batchesList.flatMap(b => b.BatchDetails || []);
            setBatchDetailsTransation(allBatchDetails);
        } catch (err) {
            console.error("GetApi failed", err);
            setBatchDetailsTransation([]);
            setBatchDetails([]);
        } finally {
            setIsLoading(false);
        }
    }, [Template, selectedStatus]);

    useEffect(() => {
        getTableData();
    }, [getTableData]);


    const columnsBatch = useMemo(
        () => [
            {
                key: "BatchName",
                label: "Batch Name",
                type: "text",
                width: 250,
                render: (val, row) => (
                    <div className="flex flex-col">
                        <span
                            className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                            onClick={() => handleViewBatch(row.Id)}
                        >
                            {val}
                        </span>
                        <span className="text-xs text-slate-400">
                            ID: {String(row.Id || "").substring(0, 8)}...
                        </span>
                    </div>
                )
            },
            {
                key: "RequestCount", // Using RequestCount as a base for progress calculation if detailed counts aren't available, or assuming row has Success/Failure counts
                label: "Progress",
                width: 200,
                render: (_, row) => {
                    // Mocking or using potential fields if available in API response. 
                    // Adjust field names (SuccessCount, FailureCount) based on actual API response if different.
                    const total = row.RequestCount || 0;
                    const success = row.SuccessCount || 0;
                    const failed = row.FailureCount || 0;
                    const pending = total - success - failed;

                    const successPct = total > 0 ? (success / total) * 100 : 0;
                    const failedPct = total > 0 ? (failed / total) * 100 : 0;

                    return (
                        <div className="w-full">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-slate-500">{success} / {total} Done</span>
                                <span className="text-slate-400">{Math.round(successPct)}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden flex">
                                <div style={{ width: `${successPct}%` }} className="bg-emerald-500 h-full" />
                                <div style={{ width: `${failedPct}%` }} className="bg-rose-500 h-full" />
                            </div>
                        </div>
                    );
                }
            },
            {
                key: "Status",
                label: "Batch Status",
                render: (val) => {
                    const statusObj = ClientPortalWorkflowStatus.find(s => s.value === val);

                    let badgeClass = "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
                    let dotClass = "bg-slate-500";

                    if (val === 1000) {
                        badgeClass = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800";
                        dotClass = "bg-amber-500";
                    } else if (val === 1500) {
                        badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800";
                        dotClass = "bg-emerald-500";
                    } else if (val === 1600) {
                        badgeClass = "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800";
                        dotClass = "bg-rose-500";
                    }

                    return (
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeClass}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
                            {statusObj?.label || val}
                        </span>
                    );
                },
                width: 140
            },
            {
                key: "Counts",
                label: "Stats",
                width: 180,
                render: (_, row) => (
                    <div className="flex items-center gap-3 text-xs font-medium">
                        <div className="flex items-center gap-1 text-slate-500" title="Total Records">
                            <AppIcon name="Layers" size={14} />
                            {row.RequestCount}
                        </div>
                        <div className="flex items-center gap-1 text-emerald-600" title="Success">
                            <AppIcon name="CheckCircle" size={14} />
                            {row.SuccessCount || 0}
                        </div>
                        <div className="flex items-center gap-1 text-rose-600" title="Failed">
                            <AppIcon name="XCircle" size={14} />
                            {row.FailureCount || 0}
                        </div>
                    </div>
                )
            },
            {
                key: "ExecutionTime",
                label: "Duration",
                width: 120,
                render: (_, row) => {
                    if (!row.ExecutionStartTime || !row.ExecutionEndTime) return <span className="text-slate-400 text-xs">-</span>;
                    const start = new Date(row.ExecutionStartTime);
                    const end = new Date(row.ExecutionEndTime);
                    const diff = end - start;
                    return (
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                            <AppIcon name="Clock" size={14} />
                            <span className="text-xs">{diff}ms</span>
                        </div>
                    );
                }
            },
            {
                key: "CreatedOn",
                label: "Created",
                type: "date",
                width: 140,
                render: (val) => (
                    <div className="flex flex-col">
                        <span className="text-[12px] text-slate-500">{new Date(val).toLocaleDateString()}</span>
                        <span className="text-[10px] text-slate-400">{new Date(val).toLocaleTimeString()}</span>
                    </div>
                )
            },
            {
                key: "CreatedBy",
                label: "User",
                type: "text",
                width: 140,
                render: (val) => (
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-500">
                            {String(val || "?").charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs truncate max-w-[100px]">{val}</span>
                    </div>
                )
            },

        ], [onEdit, Template, handleViewBatch]);


    /* -------------------------------------------------
    FIELDS FOR TABLE
 ------------------------------------------------- */
    const filteredFields = useMemo(() => {
        if (!Template?.FieldsConfigurations) return [];
        return Template.FieldsConfigurations
            .map((f) => {
                let ApplicableJson = [];
                try { ApplicableJson = JSON.parse(f.ApplicableJson || "[]"); } catch { }
                return { ...f, ApplicableJson };
            })
            // Fix: Include 'upload' fields as well, since this view shows bulk uploads
            .filter((f) => f.ApplicableJson.includes("form") || f.ApplicableJson.includes("upload"));
    }, [Template]);

    const dynamicColumns = useMemo(() => {
        if (!filteredFields.length) return [];

        return filteredFields.map((f) => {
            const groupKey = f.GroupBackendKey || "general";
            // If GroupSave is true, the key *might* be nested in the object, or flat if it came from Bulk Upload
            // We use the flat name as primary key for table cleanliness, but allow custom render to find the value
            const key = Template?.GroupSave === true ? `${groupKey}.${f.Name}` : f.Name;

            const getValueLogic = (row) => {
                // 1. Try direct value (if AdvanceTable simple access worked)
                // Start with the most specific path if GroupSave is on
                if (Template?.GroupSave === true && row[groupKey] && row[groupKey][f.Name] !== undefined) {
                    return row[groupKey][f.Name];
                }
                // 2. Try flat access (common in Bulk Upload payloads)
                if (row[f.Name] !== undefined) return row[f.Name];

                // 3. Fallback to generic reducer logic in AdvanceTable (usually covers dot notation)
                // But here we return undefined to let AdvanceTable handle it or return -
                return undefined;
            };

            return {
                key: key,
                label: f.Label,
                valueGetter: (row) => {
                    const val = getValueLogic(row);
                    return val !== undefined && val !== null ? val : ""; // Return empty string for filter matching
                },
                render: (val, row) => {
                    // val here comes from valueGetter now!
                    return val !== undefined && val !== "" && typeof val !== 'object' ? val : "-";
                }
            };
        });
    }, [filteredFields, Template?.GroupSave]);

    const baseColumns = useMemo(
        () => [
            {
                key: "Id",
                label: "ID",
                width: 100,
                valueGetter: (row) => String(row.Id || ""),
                render: (val, row) => <span className="text-xs text-slate-400 font-mono">#{String(row.Id || "").substring(0, 6)}</span>
            },
            {
                key: "Status",
                label: "Record Status",
                width: 140,
                valueGetter: (row) => {
                    const statusObj = ClientPortalWorkflowStatus.find(s => s.value === row.Status);
                    return statusObj?.label || String(row.Status || "");
                },
                render: (_, row) => {
                    const val = row.Status;
                    const statusObj = ClientPortalWorkflowStatus.find(s => s.value === val);

                    let badgeClass = "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
                    let dotClass = "bg-slate-500";

                    if (val === 1000) {
                        badgeClass = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800";
                        dotClass = "bg-amber-500";
                    } else if (val === 1500) {
                        badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800";
                        dotClass = "bg-emerald-500";
                    } else if (val === 1600) {
                        badgeClass = "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800";
                        dotClass = "bg-rose-500";
                    }

                    return (
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeClass}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
                            {statusObj?.label || val}
                        </span>
                    );
                }
            },
            {
                key: "ValidationMessage",
                label: "Validation / Remarks",
                width: 250,
                valueGetter: (row) => row.Remarks || row.ValidationMessage || "",
                render: (_, row) => {
                    const msg = row.Remarks || row.ValidationMessage || "-";
                    const isError = row.Status === 1600;

                    return (
                        <div className={`text-xs truncate max-w-[240px] ${isError ? "text-rose-500 font-medium" : "text-slate-500"}`} title={msg}>
                            {isError && <AppIcon name="AlertCircle" size={12} className="inline mr-1 -mt-0.5" />}
                            {msg}
                        </div>
                    )
                }
            },
            {
                key: "CreatedOn",
                label: "Timeline",
                width: 150,
                valueGetter: (row) => {
                    const date = new Date(row.CreatedOn);
                    return !isNaN(date.getTime()) ? date.toLocaleDateString() : "";
                },
                render: (_, row) => {
                    const val = row.CreatedOn;
                    const date = new Date(val);
                    const isValid = !isNaN(date.getTime()) && val !== null && val !== undefined;

                    if (!isValid) return <span className="text-xs text-slate-400">-</span>;

                    return (
                        <div className="flex flex-col">
                            <span className="text-xs text-slate-700 dark:text-slate-300">
                                {date.toLocaleDateString()}
                            </span>
                            <span className="text-[10px] text-slate-400">
                                {date.toLocaleTimeString()}
                            </span>
                        </div>
                    );
                }
            },
            {
                key: "Action",
                label: "Action",
                width: 80,
                render: () => (
                    <Button variant="ghost" size="xs" className="h-6 w-6 p-0 rounded-full">
                        <AppIcon name="MoreHorizontal" size={14} className="text-slate-400" />
                    </Button>
                )
            }
        ],
        []
    );

    const columnsTransaction = useMemo(
        () => [...dynamicColumns, ...baseColumns],
        [dynamicColumns, baseColumns]
    );

    // Determine current view title
    const currentViewTitle = finalBatchDetailsTransation.length > 0
        ? `Transaction Details`
        : `Batch Submissions`;

    const currentViewSubtitle = finalBatchDetailsTransation.length > 0
        ? `Viewing ${finalBatchDetailsTransation.length} records in this batch`
        : `Manage and track form data submissions`;

    return (
        <div className="space-y-6">
            {/* Professional Header Bar */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-300">
                <div className="flex items-center gap-4">
                    {finalBatchDetailsTransation.length > 0 ? (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleBackToBatchList}
                        >
                            <AppIcon name="ArrowLeft" size={20} />
                        </Button>
                    ) : (
                        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-500/10">
                            <AppIcon name="Database" className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                    )}

                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                                {Template?.Name}
                            </h2>
                            <span className="text-slate-300 dark:text-slate-600 text-xl font-light">/</span>
                            <span className="text-lg font-medium text-slate-600 dark:text-slate-300">
                                {currentViewTitle}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                            {currentViewSubtitle}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-lg border border-slate-100 dark:border-slate-700/50">
                    <div className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:block">
                        Filter Status
                    </div>
                    <Select
                        value={String(selectedStatus)}
                        onValueChange={(val) => setSelectedStatus(Number(val))}
                    >
                        <SelectTrigger className="w-full md:w-48 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 h-9 text-sm focus:ring-indigo-500/20">
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${selectedStatus === 1000 ? "bg-amber-500" :
                                    selectedStatus === 1500 ? "bg-emerald-500" :
                                        "bg-rose-500"
                                    }`}></span>
                                <SelectValue />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            {ClientPortalWorkflowStatus.map((status) => (
                                <SelectItem key={status.value} value={String(status.value)}>
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${status.value === 1000 ? "bg-amber-500" :
                                            status.value === 1500 ? "bg-emerald-500" :
                                                "bg-rose-500"
                                            }`}></span>
                                        {status.label}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Content Area with Animation */}
            {finalBatchDetailsTransation.length === 0 ? (
                <AdvanceTable
                    key="batch-table"
                    columns={columnsBatch}
                    data={batchDetails || []}
                    isLoading={isLoading}
                    title="" // Title handled by header
                    icon="Table"
                    itemsPerPage={10}
                    showIndex={true}
                    shadow="none"
                    border={false}
                    className="bg-transparent"
                />
            ) : (
                <AdvanceTable
                    key="transaction-table"
                    columns={columnsTransaction}
                    data={finalBatchDetailsTransation}
                    isLoading={isLoading}
                    title="" // Title handled by header
                    icon="Table"
                    itemsPerPage={10}
                    showIndex={true}
                    shadow="none"
                    border={false}
                    className="bg-transparent"
                />
            )}
        </div>
    )
}

export default FormDataView