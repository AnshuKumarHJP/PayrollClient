/* =========================
   Toaster.jsx (FINAL)
   ========================= */
import { useToast } from "./use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastIcon,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./Toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, variant, size, ...props }) => (
        <Toast key={id} variant={variant} size={size} {...props}>
          <ToastIcon variant={variant} />

          <div className="flex-1 grid gap-0.5">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && (
              <ToastDescription>{description}</ToastDescription>
            )}
          </div>

          <ToastClose />
        </Toast>
      ))}

      <ToastViewport />
    </ToastProvider>
  );
}
