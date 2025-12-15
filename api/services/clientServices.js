import API from "./api"; // <-- FIXED (you wrote `api` but imported API in code)

const ENDPOINT = "/clients";

/* ======================================================
   🔢 Auto-Generate Client Code   (CLI001, CLI002 ...)
====================================================== */
const generateClientCode = async () => {
  const res = await API.get(ENDPOINT);
  const list = res.data || [];

  if (list.length === 0) return "CLI001";

  const maxCode = Math.max(
    ...list
      .map((c) => Number(c.clientCode?.replace("CLI", "")))
      .filter((n) => !isNaN(n))
  );

  return `CLI${String(maxCode + 1).padStart(3, "0")}`;
};

/* ======================================================
   🔹 Fetch All Clients
====================================================== */
export const fetchClients = async () => {
  const res = await API.get(ENDPOINT);
  return res.data || [];
};

/* ======================================================
   🔹 Fetch Client By ID
====================================================== */
export const fetchClientById = async (id) => {
  const res = await API.get(`${ENDPOINT}/${id}`);
  return res.data;
};

/* ======================================================
   🔹 Fetch Client By Code
====================================================== */
export const fetchClientByCode = async (clientCode) => {
  const res = await API.get(`${ENDPOINT}?clientCode=${clientCode}`);
  return res.data?.length ? res.data[0] : null;
};

/* ======================================================
   🔹 CREATE Client (Auto ID + Auto Code)
====================================================== */
export const createClient = async (data) => {
  const generatedCode = await generateClientCode();

  const payload = {
    ...data,
    clientCode: generatedCode,
    id: generatedCode.toLowerCase(), // cli001
    isActive: data.isActive ?? true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const res = await API.post(ENDPOINT, payload);
  return res.data;
};

/* ======================================================
   🔹 UPDATE Client
====================================================== */
export const updateClient = async (id, data) => {
  const payload = {
    ...data,
    updatedAt: new Date().toISOString(),
  };

  const res = await API.patch(`${ENDPOINT}/${id}`, payload);
  return res.data;
};

/* ======================================================
   🔹 DELETE Client
====================================================== */
export const deleteClient = async (id) => {
  await API.delete(`${ENDPOINT}/${id}`);
  return true;
};

/* ======================================================
   🔹 Toggle Client Active Status
====================================================== */
export const toggleClientStatus = async (id, isActive) => {
  const res = await API.patch(`${ENDPOINT}/${id}`, {
    isActive,
    updatedAt: new Date().toISOString(),
  });
  return res.data;
};

/* ======================================================
   🔹 Search Clients (name, industry, email, code)
====================================================== */
export const searchClients = async (query) => {
  if (!query) return fetchClients();
  const res = await API.get(`${ENDPOINT}?q=${query}`);
  return res.data || [];
};

/* ======================================================
   🔹 Filter By Status
====================================================== */
export const filterClientsByStatus = async (status = "all") => {
  if (status === "active") {
    const res = await API.get(`${ENDPOINT}?isActive=true`);
    return res.data || [];
  }
  if (status === "inactive") {
    const res = await API.get(`${ENDPOINT}?isActive=false`);
    return res.data || [];
  }

  return fetchClients();
};
