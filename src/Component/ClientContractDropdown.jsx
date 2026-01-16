import React, { useState, useEffect, useMemo } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../Lib/select";
// import { fetchClientContract } from "../../api/services/ClientContractervices";
import { useSelector } from "react-redux";

const ClientContractDropdown = ({
  value,
  onChange,
  placeholder = "Select Client",
  className = "w-full",
  disabled = false,
  FstindexSelected = false,
  UserClient = false,
}) => {
  const [ClientContract, setClientContract] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedValue, setSelectedValue] = useState(value ? String(value) : sessionStorage.getItem("activeClientContract") || "");

  const storeClientContract = useSelector(
    (state) => state.Auth?.LogResponce?.data?.ClientContractList || []
  );

  /* =========================
     LOAD ClientContract
  ========================= */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (UserClient) {
          setClientContract(storeClientContract);
        } else {
          const apiClientContract = []// await fetchClientContract();
          setClientContract(apiClientContract || []);
        }
      } catch (e) {
        console.error("Client load error", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [UserClient, storeClientContract]);

  /* =========================
     INITIAL SELECTION
  ========================= */
  useEffect(() => {
    if (loading || ClientContract.length === 0) return;

    const saved = sessionStorage.getItem("activeClientContract");

    if (saved) {
      setSelectedValue(saved);
      onChange(saved);
    } else if (FstindexSelected) {
      const firstId = String(ClientContract[0].Id);
      setSelectedValue(firstId);
      sessionStorage.setItem("activeClientContract", firstId);
      onChange(firstId);
    }
  }, [loading, ClientContract, FstindexSelected, onChange]);

  /* =========================
     HANDLE CHANGE
  ========================= */
  const handleSelectChange = (val) => {
    setSelectedValue(val);
    sessionStorage.setItem("activeClientContract", val);
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
        {!loading && ClientContract.length === 0 && (
          <div className="text-center text-gray-400 py-2 text-sm">
            No ClientContract found
          </div>
        )}

        {ClientContract.map((client) => (
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

export default ClientContractDropdown;
