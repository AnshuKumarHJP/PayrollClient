import React, { useState, useEffect } from "react";
import sessionStorageService from "../services/sessionStorageService";
import { JsonView, defaultStyles } from "react-json-view-lite";

const SessionStorageTest = () => {
  const [text, setText] = useState("");
  const [jsonData, setJsonData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load encrypted loginresponses.txt
  useEffect(() => {
    fetch("/loginresponses.txt")
      .then((res) => res.text())
      .then((data) => {
        setText(data);
        sessionStorage.setItem("ngx-webstorage | loginresponses", data);
      });
  }, []);

  const userFields = {
    activeRoleCode: "PayrollOps",
    activeRoleId: 8,
    currentUser: 226,
    isEmployee: false,
    loginUserId: 15172,
  };

  const ngxData = {
    "ngx-webstorage | companycode":
      "U2FsdGVkX1+1n3DFQx5YaDn4VpNipFaisSjOAEMyJPU=",
    "ngx-webstorage | default_sme_clientid":
      "U2FsdGVkX1++HX4xWqPNe28IcvMS6JO/RgDk0RXIJbU=",
    "ngx-webstorage | default_sme_contractid":
      "U2FsdGVkX19GDrmhtWgaNfxvPW5naYllo1m4w1hssQY=",
    "ngx-webstorage | roleid":
      "U2FsdGVkX19c4X6lslhXLFN9OLtCEOsEb9eSbWUx+38=",
    "ngx-webstorage | token":
      "U2FsdGVkX1+9CN2UVt5e2Egf16yIOIQUF3yqkwlAawmO7/wzwuqTj43KnsEJ2SW3bAm27KjlVdbUwSKMw+CYCEKxicFkqGYx6j0srywgOYWmpK7YGwtoZCrO2QbSO+DZm63VbESsZ0MBJ/vwAVgcfBUtVw5fhJwExIk+Iu6ftbg=",
  };

  useEffect(() => {
    Object.entries(userFields).forEach(([key, value]) =>
      sessionStorage.setItem(key, value)
    );
    Object.entries(ngxData).forEach(([key, value]) =>
      sessionStorage.setItem(key, value)
    );
  }, []);

  const runTest = () => {
    setLoading(true);

    setTimeout(() => {
      const output = {};

      // Read plain values
      Object.keys(userFields).forEach((key) => {
        output[key] = sessionStorage.getItem(key);
      });

      // Decrypt ngx encrypted values
      Object.keys(ngxData).forEach((key) => {
        try {
          output[key] = sessionStorageService.getSessionStorage(key);
        } catch {
          output[key] = "[DECRYPT ERROR]";
        }
      });

      // Large JSON
      try {
        const resp = sessionStorageService.getSessionStorage(
          "ngx-webstorage | loginresponses"
        );
        output["ngx-webstorage | loginresponses"] = resp;
      } catch {
        output["ngx-webstorage | loginresponses"] = "[DECRYPT ERROR]";
      }

      setJsonData(output);
      setLoading(false);
    }, 100); // small delay to show loader
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">SessionStorage Reader & Tester</h2>

      <button
        onClick={runTest}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Run Test
      </button>

      {loading && (
        <div className="mt-4 text-blue-600 font-semibold">
          🔄 Decrypting... Please wait
        </div>
      )}

      <h3 className="mt-6 font-semibold">Encrypted RAW Loginresponses:</h3>
      <pre className="bg-gray-100 p-4 rounded max-h-40 overflow-auto">
        {text}
      </pre>

      {jsonData && (
        <>
          <h3 className="mt-6 font-semibold">Decrypted Result (JSON Viewer):</h3>

          <div className="bg-gray-100 p-4 rounded">
            <JsonView
              data={jsonData}
              style={defaultStyles}
              theme="dark"
              enableClipboard={true}
              collapsed={3}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default SessionStorageTest;
