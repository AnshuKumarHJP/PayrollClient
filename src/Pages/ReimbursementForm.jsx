import { useCallback, useEffect, useState } from "react";
import { reimbursementService } from "../../api/services/reimbursementService";
import PageBuilder from "./Builder/PageBuilder";
import { useToast } from "../Lib/use-toast";

const ReimbursementForm = () => {
  const [ReimbursementData, setReimbursementData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState(null); // null | "success" | "error"
  const { toast } = useToast();

  /* ----------------------------------------------
       LOAD TABLE DATA
  ---------------------------------------------- */
  const loadTable = useCallback(async () => {
    try {
      setLoading(true);
      const res = await reimbursementService.getAll();
      setReimbursementData(res || []);
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
      await reimbursementService.create(record);
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
      await reimbursementService.update(id, data);
      await loadTable();
      return true;
    } catch (err) {
      console.error("Update failed:", err);
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
  setApiStatus("success");
};


  return (
    <div className="p-4">
      {/* PAGE BUILDER */}
      <PageBuilder
        moduleName="Onboarding"
        templateId="5"
        rows={ReimbursementData}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onRefresh={loadTable}
        onBulkSuccess={handleBulkSuccess}
        AddMore={true}
      />
    </div>
  );
};

export default ReimbursementForm;
