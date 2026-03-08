"use server";

import { createClient } from "@/utils/supabase/server";
import type { Database } from "@/utils/supabase/types";

type ApiKeyRow = Database["public"]["Tables"]["api_keys"]["Row"];
type ApiKeysActionError = { success: false; error: string };
type GetUserApiKeysResult =
  | { success: true; apiKeys: ApiKeyRow[]; isDeveloper: boolean }
  | ApiKeysActionError;
type GenerateApiKeyResult = { success: true; key: string } | ApiKeysActionError;
type DeleteApiKeyResult = { success: true } | ApiKeysActionError;
type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

async function getCurrentUser(supabase: SupabaseServerClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

async function getDeveloperStatus(supabase: SupabaseServerClient, userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("is_developer")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    return { isDeveloper: false, error: error.message };
  }

  return { isDeveloper: Boolean(data?.is_developer) };
}

export async function getUserApiKeys(): Promise<GetUserApiKeysResult> {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { isDeveloper, error: developerStatusError } = await getDeveloperStatus(supabase, user.id);

  if (developerStatusError) {
    return { success: false, error: developerStatusError };
  }

  const { data, error } = await supabase
    .from("api_keys")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, apiKeys: data, isDeveloper };
}

export async function generateApiKey(): Promise<GenerateApiKeyResult> {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { isDeveloper, error: developerStatusError } = await getDeveloperStatus(supabase, user.id);

  if (developerStatusError) {
    return { success: false, error: developerStatusError };
  }

  if (!isDeveloper) {
    return { success: false, error: "Only users with developer status can generate API keys." };
  }

  const newKey = crypto.randomUUID();

  const { error } = await supabase.from("api_keys").insert([{ user_id: user.id, key: newKey }]);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, key: newKey };
}

export async function deleteApiKey(id: string): Promise<DeleteApiKeyResult> {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase.from("api_keys").delete().eq("id", id).eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
