import { useState, useEffect, useCallback } from "react";

import { onboardingService } from "../../api/services/onboardingService";
import PageBuilder from "./Builder/PageBuilder";
import { useToast } from "../Lib/use-toast";

const OnboardingForm = () => {
  /* ----------------------------------------------
       STATES
  ---------------------------------------------- */
  const [onboardingData, setOnboardingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  /* ----------------------------------------------
       LOAD TABLE DATA
  ---------------------------------------------- */
  const loadTable = useCallback(async () => {
    try {
      setLoading(true);
      const res = await onboardingService.getAll();
      setOnboardingData(res || []);
    } catch (err) {
      console.error("Load table failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTable();
  }, [loadTable]);

  /* ----------------------------------------------
       CREATE HANDLER
  ---------------------------------------------- */
const handleCreate = async (data) => {
  try {
    console.log("Incoming Data:", data);

    // If the user created only 1 record (not array)
    const records = Array.isArray(data) ? data : [data];

    // Save each onboarding record one-by-one
    for (const record of records) {
      await onboardingService.create(record);
    }

    await loadTable();

    toast({
      title: "Onboarding Saved",
      description: `${records.length} record(s) saved successfully.`,
      duration: 4000
    });

    return true;
  } catch (err) {
    console.error("Create failed:", err);

    toast({
      title: "Error",
      description: "Failed to create onboarding records.",
      duration: 4000,
      variant: "destructive"
    });

    return false;
  }
};


  /* ----------------------------------------------
       UPDATE HANDLER
  ---------------------------------------------- */
  const handleUpdate = async (id, data) => {
    try {
      await onboardingService.update(id, data);
      await loadTable();
     toast({ title: "Onboarding Updated", description: "The onboarding record has been updated successfully.", duration: 4000 });
      return true;
    } catch (err) {
      console.error("Update failed:", err);
      toast({ title: "Error", description: "Failed to update onboarding record.", duration: 4000, variant: "destructive" });
      return false;
    }
  };

  /* ----------------------------------------------
       BULK UPLOAD SUCCESS HANDLER
  ---------------------------------------------- */
  const handleBulkSuccess = async (bulkData) => {
  console.log("Bulk Upload Returned:", bulkData);
  // Refresh UI
  await loadTable();
};

  /* ----------------------------------------------
       UI
  ---------------------------------------------- */
  return (
    <div className="p-4">
      {/* PAGE BUILDER */}
      <PageBuilder
        moduleName="Onboarding"
        templateId="cbf2"
        rows={onboardingData}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onRefresh={loadTable}
        onBulkSuccess={handleBulkSuccess}
        AddMore={true}
      />
    </div>
  );
};

export default OnboardingForm;
