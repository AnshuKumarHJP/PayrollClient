import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../Lib/card";
import { Button } from "../Lib/button";
import { Upload, History, Users } from "lucide-react";

import { templateService } from "../../api/services/templateService";

const InputModule = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  // ----------------------------------------------------
  // LOAD TEMPLATES FROM API
  // ----------------------------------------------------
  useEffect(() => {
  const load = async () => {
    try {
      setLoading(true);
      // 🔥 Get only active templates
      const activeTemplates = await templateService.getByStatus("active");
      const templateCards = activeTemplates.map((template) => ({
        ...getDynamicModuleConfig(template.id),
        title: template.name,
        description:
          template.description ||
          `Manage ${template.module} related data`,
        path: `/inputs/${template.id}`,
        templateId: template.id,
        module: template.module,
      }));

      // 🔥 Merge WITH default static modules
      // setModules([...getDefaultModules(), ...templateCards]);
      setModules([...templateCards]);
    } catch (err) {
      console.error("Failed to load templates:", err);
      setModules(getDefaultModules());
    } finally {
      setLoading(false);
    }
  };

  load();
}, []);


  // ----------------------------------------------------
  // COLOR + ICON GENERATOR (dynamic based on name)
  // ----------------------------------------------------
  const getDynamicModuleConfig = (id) => {
    const colors = [
      "bg-blue-50 hover:bg-blue-100 border-blue-200",
      "bg-green-50 hover:bg-green-100 border-green-200",
      "bg-purple-50 hover:bg-purple-100 border-purple-200",
      "bg-indigo-50 hover:bg-indigo-100 border-indigo-200",
      "bg-orange-50 hover:bg-orange-100 border-orange-200",
      "bg-yellow-50 hover:bg-yellow-100 border-yellow-200",
      "bg-pink-50 hover:bg-pink-100 border-pink-200",
      "bg-cyan-50 hover:bg-cyan-100 border-cyan-200",
      "bg-emerald-50 hover:bg-emerald-100 border-emerald-200",
      "bg-red-50 hover:bg-red-100 border-red-200",
    ];

    // deterministic hash color
    const colorIndex =
      id.split("").reduce((a, b) => a + b.charCodeAt(0), 0) %
      colors.length;

    return {
      color: colors[colorIndex],
      icon: <Users size={34} className="text-gray-600" />,
    };
  };

  // ----------------------------------------------------
  // DEFAULT MODULE CARDS (static)
  // ----------------------------------------------------
  // const getDefaultModules = () => [
  //   {
  //     icon: <Upload size={34} className="text-teal-600" />,
  //     title: "Bulk Upload",
  //     description: "Upload multiple records via Excel/CSV files",
  //     path: "/inputs/bulk-upload",
  //     color: "bg-teal-50 hover:bg-teal-100 border-teal-200",
  //   },
  //   {
  //     icon: <History size={34} className="text-gray-600" />,
  //     title: "Import History",
  //     description: "View history of all data imports",
  //     path: "/inputs/history",
  //     color: "bg-gray-50 hover:bg-gray-100 border-gray-200",
  //   },
  // ];

  // ----------------------------------------------------
  // UI
  // ----------------------------------------------------
  if (loading) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-1">Payroll Input Module</h1>
        <p className="text-gray-600 text-sm">Loading modules…</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Payroll Input Module</h1>
        <p className="text-gray-600 text-sm">
          Centralized platform for all payroll-input and HR onboarding forms
        </p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {modules.map((m, index) => (
          <Card
            key={index}
            className={`border rounded-xl shadow-sm transition-all duration-200 ${m.color}`}
          >
            <CardHeader className="text-center pb-3">
              <div className="flex justify-center mb-3">{m.icon}</div>

              <CardTitle className="text-lg font-semibold">{m.title}</CardTitle>
            </CardHeader>

            <CardContent className="text-center pb-5">
              <p className="text-sm text-gray-700 mb-4">{m.description}</p>

              <Link to={m.path}>
                <Button className="w-full font-medium text-sm" size="md" >
                  Open {m.title}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InputModule;
