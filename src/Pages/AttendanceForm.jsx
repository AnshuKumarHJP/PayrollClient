import DynamicForm from "../Component/DynamicForm";

const AttendanceForm = () => {
  const handleSuccess = (data) => {
    console.log("Attendance submitted successfully:", data);
    // Handle success (e.g., show success message, redirect, etc.)
  };

  const handleCancel = () => {
    console.log("Form cancelled");
    // Handle cancel (e.g., redirect back)
  };

  return (
    <DynamicForm
      module="Attendance"
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  );
};

export default AttendanceForm;
