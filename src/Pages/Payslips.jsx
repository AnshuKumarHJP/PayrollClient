import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../Library/Card";
import { Button } from "../Lib/button";
import { Input } from "../Library/Input";
import { Label } from "../Library/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Lib/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../Lib/table";
import { Badge } from "../Lib/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../Lib/dialog";
import {
  FileText,
  Download,
  Search,
  Eye,
  Mail,
  Loader2,
  Settings,
} from "lucide-react";
import { payrollService } from "../../api/services/payrollService";
import { payslipsService } from "../../api/services/payslipsService";
import { useToast } from "../Lib/use-toast";

const Payslips = () => {

  // -------------------------------
  // STATE MANAGEMENT
  // -------------------------------
  const [payrollCycles, setPayrollCycles] = useState([]);
  const [selectedCycle, setSelectedCycle] = useState("");
  const [payrollEntries, setPayrollEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [loading, setLoading] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  // Dialogs
  const [showPayslipDialog, setShowPayslipDialog] = useState(false);
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);

  // Bulk operations
  const [selectedEntries, setSelectedEntries] = useState([]);

  // Settings
  const [payslipSettings, setPayslipSettings] = useState({
    includeLogo: true,
    includeCompanyDetails: true,
    includeBankDetails: true,
    emailTemplate: "default",
    autoEmail: false,
  });

  const { toast } = useToast();



  // -------------------------------
  // FETCH PAYROLL CYCLES
  // -------------------------------
  useEffect(() => {
    const fetchCycles = async () => {
      try {
        const data = await payrollService.getAllCycles();
        setPayrollCycles(data || []);
      } catch {
        toast({
          title: "Error",
          description: "Unable to load payroll cycles.",
          variant: "destructive",
        });
      }
    };

    fetchCycles();
  }, []);



  // -------------------------------
  // FETCH ENTRIES FOR SELECTED CYCLE
  // -------------------------------
  useEffect(() => {
    if (!selectedCycle) return;

    const fetchEntries = async () => {
      try {
        setLoading(true);

        const data = await payrollService.getEntriesByCycleId(selectedCycle);

        // ---- NORMALIZE BACKEND RESPONSE HERE ----
        const normalize = (e) => ({
          id: e.id || e._id,
          employeeName: e.employeeName || e.empName || e.name || "Unknown",
          employeeId: e.employeeId || e.empCode || e.code || "-",
          department: e.department || e.dept || "N/A",
          designation: e.designation || "",
          basicSalary: e.basicSalary || e.basic || 0,
          hra: e.hra || e.houseRentAllowance || 0,
          conveyance: e.conveyance || 0,
          lta: e.lta || 0,
          medical: e.medical || 0,
          otherAllowances: e.otherAllowances || 0,
          grossSalary: e.grossSalary || e.gross || 0,
          pf: e.pf || 0,
          professionalTax: e.professionalTax || 0,
          incomeTax: e.incomeTax || 0,
          loanDeduction: e.loanDeduction || 0,
          otherDeductions: e.otherDeductions || 0,
          totalDeductions: e.totalDeductions || e.deductions || 0,
          netSalary: e.netSalary || e.net || 0,
          cycleName: e.cycleName,
          startDate: e.startDate,
          endDate: e.endDate,
        });

        const normalizedData = (data || []).map(normalize);
        setPayrollEntries(normalizedData);

      } catch (err) {
        toast({
          title: "Error",
          description: "Unable to load payroll entries.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [selectedCycle]);



  // -------------------------------
  // FILTERED ENTRIES (Optimized Memo)
  // -------------------------------
  const filteredEntries = useMemo(() => {
    return payrollEntries.filter((entry) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        entry.employeeName?.toLowerCase().includes(search) ||
        entry.employeeId?.toLowerCase().includes(search);

      const matchesDepartment =
        selectedDepartment === "all" || entry.department === selectedDepartment;

      return matchesSearch && matchesDepartment;
    });
  }, [payrollEntries, searchTerm, selectedDepartment]);



  // -------------------------------
  // UTIL FUNCTIONS
  // -------------------------------
  const formatCurrency = (num) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(num || 0);



  // -------------------------------
  // ACTION HANDLERS
  // -------------------------------
  const viewPayslip = (entry) => {
    setSelectedEntry(entry);
    setShowPayslipDialog(true);
  };

  const downloadPayslip = async (entry) => {
    try {
      await payslipsService.downloadPayslip(entry.id, "pdf");
      toast({ title: "Success", description: "Payslip downloaded successfully." });
    } catch {
      toast({ title: "Error", description: "Failed to download payslip.", variant: "destructive" });
    }
  };

  const emailPayslip = async (entry) => {
    try {
      await payslipsService.emailPayslip(entry.id);
      toast({ title: "Success", description: "Payslip emailed successfully." });
    } catch {
      toast({ title: "Error", description: "Email failed.", variant: "destructive" });
    }
  };



  // -------------------------------
  // EXPORT CSV
  // -------------------------------
  const exportCSV = () => {
    const headers = [
      "Employee Name",
      "Employee ID",
      "Department",
      "Gross Salary",
      "Total Deductions",
      "Net Salary",
    ];

    const rows = filteredEntries.map((e) => [
      e.employeeName,
      e.employeeId,
      e.department,
      e.grossSalary,
      e.totalDeductions,
      e.netSalary,
    ]);

    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Payslips-Summary.csv";
    link.click();
  };



  // -------------------------------
  // UI STARTS HERE
  // -------------------------------
  return (
    <div className="p-4">

      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2 items-center">
          <FileText size={22} />
          <h1 className="text-xl font-bold">Payslips</h1>
        </div>

        <div className="flex gap-2">

          {/* SETTINGS */}
          <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
            <DialogTrigger asChild>
              <Button variant="success">
                <Settings size={14} className="mr-2" />
                Settings
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Payslip Settings</DialogTitle>
              </DialogHeader>

              <div className="space-y-3 mt-4">
                {["includeLogo", "includeCompanyDetails", "includeBankDetails", "autoEmail"].map((key) => (
                  <div key={key} className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      checked={payslipSettings[key]}
                      onChange={(e) =>
                        setPayslipSettings((prev) => ({ ...prev, [key]: e.target.checked }))
                      }
                    />
                    <Label>{key.replace(/([A-Z])/g, " $1")}</Label>
                  </div>
                ))}

                <div>
                  <Label>Email Template</Label>
                  <Select
                    value={payslipSettings.emailTemplate}
                    onValueChange={(val) =>
                      setPayslipSettings((prev) => ({ ...prev, emailTemplate: val }))
                    }
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowSettingsDialog(false)}>Cancel</Button>
                <Button
                  onClick={() => {
                  //  localStorage.setItem("payslipSettings", JSON.stringify(payslipSettings));
                    toast({ title: "Saved", description: "Settings updated." });
                    setShowSettingsDialog(false);
                  }}
                >
                  Save
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={exportCSV}>
            <Download size={14} className="mr-2" /> Export Summary
          </Button>
        </div>
      </div>



      {/* FILTERS */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">

            {/* Cycle */}
            <div>
              <Label>Payroll Cycle</Label>
              <Select value={selectedCycle} onValueChange={setSelectedCycle}>
                <SelectTrigger><SelectValue placeholder="Select cycle" /></SelectTrigger>
                <SelectContent>
                  {payrollCycles.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.name} ({new Date(c.startDate).toLocaleDateString()} -
                      {new Date(c.endDate).toLocaleDateString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Department */}
            <div>
              <Label>Department</Label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {["IT","HR","Finance","Sales","Marketing","Operations","QA","R&D"].map((d) => (
                    <SelectItem value={d} key={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div>
              <Label>Search Employee</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  className="pl-8"
                  placeholder="Search by name or ID…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

          </div>
        </CardContent>
      </Card>



      {/* TABLE */}
      {selectedCycle && (
        <Card>
          <CardHeader>
            <CardTitle>Payslips</CardTitle>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin h-7 w-7" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Gross Salary</TableHead>
                      <TableHead>Total Deductions</TableHead>
                      <TableHead>Net Salary</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <p className="font-medium">{entry.employeeName}</p>
                          <p className="text-sm text-gray-500">{entry.employeeId}</p>
                        </TableCell>

                        <TableCell>{entry.department}</TableCell>
                        <TableCell>{formatCurrency(entry.grossSalary)}</TableCell>
                        <TableCell>{formatCurrency(entry.totalDeductions)}</TableCell>

                        <TableCell className="text-green-700 font-bold">
                          {formatCurrency(entry.netSalary)}
                        </TableCell>

                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">Generated</Badge>
                        </TableCell>

                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="success" onClick={() => viewPayslip(entry)}>
                              <Eye size={14} className="mr-1" /> View
                            </Button>

                            <Button variant="success" onClick={() => downloadPayslip(entry)}>
                              <Download size={14} className="mr-1" /> Download
                            </Button>

                            <Button variant="success" onClick={() => emailPayslip(entry)}>
                              <Mail size={14} className="mr-1" /> Email
                            </Button>
                          </div>
                        </TableCell>

                      </TableRow>
                    ))}

                    {filteredEntries.length === 0 && (
                      <TableRow>
                        <TableCell colSpan="7" className="text-center py-6 text-gray-500">
                          No records found
                        </TableCell>
                      </TableRow>
                    )}

                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* PayslipDialog */}
      <Dialog open={showPayslipDialog} onOpenChange={setShowPayslipDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Payslip Details</DialogTitle>
          </DialogHeader>

          {selectedEntry && (
            <div className="space-y-6">
              {/* Employee Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Employee Name</Label>
                  <p className="text-lg">{selectedEntry.employeeName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Employee ID</Label>
                  <p className="text-lg">{selectedEntry.employeeId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Department</Label>
                  <p>{selectedEntry.department}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Designation</Label>
                  <p>{selectedEntry.designation}</p>
                </div>
              </div>

              {/* Salary Breakdown */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Earnings</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Basic Salary</span>
                      <span>{formatCurrency(selectedEntry.basicSalary)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>HRA</span>
                      <span>{formatCurrency(selectedEntry.hra)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conveyance</span>
                      <span>{formatCurrency(selectedEntry.conveyance)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>LTA</span>
                      <span>{formatCurrency(selectedEntry.lta)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Medical</span>
                      <span>{formatCurrency(selectedEntry.medical)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Other Allowances</span>
                      <span>{formatCurrency(selectedEntry.otherAllowances)}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-semibold">
                      <span>Gross Salary</span>
                      <span>{formatCurrency(selectedEntry.grossSalary)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Deductions</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>PF</span>
                      <span>{formatCurrency(selectedEntry.pf)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Professional Tax</span>
                      <span>{formatCurrency(selectedEntry.professionalTax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Income Tax</span>
                      <span>{formatCurrency(selectedEntry.incomeTax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Loan Deduction</span>
                      <span>{formatCurrency(selectedEntry.loanDeduction)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Other Deductions</span>
                      <span>{formatCurrency(selectedEntry.otherDeductions)}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-semibold">
                      <span>Total Deductions</span>
                      <span>{formatCurrency(selectedEntry.totalDeductions)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Salary */}
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">Net Salary</span>
                  <span className="text-2xl font-bold text-green-700">{formatCurrency(selectedEntry.netSalary)}</span>
                </div>
              </div>

              {/* Cycle Info */}
              <div className="text-sm text-gray-600">
                <p>Payroll Cycle: {selectedEntry.cycleName}</p>
                <p>Period: {new Date(selectedEntry.startDate).toLocaleDateString()} - {new Date(selectedEntry.endDate).toLocaleDateString()}</p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setShowPayslipDialog(false)}>Close</Button>
            <Button onClick={() => downloadPayslip(selectedEntry)}>Download PDF</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Payslips;
