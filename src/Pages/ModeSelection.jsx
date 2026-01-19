import { useState } from "react";
import { useDispatch } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "../Lib/card";
import { Button } from "../Lib/button";
import { Badge } from "../Lib/badge";
import { Alert, AlertDescription } from "../Lib/alert";
import { ArrowRight, Info, CheckCircle } from "lucide-react";
import AppIcon from "../Component/AppIcon"
import { SweetSuccess } from "../Component/SweetAlert";
import {useToast} from '../Lib/use-toast'
import { ModeSelectionData } from "../Data/StaticData";

const ModeSelection = () => {
  const dispatch = useDispatch();
  const [selectedMode, setSelectedMode] = useState(null);
  const [isProceeding, setIsProceeding] = useState(false);
  const { toast } = useToast();

  const selectedModeData = ModeSelectionData?.find((m) => m.id === selectedMode);

  const activeClient = useSelector((state) => state.Auth?.Common?.SelectedClient || "");
  const activeClientContract = useSelector((state) => state.Auth?.Common?.SelectedClientContract || "");

  const handleProceed = () => {

    if (!selectedMode) {
      toast({
        title: "Validation Error",
        description: "Please select a data entry mode.",
        variant: "destructive",
      });
      return;
    }

    if (!activeClient) {
      toast({
        title: "Validation Error",
        description: "Active client is required. Please select a client.",
        variant: "destructive",
      });
      return;
    }

    if (!activeClientContract) {
      toast({
        title: "Validation Error",
        description: "Active client contract is required. Please select a contract.",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      ClientId: activeClient,
      ClientContractId: activeClientContract,
      mode: selectedMode,
    };

    console.log("Saving Mode:", payload);

    setIsProceeding(true);
    setTimeout(() => {
      setIsProceeding(false);
      SweetSuccess({
        title: "Mode Selected",
        text: `You are proceeding with ${selectedModeData?.name}.`,
      });
    }, 1200);
  };

  return (
    <div className="p-4">
      {/* HEADER */}
      <div className="text-center mb-8">
        <div className="flex justify-center items-center gap-2 mb-2">
          <AppIcon name="Settings" size={32} />
          <h1 className="text-2xl font-bold">Choose Data Entry Mode</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select how your payroll data will be accepted and processed.
        </p>
      </div>

      {/* MODE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ModeSelectionData?.map((mode) => {
          const isSelected = selectedMode === mode.id;

          return (
            <Card
              key={mode.id}
              onClick={() => setSelectedMode(mode.id)}
              className={`cursor-pointer transition-all ${
                isSelected
                  ? `${mode.color} border-2 shadow-lg scale-[1.02]`
                  : "hover:shadow-md"
              }`}
            >
              <CardHeader>
                <div className="flex gap-3 items-center">
                  <div className="p-2 rounded-md bg-white">
                    <AppIcon name={mode.iconName} size={24} />
                  </div>
                  <div>
                    <CardTitle>{mode.name}</CardTitle>
                    {isSelected && (
                      <Badge className="mt-1 bg-blue-100 text-blue-700">
                        <CheckCircle size={12} className="mr-1" />
                        Selected
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-gray-600 mb-3">{mode.description}</p>

                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Key Capabilities</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {mode.features.map((f, i) => (
                      <li key={i} className="flex gap-2">
                        <CheckCircle size={14} className="text-green-500 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t pt-3 text-sm grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Data Type:</span>
                    <div className="text-gray-600">{mode.dataType}</div>
                  </div>
                  <div>
                    <span className="font-medium">Processing:</span>
                    <div className="text-gray-600">{mode.processing}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* SELECTED MODE DETAILS */}
      {selectedModeData && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AppIcon name={selectedModeData.iconName} size={18} />
              {selectedModeData.name} – What this means
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-3">
              {selectedModeData.meaning}
            </p>

            {selectedMode === "flexible" && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Flexible Mode accepts <strong>raw data</strong>. An admin or
                  operations user will map, validate, and standardize the data
                  before payroll processing.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* ACTION */}
      <div className="flex justify-center mt-6">
        <Button
          size="lg"
          disabled={!selectedMode || isProceeding}
          onClick={handleProceed}
          className="px-8"
        >
          {isProceeding ? "Setting up..." : "Proceed"}
          <ArrowRight size={16} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default ModeSelection;
