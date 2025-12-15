import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../Lib/card";
import { Button } from "../Lib/button";
import { Badge } from "../Lib/badge";
import { Alert, AlertDescription } from "../Lib/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../Lib/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../Lib/table";
import { Eye, Download, CheckCircle, AlertTriangle, FileSpreadsheet, Loader2 } from "lucide-react";
import { templateService } from "../../api/services/templateService";
import { columnMappingService } from "../../api/services/columnMappingService";
import { useToast } from "../Lib/use-toast";

const MappedTemplatePreview = () => {
  const [activeTab, setActiveTab] = useState("preview");
  const [mappedData, setMappedData] = useState(null);
  const [systemFields, setSystemFields] = useState([]);
  const [validationResults, setValidationResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchMappedData();
  }, []);

  const fetchMappedData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch template preview data
      const templateResponse = await templateService.preview(1); // Using template ID 1 as example
      const columnMappings = await columnMappingService.getAll();

      // Get system fields from template
      const template = await templateService.getById(1);
      const fields = template.fields || [];

      setMappedData({
        mappings: columnMappings.reduce((acc, mapping) => {
          acc[mapping.systemField] = mapping.excelColumn;
          return acc;
        }, {}),
        sampleData: templateResponse.data || []
      });

      setSystemFields(fields.map(field => ({
        id: field.name,
        label: field.label,
        type: field.type,
        required: field.required
      })));

      // Mock validation results - in real implementation, this would come from API
      setValidationResults({
        totalRows: templateResponse.data?.length || 0,
        validRows: templateResponse.data?.length || 0,
        invalidRows: 0,
        warnings: 0,
        errors: 0,
        status: "success"
      });

    } catch (err) {
      setError('Failed to fetch mapped template data');
      toast({
        title: 'Error',
        description: 'Failed to fetch mapped template data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getMappedValue = (row, systemFieldId) => {
    const excelColumn = mappedData.mappings[systemFieldId];
    return row[excelColumn] || "";
  };

  const exportMappingConfig = () => {
    const config = {
      mappings: mappedData.mappings,
      validationRules: systemFields.map(field => ({
        field: field.id,
        required: field.required,
        type: field.type
      })),
      metadata: {
        createdAt: new Date().toISOString(),
        totalFields: systemFields.length,
        mappedFields: Object.keys(mappedData.mappings).length
      }
    };

    const dataStr = JSON.stringify(config, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = 'mapping_config.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const downloadExcelTemplate = () => {
    alert("Excel template download would start here. In a real implementation, this would generate and download an Excel file with proper formatting and sample data.");
  };

  const getValidationStatus = () => {
    if (validationResults.errors > 0) {
      return { status: "error", color: "border-red-500", icon: AlertTriangle, message: `${validationResults.errors} errors found` };
    } else if (validationResults.warnings > 0) {
      return { status: "warning", color: "border-yellow-500", icon: AlertTriangle, message: `${validationResults.warnings} warnings found` };
    } else {
      return { status: "success", color: "border-green-500", icon: CheckCircle, message: "All data validated successfully" };
    }
  };

  const validationStatus = getValidationStatus();

  if (loading) {
    return (
      <div className="p-2">
        <div className="flex items-center gap-2 mb-6">
          <Eye size={24} />
          <h1 className="text-xl font-bold">Mapped Template Preview</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading template data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-2">
        <div className="flex items-center gap-2 mb-6">
          <Eye size={24} />
          <h1 className="text-xl font-bold">Mapped Template Preview</h1>
        </div>
        <Alert className="mb-6 border-red-500">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Error:</strong> {error}
          </AlertDescription>
        </Alert>
        <Button onClick={fetchMappedData} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="flex items-center gap-2 mb-6">
        <Eye size={24} />
        <h1 className="text-xl font-bold">Mapped Template Preview</h1>
      </div>

      {/* Validation Status */}
      <Alert className={`mb-6 ${validationStatus.color}`}>
        <validationStatus.icon className="h-4 w-4" />
        <AlertDescription>
          <strong>Validation Results:</strong> {validationStatus.message}
          <br />
          Total Rows: {validationResults.totalRows} |
          Valid: {validationResults.validRows} |
          Invalid: {validationResults.invalidRows}
        </AlertDescription>
      </Alert>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <Button onClick={downloadExcelTemplate}>
          <FileSpreadsheet size={16} className="mr-2" />
          Download Excel Template
        </Button>
        <Button variant="outline" onClick={exportMappingConfig}>
          <Download size={16} className="mr-2" />
          Export Mapping Config
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="preview">Data Preview</TabsTrigger>
          <TabsTrigger value="mappings">Field Mappings</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sample Data Preview</CardTitle>
              <p className="text-sm text-gray-600">
                This shows how your Excel data will be interpreted after mapping
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {systemFields.map(field => (
                        <TableHead key={field.id}>
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mappedData.sampleData.map((row, index) => (
                      <TableRow key={index}>
                        {systemFields.map(field => (
                          <TableCell key={field.id}>
                            {getMappedValue(row, field.id)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mappings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Field Mapping Details</CardTitle>
              <p className="text-sm text-gray-600">
                Current mapping configuration between Excel columns and system fields
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>System Field</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Required</TableHead>
                      <TableHead>Mapped Excel Column</TableHead>
                      <TableHead>Sample Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {systemFields.map(field => (
                      <TableRow key={field.id}>
                        <TableCell className="font-medium">{field.label}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{field.type}</Badge>
                        </TableCell>
                        <TableCell>
                          {field.required ? (
                            <Badge className="bg-red-100 text-red-800">Required</Badge>
                          ) : (
                            <Badge variant="outline">Optional</Badge>
                          )}
                        </TableCell>
                        <TableCell className="font-mono">
                          {mappedData.mappings[field.id] || "Not mapped"}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {getMappedValue(mappedData.sampleData[0], field.id)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MappedTemplatePreview;
