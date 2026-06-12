import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  // Verify the user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Extract the file from the multipart form data
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }

  // Generate a unique filename using a timestamp
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;

  // Upload the file to the project-images bucket
  const { error: uploadError } = await supabase.storage
    .from("project-images")
    .upload(fileName, file);

  if (uploadError) {
    return Response.json({ error: uploadError.message }, { status: 500 });
  }

  // Get the public URL for the uploaded file
  const { data: urlData } = supabase.storage
    .from("project-images")
    .getPublicUrl(fileName);

  return Response.json({ url: urlData.publicUrl }, { status: 201 });
}