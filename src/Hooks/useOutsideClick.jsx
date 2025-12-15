import { useEffect } from "react";

export default function useOutsideClick(ref, callback) {
  useEffect(() => {
    const handle = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handle);
    document.addEventListener("touchstart", handle);

    return () => {
      document.removeEventListener("mousedown", handle);
      document.removeEventListener("touchstart", handle);
    };
  }, [ref, callback]);
}
