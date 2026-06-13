
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string;
  live_url: string;
  github_url: string;
  image_url?: string;
}

interface ProfileSettings {
  name: string;
  role: string;
  skills: string;
  theme: string;
  font: string;
  resume_url?: string;
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
    image_url: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [profile, setProfile] = useState<ProfileSettings>({
    name: "",
    role: "",
    skills: "",
    theme: "light",
    font: "sans",
    resume_url: "",
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [profileMessage, setProfileMessage] = useState("");

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchProjects();
    fetchProfile();
  }, []);

  async function fetchProjects() {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data);
  }

  async function fetchProfile() {
    const res = await fetch("/api/profile");
    const data = await res.json();
    setProfile({
      name: data.name,
      role: data.role,
      skills: data.skills,
      theme: data.theme,
      font: data.font,
      resume_url: data.resume_url || "",
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let imageUrl = form.image_url;

    if (imageFile) {
      const fd = new FormData();
      fd.append("file", imageFile);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      imageUrl = data.url;
    }

    const payload = { ...form, image_url: imageUrl };

    if (editingId) {
      await fetch(`/api/projects/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setForm({
      title: "",
      description: "",
      tech_stack: "",
      live_url: "",
      github_url: "",
      image_url: "",
    });
    setEditingId(null);
    setImageFile(null);
    fetchProjects();
  }

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setProfileMessage("");
    let resumeUrl = profile.resume_url;

    if (resumeFile) {
      if (resumeFile.type !== "application/pdf") {
        setProfileMessage("Error: Only PDF documents are allowed for resume uploads.");
        return;
      }

      const fd = new FormData();
      fd.append("file", resumeFile);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      resumeUrl = data.url;
    }

    const payload = { ...profile, resume_url: resumeUrl };

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setProfileMessage("Settings saved successfully!");
      setProfile((prev) => ({ ...prev, resume_url: resumeUrl }));
      setResumeFile(null);
    } else {
      setProfileMessage("Error saving settings.");
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    fetchProjects();
  }

  function handleEdit(project: Project) {
    setEditingId(project.id);
    setForm({
      title: project.title,
      description: project.description,
      tech_stack: project.tech_stack,
      live_url: project.live_url || "",
      github_url: project.github_url || "",
      image_url: project.image_url || "",
    });
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Portfolio Editor & Settings</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-gray-800"
          >
            Sign Out
          </button>
        </div>

        <form
          onSubmit={handleProfileSubmit}
          className="space-y-4 mb-10 p-6 bg-white border border-gray-200 rounded-lg shadow-sm"
        >
          <h2 className="text-lg font-semibold border-b pb-2 text-gray-800">
            1. Customize Profile & Styling
          </h2>
          {profileMessage && (
            <p className="text-sm font-medium text-emerald-600">
              {profileMessage}
            </p>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">
                Role / Headline
              </label>
              <input
                type="text"
                value={profile.role}
                onChange={(e) =>
                  setProfile({ ...profile, role: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">
                Skills & Tech Stack (comma separated)
              </label>
              <input
                type="text"
                value={profile.skills}
                onChange={(e) =>
                  setProfile({ ...profile, skills: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">
                Upload Resume (PDF Only)
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (file && file.type !== "application/pdf") {
                    setProfileMessage("Error: Only PDF documents are allowed.");
                    return;
                  }
                  setResumeFile(file);
                }}
                className="w-full text-sm px-2 py-1.5 border border-gray-300 rounded-md bg-gray-50"
              />
              {profile.resume_url && (
                <p className="text-xs text-emerald-600 mt-1 font-medium">
                  <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="underline">
                    View Active Resume Document →
                  </a>
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">
                Page Theme
              </label>
              <select
                value={profile.theme}
                onChange={(e) =>
                  setProfile({ ...profile, theme: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="light">Light Mode (Classic Minimalist)</option>
                <option value="dark">Dark Mode (Midnight Hacker)</option>
                <option value="slate">Amethyst (NextWork Purple & Playful)</option>
                <option value="forest">Retro Cyberpunk (Neon Green & Matrix)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">
                Typography Font
              </label>
              <select
                value={profile.font}
                onChange={(e) =>
                  setProfile({ ...profile, font: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="sans">Sans Serif (Clean & Modern)</option>
                <option value="serif">Serif (Elegant & Editorial)</option>
                <option value="mono">Monospace (Technical & Code-like)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700 transition-colors"
          >
            Save Profile & Styling
          </button>
        </form>

        <form
          onSubmit={handleSubmit}
          className="space-y-3 mb-10 p-6 bg-white border border-gray-200 rounded-lg shadow-sm"
        >
          <h2 className="text-lg font-semibold border-b pb-2 text-gray-800">
            {editingId ? "Edit Project" : "2. Add New Project"}
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
            placeholder="Tech Stack"
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
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="w-full"
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
                  setForm({
                    title: "",
                    description: "",
                    tech_stack: "",
                    live_url: "",
                    github_url: "",
                    image_url: "",
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="space-y-4 bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">Your Projects</h2>
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-55 transition-colors"
            >
              <div>
                <h3 className="font-medium text-gray-900">{project.title}</h3>
                <p className="text-sm text-gray-500">{project.tech_stack}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(project)}
                  className="text-sm px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="text-sm px-3 py-1 border border-red-200 text-red-600 rounded-md hover:bg-red-50"
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
