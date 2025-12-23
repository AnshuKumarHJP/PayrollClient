// src/components/NavigatorBinder.jsx
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { setNavigator } from "../services/navigationService";

export default function NavigatorBinder() {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);

  return null; // No UI needed
}
