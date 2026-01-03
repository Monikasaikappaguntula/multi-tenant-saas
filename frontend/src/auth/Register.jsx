import React, { useState } from "react";
import api from "../api/axios";

export default function Register() {
  const [form, setForm] = useState({});

  const submit = async () => {
    await api.post("/auth/register-tenant", form);
    alert("Tenant Registered");
  };

  return (
    <div>
      <h2>Register Tenant</h2>
      <input placeholder="Company Name" onChange={e => setForm({...form, tenantName:e.target.value})}/>
      <input placeholder="Subdomain" onChange={e => setForm({...form, subdomain:e.target.value})}/>
      <input placeholder="Admin Email" onChange={e => setForm({...form, adminEmail:e.target.value})}/>
      <input placeholder="Admin Name" onChange={e => setForm({...form, adminFullName:e.target.value})}/>
      <input placeholder="Password" type="password" onChange={e => setForm({...form, adminPassword:e.target.value})}/>
      <button onClick={submit}>Register</button>
    </div>
  );
}
