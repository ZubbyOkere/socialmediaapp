import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gckbouqmtivaopbgjvyr.supabase.co";
const supabaseApiKey = import.meta.env.VITE_SUPABASE_API_KEY;

export const supabase = createClient(supabaseUrl, supabaseApiKey);
