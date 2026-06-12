import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  // Fetch all projects, newest first
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();

  // Verify the user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Insert the new project into the database
  const { data, error } = await supabase
    .from("projects")
    .insert({
      title: body.title,
      description: body.description,
      tech_stack: body.tech_stack,
      live_url: body.live_url,
      github_url: body.github_url,
    })
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data, { status: 201 });
}