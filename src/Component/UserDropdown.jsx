import { useState, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../Library/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Library/DropdownMenu";
import { useToast } from "../Library/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { Switch } from "../Library/Switch";
import AppIcon from "./AppIcon";
import AvatarMans from "../Image/AvatarMan.png";
import { useDispatch, useSelector } from "react-redux";
import { resetAuth } from "../Store/Auth/AuthSlice";
import { handleRoleSwitch } from "../Store/Auth/Action";

const UserDropdown = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch();

  /* =====================================================
     REDUX STATE (SINGLE SOURCE OF TRUTH)
     ===================================================== */

  const selectedRole = useSelector(
    (state) => state.Auth.Common.SelectedRole
  );

  const authData = useSelector(
    (state) => state.Auth.LogResponce.data
  );

  const session = authData?.UserSession || {};
  const rolesRaw = authData?.UIRoles || [];

  /* =====================================================
     UI ROLES
     ===================================================== */

  const roles = useMemo(
    () => rolesRaw.map((r) => r.Role),
    [rolesRaw]
  );
  // console.log("roles", roles);

  /* =====================================================
     LOCAL UI STATE
     ===================================================== */

  const [isRoleSwitching, setIsRoleSwitching] = useState(false);

  /* =====================================================
     ROLE SWITCH
     ===================================================== */

  const handleRoleSwitchLocal = async (role) => {
    if (isRoleSwitching || selectedRole === role.Code) return;

    setIsRoleSwitching(true);
    await dispatch(handleRoleSwitch(role, navigate));
    setIsRoleSwitching(false);
  };

  /* =====================================================
     LOGOUT
     ===================================================== */

  const handleLogout = () => {
    // removeSecureSession("AUTH_DATA");
    sessionStorage.clear();
    dispatch(resetAuth());

    toast({
      title: "Logged out",
      description: "Session ended successfully",
      variant: "success",
    });

    navigate("/login");
  };

  /* =====================================================
     AVATAR FALLBACK
     ===================================================== */

  const avatarFallback =
    (session?.PersonName || "").slice(0, 2).toUpperCase() || "U";

  /* =====================================================
     UI
     ===================================================== */

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={AvatarMans} loading="lazy" />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>

          <div className="hidden md:flex flex-col leading-tight">
            <p className="font-bold">{session?.PersonName}</p>
            <p className="text-xs">{selectedRole}</p>
          </div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="text-center">
          <img
            src={AvatarMans}
            className="mx-auto h-20 rounded-full"
            alt="avatar"
          />
          <p className="mt-2 font-medium">{session?.PersonName}</p>
          <p className="text-xs">{session?.EmailId}</p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* ROLE SWITCH LIST */}
        <div
          className={`max-h-[150px] overflow-y-auto ${isRoleSwitching ? "opacity-60 pointer-events-none" : ""
            }`}
        >
          {roles
            .sort((a, b) => a.Name.localeCompare(b.Name))
            .map((role) => (
              <DropdownMenuItem
                key={role.Code}
                onSelect={(e) => e.preventDefault()}
                className="flex justify-between items-center"
              >
                <span>{role.Name}</span>
                <Switch
                  checked={selectedRole === role.Code}
                  onCheckedChange={() =>
                    handleRoleSwitchLocal(role)
                  }
                />
              </DropdownMenuItem>
            ))}
        </div>

        <DropdownMenuSeparator />

        {/* PROFILE + LOGOUT */}
        <DropdownMenuItem className="flex justify-between items-center">
          <Link to="/profile" className="flex items-center">
            <AppIcon name="CircleUser" className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>

          <div
            className="flex items-center cursor-pointer"
            onClick={handleLogout}
          >
            <AppIcon name="LogOut" className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;

/* =========================================================
   ✅ WHY THIS WORKS
=========================================================

✔ Redux SelectedRole is the ONLY source of truth
✔ Switch + label auto re-render
✔ No duplicated local state
✔ No race conditions
✔ Clean + scalable

========================================================= */
