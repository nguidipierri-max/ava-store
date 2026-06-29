import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { supabaseAdmin } from "../../lib/supabase-admin";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

// POST /api/webhook — Mercado Pago llama acá cuando cambia el estado de un pago.
export async function POST(request) {
  const body = await request.json();

  console.log("PASO 1 - Webhook recibido:", body);

  if (body.type !== "payment") {
    console.log("PASO 1b - No es tipo payment, saliendo");
    return NextResponse.json({ recibido: true });
  }

  const paymentId = body.data.id;

  const payment = new Payment(client);
  const detallePago = await payment.get({ id: paymentId });

  const ordenId = Number(detallePago.external_reference);
  const estadoPago = detallePago.status;
  console.log("PASO 2 - ordenId:", ordenId, "| estadoPago:", estadoPago);

  let nuevoEstado = "pendiente";
  if (estadoPago === "approved") nuevoEstado = "pagado";
  if (estadoPago === "rejected") nuevoEstado = "fallido";
  if (estadoPago === "cancelled") nuevoEstado = "cancelado";

  console.log("PASO 3 - nuevoEstado calculado:", nuevoEstado);

  const { data: ordenActual } = await supabaseAdmin
    .from("orders")
    .select("estado")
    .eq("id", ordenId)
    .single();

  console.log("PASO 4 - ordenActual (antes de actualizar):", ordenActual);

  const yaEstabaPagada = ordenActual?.estado === "pagado";
  console.log("PASO 5 - yaEstabaPagada:", yaEstabaPagada);

  const { error, data } = await supabaseAdmin
    .from("orders")
    .update({ estado: nuevoEstado })
    .eq("id", ordenId)
    .select();

  console.log("PASO 6 - Resultado del update de orden:", { error, data });

  if (error) {
    console.error("PASO 6b - Error actualizando orden:", error);
    return NextResponse.json({ error: "No se pudo actualizar la orden" }, { status: 500 });
  }

  console.log("PASO 7 - Evaluando si descuento stock. nuevoEstado === 'pagado':", nuevoEstado === "pagado", "| !yaEstabaPagada:", !yaEstabaPagada);

  if (nuevoEstado === "pagado" && !yaEstabaPagada) {
    console.log("PASO 8 - ENTRANDO al bloque de descuento de stock para ordenId:", ordenId);

    const { data: items, error: errorItems } = await supabaseAdmin
      .from("order_items")
      .select("product_id, cantidad")
      .eq("order_id", ordenId);

    console.log("PASO 9 - items encontrados:", items, "| errorItems:", errorItems);

    if (errorItems) {
      console.error("PASO 9b - Error obteniendo items:", errorItems);
    } else if (!items || items.length === 0) {
      console.log("PASO 9c - No se encontraron items para esta orden");
    } else {
      for (const item of items) {
        console.log("PASO 10 - Procesando item:", item);

        const { data: producto, error: errorProducto } = await supabaseAdmin
          .from("products")
          .select("stock")
          .eq("id", item.product_id)
          .single();

        console.log("PASO 11 - producto encontrado:", producto, "| errorProducto:", errorProducto);

        if (producto) {
          const nuevoStock = Math.max(0, producto.stock - item.cantidad);
          const { error: errorUpdateStock } = await supabaseAdmin
            .from("products")
            .update({ stock: nuevoStock })
            .eq("id", item.product_id);
          console.log(`PASO 12 - Stock actualizado para producto ${item.product_id}: ${producto.stock} -> ${nuevoStock} | error:`, errorUpdateStock);
        }
      }
    }
  } else {
    console.log("PASO 8alt - NO se descuenta stock (ya estaba pagada o no es estado pagado)");
  }

  console.log("PASO 13 - Webhook terminado, respondiendo recibido:true");
  return NextResponse.json({ recibido: true });
}