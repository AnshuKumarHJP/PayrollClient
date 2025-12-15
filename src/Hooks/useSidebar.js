import { useSelector, useDispatch } from "react-redux";
import {
  toggleSidebar,
  toggleMobileSidebar,
  setIsHovered,
  setActiveItem,
  toggleSubmenu,
  setMobile,
} from "../Store/Slices/sidebarSlice";

export default function useSidebar() {
  const dispatch = useDispatch();

  const sidebar = useSelector((state) => state.sidebar);

  return {
    ...sidebar,

    toggleSidebar: () => dispatch(toggleSidebar()),
    toggleMobileSidebar: () => dispatch(toggleMobileSidebar()),
    setIsHovered: (v) => dispatch(setIsHovered(v)),
    setActiveItem: (v) => dispatch(setActiveItem(v)),
    toggleSubmenu: (v) => dispatch(toggleSubmenu(v)),
    setMobile: (v) => dispatch(setMobile(v)),
  };
}
