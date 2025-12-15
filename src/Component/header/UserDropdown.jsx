import { useState, useEffect } from "react";
import { Button } from "../../Lib/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../Lib/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../Lib/dropdown-menu";
import { User, Settings, LogOut, Loader2 } from "lucide-react";
import userDropdownService from "../../../api/services/userDropdownService";
import { useToast } from "../../Lib/use-toast";
import Logo from "../../Image/HFLogo.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "../../../api/services/authService";
import { resetGlobalStore, setClientList, setCurrentUser } from "../../Store/Slices/GlobalSlice";
import { resetGlobalSaveStore } from "../../Store/Slices/GlobalSaveSlice";
import { persistor } from "../../Store/Store";

const UserDropdown = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const { GlobalSaveStore, GlobalStore } = useSelector((state) => state);
  let CurrentUser = GlobalStore?.CurrentUser;

  useEffect(() => {
    fetchUserMenuItems();
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const userData = await getCurrentUser(GlobalSaveStore?.UserCode);
      // 1️⃣ Save only the client list separately
      dispatch(setClientList(userData?.accessibleClients));
      // 2️⃣ Remove accessibleClients before storing current user
      const { accessibleClients, ...cleanUserData } = userData;
      // 3️⃣ Dispatch cleaned user data
      dispatch(setCurrentUser(cleanUserData));
    } catch (error) {
      console.error("Error fetching current user data:", error);
    }
  };

  const fetchUserMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userDropdownService.getUserMenuItems();
      setMenuItems(data);
    } catch (err) {
      setError('Failed to fetch user menu items');
      toast({
        title: 'Error',
        description: 'Failed to fetch user menu items. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMenuItemClick = (item) => {
    // Handle menu item click
    console.log('Menu item clicked:', item);
  };

  const handleLogout = async () => {
    dispatch(resetGlobalStore());
    dispatch(resetGlobalSaveStore());
    await persistor.purge();
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">
        {error}
      </div>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={Logo} alt="@johndoe" />
            <AvatarFallback>{CurrentUser?.firstName}</AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col leading-tight">
            <p className="text-emerald-800 font-bold">{CurrentUser?.firstName}</p>
            <p className="text-xs text-emerald-800">{CurrentUser?.role}</p>
            </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{CurrentUser?.firstName} {CurrentUser?.lastName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {CurrentUser?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {menuItems.map((item, index) => (
          <DropdownMenuItem key={index} onClick={() => handleMenuItemClick(item)}>
            {item.label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
