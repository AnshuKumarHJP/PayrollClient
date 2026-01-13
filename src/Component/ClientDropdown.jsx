import React, { useState, useEffect, useMemo } from "react";
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
  UserClient = false,
}) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const storeClients = useSelector(
    (state) => state.Auth?.LogResponce?.data?.ClientList || []
  );

  /* =========================
     LOAD CLIENTS
  ========================= */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (UserClient) {
          setClients(storeClients);
        } else {
          const apiClients = await fetchClients();
          setClients(apiClients || []);
        }
      } catch (e) {
        console.error("Client load error", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [UserClient, storeClients]);

  /* =========================
     INITIAL SELECTION
  ========================= */
  useEffect(() => {
    if (loading || clients.length === 0) return;

    const saved = sessionStorage.getItem("activeClient");

    if (saved) {
      onChange(saved);
    } else if (FstindexSelected) {
      const firstId = String(clients[0].Id);
      sessionStorage.setItem("activeClient", firstId);
      onChange(firstId);
    }
  }, [loading, clients, FstindexSelected, onChange]);

  /* =========================
     HANDLE CHANGE
  ========================= */
  const handleSelectChange = (val) => {
    sessionStorage.setItem("activeClient", val);
    onChange(val);
  };

  /* =========================
     NORMALIZED VALUE
  ========================= */
  const selectedValue = value
    ? String(value)
    : sessionStorage.getItem("activeClient") || "";

  return (
    <Select
      value={selectedValue}
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
          <SelectItem
            key={client.Id}
            value={String(client.Id)}   // 🔥 STRING
          >
            {client.Name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ClientDropdown;
