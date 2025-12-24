import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../Lib/card";
import { Button } from "../Lib/button";
import { Input } from "../Lib/input";
import { Label } from "../Lib/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Lib/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../Lib/table";
import { Badge } from "../Lib/badge";
import { FileText, Download, Search, Filter, Loader2 } from "lucide-react";
import { salaryRegisterService } from "../../api/services/salaryRegisterService";
import { useToast } from "../Lib/use-toast";

const SalaryRegister = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("january-2024");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [salaryData, setSalaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { toast } = useToast();

  useEffect(() => {
    fetchSalaryRegister();
  }, [selectedPeriod, selectedDepartment]);

  const fetchSalaryRegister = async () => {
    try {
      setLoading(true);
      setError(null);

      let data = [];
      if (selectedDepartment !== "all") {
        // Filter by department
        data = await salaryRegisterService.getByDepartment(selectedDepartment);
      } else {
        // Get all salary register entries
        data = await salaryRegisterService.getAll();
      }

      // Filter by period if specified
      if (selectedPeriod !== "all") {
        data = data.filter(item => item.period === selectedPeriod);
      }

      setSalaryData(data);
    } catch (err) {
      console.error("Error fetching salary register:", err);
      setError("Failed to fetch salary register");
      toast({
        title: "Error",
        description: "Failed to fetch salary register. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    return salaryData.filter(employee =>
      employee.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [salaryData, searchTerm]);

  const getStatusBadge = (status) => {
    return (
      <Badge className={status === "processed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const exportToExcel = useCallback(async () => {
    try {
      const blob = await salaryRegisterService.exportToExcel(selectedPeriod, selectedDepartment);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `salary-register-${selectedPeriod}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Salary register exported to Excel successfully.",
      });
    } catch (err) {
      console.error("Export error:", err);
      toast({
        title: "Error",
        description: "Failed to export salary register. Please try again.",
        variant: "destructive",
      });
    }
  }, [selectedPeriod, selectedDepartment, toast]);

  const exportToPDF = useCallback(async () => {
    try {
      const blob = await salaryRegisterService.exportToPDF(selectedPeriod, selectedDepartment);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `salary-register-${selectedPeriod}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Salary register exported to PDF successfully.",
      });
    } catch (err) {
      console.error("Export error:", err);
      toast({
        title: "Error",
        description: "Failed to export salary register. Please try again.",
        variant: "destructive",
      });
    }
  }, [selectedPeriod, selectedDepartment, toast]);

  const summaryData = useMemo(() => {
    const totalEmployees = salaryData.length;
    const totalGross = salaryData.reduce((sum, emp) => sum + emp.totalEarnings, 0);
    const totalDeductions = salaryData.reduce((sum, emp) => sum + emp.totalDeductions, 0);
    const totalNet = salaryData.reduce((sum, emp) => sum + emp.netSalary, 0);
    return { totalEmployees, totalGross, totalDeductions, totalNet };
  }, [salaryData]);

  const { totalEmployees, totalGross, totalDeductions, totalNet } = summaryData;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText size={24} />
          <h1 className="text-2xl font-bold">Salary Register</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={exportToExcel} variant="outline">
            <Download size={16} className="mr-2" />
            Export Excel
          </Button>
          <Button onClick={exportToPDF} variant="outline">
            <Download size={16} className="mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold">{totalEmployees}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Gross</p>
                <p className="text-2xl font-bold">${totalGross.toLocaleString()}</p>
              </div>
              <FileText className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Deductions</p>
                <p className="text-2xl font-bold">${totalDeductions.toLocaleString()}</p>
              </div>
              <FileText className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Net</p>
                <p className="text-2xl font-bold">${totalNet.toLocaleString()}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Search Employee</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="search"
                  placeholder="Search by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="period">Payroll Period</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="january-2024">January 2024</SelectItem>
                  <SelectItem value="december-2023">December 2023</SelectItem>
                  <SelectItem value="november-2023">November 2023</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Salary Register Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Salary Details</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mr-2" />
              <span>Loading salary register...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              <p>{error}</p>
              <Button onClick={fetchSalaryRegister} className="mt-4">
                Try Again
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Basic Salary</TableHead>
                    <TableHead>HRA</TableHead>
                    <TableHead>Conveyance</TableHead>
                    <TableHead>LTA</TableHead>
                    <TableHead>Medical</TableHead>
                    <TableHead>Other Allow.</TableHead>
                    <TableHead>Total Earnings</TableHead>
                    <TableHead>PF</TableHead>
                    <TableHead>Prof. Tax</TableHead>
                    <TableHead>Income Tax</TableHead>
                    <TableHead>Other Ded.</TableHead>
                    <TableHead>Total Deductions</TableHead>
                    <TableHead>Net Salary</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={16} className="text-center py-8 text-gray-500">
                        No salary register data found for the selected filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{employee.employeeName}</p>
                            <p className="text-sm text-gray-600">{employee.employeeId}</p>
                          </div>
                        </TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>${employee.basicSalary}</TableCell>
                        <TableCell>${employee.hra}</TableCell>
                        <TableCell>${employee.conveyance}</TableCell>
                        <TableCell>${employee.lta}</TableCell>
                        <TableCell>${employee.medical}</TableCell>
                        <TableCell>${employee.otherAllowances}</TableCell>
                        <TableCell className="font-medium">${employee.totalEarnings}</TableCell>
                        <TableCell>${employee.pf}</TableCell>
                        <TableCell>${employee.professionalTax}</TableCell>
                        <TableCell>${employee.incomeTax}</TableCell>
                        <TableCell>${employee.otherDeductions}</TableCell>
                        <TableCell className="font-medium">${employee.totalDeductions}</TableCell>
                        <TableCell className="font-bold text-green-600">${employee.netSalary}</TableCell>
                        <TableCell>{getStatusBadge(employee.status)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default React.memo(SalaryRegister);
