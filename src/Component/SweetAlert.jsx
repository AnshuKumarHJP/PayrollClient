// SweetAlert.jsx
// ✅ Custom SweetAlert2 Wrapper with multiple reusable components

import Swal from "sweetalert2";
import AppIcon from "./AppIcon";

const MySwal = Swal;

/* --------------------------------------------------
   BASE ALERT (internal)
-------------------------------------------------- */
const fireAlert = ({
  title,
  text,
  html,
  icon,
  confirmText = "OK",
  cancelText = "Cancel",
  showCancel = false,
  onConfirm,
  onCancel,
  ...rest
}) => {
  return MySwal.fire({
    title,
    text,
    html,
    icon,
    showCancelButton: showCancel,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    customClass: {
      popup: "rounded-xl",
      confirmButton:
        "bg-blue-600 text-white px-4 py-2 rounded mr-2",
      cancelButton:
        "bg-gray-200 text-gray-700 px-4 py-2 rounded"
    },
    buttonsStyling: false,
    ...rest
  }).then((result) => {
    if (result.isConfirmed && onConfirm) onConfirm(result);
    if (result.isDismissed && onCancel) onCancel(result);
    return result;
  });
};

/* --------------------------------------------------
   COMPONENTS
-------------------------------------------------- */

// ✅ Success Alert
export const SweetSuccess = (props) =>
  fireAlert({
    icon: "success",
    title: "Success",
    ...props
  });

// ✅ Error Alert
export const SweetError = (props) =>
  fireAlert({
    icon: "error",
    title: "Error",
    ...props
  });

// ✅ Warning / Confirm Alert
export const SweetConfirm = (props) =>
  fireAlert({
    icon: "warning",
    showCancel: true,
    confirmText: "Yes",
    cancelText: "No",
    ...props
  });

// ✅ Info Alert
export const SweetInfo = (props) =>
  fireAlert({
    icon: "info",
    title: "Information",
    ...props
  });

// ✅ Custom Alert (text-based)
export const SweetCustom = ({
  title,
  text,
  ...props
}) =>
  fireAlert({
    title,
    text,
    ...props
  });

// ✅ Loading Alert
export const SweetLoading = ({
  title = "Processing...",
  text = "Please wait"
}) => {
  MySwal.fire({
    title,
    text,
    allowOutsideClick: false,
    didOpen: () => {
      MySwal.showLoading();
    }
  });
};

// ✅ Close Alert
export const SweetClose = () => MySwal.close();

/* --------------------------------------------------
   EXPORT DEFAULT API (OPTIONAL)
-------------------------------------------------- */
export default {
  success: SweetSuccess,
  error: SweetError,
  info: SweetInfo,
  confirm: SweetConfirm,
  custom: SweetCustom,
  loading: SweetLoading,
  close: SweetClose
};
