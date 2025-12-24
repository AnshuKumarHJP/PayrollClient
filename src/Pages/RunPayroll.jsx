import React,{ useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../Lib/card";
import { Button } from "../Lib/button";
import { Input } from "../Lib/input";
import { Label } from "../Lib/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Lib/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../Lib/table";
import { Badge } from "../Lib/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../Lib/dialog";
import {
  Play,
  Lock,
  Eye,
  Plus,
  Calendar,
  Users,
  Loader2,
  Settings,
  Download,
  Upload,
  Edit,
  Trash2
} from "lucide-react";
import { payrollService } from "../../api/services/payrollService";
import { useToast } from "../Lib/use-toast";

/**
 * RunPayroll (Optimized)
 *
 * - Normalizes backend cycle object (supports both `cycleName` and `name`)
 * - Adds View dialog (previously missing)
 * - UseMemo/useCallback for performance
 * - Consolidated handlers + safe fallbacks
 * - Minimal re-renders
 */

const RunPayroll = () => {
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Consolidated dialog state
  const [dialogState, setDialogState] = useState({
    create: false,
    bulk: false,
    settings: false,
    edit: false,
    delete: false,
    view: false
  });

  // Selected / editing state
  const [selectedCycle, setSelectedCycle] = useState(null);
  const [selectedCycles, setSelectedCycles] = useState([]); // for bulk ops
  const [editingCycle, setEditingCycle] = useState(null);
  const [cycleToDelete, setCycleToDelete] = useState(null);

  // Form state (used for create & edit)
  const [formCycle, setFormCycle] = useState({
    name: "",
    startDate: "",
    endDate: "",
    payDate: "",
    description: ""
  });

  // Settings
  const [calculationSettings, setCalculationSettings] = useState({
    pfRate: 12,
    hraRate: 50,
    conveyanceAllowance: 1920,
    ltaRate: 8.33,
    medicalAllowance: 1250,
    professionalTax: 2400,
    includeOvertime: true,
    includeBonuses: true
  });

  const { toast } = useToast();

  // -----------------------
  // Utilities
  // -----------------------
  const normalizeCycle = useCallback((c = {}) => {
    // Accepts object containing both `cycleName` and `name` cases
    return {
      id: c.id ?? c._id ?? c._uuid ?? null,
      name: c.name ?? c.cycleName ?? c.cycle_title ?? "Unnamed Cycle",
      startDate: c.startDate ?? c.start_date ?? c.fromDate ?? null,
      endDate: c.endDate ?? c.end_date ?? c.toDate ?? null,
      payDate: c.payDate ?? c.pay_date ?? c.salaryDate ?? null,
      status: c.status ?? "draft",
      totalEmployees: c.totalEmployees ?? c.totalEmployeesCount ?? 0,
      totalNetSalary: c.totalNetSalary ?? c.totalNet ?? 0,
      description: c.description ?? c.notes ?? "",
      processedBy: c.processedBy ?? null,
      processedAt: c.processedAt ?? null,
      createdAt: c.createdAt ?? c.created_at ?? null,
      raw: c // keep raw object for debugging if needed
    };
  }, []);

  const numberFormatINR = (value) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(value || 0));

  const formatDateSafe = (d) => {
    if (!d) return "-";
    try {
      return new Date(d).toLocaleDateString();
    } catch {
      return d;
    }
  };

  // -----------------------
  // Fetch cycles
  // -----------------------
  const fetchPayrollCycles = useCallback(async () => {
    try {
      setLoading(true);
      const data = await payrollService.getAllCycles();
      const arr = Array.isArray(data) ? data : (data?.items ?? []);
      setCycles((arr || []).map(normalizeCycle));
    } catch (err) {
      console.error("fetchPayrollCycles error:", err);
      toast({
        title: "Error",
        description: "Failed to fetch payroll cycles. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [normalizeCycle, toast]);

  useEffect(() => {
    fetchPayrollCycles();
  }, [fetchPayrollCycles]);

  // -----------------------
  // Metrics derived
  // -----------------------
  const totalCycles = cycles.length;
  const processedCycles = cycles.filter((c) => c.status === "processed").length;
  const totalEmployees = cycles.reduce((sum, c) => sum + (c.totalEmployees || 0), 0);

  // -----------------------
  // Handlers
  // -----------------------
  const handleCreateCycle = async () => {
    try {
      await payrollService.createCycle(formCycle);
      toast({ title: "Success", description: "Payroll cycle created successfully." });
      setDialogState(prev => ({ ...prev, create: false }));
      setFormCycle({ name: "", startDate: "", endDate: "", payDate: "", description: "" });
      fetchPayrollCycles();
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to create payroll cycle.", variant: "destructive" });
    }
  };

  const handleEditCycle = (cycle) => {
    setEditingCycle(cycle);
    setFormCycle({
      name: cycle.name ?? cycle.cycleName ?? "",
      startDate: cycle.startDate ?? "",
      endDate: cycle.endDate ?? "",
      payDate: cycle.payDate ?? "",
      description: cycle.description ?? ""
    });
    setDialogState(prev => ({ ...prev, edit: true }));
  };

  const handleUpdateCycle = async () => {
    if (!editingCycle?.id) {
      toast({ title: "Error", description: "Invalid cycle selected.", variant: "destructive" });
      return;
    }
    try {
      await payrollService.updateCycle(editingCycle.id, formCycle);
      toast({ title: "Success", description: "Payroll cycle updated successfully." });
      setDialogState(prev => ({ ...prev, edit: false }));
      setEditingCycle(null);
      setFormCycle({ name: "", startDate: "", endDate: "", payDate: "", description: "" });
      fetchPayrollCycles();
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to update payroll cycle.", variant: "destructive" });
    }
  };

  const handleDeleteCycle = (cycle) => {
    setCycleToDelete(cycle);
    setDialogState(prev => ({ ...prev, delete: true }));
  };

  const confirmDeleteCycle = async () => {
    if (!cycleToDelete?.id) return;
    try {
      await payrollService.deleteCycle(cycleToDelete.id);
      toast({ title: "Success", description: "Payroll cycle deleted successfully." });
      setDialogState(prev => ({ ...prev, delete: false }));
      setCycleToDelete(null);
      fetchPayrollCycles();
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to delete payroll cycle.", variant: "destructive" });
    }
  };

  const handleCalculatePayroll = async (cycleId) => {
    try {
      // First validate prerequisites
      const validation = await payrollService.validatePayrollPrerequisites(cycleId);

      if (!validation.isValid) {
        const errorMessages = validation.errors.map(err =>
          `${err.employeeName}: ${err.issues.join(', ')}`
        );
        toast({
          title: "Validation Failed",
          description: `Cannot calculate payroll due to validation errors:\n${errorMessages.join('\n')}`,
          variant: "destructive"
        });
        return;
      }

      // Show warnings if any
      if (validation.warnings.length > 0) {
        const warningMessages = validation.warnings.map(warn =>
          `${warn.employeeName}: ${warn.issues.join(', ')}`
        );
        toast({
          title: "Warnings",
          description: `Payroll calculation proceeding with warnings:\n${warningMessages.join('\n')}`,
          variant: "default"
        });
      }

      // Proceed with calculation
      await payrollService.calculatePayrollForCycle(cycleId);
      // Update cycle status to calculated
      await payrollService.updateCycleStatus(cycleId, 'calculated');
      toast({ title: "Success", description: "Payroll calculated successfully." });
      fetchPayrollCycles(); // Refresh to get updated status and employee count from backend
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to calculate payroll.", variant: "destructive" });
    }
  };

  const handleLockCycle = async (cycleId) => {
    try {
      await payrollService.lockCycle(cycleId);
      toast({ title: "Success", description: "Payroll cycle locked successfully." });
      fetchPayrollCycles();
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to lock payroll cycle.", variant: "destructive" });
    }
  };

  // Bulk operations
  const handleBulkCalculate = async () => {
    try {
      for (const id of selectedCycles) {
        await payrollService.calculatePayrollForCycle(id);
        await payrollService.updateCycleStatus(id, 'calculated');
      }
      toast({ title: "Success", description: `Payroll calculated for ${selectedCycles.length} cycles.` });
      setSelectedCycles([]);
      setDialogState(prev => ({ ...prev, bulk: false }));
      fetchPayrollCycles();
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Bulk calculate failed.", variant: "destructive" });
    }
  };

  const handleBulkLock = async () => {
    try {
      for (const id of selectedCycles) {
        await payrollService.lockCycle(id);
      }
      toast({ title: "Success", description: `${selectedCycles.length} cycles locked.` });
      setSelectedCycles([]);
      setDialogState(prev => ({ ...prev, bulk: false }));
      fetchPayrollCycles();
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Bulk lock failed.", variant: "destructive" });
    }
  };

  const handleExportCycles = () => {
    const csvContent = [
      ["Cycle Name", "Start Date", "End Date", "Pay Date", "Status", "Employees", "Total Amount"],
      ...cycles.map((c) => [
        c.cycleName,
        formatDateSafe(c.startDate),
        formatDateSafe(c.endDate),
        formatDateSafe(c.payDate),
        c.status,
        c.totalEmployees || 0,
        c.totalNetSalary || 0
      ])
    ].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "payroll-cycles.csv";
    a.click();
    URL.revokeObjectURL(url);

    toast({ title: "Success", description: "Payroll cycles exported." });
  };

  const handleViewCycle = (cycle) => {
    setSelectedCycle(cycle);
    setDialogState(prev => ({ ...prev, view: true }));
  };

  const saveCalculationSettings = () => {
    localStorage.setItem("payrollCalculationSettings", JSON.stringify(calculationSettings));
    toast({ title: "Saved", description: "Calculation settings saved." });
    setDialogState(prev => ({ ...prev, settings: false }));
  };

  // -----------------------
  // Status badge helper
  // -----------------------
  const getStatusBadge = (status) => {
    const cfg = {
      draft: { label: "Draft", classes: "bg-gray-100 text-gray-800" },
      calculated: { label: "Calculated", classes: "bg-blue-100 text-blue-800" },
      locked: { label: "Locked", classes: "bg-orange-100 text-orange-800" },
      processed: { label: "Processed", classes: "bg-green-100 text-green-800" }
    }[status] || { label: status ?? "Unknown", classes: "bg-gray-100 text-gray-800" };

    return <Badge className={cfg.classes}>{cfg.label}</Badge>;
  };

  // -----------------------
  // Render
  // -----------------------
  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Play size={24} />
            <h1 className="text-2xl font-bold">Run Payroll</h1>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">What are Payroll Cycles?</h3>
          <p className="text-blue-800 text-sm leading-relaxed">
            Payroll cycles are time periods during which salaries are calculated and processed.
            Create a cycle, calculate payroll for it, then lock before processing payments.
          </p>
          <div className="mt-3 text-xs text-blue-700">
            <strong>Workflow:</strong> Create Cycle → Calculate Payroll → Lock Cycle → Process Payments
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mb-4">
        <Dialog open={dialogState.settings} onOpenChange={(open) => setDialogState(prev => ({ ...prev, settings: open }))}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Settings size={16} className="mr-2" /> Settings
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader><DialogTitle>Calculation Settings</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>PF Rate (%)</Label>
                  <Input type="number" value={calculationSettings.pfRate}
                    onChange={(e) => setCalculationSettings(s => ({ ...s, pfRate: Number(e.target.value) }))} />
                </div>
                <div>
                  <Label>HRA Rate (%)</Label>
                  <Input type="number" value={calculationSettings.hraRate}
                    onChange={(e) => setCalculationSettings(s => ({ ...s, hraRate: Number(e.target.value) }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Conveyance Allowance</Label>
                  <Input type="number" value={calculationSettings.conveyanceAllowance}
                    onChange={(e) => setCalculationSettings(s => ({ ...s, conveyanceAllowance: Number(e.target.value) }))} />
                </div>
                <div>
                  <Label>LTA Rate (%)</Label>
                  <Input type="number" value={calculationSettings.ltaRate}
                    onChange={(e) => setCalculationSettings(s => ({ ...s, ltaRate: Number(e.target.value) }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Medical Allowance</Label>
                  <Input type="number" value={calculationSettings.medicalAllowance}
                    onChange={(e) => setCalculationSettings(s => ({ ...s, medicalAllowance: Number(e.target.value) }))} />
                </div>
                <div>
                  <Label>Professional Tax</Label>
                  <Input type="number" value={calculationSettings.professionalTax}
                    onChange={(e) => setCalculationSettings(s => ({ ...s, professionalTax: Number(e.target.value) }))} />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogState(prev => ({ ...prev, settings: false }))}>Cancel</Button>
              <Button onClick={saveCalculationSettings}>Save Settings</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={dialogState.bulk} onOpenChange={(open) => setDialogState(prev => ({ ...prev, bulk: open }))}>
          <DialogTrigger asChild>
            <Button variant="outline"><Upload size={16} className="mr-2" /> Bulk Operations</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader><DialogTitle>Bulk Payroll Operations</DialogTitle></DialogHeader>
            <div className="py-4">
              <p className="text-sm text-gray-600 mb-4">Select draft cycles to operate on:</p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {cycles.filter(c => c.status === "draft").map(cycle => (
                  <div key={cycle.id} className="flex items-center gap-2">
                    <input type="checkbox"
                      checked={selectedCycles.includes(cycle.id)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedCycles(s => [...s, cycle.id]);
                        else setSelectedCycles(s => s.filter(i => i !== cycle.id));
                      }} />
                    <label>{cycle.cycleName} ({formatDateSafe(cycle.startDate)} - {formatDateSafe(cycle.endDate)})</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogState(prev => ({ ...prev, bulk: false }))}>Cancel</Button>
              <Button onClick={handleBulkCalculate} disabled={selectedCycles.length === 0}>Calculate Selected ({selectedCycles.length})</Button>
              <Button onClick={handleBulkLock} disabled={selectedCycles.length === 0}>Lock Selected ({selectedCycles.length})</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Button variant="outline" onClick={handleExportCycles}><Download size={16} className="mr-2" /> Export</Button>

        <Dialog open={dialogState.create} onOpenChange={(open) => setDialogState(prev => ({ ...prev, create: open }))}>
          <DialogTrigger asChild>
            <Button><Plus size={16} className="mr-2" /> Create Cycle</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader><DialogTitle>Create New Payroll Cycle</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label>Cycle Name</Label>
                <Input value={formCycle.name} onChange={(e) => setFormCycle(f => ({ ...f, name: e.target.value }))} placeholder="e.g., January 2024" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Input type="date" value={formCycle.startDate} onChange={(e) => setFormCycle(f => ({ ...f, startDate: e.target.value }))} />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input type="date" value={formCycle.endDate} onChange={(e) => setFormCycle(f => ({ ...f, endDate: e.target.value }))} />
                </div>
              </div>
              <div>
                <Label>Pay Date</Label>
                <Input type="date" value={formCycle.payDate} onChange={(e) => setFormCycle(f => ({ ...f, payDate: e.target.value }))} />
              </div>
              <div>
                <Label>Description</Label>
                <Input value={formCycle.description} onChange={(e) => setFormCycle(f => ({ ...f, description: e.target.value }))} placeholder="Optional description" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogState(prev => ({ ...prev, create: false }))}>Cancel</Button>
              <Button onClick={handleCreateCycle}>Create Cycle</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-600">Total Cycles</p><p className="text-2xl font-bold">{totalCycles}</p></div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent></Card>

        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-600">Processed Cycles</p><p className="text-2xl font-bold">{processedCycles}</p></div>
            <Play className="h-8 w-8 text-green-500" />
          </div>
        </CardContent></Card>

        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-600">Total Employees</p><p className="text-2xl font-bold">{totalEmployees}</p></div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </CardContent></Card>
      </div>

      {/* Cycles Table */}
      <Card>
        <CardHeader><CardTitle>Payroll Cycles</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cycle Name</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Pay Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Employees</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {cycles.map((cycle) => (
                    <TableRow key={cycle.id}>
                      <TableCell className="font-medium">{cycle.name}</TableCell>
                      <TableCell>{formatDateSafe(cycle.startDate)} - {formatDateSafe(cycle.endDate)}</TableCell>
                      <TableCell>{formatDateSafe(cycle.payDate)}</TableCell>
                      <TableCell>{getStatusBadge(cycle.status)}</TableCell>
                      <TableCell>{cycle.totalEmployees || 0}</TableCell>
                      <TableCell>{numberFormatINR(cycle.totalNetSalary || 0)}</TableCell>

                      <TableCell>
                        <div className="flex gap-2">
                          {cycle.status === "draft" && (
                            <>
                              <Button  onClick={() => handleEditCycle(cycle)} variant="outline">
                                <Edit size={14} className="mr-1" /> Edit
                              </Button>

                              <Button  onClick={() => handleDeleteCycle(cycle)} variant="outline" className="text-red-600 hover:text-red-700">
                                <Trash2 size={14} className="mr-1" /> Delete
                              </Button>

                              <Button  onClick={() => handleCalculatePayroll(cycle.id)} className="bg-blue-600 hover:bg-blue-700">
                                <Play size={14} className="mr-1" /> Calculate
                              </Button>
                            </>
                          )}

                          {cycle.status === "calculated" && (
                            <Button  onClick={() => handleLockCycle(cycle.id)} className="bg-orange-600 hover:bg-orange-700">
                              <Lock size={14} className="mr-1" /> Lock
                            </Button>
                          )}

                          <Button  variant="outline" onClick={() => handleViewCycle(cycle)}>
                            <Eye size={14} className="mr-1" /> View
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}

                  {cycles.length === 0 && (
                    <TableRow>
                      <TableCell colSpan="7" className="text-center py-6 text-gray-500">No payroll cycles found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* --- VIEW DIALOG (Missing previously) --- */}
      <Dialog open={dialogState.view} onOpenChange={(open) => setDialogState(prev => ({ ...prev, view: open }))}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Payroll Cycle Details</DialogTitle></DialogHeader>

          {selectedCycle ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Cycle Name</Label>
                  <p>{selectedCycle.name}</p>
                </div>

                <div>
                  <Label className="font-semibold">Status</Label>
                  <p>{selectedCycle.status}</p>
                </div>

                <div>
                  <Label className="font-semibold">Start Date</Label>
                  <p>{formatDateSafe(selectedCycle.startDate)}</p>
                </div>

                <div>
                  <Label className="font-semibold">End Date</Label>
                  <p>{formatDateSafe(selectedCycle.endDate)}</p>
                </div>

                <div>
                  <Label className="font-semibold">Pay Date</Label>
                  <p>{formatDateSafe(selectedCycle.payDate)}</p>
                </div>

                <div>
                  <Label className="font-semibold">Total Employees</Label>
                  <p>{selectedCycle.totalEmployees || 0}</p>
                </div>

                <div>
                  <Label className="font-semibold">Total Net Salary</Label>
                  <p>{numberFormatINR(selectedCycle.totalNetSalary || 0)}</p>
                </div>
              </div>

              {selectedCycle.description && (
                <div>
                  <Label className="font-semibold">Description</Label>
                  <p>{selectedCycle.description}</p>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogState(prev => ({ ...prev, view: false }))}>Close</Button>
              </div>
            </div>
          ) : (
            <p>No data found</p>
          )}
        </DialogContent>
      </Dialog>

      {/* --- EDIT DIALOG (reused formCycle) --- */}
      <Dialog open={dialogState.edit} onOpenChange={(open) => setDialogState(prev => ({ ...prev, edit: open }))}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Payroll Cycle</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label>Cycle Name</Label>
              <Input value={formCycle.name} onChange={(e) => setFormCycle(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input type="date" value={formCycle.startDate} onChange={(e) => setFormCycle(f => ({ ...f, startDate: e.target.value }))} />
              </div>
              <div>
                <Label>End Date</Label>
                <Input type="date" value={formCycle.endDate} onChange={(e) => setFormCycle(f => ({ ...f, endDate: e.target.value }))} />
              </div>
            </div>
            <div>
              <Label>Pay Date</Label>
              <Input type="date" value={formCycle.payDate} onChange={(e) => setFormCycle(f => ({ ...f, payDate: e.target.value }))} />
            </div>
            <div>
              <Label>Description</Label>
              <Input value={formCycle.description} onChange={(e) => setFormCycle(f => ({ ...f, description: e.target.value }))} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDialogState(prev => ({ ...prev, edit: false }))}>Cancel</Button>
            <Button onClick={handleUpdateCycle}>Update Cycle</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- DELETE CONFIRM --- */}
      <Dialog open={dialogState.delete} onOpenChange={(open) => setDialogState(prev => ({ ...prev, delete: open }))}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Payroll Cycle</DialogTitle></DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to delete the payroll cycle "{cycleToDelete?.name}"?
            </p>
            <p className="text-xs text-red-600 mt-2">This action cannot be undone.</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDialogState(prev => ({ ...prev, delete: false }))}>Cancel</Button>
            <Button onClick={confirmDeleteCycle} className="bg-red-600 hover:bg-red-700">Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default React.memo(RunPayroll);
