
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function getTechColor(tech: string, theme: string): string {
  const name = tech.toLowerCase().trim();
  const isDark = theme !== "light";

  if (isDark) {
    if (name.includes("typescript") || name === "ts") return "bg-[#60a5fa]";
    if (name.includes("javascript") || name === "js") return "bg-[#f1e05a]";
    if (name.includes("react")) return "bg-[#61dafb]";
    if (name.includes("next")) return "bg-white";
    if (name.includes("node")) return "bg-[#4ade80]";
    if (name.includes("supabase")) return "bg-[#3ecf8e]";
    if (name.includes("postgres") || name.includes("sql")) return "bg-[#60a5fa]";
    if (name.includes("tailwind")) return "bg-[#38bdf8]";
    if (name.includes("python")) return "bg-[#ffd343]";
    if (name.includes("html")) return "bg-[#f97316]";
    if (name.includes("css")) return "bg-[#c084fc]";
    return "bg-slate-200";
  } else {
    if (name.includes("typescript") || name === "ts") return "bg-[#881337]";
    if (name.includes("javascript") || name === "js") return "bg-[#b79a00]";
    if (name.includes("react")) return "bg-[#4c0519]";
    if (name.includes("next")) return "bg-[#310212]";
    if (name.includes("node")) return "bg-[#215732]";
    if (name.includes("supabase")) return "bg-[#1c784c]";
    if (name.includes("postgres") || name.includes("sql")) return "bg-[#336791]";
    if (name.includes("tailwind")) return "bg-[#0ea5e9]";
    if (name.includes("python")) return "bg-[#306998]";
    if (name.includes("html")) return "bg-[#c0392b]";
    if (name.includes("css")) return "bg-[#563d7c]";
    return "bg-rose-950/60";
  }
}

export default async function Home() {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profile")
    .select("*")
    .single();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  const theme = (profile?.theme as "light" | "dark" | "slate" | "forest") || "light";
  const font = (profile?.font as "sans" | "serif" | "mono") || "sans";

  const mainBg = {
    light: "bg-[#fbf9f4] relative overflow-hidden",
    dark: "bg-[#030014] relative overflow-hidden",
    slate: "bg-[#0a051b] relative overflow-hidden",
    forest: "bg-black relative overflow-hidden",
  }[theme];

  const themeClasses = {
    light: "bg-white/90 backdrop-blur-md text-[#4c0519] border-rose-100/80 hover:border-[#881337] hover:shadow-xl hover:shadow-rose-950/5 -translate-y-0 hover:-translate-y-1.5",
    dark: "bg-white/[0.03] backdrop-blur-xl text-zinc-100 border-white/[0.08] hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-500/10 -translate-y-0 hover:-translate-y-1.5",
    slate: "bg-white/[0.05] backdrop-blur-xl text-white border-white/[0.08] hover:border-fuchsia-500 hover:shadow-2xl hover:shadow-fuchsia-500/20 -translate-y-0 hover:-translate-y-1.5",
    forest: "bg-zinc-950/80 border-green-950/60 text-green-400 hover:border-green-400 hover:shadow-lg hover:shadow-green-500/20 -translate-y-0 hover:-translate-y-1",
  }[theme];

  const textMuted = {
    light: "text-rose-900/80",
    dark: "text-zinc-400",
    slate: "text-violet-300",
    forest: "text-green-500 font-mono tracking-wider",
  }[theme];

  const headerGradient = {
    light: "bg-gradient-to-r from-[#310212] via-[#630424] to-[#9f1239] bg-clip-text text-transparent",
    dark: "bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent",
    slate: "bg-gradient-to-r from-fuchsia-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent",
    forest: "text-green-400 font-mono tracking-tight",
  }[theme];

  const borderTheme = {
    light: "border-rose-200/50",
    dark: "border-zinc-800/80",
    slate: "border-violet-900/50",
    forest: "border-green-950",
  }[theme];

  const buttonClasses = {
    light: "bg-[#4c0519] text-[#fbf9f4] hover:bg-[#881337] hover:shadow-rose-950/20",
    dark: "bg-emerald-500 text-black hover:bg-emerald-400 hover:shadow-emerald-950/40",
    slate: "bg-fuchsia-600 text-white hover:bg-fuchsia-500 hover:shadow-fuchsia-950/40",
    forest: "bg-green-500 text-black hover:bg-green-400 hover:shadow-green-950/40",
  }[theme];

  const fontClasses = {
    sans: "font-sans",
    serif: "font-serif",
    mono: "font-mono",
  }[font];

  return (
    <main className={`min-h-screen pb-16 ${mainBg} ${themeClasses} ${fontClasses} transition-all duration-500`}>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float-fluid-1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(40px, -60px) scale(1.1); }
          66% { transform: translate(-30px, 40px) scale(0.9); }
        }
        @keyframes float-fluid-2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-50px, 60px) scale(1.15); }
        }
        @keyframes nebula-pulse {
          0%, 100% { transform: scale(1) translate(0px, 0px); opacity: 0.08; }
          50% { transform: scale(1.15) translate(30px, -40px); opacity: 0.15; }
        }
        @keyframes star-twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 0.9; transform: scale(1.2); }
        }
        @keyframes geo-rotate-1 {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-40px) rotate(180deg); }
          100% { transform: translateY(0px) rotate(360deg); }
        }
        @keyframes geo-rotate-2 {
          0% { transform: translateY(0px) rotate(360deg); }
          50% { transform: translateY(50px) rotate(180deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes matrix-fall {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-fluid-1 { animation: float-fluid-1 22s ease-in-out infinite; }
        .animate-fluid-2 { animation: float-fluid-2 28s ease-in-out infinite; }
        .animate-nebula { animation: nebula-pulse 18s ease-in-out infinite; }
        .animate-twinkle { animation: star-twinkle 4s ease-in-out infinite; }
        .animate-geo-1 { animation: geo-rotate-1 22s ease-in-out infinite; }
        .animate-geo-2 { animation: geo-rotate-2 26s ease-in-out infinite; }
        .animate-matrix-col { animation: matrix-fall 14s linear infinite; }
        .animate-scanline { animation: scanline 7s linear infinite; }
      `}} />

      {theme === "light" && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-50px] left-[-50px] w-[500px] h-[500px] bg-rose-200/15 rounded-full blur-3xl animate-fluid-1" />
          <div className="absolute bottom-[-100px] right-[-100px] w-[600px] h-[600px] bg-amber-100/25 rounded-full blur-3xl animate-fluid-2" />
        </div>
      )}

      {theme === "dark" && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] animate-nebula" />
          <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] animate-nebula" style={{ animationDelay: "4s" }} />
          <div className="absolute top-20 left-1/3 w-1 h-1 bg-white rounded-full animate-twinkle" />
          <div className="absolute top-40 right-1/4 w-1.5 h-1.5 bg-white rounded-full animate-twinkle" style={{ animationDelay: "1.2s" }} />
          <div className="absolute bottom-1/3 left-10 w-1 h-1 bg-white rounded-full animate-twinkle" style={{ animationDelay: "2.5s" }} />
        </div>
      )}

      {theme === "slate" && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-100px] right-[-100px] w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-[200px] left-[-100px] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[150px]" />
          <div className="absolute top-1/4 left-10 w-24 h-24 border border-fuchsia-500/10 rounded-xl animate-geo-1" />
          <div className="absolute top-1/2 right-12 w-32 h-32 border border-violet-500/10 rounded-full animate-geo-2" />
          <div className="absolute bottom-10 left-1/3 w-16 h-16 border border-indigo-500/10 rotate-45 animate-geo-1" />
        </div>
      )}

      {theme === "forest" && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#022c22_1px,transparent_1px),linear-gradient(to_bottom,#022c22_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
          <div className="absolute top-0 left-0 w-full h-[3px] bg-green-500/20 animate-scanline" />
          <div className="flex justify-around opacity-[0.06] text-[11px] text-green-400 font-mono w-full h-full select-none">
            <span className="relative animate-matrix-col" style={{ animationDelay: "1s" }}>010110010110</span>
            <span className="relative animate-matrix-col" style={{ animationDelay: "3s" }}>100111010101</span>
            <span className="relative animate-matrix-col" style={{ animationDelay: "6s" }}>001011100010</span>
            <span className="relative animate-matrix-col" style={{ animationDelay: "2s" }}>110110010100</span>
            <span className="relative animate-matrix-col" style={{ animationDelay: "5s" }}>011100101101</span>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
        
        <header className={`mb-12 border-b pb-8 ${borderTheme}`}>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <div className="inline-block px-2.5 py-0.5 rounded-full border border-current text-[10px] font-mono opacity-80">
              Available for Freelance & Roles
            </div>
            {profile?.resume_url && (
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase transition-all duration-300 shadow-md ${buttonClasses}`}
              >
                View Resume →
              </a>
            )}
          </div>

          <h1 className={`text-4xl font-black tracking-tight ${headerGradient}`}>
            {profile?.name || "Your Name"}
          </h1>
          <p className={`mt-2 text-xl font-semibold tracking-tight ${textMuted}`}>
            {profile?.role || "Software Engineer"}
          </p>
          <p className="mt-3 text-sm opacity-75 max-w-2xl leading-relaxed">
            I craft responsive, resilient digital products with modern technologies. Let's design the next generation of web applications.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 items-center">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mr-1.5">
              Primary Focus:
            </span>
            {profile?.skills.split(",").map((skill: string, idx: number) => {
              const dotColor = getTechColor(skill, theme);
              return (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-1.5 text-[10px] px-2.5 py-0.5 rounded-full border ${borderTheme} bg-white/[0.02] backdrop-blur-sm font-mono`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                  {skill.trim()}
                </span>
              );
            })}
          </div>
        </header>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold tracking-tight">Featured Work</h2>
            <div className="h-[1px] flex-grow bg-current opacity-10 mx-4" />
          </div>

          <div className="grid gap-5 grid-cols-1">
            {projects?.map((project) => (
              <div
                key={project.id}
                className={`border rounded-xl p-5 flex flex-col md:flex-row gap-5 items-start transition-all duration-300 ${themeClasses}`}
              >
                {project.image_url && (
                  project.live_url ? (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative overflow-hidden rounded-lg border border-white/[0.05] w-full md:w-56 h-36 shrink-0 shadow-inner cursor-pointer block"
                    >
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-20 shadow-md transform translate-y-1 group-hover:translate-y-0">
                        Visit project
                      </div>
                    </a>
                  ) : (
                    <div className="overflow-hidden rounded-lg border border-white/[0.05] w-full md:w-56 h-36 shrink-0 shadow-inner">
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )
                )}
                <div className="flex-grow flex flex-col justify-between h-full w-full">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight">{project.title}</h3>
                    <p className={`mt-1.5 text-xs leading-relaxed text-justify ${textMuted}`}>
                      {project.description}
                    </p>
                  </div>
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech_stack?.split(",").map((tech: string, idx: number) => {
                        const dotColor = getTechColor(tech, theme);
                        return (
                          <span key={idx} className="inline-flex items-center gap-1.5 text-[9px] px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 font-mono text-gray-400 border border-white/[0.02]">
                            <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                            {tech.trim()}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
