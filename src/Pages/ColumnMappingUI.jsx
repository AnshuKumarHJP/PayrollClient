import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../Lib/card";
import { Button } from "../Lib/button";
import { Label } from "../Lib/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Lib/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../Lib/table";
import { Badge } from "../Lib/badge";
import { Alert, AlertDescription } from "../Lib/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../Lib/dialog";
import { ArrowRightLeft, CheckCircle, AlertTriangle, Info, Upload, FileSpreadsheet } from "lucide-react";
import FileInput from "../Lib/FileInput";
import systemFieldsService from "../../api/services/systemFieldsService";
import { columnMappingService } from "../../api/services/columnMappingService";
import { useToast } from "../Lib/use-toast";

const ColumnMappingUI = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [excelHeaders, setExcelHeaders] = useState([]);
  const [mappings, setMappings] = useState({});
  const [systemFields, setSystemFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const [isMappingDialogOpen, setIsMappingDialogOpen] = useState(false);
  const [selectedSystemField, setSelectedSystemField] = useState(null);
  const [mappingProgress, setMappingProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState([]);
  const [savedMappings, setSavedMappings] = useState([]);

  useEffect(() => {
    fetchSystemFields();
    fetchSavedMappings();
  }, []);

  const fetchSystemFields = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await systemFieldsService.getAllSystemFields();
      setSystemFields(data);
    } catch (err) {
      setError('Failed to fetch system fields');
      toast({
        title: 'Error',
        description: 'Failed to fetch system fields. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedMappings = async () => {
    try {
      const data = await columnMappingService.getAll();
      setSavedMappings(data);
    } catch (err) {
      console.error('Failed to fetch saved mappings:', err);
    }
  };

  // Mock Excel headers from uploaded file
  const mockExcelHeaders = [
    "Emp_ID", "First_Name", "Last_Name", "Email_ID", "Phone_No",
    "DOB", "Join_Date", "Dept", "Job_Title", "Monthly_Salary",
    "Manager_Name", "Office_Location", "Employee_Status", "Contract_Type"
  ];



  const calculateMappingProgress = (currentMappings) => {
    const requiredFields = systemFields.filter(f => f.required).length;
    const mappedRequiredFields = systemFields.filter(f => f.required && currentMappings[f.id]).length;
    const progress = (mappedRequiredFields / requiredFields) * 100;
    setMappingProgress(progress);
  };

  const handleMappingChange = (systemFieldId, excelHeader) => {
    const newMappings = {
      ...mappings,
      [systemFieldId]: excelHeader
    };
    setMappings(newMappings);
    calculateMappingProgress(newMappings);
  };

  const handleAutoMap = () => {
    const autoMappings = {};
    systemFields.forEach(systemField => {
      // Enhanced auto-mapping logic
      const keywords = {
        employeeId: ['emp', 'id', 'employee'],
        firstName: ['first', 'fname', 'given'],
        lastName: ['last', 'lname', 'surname', 'family'],
        email: ['email', 'mail'],
        phone: ['phone', 'mobile', 'tel'],
        dateOfBirth: ['dob', 'birth', 'birthday'],
        joiningDate: ['join', 'start', 'hire'],
        department: ['dept', 'department'],
        designation: ['designation', 'title', 'job', 'role'],
        salary: ['salary', 'pay', 'wage'],
        manager: ['manager', 'supervisor'],
        workLocation: ['location', 'office', 'workplace']
      };

      const fieldKeywords = keywords[systemField.id] || [];
      const matchingHeader = excelHeaders.find(header =>
        fieldKeywords.some(keyword =>
          header.toLowerCase().includes(keyword)
        )
      );

      if (matchingHeader) {
        autoMappings[systemField.id] = matchingHeader;
      }
    });

    setMappings(autoMappings);
    calculateMappingProgress(autoMappings);
  };

  const validateMappings = () => {
    const errors = [];

    // Check required fields
    systemFields.filter(f => f.required).forEach(field => {
      if (!mappings[field.id]) {
        errors.push(`Required field "${field.label}" is not mapped`);
      }
    });

    // Check for duplicate mappings
    const mappedHeaders = Object.values(mappings).filter(Boolean);
    const duplicates = mappedHeaders.filter((header, index) => mappedHeaders.indexOf(header) !== index);
    if (duplicates.length > 0) {
      errors.push(`Duplicate mappings found for: ${duplicates.join(', ')}`);
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleProceedToReview = () => {
    if (validateMappings()) {
      // In a real app, this would navigate to the review screen
      alert("Mappings validated successfully! Proceeding to review screen.");
    }
  };

  const saveMappings = async () => {
    try {
      // Convert mappings object to array format expected by the service
      const mappingData = Object.entries(mappings).map(([systemField, excelColumn]) => ({
        systemField,
        excelColumn,
        templateId: 1 // Using template ID 1 as example
      }));

      await columnMappingService.saveMappings(mappingData);
      toast({
        title: 'Success',
        description: 'Mappings saved successfully!',
      });
      fetchSavedMappings(); // Refresh saved mappings
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to save mappings. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const clearMappings = () => {
    setMappings({});
    setMappingProgress(0);
    setValidationErrors([]);
  };

  const getMappingStatus = (systemField) => {
    if (mappings[systemField.id]) {
      return { status: 'mapped', color: 'bg-green-100 text-green-800', label: 'Mapped' };
    } else if (systemField.required) {
      return { status: 'required', color: 'bg-red-100 text-red-800', label: 'Required' };
    } else {
      return { status: 'optional', color: 'bg-gray-100 text-gray-800', label: 'Optional' };
    }
  };

  return (
    <div className="p-2">
      <div className="flex items-center gap-2 mb-6">
        <ArrowRightLeft size={24} />
        <h1 className="text-xl font-bold">Column Mapping</h1>
      </div>

      {/* File Upload Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upload Excel Template</CardTitle>
        </CardHeader>
        <CardContent>
          <FileInput
            label="Excel Template"
            allowTypes={[".xlsx", ".xls"]}
            onChangeFile={(file) => {
              if (file) {
                setUploadedFile(file);
                // Simulate reading Excel headers
                setTimeout(() => {
                  setExcelHeaders(mockExcelHeaders);
                  // Auto-suggest mappings
                  const autoMappings = {};
                  systemFields.forEach(systemField => {
                    const matchingHeader = mockExcelHeaders.find(header =>
                      header.toLowerCase().includes(systemField.id.toLowerCase()) ||
                      header.toLowerCase().replace(/[_]/g, '').includes(systemField.id.toLowerCase())
                    );
                    if (matchingHeader) {
                      autoMappings[systemField.id] = matchingHeader;
                    }
                  });
                  setMappings(autoMappings);
                  calculateMappingProgress(autoMappings);
                }, 1000);
              }
            }}
          />
          <p className="text-sm text-gray-600 mt-2">
            Select an Excel file (.xlsx, .xls) to map columns to system fields
          </p>
        </CardContent>
      </Card>

      {/* Mapping Interface */}
      {excelHeaders.length > 0 && (
        <>
          {/* Mapping Progress */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Mapping Progress</span>
                <span className="text-sm text-gray-600">{Math.round(mappingProgress)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${mappingProgress}%` }}
                ></div>
              </div>
              <div className="flex gap-4 mt-2 text-sm">
                <Button size="sm" variant="outline" onClick={handleAutoMap}>
                  Auto Map
                </Button>
                <Button size="sm" variant="outline" onClick={clearMappings}>
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Mapping Table */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Field Mappings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>System Field</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Mapped Excel Column</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {systemFields.map((field) => {
                      const status = getMappingStatus(field);
                      return (
                        <TableRow key={field.id}>
                          <TableCell className="font-medium">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{field.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={status.color}>
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={mappings[field.id] || ""}
                              onValueChange={(value) => handleMappingChange(field.id, value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Excel column" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">Not mapped</SelectItem>
                                {excelHeaders.map((header) => (
                                  <SelectItem key={header} value={header}>
                                    {header}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedSystemField(field);
                                setIsMappingDialogOpen(true);
                              }}
                            >
                              <Info size={14} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Excel Headers Preview */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Excel Headers Found</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {excelHeaders.map((header, index) => (
                  <Badge key={index} variant="outline" className="px-3 py-1">
                    {header}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                These are the column headers found in your uploaded Excel file.
              </p>
            </CardContent>
          </Card>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <Alert className="mb-6 border-red-500">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Please fix the following issues:</strong>
                <ul className="mt-2 space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={saveMappings}>
              Save Draft
            </Button>
            <Button
              onClick={handleProceedToReview}
              disabled={mappingProgress < 100}
            >
              Proceed to Review
            </Button>
          </div>
        </>
      )}

      {/* Field Information Dialog */}
      <Dialog open={isMappingDialogOpen} onOpenChange={setIsMappingDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Field Information</DialogTitle>
          </DialogHeader>
          {selectedSystemField && (
            <div className="space-y-4">
              <div>
                <Label className="font-medium">Field Name</Label>
                <p className="text-sm text-gray-600">{selectedSystemField.label}</p>
              </div>
              <div>
                <Label className="font-medium">Field Type</Label>
                <p className="text-sm text-gray-600">{selectedSystemField.type}</p>
              </div>
              <div>
                <Label className="font-medium">Required</Label>
                <p className="text-sm text-gray-600">
                  {selectedSystemField.required ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <Label className="font-medium">Description</Label>
                <p className="text-sm text-gray-600">
                  This field {selectedSystemField.required ? "must" : "can optionally"} be mapped to an Excel column.
                  {selectedSystemField.type === "email" && " The mapped column should contain valid email addresses."}
                  {selectedSystemField.type === "date" && " The mapped column should contain dates in a recognizable format."}
                  {selectedSystemField.type === "number" && " The mapped column should contain numeric values only."}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ColumnMappingUI;
