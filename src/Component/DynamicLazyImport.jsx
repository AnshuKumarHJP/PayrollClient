import React, { lazy, Suspense, useMemo } from "react";
import Loading from "./Loading";

// Vite scans everything under src/
const modules = import.meta.glob("/src/**/*.jsx");

// Cache for lazy-loaded modules
const componentCache = new Map();

export default function DynamicLazyImport({ path, ...props }) {
  if (!path) return null;


  // Normalize path once
  const normalizedPath = useMemo(() => {
    let fixed = path.replace(/^\.\.\//, ""); 
    fixed = fixed.replace(/^src\//, "");
    return "/src/" + fixed;
  }, [path]);

  // If module not found
  if (!modules[normalizedPath]) {
    return (
      <div className="p-4 text-red-600">
        Component not found: {normalizedPath}
      </div>
    );
  }

  // ✔ Lazy cache → prevents re-import + prevents double network load
  const Component = useMemo(() => {
    if (!componentCache.has(normalizedPath)) {
      componentCache.set(normalizedPath, lazy(modules[normalizedPath]));
    }
    return componentCache.get(normalizedPath);
  }, [normalizedPath]);

  return (
    <Suspense fallback={<Loading />}>
      <Component {...props} />
    </Suspense>
  );
}
