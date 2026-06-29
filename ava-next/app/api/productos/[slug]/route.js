import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

// GET /api/productos/[slug] — devuelve un solo producto por su slug, desde Supabase.
export async function GET(request, { params }) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Producto no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}