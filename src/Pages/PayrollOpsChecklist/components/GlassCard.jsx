import React from 'react';

const GlassCard = ({ children, className = "", onClick, hoverable = false }) => (
    <div
        onClick={onClick}
        className={`
      relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/90 dark:border-slate-800/80
      rounded-[24px] shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04),0_10px_30px_-5px_rgba(0,0,0,0.08)]
      ${hoverable ? "cursor-pointer transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] hover:-translate-y-1 hover:border-white/100 dark:hover:border-slate-700" : ""}
      ${className}
    `}
    >
        {children}
    </div>
);

export default GlassCard;
