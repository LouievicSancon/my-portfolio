"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

// Type definition for a portfolio project
interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string;
  live_url: string;
  github_url: string;
}

export default function EditorPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    tech_stack: "",
    live_url: "",
    github_url: "",
  });
  const router = useRouter();
  const supabase = createClient();

  // Fetch projects on initial page load
  useEffect(() => {
    fetchProjects();
  }, []);

  // GET all projects from the API
  async function fetchProjects() {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data);
  }

  // Handle form submission for create or update
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (editingId) {
      // PUT request to update an existing project
      await fetch(`/api/projects/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      // POST request to create a new project
      await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }

    setForm({ title: "", description: "", tech_stack: "", live_url: "", github_url: "" });
    setEditingId(null);
    fetchProjects();
  }

  // DELETE a project by ID
  async function handleDelete(id: string) {
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    fetchProjects();
  }

  // Populate form with existing project data for editing
  function handleEdit(project: Project) {
    setEditingId(project.id);
    setForm({
      title: project.title,
      description: project.description,
      tech_stack: project.tech_stack,
      live_url: project.live_url || "",
      github_url: project.github_url || "",
    });
  }

  // Sign out and redirect to login
  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Portfolio Editor</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-gray-800"
          >
            Sign Out
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 mb-10 p-6 border border-gray-200 rounded-lg">
          <h2 className="text-lg font-medium">
            {editingId ? "Edit Project" : "Add New Project"}
          </h2>
          <input
            type="text"
            placeholder="Project Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            rows={3}
            required
          />
          <input
            type="text"
            placeholder="Tech Stack (e.g. React, Node.js, PostgreSQL)"
            value={form.tech_stack}
            onChange={(e) => setForm({ ...form, tech_stack: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          <input
            type="url"
            placeholder="Live URL (optional)"
            value={form.live_url}
            onChange={(e) => setForm({ ...form, live_url: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          <input
            type="url"
            placeholder="GitHub URL (optional)"
            value={form.github_url}
            onChange={(e) => setForm({ ...form, github_url: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
            >
              {editingId ? "Update" : "Add Project"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({ title: "", description: "", tech_stack: "", live_url: "", github_url: "" });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="space-y-4">
          <h2 className="text-lg font-medium">Your Projects</h2>
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div>
                <h3 className="font-medium">{project.title}</h3>
                <p className="text-sm text-gray-500">{project.tech_stack}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(project)}
                  className="text-sm px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="text-sm px-3 py-1 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}