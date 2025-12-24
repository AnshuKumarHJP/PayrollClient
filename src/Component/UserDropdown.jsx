import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../Lib/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../Lib/dropdown-menu";
import { Loader2 } from "lucide-react";
import { useToast } from "../Lib/use-toast";
import Logo from "../Image/HFLogo.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetGlobalStore } from "../Store/Slices/GlobalSlice";
import { resetGlobalSaveStore } from "../Store/Slices/GlobalSaveSlice";
import { Switch } from "../Lib/switch";
import AppIcon from "./AppIcon";
import { persistor } from "../Store/Store";

const UserDropdown = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const authLoading = useSelector((state) => state.Auth?.LogResponce?.isLoading);
  const LogResponce = useSelector((state) => state.Auth?.LogResponce?.data);

  const CurrentUserSession = LogResponce?.UserSession || {};
  const CurrentUserRole = LogResponce?.UIRoles || [];

  // All roles
  const roles = CurrentUserRole.map((r) => r?.Role);

  // Load active role from sessionStorage OR first role
  const [activeRole, setActiveRole] = useState(
    sessionStorage.getItem("activeRole") || roles?.[0]?.Code
  );

  // 🔥 FIX: set first role automatically when roles arrive
  useEffect(() => {
    if (roles.length > 0) {
      const saved = sessionStorage.getItem("activeRole");

      if (!saved) {
        const firstRole = roles[0]?.Code;
        if (firstRole) {
          setActiveRole(firstRole);
          sessionStorage.setItem("activeRole", firstRole);
        }
      }
    }
  }, [roles]);

  // Role switch
  const handleRoleSwitch = (roleCode) => {
    setActiveRole(roleCode);
    sessionStorage.setItem("activeRole", roleCode);
    window.location.href="/"
    toast({
      title: "Role switched",
      description: `Active role changed to ${roleCode}`,
    });
  };

const handleLogout = async () => {
  try {
    // 1️⃣ Clear all Redux slices
    dispatch({ type: "RESET_AUTH" });
    dispatch(resetGlobalStore());
    dispatch(resetGlobalSaveStore());
    // 2️⃣ Clear browser storage
    sessionStorage.clear();
    localStorage.clear();
    // 3️⃣ Clear redux-persist storage
    if (persistor) {
      await persistor.flush();   // ensures pending state is written
      await persistor.purge();   // clears persisted data
    }
    // 4️⃣ Navigate to Login
    navigate("/login");

    // 5️⃣ Toast
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });

  } catch (error) {
    console.error("Logout error:", error);
  }
};


  if (authLoading) {
    return (
      <div className="flex items-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer flex items-center gap-2">
          
          {/* USER AVATAR */}
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={
                "https://firebasestorage.googleapis.com/v0/b/linkedin-clone-d79a1.appspot.com/o/man.png?alt=media&token=4b126130-032a-45b5-bea4-87adb0d096dc%22"
              }
              alt="profile"
            />
            <AvatarFallback>
              {(CurrentUserSession?.PersonName || "")
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* NAME + ROLE */}
          <div className="hidden md:flex flex-col leading-tight">
            <p className="text-emerald-800 font-bold">
              {CurrentUserSession?.PersonName || "User"}
            </p>
            <p className="text-xs text-emerald-800">
              {activeRole}
            </p>
          </div>

        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80" align="end" forceMount>

        {/* USER SUMMARY */}
        <DropdownMenuLabel className="font-normal">
          <div className="flex justify-center mb-2">
            <img
              className="rounded-full h-20"
              src={
                "https://firebasestorage.googleapis.com/v0/b/linkedin-clone-d79a1.appspot.com/o/man.png?alt=media&token=4b126130-032a-45b5-bea4-87adb0d096dc%22"
              }
              alt="image"
            />
          </div>

          <div className="flex flex-col space-y-1 items-center space-y-4">
            <p className="text-sm font-medium leading-none">
              {CurrentUserSession?.PersonName}
            </p>

            <p className="text-xs leading-none text-muted-foreground">
              Logged in at:{" "}
              {CurrentUserSession?.hfLastLogin
                ? new Date(CurrentUserSession.hfLastLogin).toLocaleString(
                    "en-IN",
                    {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    }
                  )
                : ""}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* ROLE SWITCH LIST */}
        <div className="max-h-[150px] overflow-y-auto">
          {roles.map((role, index) => (
            <DropdownMenuItem
              key={index}
              className="flex items-center justify-between cursor-pointer"
              onSelect={(e) => e.preventDefault()}
            >
              <span className="text-sm">{role.Name}</span>

              <Switch
                checked={activeRole === role.Code}
                onCheckedChange={() => handleRoleSwitch(role.Code)}
              />
            </DropdownMenuItem>
          ))}
        </div>

        <DropdownMenuSeparator />

        {/* PROFILE + LOGOUT */}
        <DropdownMenuItem className="flex justify-between">
          
          <Link to="/profile" className="flex items-center">
            <AppIcon name={"CircleUser"} className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>

          <div
            className="flex items-center"
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
