import React, { useState, useEffect, useMemo } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../Lib/select";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedClientContract } from "../Store/Auth/AuhtSlice";

const ClientContractDropdown = ({
  value,
  onChange,
  placeholder = "Select Client",
  className = "w-full",
  disabled = false,
  FstindexSelected = false,
  UserClient = false,
}) => {
  const dispatch = useDispatch();
  const [ClientContract, setClientContract] = useState([]);
  const [loading, setLoading] = useState(true);
  const selectedClientContract = useSelector((state) => state.Auth?.Common?.SelectedClientContract || "");
  const [selectedValue, setSelectedValue] = useState(value ? String(value) : selectedClientContract || "");

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

    if (selectedClientContract) {
      setSelectedValue(selectedClientContract);
      onChange(selectedClientContract);
    } else if (FstindexSelected) {
      const firstId = String(ClientContract[0].Id);
      setSelectedValue(firstId);
      dispatch(setSelectedClientContract(firstId));
      onChange(firstId);
    }
  }, [loading, ClientContract, FstindexSelected, onChange, selectedClientContract, dispatch]);

  /* =========================
     HANDLE CHANGE
  ========================= */
  const handleSelectChange = (val) => {
    setSelectedValue(val);
    dispatch(setSelectedClientContract(val));
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

        {ClientContract.map((ClientContract) => (
          <SelectItem
            key={ClientContract.Id}
            value={String(ClientContract.Id)}   // 🔥 STRING
          >
            {ClientContract.Name} [ {ClientContract?.Code} ]
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ClientContractDropdown;
