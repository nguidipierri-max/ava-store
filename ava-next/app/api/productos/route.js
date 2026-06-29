import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";
import { supabaseAdmin } from "../../lib/supabase-admin";

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

// POST /api/productos — crea un producto nuevo (uso administrativo).
// Body esperado: { nombre, precio, slug, descripcion, stock }
export async function POST(request) {
  const body = await request.json();
  const { nombre, precio, slug, descripcion, stock } = body;

  if (!nombre || !precio || !slug) {
    return NextResponse.json(
      { error: "Faltan datos obligatorios (nombre, precio, slug)" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("products")
    .insert({
      nombre,
      precio,
      slug,
      descripcion: descripcion || "",
      stock: stock ?? 0,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: "No se pudo crear el producto" },
      { status: 500 }
    );
  }

  return NextResponse.json(data, { status: 201 });
}

// PUT /api/productos — edita un producto existente (uso administrativo).
// Body esperado: { id, nombre, precio, slug, descripcion, stock }
export async function PUT(request) {
  const body = await request.json();
  const { id, nombre, precio, slug, descripcion, stock } = body;

  if (!id) {
    return NextResponse.json(
      { error: "Falta el id del producto a editar" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("products")
    .update({ nombre, precio, slug, descripcion, stock })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: "No se pudo editar el producto" },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

// DELETE /api/productos?id=... — borra un producto (uso administrativo).
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Falta el id del producto a borrar" },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: "No se pudo borrar el producto" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}