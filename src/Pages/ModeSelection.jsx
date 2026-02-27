import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../Library/Button";
import { CheckCircle } from "lucide-react";
import AppIcon from "../Component/AppIcon";
import { SweetSuccess, SweetConfirm } from "../Component/SweetAlert";
import { useToast } from '../Library/use-toast';
import { ModeSelectionData } from "../Data/StaticData";
import ClientAPI from "../services/ClientApi";
import CryptoService from "../Security/useCrypto";
import ContextGate from "../Component/ContextGate";

const ModeSelection = () => {
  const dispatch = useDispatch();
  const [selectedMode, setSelectedMode] = useState(null);
  const [isProceeding, setIsProceeding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const activeClient = useSelector((state) => state.Auth?.Common?.SelectedClientCode);
  const activeClientContract = useSelector((state) => state.Auth?.Common?.SelectedClientContractCode);
  const selectedModeData = ModeSelectionData?.find((m) => m.id === selectedMode);

  useEffect(() => {
    if (activeClient) {
      fetchConfiguration();
    } else {
      setIsLoading(false);
    }
  }, []);

  const [configId, setConfigId] = useState(0);

  const fetchConfiguration = async () => {
    if (!activeClient) return;
    setIsLoading(true);
    try {
      const encryptedClientId = await CryptoService.encrypt(activeClient);
      const url = `/api/FormBuilder/GetClientServiceTypeConfigurationByClientId?ClientId=${encryptedClientId}`;
      const res = await ClientAPI(url, null, "GET", null, "normal");

      if (res?.data) {
        const decrypted = CryptoService.decrypt(res.data);
        if (decrypted?.Status && decrypted?.Result) {
          let parsedData = JSON.parse(decrypted.Result);
          if (parsedData && parsedData.length > 0) {
            const type = parsedData[0].ClientServiceType;
            if (parsedData[0].Id) setConfigId(parsedData[0].Id);
            if (type === 1 || type === 2) setSelectedMode(type);
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch configuration", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceed = async () => {
    if (!selectedMode) {
      toast({ title: "Validation Error", description: "Please select a data entry mode.", variant: "danger" });
      return;
    }
    if (!activeClient || !activeClientContract) {
      toast({ title: "Validation Error", description: "Active client and contract are required.", variant: "danger" });
      return;
    }

    SweetConfirm({
      title: "Confirm Selection",
      html: `Are you sure you want to proceed with <b>${selectedModeData?.name}</b>?`,
      icon: "warning",
      showCancel: true,
      confirmText: "Yes, Confirm",
      cancelText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsProceeding(true);

        try {
          const payload = {
            ClientId: activeClient,
            ClientContractId: activeClientContract,
            TeamId: 0, // Fallback if not selected
            ClientServiceType: selectedMode,
            IsActive: true
          };

          if (configId) payload.Id = configId;

          const encryptedPayload = await CryptoService.encrypt(payload);
          const res = await ClientAPI("/api/FormBuilder/UpsertClientServiceTypeConfiguration", encryptedPayload, "PUT");
          const decrypted = CryptoService.decrypt(res?.data);
          if (!decrypted?.Status) {
            toast({ title: "Error", description: decrypted?.Message, variant: "danger" });
            return;
          }
          if (decrypted?.Status) {
            toast({
              title: "Success",
              description: decrypted?.Message || `You have selected ${selectedModeData?.name}.`,
              variant: "success"
            });
            SweetSuccess({
              title: "Configuration Saved",
              text: decrypted?.Message || `You have selected ${selectedModeData?.name}.`,
            });
          } else {
            toast({
              title: "Error",
              description: decrypted?.Message || "Failed to save configuration.",
              variant: "danger"
            });
          }

        } catch (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "danger"
          });
        } finally {
          setIsProceeding(false);
        }
      }
    });

  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 animate-in fade-in duration-700">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="relative size-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex items-center justify-center">
            <div className="size-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center animate-bounce">
              <AppIcon name="Building2" size={24} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="absolute -bottom-1 -right-1 size-6 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center shadow-lg">
              <div className="size-2 bg-white rounded-full animate-ping"></div>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center space-y-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">Synchronizing Environment</h3>
          <div className="flex items-center gap-3 justify-center">
            <div className="h-1 w-12 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 animate-[loading-bar_1.5s_infinite]"></div>
            </div>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest">Fetching Configuration</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <ContextGate title="Data Processing Mode" icon="Settings" >
        <div className="sm:px-2 flex flex-col items-center">
          <div className="text-center mb-4 max-w-3xl">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Data Processing Mode
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Choose the workflow that matches your data readiness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {ModeSelectionData?.map((mode) => {
              const isSelected = selectedMode === mode.id;

              return (
                <div
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id)}
                  className={`relative flex flex-col cursor-pointer rounded-2xl border transition-all duration-200 overflow-hidden group hover:shadow-lg
                ${isSelected
                      ? `ring-2 ${mode.id === 1 ? 'ring-amber-500 bg-amber-50/30' : 'ring-indigo-500 bg-indigo-50/30'} shadow-xl border-transparent`
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300"
                    }`}
                >
                  {/* Header Stripe */}
                  <div className={`h-1.5 w-full ${mode.iconColor.replace('text-', 'bg-')}`}></div>

                  <div className="p-5 sm:p-6 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-700 ${mode.iconColor}`}>
                        <AppIcon name={mode.iconName} size={24} className="sm:w-7 sm:h-7" />
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {isSelected ? (
                          <CheckCircle className="text-indigo-600 drop-shadow-sm" size={20} />
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-slate-200 dark:border-slate-600 group-hover:border-indigo-300 transition-colors" />
                        )}
                        {mode.badge && (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wide border ${mode.id === 1
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            }`}>
                            {mode.badge}
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">{mode.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                      {mode.description}
                    </p>

                    {/* Spacer to push content down if needed, or just let it flow naturally */}
                    <div className="flex-grow"></div>

                    {/* Compact Metrics */}
                    <div className="grid grid-cols-2 gap-3 text-xs mb-4 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/50">
                      <div className="col-span-2 sm:col-span-1">
                        <span className="text-slate-400 block mb-1 font-medium uppercase tracking-wider text-[10px]">Processing</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200 block text-pretty leading-snug">{mode.processing}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-1 font-medium uppercase tracking-wider text-[10px]">Data Type</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200 block leading-snug">{mode.dataType}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-1 font-medium uppercase tracking-wider text-[10px]">Turnaround</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200 block">{mode.turnaroundTime}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-1 font-medium uppercase tracking-wider text-[10px]">Best For</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200 block truncate" title={mode.recommendedFor}>{mode.recommendedFor}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-[10px] sm:text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">What you get</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {mode.features.map((f, i) => (
                          <span key={i} className="flex items-center text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                            <CheckCircle size={14} className={`mr-2 flex-shrink-0 ${mode.iconColor}`} />
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 w-full sticky bottom-4 z-10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-xl ring-1 ring-slate-900/5">
              <div className="text-center sm:text-left flex-1 min-w-0 w-full sm:w-auto">
                {selectedModeData ? (
                  <div className="flex items-start gap-3">
                    <div className="hidden sm:block mt-1 flex-shrink-0">
                      <AppIcon name="Info" size={20} className="text-indigo-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">Implication: {selectedModeData.name}</p>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-snug line-clamp-1">{selectedModeData.meaning}</p>
                    </div>
                  </div>
                ) : (
                  <span className="text-sm text-slate-400 italic flex items-center justify-center sm:justify-start gap-2">
                    <AppIcon name="AlertCircle" size={16} />
                    Please select a processing mode to continue
                  </span>
                )}
              </div>
              <Button
                size="md"
                disabled={!selectedMode || isProceeding}
                onClick={handleProceed}
                className="w-full md:w-auto px-6 py-2 shadow-lg text-sm sm:text-base h-10 sm:h-auto"
              >
                {isProceeding ? "Saving..." : "Update"}
              </Button>
            </div>
          </div>
        </div>
      </ContextGate>
    </>
  );
};

export default ModeSelection;
