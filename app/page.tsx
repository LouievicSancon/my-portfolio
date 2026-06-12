import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function Home() {
  // Fetch all projects from Supabase, newest first
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Hero section with your name and intro */}
        <header className="mb-16">
          <h1 className="text-4xl font-bold tracking-tight">Your Name</h1>
          <p className="mt-2 text-lg text-gray-600">
            Software Engineer
          </p>
          <p className="mt-4 text-gray-500 max-w-2xl">
            I build web applications with modern technologies. Here are some of
            my recent projects.
          </p>
        </header>

        {/* Project cards grid */}
        <section>
          <h2 className="text-2xl font-semibold mb-8">Projects</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {projects?.map((project) => (
              <div
                key={project.id}
                className="border border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-colors"
              >
                <h3 className="text-lg font-medium">{project.title}</h3>
                <p className="mt-2 text-sm text-gray-600">
                  {project.description}
                </p>
                <p className="mt-3 text-xs text-gray-400">
                  {project.tech_stack}
                </p>
                <div className="mt-4 flex gap-3">
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Live Demo
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}