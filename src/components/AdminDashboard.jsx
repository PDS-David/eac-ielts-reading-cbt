import React, { useEffect, useState } from "react";
import { ADMIN_PASSWORD } from "../config.js";

export default function AdminDashboard() {
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [results, setResults] = useState([]);

  const loadResults = () => {
    const data = JSON.parse(localStorage.getItem("eac_results") || "[]");
    setResults(data);
  };

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuth(true);
      loadResults();
    } else {
      alert("Incorrect password");
    }
  };

  const exportCSV = () => {
    const header = ["Name", "WhatsApp", "Score", "Reading Band", "Overall Band", "Weaknesses"].join(",");
    const rows = results.map(r =>
      [r.name, r.whatsapp, `${r.correct}/${r.total}`, r.readingBand, r.overall, r.weaknesses.join("|")].join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "EAC_IELTS_Results.csv";
    link.click();
  };

  if (!auth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h1 className="text-2xl font-semibold text-blue-700 mb-4">Admin Dashboard Login</h1>
        <input
          className="border p-2 rounded mb-3 w-64"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-xl font-bold text-blue-700">Admin Dashboard</h2>
        <div>
          <button onClick={loadResults} className="bg-gray-200 hover:bg-gray-300 py-1 px-3 rounded mr-2">🔄 Refresh</button>
          <button onClick={exportCSV} className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded">🗂 Export CSV</button>
        </div>
      </div>

      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">WhatsApp</th>
            <th className="border px-2 py-1">Score</th>
            <th className="border px-2 py-1">Reading Band</th>
            <th className="border px-2 py-1">Overall</th>
            <th className="border px-2 py-1">Weaknesses</th>
          </tr>
        </thead>
        <tbody>
          {results.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-500">No results yet.</td>
            </tr>
          ) : (
            results.map((r, i) => (
              <tr key={i}>
                <td className="border px-2 py-1">{r.name}</td>
                <td className="border px-2 py-1">{r.whatsapp}</td>
                <td className="border px-2 py-1">{r.correct}/{r.total}</td>
                <td className="border px-2 py-1">{r.readingBand}</td>
                <td className="border px-2 py-1">{r.overall}</td>
                <td className="border px-2 py-1">{r.weaknesses.join(", ")}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
