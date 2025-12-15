import DynamicForm from "../Component/DynamicForm";

const LeaveForm = () => {
  const handleSuccess = (data) => {
    console.log("Leave application submitted successfully:", data);
    // Handle success (e.g., show success message, redirect, etc.)
  };

  const handleCancel = () => {
    console.log("Form cancelled");
    // Handle cancel (e.g., redirect back)
  };

  return (
    <DynamicForm
      module="leave"
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  );
};

export default LeaveForm;
