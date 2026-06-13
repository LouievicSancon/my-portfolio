
import { createClient } from "@/lib/supabase/server";

const PROFILE_ID = "00000000-0000-0000-0000-000000000000";

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .eq("id", PROFILE_ID)
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}

export async function PUT(request: Request) {
  const supabase = await createClient();

  // Verify the user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const { data, error } = await supabase
    .from("profile")
    .update({
      name: body.name,
      role: body.role,
      skills: body.skills,
      theme: body.theme,
      font: body.font,
      resume_url: body.resume_url, // Added this field!
    })
    .eq("id", PROFILE_ID)
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}
