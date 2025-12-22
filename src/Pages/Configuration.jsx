import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../Lib/card";
import { Button } from "../Lib/button";
import {
  Settings,
  Users,
  Menu,
  FileText,
  Wrench,
  ShieldCheck,
  Link as LinkIcon,
  Database,
  ArrowRightLeft,
  Calendar,
  Building,
  RulerDimensionLine,
} from "lucide-react";
import AppIcon from "../Component/AppIcon";
import DynamicLazyImport from "../Component/DynamicLazyImport";


const configItemsNew = [
  { key: "role", title: "Role", icon: "Users", PagePath: "../Pages/Builder/TemplateList.jsx" },
  { key: "menu-setting", title: "Menu Setting", icon: "Menu", PagePath: "../Pages/Builder/TemplateList.jsx" },
  { key: "templates", title: "Form / Excel Templates", icon: "FileText", PagePath: "../Pages/Builder/TemplateList.jsx" },
  { key: "templates-preview", title: "Template Preview", icon: "FileText", PagePath: "../Pages/Builder/TemplateList.jsx" },
  { key: "rule-types", title: "Validation Rule Types", icon: "ShieldCheck", PagePath: "../Pages/Builder/TemplateList.jsx" },
  { key: "mapping-inputs", title: "Mapping Payroll Inputs to Clients", icon: "ArrowRightLeft", PagePath: "../Pages/Builder/TemplateList.jsx" },
  { key: "payroll-period", title: "Payroll Period", icon: "Calendar", PagePath: "../Pages/Builder/TemplateList.jsx" },
  { key: "inputs-config", title: "Inputs Configuration", icon: "Database", PagePath: "../Pages/Builder/TemplateList.jsx" },
  { key: "client-setup", title: "Client Setup", icon: "Building", PagePath: "../Pages/Builder/TemplateList.jsx" },
];

const Configuration = () => {

  const [activeMenu, setActiveMenu] = useState(configItemsNew[0].key);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeItem = configItemsNew.find((x) => x.key === activeMenu);


  const configItems = [
    {
      title: "Role",
      description: "Manage user roles and permissions",
      icon: <Users size={24} />,
      path: "/config/role",
      status: "Coming Soon",
    },
    {
      title: "Menu Setting",
      description: "Configure menu options and navigation",
      icon: <Menu size={24} />,
      path: "/config/menu-setting",
      status: "Coming Soon",
    },
    {
      title: "Form / Excel Templates",
      description: "Manage input templates for data collection",
      icon: <FileText size={24} />,
      path: "/config/templates",
      status: "Available",
    },
    {
      title: "Template Preview",
      description: "Preview Excel templates before use",
      icon: <FileText size={24} />,
      path: "/config/templates/preview",
      status: "Available",
    },
    {
      title: "Validation Rule Types",
      description: "Manage different types of validation rules",
      icon: <ShieldCheck size={24} />,
      path: "/config/rule-types",
      status: "Available",
    },

    {
      title: "Mapping Payroll Inputs to Clients",
      description: "Map input configurations to clients",
      icon: <ArrowRightLeft size={24} />,
      path: "/config/mapping-inputs-clients",
      status: "Available",
    },
    {
      title: "Payroll Period",
      description: "Set up payroll processing periods",
      icon: <Calendar size={24} />,
      path: "/config/payroll-period",
      status: "Coming Soon",
    },
    {
      title: "Inputs Configuration",
      description: "Configure inputs for Onboarding, Payroll, and Loan",
      icon: <Database size={24} />,
      path: "/config/inputs-config",
      status: "Coming Soon",
      subItems: ["Onboarding", "Payroll", "Loan"],
    },
    {
      title: "Client Setup",
      description: "Configure client settings (Standard/Custom Mode)",
      icon: <Building size={24} />,
      path: "/modes",
      status: "Available",
      subItems: ["Standard Mode", "Custom Mode"],
    },
  ];

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

        <button
          className="md:hidden p-2 bg-emerald-600 text-white rounded-lg shadow"
          onClick={() => setMobileMenuOpen(true)}
        >
          <AppIcon name="Menu" />
        </button>
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
        <div className="border shadow-md rounded-xl bg-white overflow-hidden max-h-[80vh] overflow-y-auto">
          <MenuList />
        </div>

        {/* RIGHT CONTENT */}
        <div className="bg-white shadow rounded-xl p-4 min-h-[250px] overflow-y-auto">
          <DynamicLazyImport path={activeItem.PagePath} />
        </div>
      </div>

      {/* MOBILE CONTENT */}
      <div className="md:hidden mt-4 bg-white shadow rounded-xl p-4 min-h-[150px]">
        <DynamicLazyImport path={activeItem.PagePath} />
      </div>
    </div>

    </>

  );
};

export default Configuration;
