import DynamicForm from "../Component/DynamicForm";

const LoanForm = () => {
  const handleSuccess = (data) => {
    console.log("Loan application submitted successfully:", data);
    // Handle success (e.g., show success message, redirect, etc.)
  };

  const handleCancel = () => {
    console.log("Form cancelled");
    // Handle cancel (e.g., redirect back)
  };

  return (
    <DynamicForm
      module="loans"
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  );
};

export default LoanForm;
