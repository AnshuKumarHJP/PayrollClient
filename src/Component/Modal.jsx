// Modal.jsx — CENTERED, OPTIMIZED, FRAMER-SAFE
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppIcon from "./AppIcon";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from "../Library/tooltip";

/* ───────────────────────────────
   MODAL MODES (NO TRANSFORM CENTERING)
   ─────────────────────────────── */
const MODES = {
  normal: {
    wrapper: "fixed inset-0 flex items-center justify-center",
    size: "w-[90%] max-w-4xl h-[80%] rounded-xl"
  },
  fullscreen: {
    wrapper: "fixed inset-0",
    size: "w-screen h-screen rounded-none"
  },
  minimized: {
    wrapper: "fixed bottom-4 right-4",
    size: "w-80 h-14 rounded-lg"
  }
};

export default function Modal({
  isOpen,
  onClose,

  Header,     // JSX | (ctx) => JSX
  Body,       // JSX | (ctx) => JSX
  Footer,     // JSX | (ctx) => JSX

  title = "Modal",
  children
}) {
  const [mode, setMode] = useState("normal");
  const layout = MODES[mode];

  const ctx = { mode, setMode, onClose };
  const renderNode = (node) =>
    typeof node === "function" ? node(ctx) : node;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* OVERLAY */}
          {mode !== "minimized" && (
            <motion.div
              className="fixed inset-0 bg-black/40 z-[1001]"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}

          {/* MODAL WRAPPER (CENTER CONTROL) */}
          <motion.div
            className={`${layout.wrapper} z-[1002]`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* MODAL BOX */}
            <motion.div
              layout
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.96 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`
                bg-white shadow-xl flex flex-col overflow-hidden
                ${layout.size}
              `}
            >
              {/* ───────── HEADER (STATIC) ───────── */}
              <div className="shrink-0 relative border-b bg-gray-100">
                <div className={`${mode === "minimized" ? "p-4" : ""}`}>
                  {Header && mode !== "minimized" ? (
                    renderNode(Header)
                  ) : (
                    <span className="font-semibold text-sm truncate block">
                      {title}
                    </span>
                  )}
                </div>

                {/* HEADER ACTIONS */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-3">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AppIcon
                          onClick={() => setMode("minimized")}
                          name="Minus"
                          size={18}
                          className="cursor-pointer"
                        />
                      </TooltipTrigger>
                      <TooltipContent>Minimize</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AppIcon
                          onClick={() =>
                            setMode(mode === "fullscreen" ? "normal" : "fullscreen")
                          }
                          name={mode === "fullscreen" ? "Minimize2" : "Expand"}
                          size={14}
                          className="cursor-pointer"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        {mode === "fullscreen" ? "Restore" : "Maximize"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AppIcon
                          onClick={onClose}
                          name="X"
                          size={18}
                          className="cursor-pointer"
                        />
                      </TooltipTrigger>
                      <TooltipContent>Close</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              {/* ───────── BODY (SCROLLABLE) ───────── */}
              {mode !== "minimized" && (
                <div className="flex-1 overflow-auto">
                  {Body ? renderNode(Body) : children}
                </div>
              )}

              {/* ───────── FOOTER (STATIC) ───────── */}
              {mode !== "minimized" && Footer && (
                <div className="shrink-0 border-t bg-gray-50">
                  {renderNode(Footer)}
                </div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
