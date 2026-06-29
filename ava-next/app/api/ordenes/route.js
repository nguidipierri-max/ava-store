import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";

// POST /api/ordenes — crea una orden nueva con sus items.
// Body esperado: { items: [{ product_id, cantidad, precio_unitario }] }
export async function POST(request) {
  const body = await request.json();
  const { items } = body;

  if (!items || items.length === 0) {
    return NextResponse.json(
      { error: "El carrito está vacío" },
      { status: 400 }
    );
  }

  const total = items.reduce(
    (acc, item) => acc + item.cantidad * item.precio_unitario,
    0
  );

  // 1. Creamos la orden
  const { data: orden, error: errorOrden } = await supabase
    .from("orders")
    .insert({ total, estado: "pendiente" })
    .select()
    .single();

  if (errorOrden) {
    return NextResponse.json(
      { error: "No se pudo crear la orden" },
      { status: 500 }
    );
  }

  // 2. Creamos los items de esa orden
  const itemsParaInsertar = items.map((item) => ({
    order_id: orden.id,
    product_id: item.product_id,
    cantidad: item.cantidad,
    precio_unitario: item.precio_unitario,
  }));

  const { error: errorItems } = await supabase
    .from("order_items")
    .insert(itemsParaInsertar);

  if (errorItems) {
    return NextResponse.json(
      { error: "No se pudieron guardar los items de la orden" },
      { status: 500 }
    );
  }

  return NextResponse.json(orden, { status: 201 });
}