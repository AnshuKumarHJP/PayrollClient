import clsx from "clsx";

/**
 * Supports:
 * - textarea input
 * - label
 * - error state
 * - helper text
 * - disabled
 * - dark mode
 * - accessibility attributes
 */

const baseWrapper = "flex flex-col gap-1";
const labelStyle = "text-p11 font-medium text-gray-500 dark:text-gray-400";

const baseInput =
    "w-full rounded-md border px-3 py-2 text-p font-regular outline-none transition-all " +
    "placeholder:text-lightGray-500 dark:placeholder:text-gray-500 " +
    "disabled:bg-lightGray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed " +
    "bg-white dark:bg-slate-800 text-gray-900 dark:text-white";

const states = {
    default:
        "border-strokeGray-500 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-400 " +
        "focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/50",
    error:
        "border-danger dark:border-red-500 focus:border-danger dark:focus:border-red-500 " +
        "focus:ring-2 focus:ring-danger/20 dark:focus:ring-red-900/50",
};

const errorText = "text-p10 text-danger dark:text-red-400 mt-0.5";

function Textarea({
    label,
    error,
    rows = 4,
    className,
    "data-testid": dataTestId,
    ...props
}) {
    const textareaId = props.id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={baseWrapper} data-testid={dataTestId ? `${dataTestId}-wrapper` : undefined}>
            {label && (
                <label
                    htmlFor={textareaId}
                    className={labelStyle}
                    data-testid={dataTestId ? `${dataTestId}-label` : undefined}
                >
                    {label}
                </label>
            )}
            <textarea
                id={textareaId}
                rows={rows}
                className={clsx(
                    baseInput,
                    "resize-none",
                    error ? states.error : states.default,
                    className
                )}
                aria-invalid={error ? "true" : undefined}
                aria-describedby={error ? `${textareaId}-error` : undefined}
                data-testid={dataTestId}
                {...props}
            />
            {error && (
                <span
                    id={`${textareaId}-error`}
                    className={errorText}
                    data-testid={dataTestId ? `${dataTestId}-error` : undefined}
                    role="alert"
                    aria-live="polite"
                >
                    {error}
                </span>
            )}
        </div>
    );
}

export default Textarea;
export { Textarea };
