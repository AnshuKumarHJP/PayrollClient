import React from "react";
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

const Configuration = () => {
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

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings size={24} />
        <h1 className="text-2xl font-bold">Configuration</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {configItems.map((item, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    {item.icon}
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    item.status === "Available"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{item.description}</p>
              {item.subItems && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Includes:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {item.subItems.map((subItem, subIndex) => (
                      <li key={subIndex} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        {subItem}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {item.status === "Available" ? (
                <Link to={item.path}>
                  <Button className="w-full">
                    Access Configuration
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" className="w-full" disabled>
                  Coming Soon
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Configuration;
