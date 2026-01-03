import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { logout } = useAuth();

  return (
    <div style={{ padding: 10, borderBottom: "1px solid black" }}>
      <Link to="/dashboard">Dashboard</Link> |{" "}
      <Link to="/projects">Projects</Link> |{" "}
      <Link to="/users">Users</Link> |{" "}
      <button onClick={logout}>Logout</button>
    </div>
  );
}