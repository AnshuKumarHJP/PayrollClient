import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../Lib/card";
import { Button } from "../Lib/button";
import { Input } from "../Lib/input";
import { Label } from "../Lib/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Lib/select";
import { Textarea } from "../Lib/textarea";
import { Badge } from "../Lib/badge";
import { Eye, FileText, Loader2 } from "lucide-react";
import { templateService } from "../../api/services/templateService";
import { useToast } from "../Lib/use-toast";

const TemplatePreview = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewData, setPreviewData] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const data = await templateService.getAll();
      setTemplates(data);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to fetch templates. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = async (templateId) => {
    try {
      const template = await templateService.getById(templateId);
      const previewResponse = await templateService.preview(templateId);
      setSelectedTemplate(template);

      // Use demo data from API if available, otherwise initialize with empty values
      const demoData = previewResponse.data || {};
      const initialData = {};
      template.fields.forEach(field => {
        initialData[field.name] = demoData[field.name] || field.defaultValue || '';
      });
      setPreviewData(initialData);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to load template preview. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleInputChange = (fieldName, value) => {
    setPreviewData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const renderField = (field) => {
    const value = previewData[field.name] || '';

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.name}
              type={field.type}
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
              maxLength={field.maxLength}
              required={field.required}
            />
            {field.validation && (
              <p className="text-xs text-gray-500">
                Validation: {field.validation}
                {field.maxLength && ` (Max: ${field.maxLength} chars)`}
              </p>
            )}
          </div>
        );

      case 'date':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.name}
              type="date"
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              required={field.required}
            />
          </div>
        );

      case 'select':
        const options = field.options ? field.options.split(',').map(opt => opt.trim()) : [];
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={value}
              onValueChange={(newValue) => handleInputChange(field.name, newValue)}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option, index) => (
                  <SelectItem key={index} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'textarea':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={field.name}
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
              rows={3}
              maxLength={field.maxLength}
              required={field.required}
            />
            {field.maxLength && (
              <p className="text-xs text-gray-500">
                Max {field.maxLength} characters
              </p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.name} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={field.name}
              checked={value === 'true' || value === true}
              onChange={(e) => handleInputChange(field.name, e.target.checked)}
              className="rounded"
            />
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
          </div>
        );

      case 'file':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.name}
              type="file"
              onChange={(e) => handleInputChange(field.name, e.target.files[0]?.name || '')}
              accept={field.validation === 'image' ? 'image/*' : '*'}
            />
          </div>
        );

      default:
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label} ({field.type})
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.name}
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            />
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="p-2">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading templates...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Eye size={24} />
          <h1 className="text-xl font-bold">Template Preview</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Selection */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Select Template</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="templateSelect">Choose a template to preview</Label>
                <Select onValueChange={handleTemplateSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id.toString()}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedTemplate && (
                <div className="space-y-2">
                  <h3 className="font-medium">{selectedTemplate.name}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{selectedTemplate.module}</Badge>
                    <Badge variant="secondary">{selectedTemplate.version}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {Array.isArray(selectedTemplate.fields) ? selectedTemplate.fields.length : 0} fields
                  </p>
                  {selectedTemplate.description && (
                    <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Preview Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedTemplate ? `Preview: ${selectedTemplate.name}` : 'Select a template to preview'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedTemplate ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedTemplate.fields.map((field) => renderField(field))}
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline">
                    <FileText size={16} className="mr-2" />
                    Export Preview
                  </Button>
                  <Button>
                    <Eye size={16} className="mr-2" />
                    View JSON
                  </Button>
                </div>

                {/* JSON Preview */}
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Form Data (JSON)</h4>
                  <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto">
                    {JSON.stringify(previewData, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Eye size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Template Selected</h3>
                <p className="text-gray-600">
                  Choose a template from the sidebar to preview how it will look when used for data entry.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default React.memo(TemplatePreview);
