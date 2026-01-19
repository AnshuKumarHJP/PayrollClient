import React, { useState } from "react";
import { Button } from "../Lib/button";
import { Input } from "../Lib/input";
import { Label } from "../Lib/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../Lib/dialog";
import { Plus, Edit, Trash2, Settings2 } from "lucide-react";
import AdvanceTable from "../Component/AdvanceTable";

const blank = {
  key: "",
  title: "",
  icon: "",
  PagePath: "",
  PageEditPath: "",
};
const configItemsNew = [
  { key: "role", title: "Role", icon: "Users", PagePath: "../Pages/Builder/TemplateList.jsx", PageEditPath: "../Pages/Builder/TemplateEdit.jsx" },
  { key: "menu-setting", title: "Menu Setting", icon: "Menu", PagePath: "../Pages/Builder/TemplateList.jsx", PageEditPath: "../Pages/Builder/TemplateEdit.jsx" },
  { key: "templates", title: "Form / Excel Templates", icon: "FileText", PagePath: "../Pages/Builder/TemplateList.jsx", PageEditPath: "../Pages/Builder/TemplateEdit.jsx" },
  { key: "payroll-period", title: "Payroll Period", icon: "Calendar", PagePath: "../Pages/Builder/TemplateList.jsx", PageEditPath: "../Pages/Builder/TemplateEdit.jsx" },
  { key: "inputs-config", title: "Inputs Configuration", icon: "Database", PagePath: "../Pages/Builder/TemplateList.jsx", PageEditPath: "../Pages/Builder/TemplateEdit.jsx" },
  { key: "client-setup", title: "Client Setup", icon: "Building", PagePath: "../Pages/Builder/TemplateList.jsx", PageEditPath: "../Pages/Builder/TemplateEdit.jsx" },
  { key: "config", title: "Add Configuration Menu", icon: "Settings2", PagePath: "../Pages/ConfigurationPage.jsx", PageEditPath: "../Pages/ConfigurationPage.jsx" },
];

const ConfigurationPage = () => {
  const [configs, setConfigs] = useState(configItemsNew);

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState(blank);

  const openModal = (data = blank, index = null) => {
    setFormData(data);
    setEditingIndex(index);
    setDialogOpen(true);
  };

  const save = () => {
    const updated = [...configs];
    if (editingIndex !== null) updated[editingIndex] = formData;
    else updated.push(formData);
    setConfigs(updated);
    setDialogOpen(false);
  };

  const remove = (index) => {
    setConfigs((prev) => prev.filter((_, i) => i !== index));
  };

  const change = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const Field = ({ name, label, placeholder }) => (
    <div className="flex flex-col gap-1">
      <Label className="text-sm font-medium text-muted-foreground">{label}</Label>
      <Input
        name={name}
        placeholder={placeholder}
        value={formData[name]}
        onChange={change}
     //   className="rounded-xl border-muted/30 focus-visible:ring-2 focus-visible:ring-primary/40"
      />
    </div>
  );

  const columns = [
    { key: "key", label: "Key" },
    { key: "title", label: "Title" },
    { key: "icon", label: "Icon" },
    { key: "PagePath", label: "Page Path" },
    { key: "PageEditPath", label: "Edit Path" },
  ];

  const renderActions = (_, index) => (
    <div className="flex gap-2">
      <Button
        variant="secondary"
        size="icon"
        onClick={() => openModal(configs[index], index)}
        className="rounded-lg"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="destructive"
        size="icon"
        onClick={() => remove(index)}
        className="rounded-lg"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Settings2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Configuration Menu Manager</h1>
            <p className="text-sm text-muted-foreground">
              Manage system configuration items dynamically
            </p>
          </div>
        </div>

        <Button  onClick={() => openModal()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Configuration 
        </Button>
      </div>

      {/* Table */}
        <AdvanceTable
          title=""
          columns={columns}
          data={configs}
          renderActions={renderActions}
        />

      {/* Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl rounded-3xl shadow-2xl border border-muted/20">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
             <Settings2 className="h-6 w-6 text-primary" />
              {editingIndex !== null ? "Edit Configuration" : "Add Configuration"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid md:grid-cols-2 gap-6 py-4">
            <Field name="key" placeholder="Enter key" label="Key" />
            <Field name="title" placeholder="Enter title" label="Title" />
            <Field name="icon" placeholder="Enter icon name" label="Icon" />
            <Field name="PagePath" placeholder="Enter path" label="Page Path" />
            <Field name="PageEditPath" placeholder="Enter edit path" label="Edit Path" />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>

            <Button
              onClick={save}
              className="bg-emerald-500 text-white px-4 hover:bg-emerald-600"
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default ConfigurationPage;
