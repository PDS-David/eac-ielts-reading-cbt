import React from "react";
import { useState } from "react";
import ReadingCBTv2 from "./components/ReadingCBTv2.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";

export default function App() {
  const [route, setRoute] = useState(window.location.pathname);

  if (route === "/admin") {
    return <AdminDashboard />;
  }

  return <ReadingCBTv2 />;
}
