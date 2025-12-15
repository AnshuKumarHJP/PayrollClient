import React, { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../Lib/select";

import { fetchClients } from "../../api/services/clientServices";
import { useSelector } from "react-redux";

const ClientDropdown = ({
  value,
  onChange,
  placeholder = "Select Client",
  className = "w-full",
  disabled = false,
  FstindexSelected = false,
  UserClient = false, // if true → load from store, else from API
}) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const { GlobalStore } = useSelector((state) => state);
  const clientListFromStore = GlobalStore?.ClientList || [];

  useEffect(() => {
    const loadClients = async () => {
      setLoading(true);
      try {
        // ---------------------------
        // OPTION 1 → Use Redux Store
        // ---------------------------
        if (UserClient === true) {
          setClients(clientListFromStore);
          return;
        }

        // ---------------------------
        // OPTION 2 → Fetch from API
        // ---------------------------
        const apiClients = await fetchClients();
        setClients(apiClients);
      } catch (error) {
        console.error("Error loading clients:", error);
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, [UserClient, clientListFromStore]);

  // -------------------------------
  // AUTO SELECT FIRST CLIENT (index 0)
  // -------------------------------
  useEffect(() => {
    if (!loading && clients.length > 0 && !value) {
      if (FstindexSelected) {
        onChange(clients[0].clientCode); // Auto-select first
      }
    }
  }, [loading, clients, value, onChange]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled || loading}
      >
        <SelectTrigger className={className}>
          <SelectValue placeholder={loading ? "Loading..." : placeholder} />
        </SelectTrigger>

        <SelectContent>
          {!loading && clients.length === 0 && (
            <div className="text-center text-gray-400 py-2 text-sm">
              No clients found
            </div>
          )}

          {clients.map((client) => (
            <SelectItem key={client.clientCode} value={client.clientCode}>
              {client.clientName} ({client.clientCode})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ClientDropdown;
