import React, { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    api.get("/projects")
      .then(res => setProjects(res.data.data.projects))
      .catch(() => alert("Failed to load projects"));
  }, []);

  const createProject = async () => {
    if (!name) return alert("Project name required");

    await api.post("/projects", { name });
    window.location.reload();
  };

  const deleteProject = async (id) => {
    await api.delete(`/projects/${id}`);
    window.location.reload();
  };

  return (
    <div>
      <Navbar />
      <h2>Projects</h2>

      <input
        placeholder="Project Name"
        onChange={e => setName(e.target.value)}
      />
      <button onClick={createProject}>Create Project</button>

      <ul>
        {projects.map(p => (
          <li key={p.id}>
            {p.name}
            <button onClick={() => deleteProject(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
