import "server-only";

function getRequiredEnvironmentVariable(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(
      `Supabase configuration error: ${name} is required. Set it in the server environment.`,
    );
  }

  return value;
}

export function getSupabaseUrl() {
  const value = getRequiredEnvironmentVariable("SUPABASE_URL");

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(
      "Supabase configuration error: SUPABASE_URL must be a valid absolute HTTP(S) URL.",
    );
  }

  if (
    (url.protocol !== "https:" && url.protocol !== "http:") ||
    !url.hostname
  ) {
    throw new Error(
      "Supabase configuration error: SUPABASE_URL must be a valid absolute HTTP(S) URL.",
    );
  }

  return url.toString().replace(/\/$/, "");
}

export function getSupabaseServiceRoleKey() {
  return getRequiredEnvironmentVariable("SUPABASE_SERVICE_ROLE_KEY");
}

export function getSupabaseAnonKey() {
  return getRequiredEnvironmentVariable("SUPABASE_ANON_KEY");
}
