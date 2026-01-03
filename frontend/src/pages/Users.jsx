import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function Users() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!user?.tenant?.id) return;

    api.get(`/tenants/${user.tenant.id}/users`)
      .then(res => setUsers(res.data.data.users))
      .catch(err => console.log(err));
  }, [user]);

  return (
    <div>
      <Navbar />
      <h2>Users</h2>

      {users.map(u => (
        <div key={u.id}>
          {u.fullName} — {u.role}
        </div>
      ))}
    </div>
  );
}