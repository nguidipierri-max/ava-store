import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";

// GET /api/productos — devuelve el catálogo completo desde Supabase.
export async function GET() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id");

  if (error) {
    return NextResponse.json(
      { error: "No se pudieron cargar los productos" },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}