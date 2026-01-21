import React, { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/Library/Select";
import { fetchClients } from "../../api/services/clientServices";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedClient } from "../Store/Auth/AuhtSlice";

const ClientDropdown = ({
  value,
  onChange,
  placeholder = "Select Client",
  className = "w-full",
  disabled = false,
  FstindexSelected = false,
  UserClient = false,
}) => {
  const dispatch = useDispatch();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const selectedClient = useSelector((state) => state.Auth?.Common?.SelectedClient || "");
  const [selectedValue, setSelectedValue] = useState(value ? String(value) : selectedClient || "");

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

    if (selectedClient) {
      setSelectedValue(selectedClient);
      onChange(selectedClient);
    } else if (FstindexSelected) {
      const firstId = String(clients[0].Id);
      setSelectedValue(firstId);
      dispatch(setSelectedClient(firstId));
      onChange(firstId);
    }
  }, [loading, clients, FstindexSelected, onChange, selectedClient, dispatch]);

  /* =========================
     HANDLE CHANGE
  ========================= */
  const handleSelectChange = (val) => {
    setSelectedValue(val);
    dispatch(setSelectedClient(val));
    onChange(val);
  };

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
            {client.Name} [ {client.Code} ]
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ClientDropdown;
