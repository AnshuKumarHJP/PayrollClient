import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../Lib/card";
import { Button } from "../Lib/button";
import {
  Settings,
  X,
} from "lucide-react";
import AppIcon from "../Component/AppIcon";
import DynamicLazyImport from "../Component/DynamicLazyImport";

// Dynamic lazy loading for edit components
const EditComponent = ({ path, id, onSave, onCancel }) => {
  const LazyComponent = React.lazy(() => import(path));
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <LazyComponent
        id={id}
        onSave={onSave}
        onCancel={onCancel}
      />
    </React.Suspense>
  );
};


const configItemsNew = [
  { key: "templates", title: "Form / Excel Templates", icon: "FileText", PagePath: "../Pages/Builder/TemplateList.jsx", PageEditPath: "../Pages/Builder/TemplateEdit.jsx" },
  { key: "templates-preview", title: "Template Preview", icon: "FileText", PagePath: "../Pages/Builder/ExcelTemplatePreview.jsx", PageEditPath: "../Pages/Builder/TemplateEdit.jsx" },
  { key: "rule-types", title: "Validation Rule Types", icon: "ShieldCheck", PagePath: "../Pages/RuleTypesManagement.jsx", PageEditPath: "../Pages/RuleTypesManagement.jsx" },
  { key: "mapping-inputs", title: "Mapping Payroll Inputs to Clients", icon: "ArrowRightLeft", PagePath: "../Pages/PayrollInputMapping.jsx", PageEditPath: "../Pages/Builder/TemplateEdit.jsx" },
  { key: "payroll-period", title: "Payroll Period", icon: "Calendar", PagePath: "../Pages/Builder/TemplateList.jsx", PageEditPath: "../Pages/Builder/TemplateEdit.jsx" },
  { key: "inputs-config", title: "Inputs Configuration", icon: "Database", PagePath: "../Pages/Builder/TemplateList.jsx", PageEditPath: "../Pages/Builder/TemplateEdit.jsx" },
  { key: "client-setup", title: "Client Setup", icon: "Building", PagePath: "../Pages/Builder/TemplateList.jsx", PageEditPath: "../Pages/Builder/TemplateEdit.jsx" },
  { key: "config", title: "Configuration Menu", icon: "Settings2", PagePath: "../Pages/ConfigurationPage.jsx", PageEditPath: "../Pages/ConfigurationPage.jsx" },
];

const Configuration = () => {

  const [searchParams, setSearchParams] = useSearchParams();
  const [activeMenu, setActiveMenu] = useState(configItemsNew[0].key);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAddEditMode, setIsAddEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const activeItem = configItemsNew.find((x) => x.key === activeMenu);

  // Handle URL params for add/edit mode
  useEffect(() => {
    const mode = searchParams.get('mode');
    const id = searchParams.get('id');
    if (mode === 'add' || mode === 'edit') {
      setIsAddEditMode(true);
      setCurrentItem(id ? { id: parseInt(id) } : null);
    } else {
      setIsAddEditMode(false);
      setCurrentItem(null);
    }
  }, [searchParams]);

  const MenuList = () => (
    <div>
      {configItemsNew.map((item) => (
        <div
          key={item.key}
          onClick={() => {
            setActiveMenu(item.key);
            setMobileMenuOpen(false);
          }}
          className={`p-3 flex justify-between items-center border-b cursor-pointer transition-all
            ${
              activeMenu === item.key
                ? "bg-emerald-100 border-l-4 border-l-emerald-600"
                : "hover:bg-emerald-50"
            }
          `}
        >
          <div className="flex items-center gap-2">
            <AppIcon size={15} name={item.icon} className="text-emerald-600" />
            <p className="font-semibold text-xs md:text-sm">{item.title}</p>
          </div>
          <AppIcon name="MoveRight" size={16} />
        </div>
      ))}
    </div>
  );

  return (
    <>
     <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Settings size={20} />
          <h1 className="md:text-xl font-bold">Configuration</h1>
        </div>

        <div className="flex items-center gap-2">
          {isAddEditMode && (
            <Button
              variant="outline"
              onClick={() => {
                setIsAddEditMode(false);
                setCurrentItem(null);
              }}
            >
              <X size={16} className="mr-2" />
              Cancel
            </Button>
          )}
          <button
            className="md:hidden p-2 bg-emerald-600 text-white rounded-lg shadow"
            onClick={() => setMobileMenuOpen(true)}
          >
            <AppIcon name="Menu" />
          </button>
        </div>
      </div>

      {/* MOBILE OVERLAY */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* MOBILE DRAWER */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 p-1 
          transform transition-transform duration-300 md:hidden
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <button
          className="absolute top-3 right-3 p-2 bg-gray-200 rounded-full"
          onClick={() => setMobileMenuOpen(false)}
        >
          <AppIcon name="X" />
        </button>

        <div className="mt-10 space-y-1"><MenuList /></div>
      </div>

      {/* DESKTOP LAYOUT */}
      <div className="hidden md:grid grid-cols-[280px_1fr] gap-3">

        {/* LEFT SIDEBAR */}
        <div className="border shadow-sm rounded-xl bg-white overflow-hidden max-h-[80vh] overflow-y-auto">
          <MenuList />
        </div>

        {/* RIGHT CONTENT */}
        <div className="bg-white shadow rounded-xl p-4 min-h-[250px] overflow-y-auto">
          {isAddEditMode ? (
            <EditComponent
              path={activeItem.PageEditPath}
              id={currentItem?.id}
              onSave={() => {
                setIsAddEditMode(false);
                setCurrentItem(null);
                // Clear URL params
                setSearchParams({});
              }}
              onCancel={() => {
                setIsAddEditMode(false);
                setCurrentItem(null);
                // Clear URL params
                setSearchParams({});
              }}
            />
          ) : (
            <DynamicLazyImport
              path={activeItem.PagePath}
              onAddEditMode={(mode, item) => {
                setIsAddEditMode(mode);
                setCurrentItem(item);
              }}
            />
          )}
        </div>
      </div>

      {/* MOBILE CONTENT */}
      <div className="md:hidden mt-4 bg-white shadow rounded-xl p-4 min-h-[150px]">
        {isAddEditMode ? (
          <EditComponent
            path={activeItem.PageEditPath}
            id={currentItem?.id}
            onSave={() => {
              setIsAddEditMode(false);
              setCurrentItem(null);
            }}
            onCancel={() => {
              setIsAddEditMode(false);
              setCurrentItem(null);
            }}
          />
        ) : (
          <DynamicLazyImport
            path={activeItem.PagePath}
            onAddEditMode={(mode, item) => {
              setIsAddEditMode(mode);
              setCurrentItem(item);
            }}
          />
        )}
      </div>
    </div>

    </>

  );
};

export default Configuration;
