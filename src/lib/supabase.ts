import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = process.env.SCIWEAVE_SUPABASE_URL;
export const supabaseServiceKey = process.env.SCIWEAVE_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.warn("Supabase environment variables not configured - some features may be limited");
    console.warn(`SCIWEAVE_SUPABASE_URL: ${supabaseUrl ? 'set' : 'missing'}`);
    console.warn(`SCIWEAVE_SUPABASE_SERVICE_KEY: ${supabaseServiceKey ? 'set' : 'missing'}`);
}

export const supabase =
    supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

