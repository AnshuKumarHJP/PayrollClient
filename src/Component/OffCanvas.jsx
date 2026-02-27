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
                className={`fixed z-50 bg-white rounded-l-2xl shadow-xl transform transition-transform duration-300 flex flex-col
                 ${cfg.base} ${size ?? ""} 
                 ${isOpen ? cfg.open : cfg.closed}`}
            >
                {/* Header with Close Button */}
                {showClose && (
                    <div className="absolute right-2 top-2 z-10">
                        <button
                            onClick={onClose}
                            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
                            aria-label="Close"
                        >
                            <AppIcon name="X" size={20} />
                        </button>
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
                    {children}
                </div>
            </div>
        </Fragment>
    );
}
