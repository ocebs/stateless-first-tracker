import { createClient } from "https://esm.sh/@supabase/supabase-js@1.35.3";
import { assert } from "https://deno.land/std/testing/asserts.ts";

const { SUPABASE_URL, SUPABASE_KEY } = Deno.env.toObject();
assert(SUPABASE_URL, "Missing Supabase URL");
assert(SUPABASE_KEY, "Missing Supabase key");

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
export default supabase;
