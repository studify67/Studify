import { createClient } from "@supabase/supabase-js";

// Base Supabase project URL without /rest/v1/ or trailing slash
const SUPABASE_URL = "https://zoogpcfixsebgycmiegh.supabase.co";
const SUPABASE_PUBLIC_KEY = "sb_publishable_vmELTEuTpDtxafBLwu4bIg_YN_kDAZp";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
