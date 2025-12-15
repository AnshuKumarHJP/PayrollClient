import React from 'react'
import AdvanceTable from '../../Component/AdvanceTable';
import DropdownMenuBtn from './DropdownMenuBtn';

const EmployeeList = () => {
  const employees = [
    {
      id: 1,
      name: "Floyd Miles",
      email: "floydmiles@pagedone.io",
      role: "UI Designer",
      department: "Product design",
      phone: "+12 3456 7890",
      joinDate: "2023-06-24",
      status: "Active",
      avatar: "https://i.pravatar.cc/50?img=1",
    },
    {
      id: 2,
      name: "Savannah Nguyen",
      email: "savannah@pagedone.io",
      role: "Web Developer",
      department: "Programmer",
      phone: "+12 3456 7890",
      joinDate: "2023-02-23",
      status: "Inactive",
      avatar: "https://i.pravatar.cc/50?img=2",
    },
    {
      id: 3,
      name: "Cameron Williamson",
      email: "cameron@pagedone.io",
      role: "Project Manager",
      department: "Human Resource",
      phone: "+12 3456 7890",
      joinDate: "2023-10-23",
      status: "Onboarding",
      avatar: "https://i.pravatar.cc/50?img=3",
    }
  ];

  const columns = [
    {
      key: "name",
      label: "Full Name & Email",
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <img src={row.avatar} className="w-10 h-10 rounded-full" />
          <div>
            <p className="font-medium">{row.name}</p>
            <p className="text-xs text-gray-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: "role", label: "Role" },
    { key: "department", label: "Department" },
    { key: "phone", label: "Mobile Number" },
    {
      key: "joinDate",
      label: "Join Date",
      type: "date",
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`px-2 py-1 text-xs rounded-full 
          ${value === "Active"
              ? "bg-green-100 text-green-700"
              : value === "Inactive"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
        >
          {value}
        </span>
      ),
    },
  ];
  return (
    <>
      <AdvanceTable
        title="Employees List"
        data={employees}
        columns={columns}
        renderActions={(row) => <DropdownMenuBtn row={row} />}
      />
    </>
  )
}

export default EmployeeList