import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../Lib/card";
import { Button } from "../Lib/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Lib/select";
import { Badge } from "../Lib/badge";
import { CheckCircle, XCircle, Users, FileText, Link, Unlink } from "lucide-react";
import { templateService } from "../../api/services/templateService";

const PayrollInputMapping = () => {
  const [clients, setClients] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientTemplates, setClientTemplates] = useState([]);
  const [availableTemplates, setAvailableTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapping, setMapping] = useState({});

  // Load clients and templates
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Load clients from db.json
        const clientsResponse = await fetch('/api/db.json');
        const dbData = await clientsResponse.json();
        setClients(dbData.clients || []);

        // Load templates
        const templatesData = await templateService.getAll();
        setTemplates(templatesData || []);

      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Update mappings when client changes
  useEffect(() => {
    if (selectedClient && templates.length > 0) {
      const clientMappedTemplates = templates.filter(template =>
        template.clientCode === selectedClient.clientCode
      );
      setClientTemplates(clientMappedTemplates);

      // Available templates include: common templates + templates not mapped to any client + templates mapped to other clients
      const available = templates.filter(template =>
        template.isCommon === true ||
        template.clientCode === null ||
        template.clientCode !== selectedClient.clientCode
      );
      setAvailableTemplates(available);

      // Initialize mapping state
      const initialMapping = {};
      templates.forEach(template => {
        initialMapping[template.id] = template.clientCode === selectedClient.clientCode;
      });
      setMapping(initialMapping);
    }
  }, [selectedClient, templates]);

  const handleClientChange = (clientCode) => {
    const client = clients.find(c => c.clientCode === clientCode);
    setSelectedClient(client);
  };

  const handleTemplateMapping = async (templateId, shouldMap) => {
    try {
      const template = templates.find(t => t.id === templateId);
      if (!template) return;

      const updatedTemplate = {
        ...template,
        clientCode: shouldMap ? selectedClient.clientCode : null
      };

      // Update template via service
      await templateService.update(templateId, updatedTemplate);

      // Update local state
      setMapping(prev => ({
        ...prev,
        [templateId]: shouldMap
      }));

      // Refresh template lists
      const updatedTemplates = templates.map(t =>
        t.id === templateId ? updatedTemplate : t
      );
      setTemplates(updatedTemplates);

    } catch (error) {
      console.error('Failed to update template mapping:', error);
    }
  };

  const getTemplateStats = (clientCode) => {
    const clientMapped = templates.filter(t => t.clientCode === clientCode);
    return {
      total: clientMapped.length,
      active: clientMapped.filter(t => t.status === 'active').length
    };
  };

  if (loading) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-4">Payroll Input Mapping</h1>
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Payroll Input Mapping</h1>
        <p className="text-gray-600 text-sm">
          Map templates to clients for customized payroll input workflows
        </p>
      </div>

      {/* Client Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users size={20} />
            Select Client
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-md">
            <Select onValueChange={handleClientChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a client to manage templates" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => {
                  const stats = getTemplateStats(client.clientCode);
                  return (
                    <SelectItem key={client.id} value={client.clientCode}>
                      <div className="flex items-center justify-between w-full">
                        <span>{client.clientName}</span>
                        <Badge variant="secondary" className="ml-2">
                          {stats.active}/{stats.total} templates
                        </Badge>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {selectedClient && (
        <>
          {/* Current Mappings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText size={20} />
                Current Template Mappings for {selectedClient.clientName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {clientTemplates.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No templates currently mapped to this client
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clientTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="border rounded-lg p-4 bg-green-50 border-green-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-green-800">{template.name}</h4>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle size={12} className="mr-1" />
                          Mapped
                        </Badge>
                      </div>
                      <p className="text-sm text-green-600 mb-3">{template.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {template.module}
                        </Badge>
                        <Button
                          size="sm"
                          variant=""
                          onClick={() => handleTemplateMapping(template.id, false)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Unlink size={14} className="mr-1" />
                          Unmap
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Available Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link size={20} />
                Available Templates to Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              {availableTemplates.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  All templates are already mapped to clients
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="border rounded-lg p-4 bg-gray-50 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-800">{template.name}</h4>
                        <Badge variant="outline">
                          {template.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {template.module}
                        </Badge>
                        <Button
                          size="sm"
                          onClick={() => handleTemplateMapping(template.id, true)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Link size={14} className="mr-1" />
                          Map to Client
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Mapping Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {clientTemplates.length}
                  </div>
                  <div className="text-sm text-gray-600">Templates Mapped</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {availableTemplates.length}
                  </div>
                  <div className="text-sm text-gray-600">Available Templates</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {clientTemplates.filter(t => t.status === 'active').length}
                  </div>
                  <div className="text-sm text-gray-600">Active Templates</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default PayrollInputMapping;
