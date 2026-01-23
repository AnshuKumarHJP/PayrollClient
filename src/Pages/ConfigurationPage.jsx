const configItemsNew = [
  { key: "role", title: "Role", icon: "Users", PagePath: "../Pages/Builder/TemplateList.jsx", PageEditPath: "../Pages/Builder/TemplateEdit.jsx", DisplayOrder: 1, IsActive: true },
  { key: "menu-setting", title: "Menu Setting", icon: "Menu", PagePath: "../Pages/Builder/TemplateList.jsx", PageEditPath: "../Pages/Builder/TemplateEdit.jsx", DisplayOrder: 2, IsActive: true },
  { key: "templates", title: "Form / Excel Templates", icon: "FileText", PagePath: "../Pages/Builder/TemplateList.jsx", PageEditPath: "../Pages/Builder/TemplateEdit.jsx", DisplayOrder: 3, IsActive: true },
  { key: "payroll-period", title: "Payroll Period", icon: "Calendar", PagePath: "../Pages/Builder/TemplateList.jsx", PageEditPath: "../Pages/Builder/TemplateEdit.jsx", DisplayOrder: 4, IsActive: true },
  { key: "inputs-config", title: "Inputs Configuration", icon: "Database", PagePath: "../Pages/Builder/TemplateList.jsx", PageEditPath: "../Pages/Builder/TemplateEdit.jsx", DisplayOrder: 5, IsActive: true },
  { key: "client-setup", title: "Client Setup", icon: "Building", PagePath: "../Pages/Builder/TemplateList.jsx", PageEditPath: "../Pages/Builder/TemplateEdit.jsx", DisplayOrder: 6, IsActive: true },
  { key: "config", title: "Add Configuration Menu", icon: "Settings2", PagePath: "../Pages/ConfigurationPage.jsx", PageEditPath: "../Pages/ConfigurationPage.jsx", DisplayOrder: 7, IsActive: true },
];

import React, { useState } from "react";
import Button from "../Library/Button";
import { Input } from "../Library/Input";
import { Label } from "../Library/Label";
import { Badge } from "../Library/Badge";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "../Library/dialog";
import { Switch } from "../Library/Switch";
import AdvanceTable from "../Component/AdvanceTable";
import AppIcon from "../Component/AppIcon";
import { Settings2, Edit, Trash2 } from "lucide-react";

/* =========================================================
   INITIAL DATA
========================================================= */
const blank = {
  key: "",
  title: "",
  icon: "",
  PagePath: "",
  PageEditPath: "",
  DisplayOrder: 1,
  IsActive: true,
};

/* =========================================================
   COMPONENT
========================================================= */
const ConfigurationPage = () => {
  const [configs, setConfigs] = useState(configItemsNew);
  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState(blank);

  /* ---------------- HANDLERS ---------------- */
  const openModal = (data = blank, index = null) => {
    setFormData({ ...data });
    setEditingIndex(index);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setFormData(blank);
    setEditingIndex(null);
  };

  const save = () => {
    const updated = [...configs];
    if (editingIndex !== null) updated[editingIndex] = formData;
    else updated.push(formData);
    setConfigs(updated);
    closeModal();
  };

  const remove = (index) => {
    setConfigs((p) => p.filter((_, i) => i !== index));
  };

  const onChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  /* ---------------- TABLE ---------------- */
  const columns = [
    { key: "title", label: "Title" },
    {
      key: "icon",
      label: "Icon",
      width: 80,
      render: (v) => <AppIcon name={v} className="text-indigo-600" />,
    },
    { key: "PagePath", label: "Page Path", width: 220 },
    { key: "PageEditPath", label: "Edit Path", width: 220 },
    { key: "DisplayOrder", label: "Order", width: 80 },
    {
      key: "IsActive",
      label: "Status",
      width: 100,
      render: (v) => (
        <Badge variant={v ? "success" : "danger"}>
          {v ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ];

  const renderActions = (row) => {
    const index = configs.indexOf(row);
    return (
      <div className="flex gap-2">
        <Button
          variant="warning"
          size="sm"
          onClick={() => openModal(configs[index], index)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => remove(index)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  /* =========================================================
     RENDER
  ========================================================= */
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-indigo-100 shadow-sm">
              <Settings2 className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Configuration Menu Manager
              </h1>
              <p className="text-sm text-gray-600 max-w-2xl leading-relaxed">
                Centralize and manage all your application configuration settings in one place.
                Create, edit, and organize menu items, templates, and system preferences with
                full control over display order, activation status, and navigation paths.
              </p>
              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-700">
                    {configs.filter(c => c.IsActive).length} Active Configurations
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-700">
                    {configs.filter(c => !c.IsActive).length} Inactive Configurations
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <AppIcon name="Database" size={14} className="text-indigo-600" />
                  <span className="text-xs font-medium text-gray-700">
                    Total: {configs.length} Items
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Button
            icon={<AppIcon name="Plus" />}
            onClick={() => openModal()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
          >
            Add Configuration
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <AdvanceTable
        title=""
        columns={columns}
        data={configs}
        renderActions={renderActions}
      />

      {/* MODAL (USING YOUR DIALOG) */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          header={
            <div className="flex items-center gap-3 p-2 border-b bg-gradient-to-r from-indigo-600 to-indigo-500 text-white">
              <div className="p-2 rounded-lg text-white">
                <AppIcon
                  name={editingIndex !== null ? "Pencil" : "Plus"}
                  size={20}
                //  className="text-indigo-600"
                />
              </div>
              <div>
                <DialogTitle className="text-md font-semibold text-white">
                  {editingIndex !== null
                    ? "Edit Configuration Item"
                    : "Add New Configuration Item"}
                </DialogTitle>
                <p className="text-[12px] text-gray-100 mt-1">
                  {editingIndex !== null
                    ? "Update the configuration details below"
                    : "Fill in the details to create a new configuration item"}
                </p>
              </div>
            </div>
          }
          body={
            <div className="space-y-6">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <AppIcon name="Info" size={16} className="text-indigo-600" />
                  <h3 className="text-sm font-medium text-gray-900">Basic Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Configuration Key *
                    </Label>
                    <Input
                      name="key"
                      value={formData.key}
                      onChange={onChange}
                      placeholder="e.g., user-management"
                      className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <p className="text-xs text-gray-500">Unique identifier for this configuration</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Display Title *
                    </Label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={onChange}
                      placeholder="e.g., User Management"
                      className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <p className="text-xs text-gray-500">User-friendly name shown in the interface</p>
                  </div>
                </div>
              </div>

              {/* Navigation & Display Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <AppIcon name="Navigation" size={16} className="text-indigo-600" />
                  <h3 className="text-sm font-medium text-gray-900">Navigation & Display</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Icon Name
                    </Label>
                    <Input
                      name="icon"
                      value={formData.icon}
                      onChange={onChange}
                      placeholder="e.g., Users, Settings"
                      className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <p className="text-xs text-gray-500">Icon name from the icon library</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Display Order
                    </Label>
                    <Input
                      type="number"
                      name="DisplayOrder"
                      value={formData.DisplayOrder}
                      onChange={onChange}
                      min="1"
                      className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <p className="text-xs text-gray-500">Order in which items appear</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Page Path
                    </Label>
                    <Input
                      name="PagePath"
                      value={formData.PagePath}
                      onChange={onChange}
                      placeholder="e.g., /users"
                      className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <p className="text-xs text-gray-500">Route path for the main page</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Edit Path
                    </Label>
                    <Input
                      name="PageEditPath"
                      value={formData.PageEditPath}
                      onChange={onChange}
                      placeholder="e.g., /users/edit"
                      className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <p className="text-xs text-gray-500">Route path for the edit page</p>
                  </div>
                </div>
              </div>

              {/* Status Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <AppIcon name="CheckCircle" size={16} className="text-indigo-600" />
                  <h3 className="text-sm font-medium text-gray-900">Status</h3>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Switch
                    checked={formData.IsActive}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, IsActive: checked }))}
                  />

                  <Label className="text-sm font-medium text-gray-700 cursor-pointer">
                    Active Configuration
                  </Label>
                  <span className="text-xs text-gray-500 ml-auto">
                    {formData.IsActive ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>
            </div>
          }
          footer={
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={closeModal}
                className="px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={save}
               // className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm"
                icon={<AppIcon name="Save" size={16} />}
              >

                {editingIndex !== null ? "Update Configuration" : "Create Configuration"}
              </Button>
            </div>
          }
        />
      </Dialog>
    </div>
  );
};

export default ConfigurationPage;

/* =========================================================
   RESULT
========================================================= */
/*
✔ Dialog width now responsive (mobile → desktop)
✔ Header / body / footer aligned
✔ Looks like enterprise configuration panel
✔ No overflow, no cramped UI
✔ Ready for production
*/
