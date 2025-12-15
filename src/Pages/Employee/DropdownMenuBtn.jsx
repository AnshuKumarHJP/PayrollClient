import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreVertical } from "lucide-react";

export default function DropdownMenuBtn() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="p-1 hover:bg-gray-200 rounded">
        <MoreVertical size={16} />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content className="bg-white rounded shadow p-2 text-sm">
        <DropdownMenu.Item className="p-2 hover:bg-gray-100 rounded cursor-pointer">
          View Details
        </DropdownMenu.Item>
        <DropdownMenu.Item className="p-2 hover:bg-gray-100 rounded cursor-pointer">
          Edit
        </DropdownMenu.Item>
        <DropdownMenu.Item className="p-2 hover:bg-gray-100 rounded cursor-pointer">
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
