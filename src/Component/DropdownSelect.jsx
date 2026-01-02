import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "../Lib/dropdown-menu";

import { Button } from "../Lib/button";
import AppIcon from "./AppIcon";

const DropdownSelect = ({ items = [], onSelect, triggerIcon, triggerSize = 18 }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <AppIcon name={triggerIcon} size={triggerSize} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="p-2">
        {items.map((item) => (
          <DropdownMenuItem
            key={item.value}
            onClick={() => onSelect(item.value)}
            className="flex gap-2 items-center"
          >
            <AppIcon name={item.icon} size={16} />
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownSelect;
