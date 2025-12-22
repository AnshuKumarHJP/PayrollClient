import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../Lib/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../Lib/dropdown-menu";
import {Loader2 } from "lucide-react";
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

  //  Load active role from sessionStorage or default to first role
  const [activeRole, setActiveRole] = useState(
    sessionStorage.getItem("activeRole") || roles?.[0]?.Code
  );

  //  Role switch handler (only 1 active at a time)
  const handleRoleSwitch = (roleCode) => {
    setActiveRole(roleCode);
    sessionStorage.setItem("activeRole", roleCode);

    toast({
      title: "Role switched",
      description: `Active role changed to ${roleCode}`,
    });
  };

  const handleLogout = async () => {
    try {
      // 1️⃣ Reset Redux slices
      dispatch({ type: "RESET_AUTH" });
      dispatch(resetGlobalStore());
      dispatch(resetGlobalSaveStore());
      // 2️⃣ Clear browser storage
      localStorage.clear();
      sessionStorage.clear();
      // 3️⃣ Flush any pending persist writes
      await persistor.flush();
      // 4️⃣ Purge persisted redux state (NO NEED FOR KEYS)
      await persistor.purge();
      // 5️⃣ Redirect
      navigate("/login");
      // 6️⃣ Toast message
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
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} className="bg-red-400">
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={"https://firebasestorage.googleapis.com/v0/b/linkedin-clone-d79a1.appspot.com/o/man.png?alt=media&token=4b126130-032a-45b5-bea4-87adb0d096dc%22"} alt="profile" />
            <AvatarFallback>
              {(CurrentUserSession?.PersonName || "")
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>


          <div className="hidden md:flex flex-col leading-tight">
            <p className="text-emerald-800 font-bold">{CurrentUserSession?.PersonName || "User"}</p>
            <p className="text-xs text-emerald-800">
              {activeRole}
            </p>
          </div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80" align="end" forceMount>
        {/* USER INFO */}
        <DropdownMenuLabel className="font-normal">
          <div className="flex justify-center mb-2">
            <img src={Logo} alt="image" className="rounded-full" />
          </div>
          <div className="flex flex-col space-y-1 items-center space-y-4">
            <p className="text-sm font-medium leading-none">
              {CurrentUserSession?.PersonName}
            </p>
            {/* <p className="text-xs leading-none text-muted-foreground">
              {CurrentUserSession?.EmailId}
            </p> */}
            <p className="text-xs leading-none text-muted-foreground">
              Logged in at: {
                CurrentUserSession?.LastCheckedOn
                  ? new Date(CurrentUserSession.LastCheckedOn).toLocaleString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  })
                  : ""
              }
            </p>

          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* ROLES LIST WITH SWITCH */}
        <div className="max-h-[150px] overflow-y-auto">
          {roles.map((role, index) => (
            <DropdownMenuItem
              key={index}
              className="flex items-center justify-between cursor-pointer"
              onSelect={(e) => e.preventDefault()} // prevent closing on click
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

        {/* LOGOUT */}
        <DropdownMenuItem className="flex justify-between">
          <Link to={'/profile'} className="flex justify-between items-center">
            <AppIcon name={"CircleUser"} className="mr-2 h-4 w-4" />
            {/* <Profile className="mr-2 h-4 w-4" /> */}
            <span>Profile</span>
          </Link>
          <div
            className="flex justify-between items-center"
            onClick={handleLogout}>
            <AppIcon name="LogOut" className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
