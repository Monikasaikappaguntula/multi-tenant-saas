import React, { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate(); // ✅ INSIDE component
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
    tenantSubdomain: ""
  });

  const submit = async () => {
    try {
      const res = await api.post("/auth/login", form);
      login(res.data.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={e => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={e => setForm({ ...form, password: e.target.value })}
      />

      <input
        placeholder="Tenant Subdomain"
        onChange={e =>
          setForm({ ...form, tenantSubdomain: e.target.value })
        }
      />

      <button onClick={submit}>Login</button>
    </div>
  );
}