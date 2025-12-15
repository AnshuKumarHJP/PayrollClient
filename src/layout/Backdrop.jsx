import useSidebar from "../Hooks/useSidebar";

const Backdrop = () => {
  const { isMobileOpen, toggleMobileSidebar } = useSidebar();

  if (!isMobileOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[2000] lg:hidden"
      onClick={toggleMobileSidebar}
    />
  );
};

export default Backdrop;
