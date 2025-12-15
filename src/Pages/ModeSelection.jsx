import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../Lib/card";
import { Button } from "../Lib/button";
import { Badge } from "../Lib/badge";
import { Alert, AlertDescription } from "../Lib/alert";
import { Settings, FileSpreadsheet, Database, CheckCircle, ArrowRight, Info } from "lucide-react";

const ModeSelection = () => {
  const [selectedMode, setSelectedMode] = useState(null);
  const [isProceeding, setIsProceeding] = useState(false);

  const modes = [
    {
      id: "standard",
      name: "Standard Mode",
      icon: Database,
      description: "Use predefined templates with standard field mappings",
      features: [
        "Pre-configured templates for common payroll modules",
        "Standard field validation and formatting",
        "Quick setup with minimal configuration",
        "Built-in data validation rules",
        "Automated error checking and correction"
      ],
      useCase: "Best for organizations with standard payroll processes and data formats",
      processingTime: "Fast",
      complexity: "Low",
      color: "bg-blue-50 border-blue-200"
    },
    {
      id: "flexible",
      name: "Flexible Mode",
      icon: FileSpreadsheet,
      description: "Upload your own Excel templates with custom column mappings",
      features: [
        "Upload existing Excel/CSV templates",
        "Custom column mapping to system fields",
        "Support for complex data structures",
        "Flexible validation rules",
        "Advanced data transformation options"
      ],
      useCase: "Best for organizations with custom data formats or legacy systems",
      processingTime: "Variable",
      complexity: "Medium",
      color: "bg-green-50 border-green-200"
    }
  ];

  const handleModeSelect = (modeId) => {
    setSelectedMode(modeId);
  };

  const handleProceed = () => {
    if (!selectedMode) return;

    setIsProceeding(true);

    // Simulate navigation delay
    setTimeout(() => {
      setIsProceeding(false);
      // In a real app, this would navigate to the next step
      alert(`Proceeding with ${modes.find(m => m.id === selectedMode)?.name}. In a real implementation, this would navigate to the appropriate workflow.`);
    }, 1500);
  };

  const selectedModeData = modes.find(mode => mode.id === selectedMode);

  return (
    <div className="p-2">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Settings size={32} className="text-blue-600" />
          <h1 className="text-3xl font-bold">Choose Your Data Entry Mode</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select the mode that best fits your organization's payroll data entry requirements.
          Each mode offers different levels of customization and complexity.
        </p>
      </div>

      {/* Mode Selection Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isSelected = selectedMode === mode.id;

          return (
            <Card
              key={mode.id}
              className={`cursor-pointer transition-all duration-200 ${
                isSelected
                  ? `${mode.color} border-2 shadow-lg scale-105`
                  : "hover:shadow-md border-gray-200"
              }`}
              onClick={() => handleModeSelect(mode.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-white' : 'bg-gray-100'}`}>
                      <Icon size={24} className={isSelected ? 'text-blue-600' : 'text-gray-600'} />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{mode.name}</CardTitle>
                      {isSelected && (
                        <Badge className="mt-1 bg-blue-100 text-blue-800">
                          <CheckCircle size={12} className="mr-1" />
                          Selected
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{mode.description}</p>

                <div className="space-y-3 mb-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2">Key Features:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {mode.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-900">Processing:</span>
                      <Badge
                        variant="outline"
                        className={`ml-2 ${
                          mode.processingTime === 'Fast' ? 'border-green-500 text-green-700' : 'border-yellow-500 text-yellow-700'
                        }`}
                      >
                        {mode.processingTime}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Complexity:</span>
                      <Badge
                        variant="outline"
                        className={`ml-2 ${
                          mode.complexity === 'Low' ? 'border-green-500 text-green-700' :
                          mode.complexity === 'Medium' ? 'border-yellow-500 text-yellow-700' :
                          'border-red-500 text-red-700'
                        }`}
                      >
                        {mode.complexity}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected Mode Details */}
      {selectedModeData && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <selectedModeData.icon size={20} />
              {selectedModeData.name} - Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Best For:</h3>
                <p className="text-gray-600">{selectedModeData.useCase}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Next Steps:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  {selectedMode === 'standard' ? (
                    <>
                      <li>• Select from available templates</li>
                      <li>• Configure basic settings</li>
                      <li>• Start data entry immediately</li>
                    </>
                  ) : (
                    <>
                      <li>• Upload your Excel/CSV template</li>
                      <li>• Map columns to system fields</li>
                      <li>• Configure validation rules</li>
                      <li>• Test with sample data</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          size="lg"
          onClick={handleProceed}
          disabled={!selectedMode || isProceeding}
          className="px-8"
        >
          {isProceeding ? (
            "Setting up..."
          ) : (
            <>
              Proceed with {selectedModeData?.name || "Selected Mode"}
              <ArrowRight size={16} className="ml-2" />
            </>
          )}
        </Button>
      </div>

      {/* Help Information */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Can't decide?</strong> If you're new to the system or have standard payroll data,
            start with Standard Mode. You can always switch modes later or create custom templates.
          </AlertDescription>
        </Alert>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Need help?</strong> Contact your system administrator or refer to the user guide
            for detailed information about each mode's capabilities and limitations.
          </AlertDescription>
        </Alert>
      </div>

      {/* Mode Comparison Table */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Mode Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Feature</th>
                  <th className="text-center p-3 font-medium">Standard Mode</th>
                  <th className="text-center p-3 font-medium">Flexible Mode</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3 font-medium">Setup Time</td>
                  <td className="p-3 text-center text-green-600">5-10 minutes</td>
                  <td className="p-3 text-center text-yellow-600">30-60 minutes</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Technical Skills Required</td>
                  <td className="p-3 text-center text-green-600">Basic</td>
                  <td className="p-3 text-center text-yellow-600">Intermediate</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Customization Level</td>
                  <td className="p-3 text-center text-yellow-600">Limited</td>
                  <td className="p-3 text-center text-green-600">High</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Data Validation</td>
                  <td className="p-3 text-center text-green-600">Built-in</td>
                  <td className="p-3 text-center text-green-600">Configurable</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Error Handling</td>
                  <td className="p-3 text-center text-green-600">Automated</td>
                  <td className="p-3 text-center text-yellow-600">Manual Setup</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Best For</td>
                  <td className="p-3 text-center text-sm">Standard payroll processes</td>
                  <td className="p-3 text-center text-sm">Custom/legacy systems</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModeSelection;
