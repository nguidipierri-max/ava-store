import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

// Cliente con permisos de administrador: se usa SOLO en el backend
// (nunca en el navegador), y se salta las políticas de RLS.
export const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey);