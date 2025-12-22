import React, { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../Lib/select"; // your Select component

import { fetchClients } from "../../api/services/clientServices";
import { useSelector } from "react-redux";

const ClientDropdown = ({
  value,
  onChange,
  placeholder = "Select Client",
  className = "w-full",
  disabled = false,
  FstindexSelected = false,
  UserClient = false,
}) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const LogResponce = useSelector((state) => state.Auth?.LogResponce?.data);
  const clientListFromStore = LogResponce?.ClientList || [];

  // ============================
  // LOAD CLIENTS (store or API)
  // ============================
  useEffect(() => {
    const loadClients = async () => {
      setLoading(true);
      try {
        if (UserClient) {
          setClients(clientListFromStore);
        } else {
          const apiClients = await fetchClients();
          setClients(apiClients);
        }
      } catch (err) {
        console.error("Client load error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadClients();
  }, [UserClient, clientListFromStore]);

  // ============================
  // LOAD ActiveClient FROM SESSION
  // ============================
  useEffect(() => {
    const savedClient = sessionStorage.getItem("activeClient");

    if (!loading && clients.length > 0) {
      if (savedClient) {
        onChange(savedClient);
      } else if (FstindexSelected && clients.length > 0) {
        const first = clients[0]?.Code;
        onChange(first);
        sessionStorage.setItem("activeClient", first);
      }
    }
  }, [loading, clients]);

  // ============================
  // SAVE TO SESSION STORAGE
  // ============================
  const handleSelectChange = (val) => {
    sessionStorage.setItem("activeClient", val);
    onChange(val);
  };

  return (
    <Select
      value={value || sessionStorage.getItem("activeClient") || ""}
      onValueChange={handleSelectChange}
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
          <SelectItem key={client.Code} value={client.Code}>
            {client.Name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ClientDropdown;
