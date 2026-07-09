import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";

// POST /api/contacto — guarda un mensaje del formulario de contacto en Supabase.
// Body esperado: { nombre, email, mensaje }
export async function POST(request) {
  const body = await request.json();
  const { nombre, email, mensaje } = body;

  if (!nombre || !email || !mensaje) {
    return NextResponse.json(
      { error: "Faltan datos obligatorios (nombre, email, mensaje)" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("mensajes_contacto")
    .insert({ nombre, email, mensaje });

  if (error) {
    console.error("Error al guardar mensaje de contacto:", error);
    return NextResponse.json(
      { error: "No se pudo guardar el mensaje" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}