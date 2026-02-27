import React from "react";
import { motion } from "framer-motion";

const PageLoading = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[500px] w-full p-8 bg-transparent">
            <div className="relative w-full mx-auto flex flex-col items-center">

                {/* ADVANCED SPINNER CONTAINER */}
                <div className="relative h-32 w-32 mb-5">
                    {/* Outer Glow Ring */}
                    <motion.div
                        className="absolute inset-0 rounded-3xl border-2 border-primary-500/10"
                        animate={{
                            rotate: 360,
                            scale: [1, 1.05, 1],
                            borderRadius: ["30%", "50%", "30%"]
                        }}
                        transition={{
                            rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                            borderRadius: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                        }}
                    />

                    {/* Middle Gradient Ring */}
                    <motion.div
                        className="absolute inset-4 rounded-full border-[3px] border-transparent border-t-primary-500 border-l-primary-500/30"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Inner Core */}
                    <div className="absolute inset-10 flex items-center justify-center">
                        <motion.div
                            className="h-3 w-3 rounded-full bg-primary-600 shadow-[0_0_15px_rgba(31,25,94,0.5)]"
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.3, 1, 0.3]
                            }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </div>

                    {/* Floating Orbits */}
                    {[0, 120, 240].map((angle, i) => (
                        <motion.div
                            key={i}
                            className="absolute top-1/2 left-1/2 h-1.5 w-1.5 rounded-full bg-indigo-400"
                            animate={{
                                rotate: [angle, angle + 360],
                                x: [Math.cos(angle * Math.PI / 180) * 45, Math.cos((angle + 360) * Math.PI / 180) * 45],
                                y: [Math.sin(angle * Math.PI / 180) * 45, Math.sin((angle + 360) * Math.PI / 180) * 45],
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        />
                    ))}
                </div>

                {/* TEXT CONTENT WITH SEQUENTIAL ANIMATION */}
                <div className="text-center space-y-3 z-10">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white"
                    >
                        Syncing <span className="text-primary-600">Workspace</span>
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 font-medium"
                    >
                        <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs uppercase tracking-[0.2em]">Secure Connection Active</span>
                    </motion.div>
                </div>

                {/* PREMIUM SKELETON PREVIEW */}
                <div className="mt-16 w-full overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm p-6 shadow-2xl shadow-slate-200/50 dark:shadow-none">
                    <div className="space-y-6">
                        {/* Header Skeleton */}
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
                            <div className="space-y-2 flex-1">
                                <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
                                <div className="h-2 w-1/4 bg-slate-100 dark:bg-slate-800/50 rounded-full animate-pulse" />
                            </div>
                        </div>

                        {/* Form Body Skeleton */}
                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="space-y-2">
                                    <div className="h-2 w-20 bg-slate-100 dark:bg-slate-800/50 rounded-full animate-pulse" />
                                    <div className="h-9 bg-slate-200/60 dark:bg-slate-800 rounded-lg animate-pulse" />
                                </div>
                            ))}
                        </div>

                        {/* Button Skeleton */}
                        <div className="flex justify-end pt-2">
                            <div className="h-10 w-28 bg-primary-500/20 dark:bg-primary-500/10 rounded-lg animate-pulse" />
                        </div>
                    </div>

                    {/* Shimmer Effect Overlay */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <motion.div
                            className="h-full w-full bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent"
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                </div>

                {/* FOOTER TIP */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ delay: 1 }}
                    className="mt-8 text-[10px] uppercase tracking-widest text-slate-400 font-bold"
                >
                    Hardware acceleration enabled
                </motion.p>
            </div>
        </div>
    );
};

export default PageLoading;
