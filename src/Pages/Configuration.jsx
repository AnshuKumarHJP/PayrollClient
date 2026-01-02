import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  Suspense
} from "react";

import { Activity } from "react"; // React 19
import { useSearchParams, useNavigate, useParams } from "react-router-dom";

import { Button } from "../Lib/button";
import { Settings, X } from "lucide-react";
import AppIcon from "../Component/AppIcon";
import Loading from "../Component/Loading";
import DynamicLazyImport from "../Component/DynamicLazyImport";
import useCrypto from "../Security/useCrypto";
import { menuItems } from "../Data/StaticData";


/* -----------------------------------------------------------------------
   MEMOIZED SIDEBAR MENU
------------------------------------------------------------------------ */
const MenuList = React.memo(function MenuList({ items, activeMenu, onSelect }) {
  return (
    <div className="min-w-0">
      {items.map((item) => (
        <div
          key={item.key}
          onClick={() => onSelect(item.key)}
          className={`p-3 flex justify-between items-center border-b cursor-pointer transition-all
            ${activeMenu === item.key
              ? "bg-emerald-100 border-l-4 border-l-emerald-600"
              : "hover:bg-emerald-50"
            }`}
        >
          <div className="flex items-center gap-2">
            <AppIcon size={15} name={item.icon} className="text-emerald-600" />
            <p className="font-semibold text-xs md:text-sm">{item.title}</p>
          </div>
          <AppIcon name="MoveRight" size={16} />
        </div>
      ))}
    </div>
  );
});

/* -----------------------------------------------------------------------
   MEMOIZED EDIT WRAPPER
------------------------------------------------------------------------ */
const EditComponent = React.memo(function EditComponent({
  path,
  id,
  onSave,
  onCancel
}) {
  return (
    <Suspense fallback={<Loading />}>
      <DynamicLazyImport path={path} id={id} onSave={onSave} onCancel={onCancel} />
    </Suspense>
  );
});

/* -----------------------------------------------------------------------
   MAIN COMPONENT
------------------------------------------------------------------------ */
const Configuration = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { tab } = useParams();

  // No nested array — FIXED
  const [configItems] = useState(menuItems);

  const [activeMenu, setActiveMenu] = useState(null);
  const [isAddEditMode, setIsAddEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { encrypt, decrypt } = useCrypto();

  /* -----------------------------------------------------------------------
     ACTIVE ITEM
  ------------------------------------------------------------------------ */
  const activeItem = useMemo(
    () => configItems.find((x) => x.key === activeMenu),
    [activeMenu, configItems]
  );

  /* -----------------------------------------------------------------------
     Correct useEffect → First tab + URL sync + Mode sync
  ------------------------------------------------------------------------ */
  useEffect(() => {
    const mode = searchParams.get("mode");
    const id = searchParams.get("id");

    // 1️⃣ Decrypt tab from path params
    const decryptedTab = decrypt(tab);
    if (decryptedTab && configItems.some(item => item.key === decryptedTab)) {
      setActiveMenu(decryptedTab);
    } else {
      // 2️⃣ Otherwise set first tab & update URL
      const firstKey = configItems[0].key;
      setActiveMenu(firstKey);
      navigate(`/config/${encrypt(firstKey)}`);
    }

    // 3️⃣ Add/Edit mode
    if (mode === "add") {
      setIsAddEditMode(true);
      setCurrentItem(null);
    }
    else if (mode === "edit") {
      setIsAddEditMode(true);
      setCurrentItem(id ? { id: Number(id) } : null);
    }

  }, [tab, searchParams, configItems, navigate, encrypt, decrypt]);

  /* -----------------------------------------------------------------------
     MENU SELECT (updates URL)
  ------------------------------------------------------------------------ */
  const handleMenuSelect = useCallback((key) => {
    setActiveMenu(key);
    setIsAddEditMode(false);
    setCurrentItem(null);
    navigate(`/config/${encrypt(key)}`);
    setMobileMenuOpen(false);
  }, [navigate, encrypt]);

  /* -----------------------------------------------------------------------
     ON SAVE / CANCEL
  ------------------------------------------------------------------------ */
  const handleSaveCancel = useCallback(() => {
    setIsAddEditMode(false);
    setCurrentItem(null);
    setSearchParams(activeMenu);
  }, [activeMenu, setSearchParams]);

  /* -----------------------------------------------------------------------
     LOADED CONTENT
  ------------------------------------------------------------------------ */
  const LoadedContent = (
    <Suspense fallback={<Loading />}>
      <DynamicLazyImport
        key={activeItem?.PagePath}
        path={activeItem?.PagePath}
        onAddEditMode={(mode, item) => {
          setIsAddEditMode(mode);
          setCurrentItem(item);
        }}
      />
    </Suspense>
  );

  const content = isAddEditMode ? (
    <EditComponent
      path={activeItem.PageEditPath}
      id={currentItem?.id}
      onSave={handleSaveCancel}
      onCancel={handleSaveCancel}
    />
  ) : (
    LoadedContent
  );

  /* -----------------------------------------------------------------------
     RENDER
  ------------------------------------------------------------------------ */
  return (
    <div className="min-w-0">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Settings size={20} />
          <h1 className="md:text-xl font-bold">Configuration</h1>
        </div>

        <div className="flex items-center gap-2">
          {isAddEditMode && (
            <Button variant="destructive" onClick={handleSaveCancel}>
              <X size={16} />
            </Button>
          )}

          {/* MOBILE MENU ICON */}
          <button
            className="md:hidden p-2 bg-emerald-600 text-white rounded-lg"
            onClick={() => setMobileMenuOpen(true)}
          >
            <AppIcon name="Menu" />
          </button>
        </div>
      </div>

      {/* MOBILE OVERLAY */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* MOBILE DRAWER */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 md:hidden
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <button
          className="absolute top-2 right-3 p-1 bg-gray-200 rounded-full"
          onClick={() => setMobileMenuOpen(false)}
        >
          <AppIcon name="X" size={15} />
        </button>

        <div className="mt-10 space-y-1 min-w-0">
          <MenuList
            items={configItems}
            activeMenu={activeMenu}
            onSelect={handleMenuSelect}
          />
        </div>
      </div>

      {/* GRID LAYOUT */}
      <div className="grid md:grid-cols-[280px_1fr] gap-3 min-w-0">

        {/* SIDEBAR DESKTOP */}
        <div className="border hidden md:block shadow-sm rounded-xl bg-white max-h-[80vh] overflow-y-auto min-w-0">
          <MenuList
            items={configItems}
            activeMenu={activeMenu}
            onSelect={handleMenuSelect}
          />
        </div>

        {/* CONTENT AREA */}
        <Activity>

          {/* DESKTOP */}
          <div
            activity:id="config-content-desktop"
            className="hidden md:block bg-white shadow rounded-xl min-h-[300px] overflow-y-auto min-w-0"
          >
            {content}
          </div>

          {/* MOBILE */}
          <div
            activity:id="config-content-mobile"
            className="md:hidden bg-white shadow rounded-xl min-h-[300px] min-w-0"
          >
            {content}
          </div>

        </Activity>
      </div>

    </div>
  );
};

export default React.memo(Configuration);
