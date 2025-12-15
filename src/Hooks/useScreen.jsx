// src/Hooks/useScreen.js
import { useEffect, useState } from "react";

export default function useScreen() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { width, isMobile: width < 1024, isDesktop: width >= 1024 };
}
