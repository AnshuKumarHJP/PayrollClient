import React, { lazy, Suspense } from "react";
import Loading from './Loading'

// ⭐ Scan ALL pages and subfolders inside /src/Pages
const modules = import.meta.glob("/src/**/*.jsx");

export default function DynamicLazyImport({ path }) {
  if (!path) return null;

  // Normalize path → convert "../Builder/Page.jsx" → "/src/Pages/Builder/Page.jsx"
  const normalized =
    "/src/" + path.replace("../", "").replace(/^src\//, "");

  // If path not found
  if (!modules[normalized]) {
    return (
      <div className="p-4 text-red-600">
        Component not found: {normalized}
      </div>
    );
  }

  const Component = lazy(modules[normalized]);

  return (
    <Suspense fallback={<Loading/>}>
      <Component />
    </Suspense>
  );
}