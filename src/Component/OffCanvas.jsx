// OffCanvas.jsx
import { Fragment } from "react";
import AppIcon from "./AppIcon";

const POSITION = {
    left: {
        base: "left-0 top-0 h-full w-72",
        closed: "-translate-x-full",
        open: "translate-x-0"
    },
    right: {
        base: "right-0 top-0 h-full w-72",
        closed: "translate-x-full",
        open: "translate-x-0"
    },
    top: {
        base: "top-0 left-0 w-full h-72",
        closed: "-translate-y-full",
        open: "translate-y-0"
    },
    bottom: {
        base: "bottom-0 left-0 w-full h-72",
        closed: "translate-y-full",
        open: "translate-y-0"
    }
};

export default function OffCanvas({
    isOpen,          // controlled by parent
    onClose,         // parent callback
    position = "left",
    size,            // optional override (w-96 / h-80)
    showClose = true,
    title,
    children
}) {
    const cfg = POSITION[position];

    return (
        <Fragment>
            {/* Overlay */}
            <div
                onClick={onClose}
                className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300
        ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
            />

            {/* Panel */}
            <div
                className={`fixed z-50 bg-white rounded-l-2xl shadow-xl transform transition-transform duration-300 
                 ${cfg.base} ${size ?? ""} 
                 ${isOpen ? cfg.open : cfg.closed}`}
            >
                {/* Header with Close Button */}
                {showClose && (
                    <button
                        onClick={onClose}
                        className="absolute right-2 top-2 rounded p-1 text-gray-500 hover:bg-red-500 hover:text-white transition"
                        aria-label="Close"
                    >
                        <AppIcon name="X" size={20} />
                    </button>
                )}

                {/* Content */}
                <div className="overflow-auto">
                    {children}
                </div>
            </div>
        </Fragment>
    );
}
