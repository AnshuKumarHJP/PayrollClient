import clsx from "clsx";

/**
 * Supports:
 * - input / textarea
 * - label
 * - error state
 * - helper text
 * - disabled
 * - grouped inputs (side-by-side)
 */

const baseWrapper = "flex flex-col gap-1";
const labelStyle = "text-p11 font-medium text-gray-500";

const baseInput =
  "w-full rounded-md border px-3 py-2 text-p font-regular outline-none transition-all " +
  "placeholder:text-lightGray-500 disabled:bg-lightGray-100 disabled:cursor-not-allowed";

const states = {
  default:
    "border-strokeGray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-100",
  error:
    "border-danger focus:border-danger focus:ring-2 focus:ring-danger/20",
};

const errorText = "text-p10 text-danger mt-0.5";

 function Input({
  label,
  error,
  helperText,
  className,
  ...props
}) {
  return (
    <div className={baseWrapper}>
      {label && <label className={labelStyle}>{label}</label>}
      <input
        className={clsx(
          baseInput,
          error ? states.error : states.default,
          className
        )}
        {...props}
      />
      {error && <span className={errorText}>{error}</span>}
      {!error && helperText && (
        <span className="text-p10 text-gray-400">{helperText}</span>
      )}
    </div>
  );
}

Input.displayName = "Input";
export { Input };
export default Input;
