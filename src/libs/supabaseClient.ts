import { createClient } from "@supabase/supabase-js";
import { clientEnv } from "src/env/schema.mjs";

export const supabase = createClient(
  clientEnv.NEXT_PUBLIC_SUPABASE_URL as string,
  clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);
