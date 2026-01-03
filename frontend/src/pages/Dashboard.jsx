import React, { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get("/auth/me")
      .then(res => setUser(res.data.data))
      .catch(() => {
        alert("Session expired");
        localStorage.removeItem("token");
        window.location.href = "/login";
      });
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <Navbar />
      <h2>Dashboard</h2>
      <p><b>Name:</b> {user.fullName}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Role:</b> {user.role}</p>
      <p><b>Tenant:</b> {user.tenant.name}</p>
    </div>
  );
}
