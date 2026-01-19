import { useState, useEffect, useMemo } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetGlobalStore } from "../Store/Slices/GlobalSlice";
import { setSelectedRole } from "../Store/Auth/AuhtSlice";
import { Switch } from "../Lib/switch";
import AppIcon from "./AppIcon";
import { persistor } from "../Store/Store";
import { moveToFirstAsync } from "../services/HealperFunction";
import { GET_AUTH_SUCCESS } from "../Store/Auth/ActionType";
import ClientApi from "../services/ClientApi";

const UserDropdown = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false)

  const auth = useSelector((s) => s.Auth?.LogResponce);
  const authLoading = auth?.isLoading;
  const Log = auth?.data || {};
  const selectedRole = useSelector((state) => state.Auth?.Common?.SelectedRole || "");

  /* =====================================================
       UI Roles List (Static for Dropdown Display)
     ===================================================== */
  const [uiRoleList, setUiRoleList] = useState([]);

  // Load UI roles once when API gives data
  useEffect(() => {
    if (Log?.UIRoles) {
      setUiRoleList(Log.UIRoles); // KEEP original UI order
    }
  }, [Log]);

  const roles = useMemo(
    () => uiRoleList.map((r) => r.Role) || [],
    [uiRoleList]
  );

  /* =====================================================
        Active Role State
     ===================================================== */
  const [activeRole, setActiveRole] = useState(
    selectedRole || roles?.[0]?.Code
  );

  // Sync activeRole with selectedRole from store
  useEffect(() => {
    if (selectedRole) {
      setActiveRole(selectedRole);
    }
  }, [selectedRole]);

  // Set default active role when roles first load
  useEffect(() => {
    if (roles.length > 0) {
      const firstRole = roles[0]?.Code;

      if (!selectedRole && firstRole) {
        dispatch(setSelectedRole(firstRole));
        setActiveRole(firstRole);
      }
    }
  }, [roles, selectedRole, dispatch]);

  /* =====================================================
        HANDLE ROLE SWITCH
     ===================================================== */

     
  const handleRoleSwitch = async (role) => {
    try {
      const payload = {
        IsCompanyHierarchy:false,
        RoleCode: role?.Code,
        RoleId: role?.Id
      };
      const accessToken = auth?.data?.Token;
      const apiResponse = await ClientApi(
        "/api/Security/UpdateRoleInSession",
        payload,
        "PUT",
        accessToken,
        "security"
      );

     // ("/api/FieldValidationRule/UpsertFieldValidationRule", encryptedPayload, "PUT", null, "normal");

      // Backend unauthorized (business 200 false)
      if (!apiResponse || apiResponse?.data?.Status !== true) {
        toast({
          title: "Access Denied",
          description: apiResponse?.data?.Message || "Unauthorized action",
          variant: "destructive",
        });
        return;
      }

      // Backend success → reorder UIRoles for parent project
      const updatedRoles = await moveToFirstAsync(
        Log?.UIRoles || [],
        (x) => x.Role?.Code === role.Code
      );

      // Update redux (parent project expects first index)
      const extracted = {
        ...Log,
        UIRoles: updatedRoles
      };

      dispatch({
        type: GET_AUTH_SUCCESS,
        payload: extracted,
      });

      // DO NOT reorder UI list → keep UI stable
      setActiveRole(role.Code);
      dispatch(setSelectedRole(role.Code));
      navigate("/")
      toast({
        title: "Role switched",
        description: `Active role changed to ${role.Code}`,
      });

    } catch (err) {
      console.error("Role switch error:", err);
      toast({
        title: "Error switching role",
        description: "Network or server issue",
        variant: "destructive",
      });
    }
  };

  /* =====================================================
        LOGOUT
     ===================================================== */
  const handleLogout = async () => {
    try {
      dispatch({ type: "RESET_AUTH" });
      dispatch(resetGlobalStore());

      sessionStorage.clear();
      localStorage.clear();

      if (persistor) {
        await persistor.flush();
        await persistor.purge();
      }

      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });

      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  /* =====================================================
        LOADING STATE
     ===================================================== */
  if (authLoading) {
    return (
      <div className="flex items-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading...</span>
      </div>
    );
  }

  const session = Log?.UserSession || {};
  const avatarName = (session?.PersonName || "").slice(0, 2).toUpperCase();

  /* =====================================================
        UI RENDER
     ===================================================== */
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src="https://firebasestorage.googleapis.com/v0/b/linkedin-clone-d79a1.appspot.com/o/man.png?alt=media&token=4b126130-032a-45b5-bea4-87adb0d096dc"
            />
            <AvatarFallback>{avatarName}</AvatarFallback>
          </Avatar>

          <div className="hidden md:flex flex-col leading-tight">
            <p className="text-emerald-800 font-bold">
              {session?.PersonName || "User"}
            </p>
            <p className="text-xs text-emerald-800">{activeRole}</p>
          </div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80" align="end" forceMount>

        {/* USER SUMMARY */}
        <DropdownMenuLabel className="font-normal">
          <div className="flex justify-center mb-2">
            <img
              className="rounded-full h-20"
              src="https://firebasestorage.googleapis.com/v0/b/linkedin-clone-d79a1.appspot.com/o/man.png?alt=media&token=4b126130-032a-45b5-bea4-87adb0d096dc"
            />
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm font-medium">{session?.PersonName}</p>
            <p className="text-sm">{session?.EmailId}</p>
            <p className="text-xs text-muted-foreground">
              Logged in at:{" "}
              {session?.LastCheckedOn
                ? new Date(session.LastCheckedOn).toLocaleString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })
                : ""}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* ROLE SWITCH LIST */}
        <div className="max-h-[150px] overflow-y-auto">
          {[...roles]
            .sort((a, b) => a.Name.localeCompare(b.Name))
            .map((role, i) => (
              <DropdownMenuItem
                key={role.Code ?? i}
                className="flex items-center justify-between"
                onSelect={(e) => e.preventDefault()}
              >
                <span className="text-sm">{role.Name}</span>

                <Switch
                  checked={activeRole === role.Code}
                  onCheckedChange={() => handleRoleSwitch(role)}
                />
              </DropdownMenuItem>
            ))}
        </div>


        <DropdownMenuSeparator />

        {/* PROFILE + LOGOUT */}
        <DropdownMenuItem className="flex justify-between">
          <Link to="/profile" className="flex items-center">
            <AppIcon name="CircleUser" className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>

          <div className="flex items-center cursor-pointer" onClick={handleLogout}>
            <AppIcon name="LogOut" className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
