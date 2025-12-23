import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../Lib/card";
import { Button } from "../Lib/button";
import { Badge } from "../Lib/badge";
import { Alert, AlertDescription } from "../Lib/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../Lib/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../Lib/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Lib/select";
import { Input } from "../Lib/input";
import { Label } from "../Lib/label";
import { Eye, Download, CheckCircle, AlertTriangle, FileSpreadsheet, Loader2, Info } from "lucide-react";
import { templateService } from "../../api/services/templateService";
import { columnMappingService } from "../../api/services/columnMappingService";
import { downloadExcelTemplate, downloadCSV } from "../services/excelUtils";
import { useToast } from "../Lib/use-toast";

const ExcelTemplatePreview = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [templates, setTemplates] = useState([]);
  const [previewData, setPreviewData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setIsLoadingTemplates(true);
      const templateList = await templateService.getAll();
      setTemplates(templateList);
      if (templateList.length > 0) {
        setSelectedTemplate(templateList[0].id.toString());
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load templates. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  const generatePreview = async () => {
    try {
      setIsGenerating(true);
      const templateId = selectedTemplate;
      const template = await templateService.getById(templateId);

      // Generate mock sample data based on template fields
      const sampleData = [];
      for (let i = 0; i < 3; i++) {
        const row = {};
        template.fields.forEach(field => {
          switch (field.type) {
            case 'text':
              row[field.name] = `Sample ${field.label} ${i + 1}`;
              break;
            case 'email':
              row[field.name] = `user${i + 1}@example.com`;
              break;
            case 'number':
              row[field.name] = (1000 + i * 100).toString();
              break;
            case 'date':
              row[field.name] = new Date(Date.now() + i * 86400000).toISOString().split('T')[0];
              break;
            case 'select':
              row[field.name] = field.options ? field.options[0] : 'Option 1';
              break;
            default:
              row[field.name] = `Sample ${field.label}`;
          }
        });
        sampleData.push(row);
      }

      setPreviewData({
        template: template,
        sampleData: sampleData,
        columnHeaders: template.fields.map(f => f.label),
        columnKeys: template.fields.map(f => f.name)
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate preview. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const template = templates.find(t => t.id === selectedTemplate);

      if (!previewData) {
        toast({
          title: "Info",
          description: "Please generate preview first before downloading.",
        });
        return;
      }

      await downloadExcelTemplate(previewData.template.fields, previewData.sampleData, template?.name);

      toast({
        title: "Success",
        description: "Excel template downloaded successfully with data validation and instructions.",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Error",
        description: "Failed to download template. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getFieldTypeIcon = (type) => {
    const icons = {
      text: "📝",
      email: "📧",
      number: "🔢",
      date: "📅",
      select: "📋",
      time: "🕐"
    };
    return icons[type] || "📄";
  };

  const getValidationInfo = (field) => {
    let info = [];
    if (field.required) info.push("Required");

    // Check validation property first, then fall back to type-based validation
    if (field.validation && field.validation !== "none") {
      switch (field.validation) {
        case "email":
          info.push("Email format");
          break;
        case "alphabetic":
          info.push("Alphabetic only");
          break;
        case "alphanumeric":
          info.push("Alphanumeric");
          break;
        case "numeric":
          info.push("Numeric only");
          break;
        case "date":
          info.push("Valid date");
          break;
        case "phone":
          info.push("Phone number");
          break;
        case "required":
          // Already handled above
          break;
        default:
          info.push(field.validation);
      }
    } else {
      // Fallback to type-based validation for backward compatibility
      switch (field.type) {
        case "email":
          info.push("Email format");
          break;
        case "number":
          info.push("Numeric only");
          break;
        case "date":
          info.push("Date format (YYYY-MM-DD)");
          break;
      }
    }

    // Add maxLength info if present
    if (field.maxLength) {
      info.push(`Max ${field.maxLength} characters`);
    }

    return info.join(", ");
  };

  if (isLoadingTemplates) {
    return (
      <div className="p-2">
        <div className="flex items-center gap-2 mb-6">
          <FileSpreadsheet size={24} />
          <h1 className="text-xl font-bold">Excel Template Preview</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading templates...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2">
      {/* Template Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
             <FileSpreadsheet size={24} />
            Select Template to Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="template">Template</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {templates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={generatePreview} disabled={isGenerating}>
                {isGenerating ? "Generating..." : "Generate Preview"}
              </Button>
              <Button variant="outline" onClick={downloadTemplate}>
                <Download size={16} className="mr-2" />
                Download Excel
              </Button>
            </div>
          </div>

          {selectedTemplate && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900">
                    {templates.find(t => t.id === selectedTemplate)?.name}
                  </h3>
                  <p className="text-blue-700 text-sm mt-1">
                    {templates.find(t => t.id === selectedTemplate)?.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Field Configuration */}
      {previewData && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Field Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {previewData.template.fields.map((field, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{getFieldTypeIcon(field.type)}</span>
                    <span className="font-medium">{field.label}</span>
                    {field.required && (
                      <Badge className="bg-red-100 text-red-800 text-xs">Required</Badge>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div><strong>Type:</strong> {field.type}</div>
                    <div><strong>Sample:</strong> {field.sample}</div>
                    {getValidationInfo(field) && (
                      <div><strong>Validation:</strong> {getValidationInfo(field)}</div>
                    )}
                    <div><strong>Field Applocable For :</strong> {Array.isArray(field.applicable) && field.applicable.length > 0
                      ? field.applicable.join(", ").toUpperCase()
                      : "-"}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Excel Preview */}
      {previewData && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Excel Template Preview</CardTitle>
            <p className="text-sm text-gray-600">
              This shows how the data will appear in Excel. The actual Excel file will include data validation, formatting, and instructions.
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    {previewData.columnHeaders.map((header, index) => (
                      <TableHead key={index} className="font-medium border-r">
                        {header}
                        {previewData.template.fields[index]?.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.sampleData.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {previewData.columnKeys.map((key, colIndex) => (
                        <TableCell key={colIndex} className="border-r">
                          {row[key]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <strong>Excel Template Features:</strong>
                  <ul className="mt-1 space-y-1 text-yellow-800">
                    <li>• Data validation rules applied to each column</li>
                    <li>• Dropdown lists for select fields</li>
                    <li>• Date formatting for date fields</li>
                    <li>• Required field indicators</li>
                    <li>• Sample data in the first few rows</li>
                    <li>• Instructions sheet with usage guidelines</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Template Usage Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>How to use the Excel template:</strong>
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Data Entry Guidelines</h3>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Start entering data from row 2 (row 1 contains headers)</li>
                <li>• Required fields are marked with red asterisks (*)</li>
                <li>• Use the dropdown lists where available</li>
                <li>• Follow the sample data format for dates and numbers</li>
                <li>• Do not modify the header row</li>
                <li>• Do not add or remove columns</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-2">Validation Rules</h3>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Email fields must contain valid email addresses</li>
                <li>• Date fields must be in YYYY-MM-DD format</li>
                <li>• Numeric fields accept only numbers</li>
                <li>• Required fields cannot be left empty</li>
                <li>• Text length limits are enforced where specified</li>
                <li>• Custom validation rules are applied automatically</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-green-900">Upload Process</h3>
                <p className="text-green-700 text-sm mt-1">
                  After filling the template, save it as .xlsx or .csv and upload it through the Bulk Upload module.
                  The system will validate all data and provide detailed error reports for any issues found.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExcelTemplatePreview;
