import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { supabaseAdmin } from "../../lib/supabase-admin";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

// POST /api/webhook — Mercado Pago llama acá cuando cambia el estado de un pago.
export async function POST(request) {
  const body = await request.json();

  console.log("Webhook recibido:", body);

  // Mercado Pago manda distintos tipos de eventos; solo nos interesan los de pago.
  if (body.type !== "payment") {
    return NextResponse.json({ recibido: true });
  }

  const paymentId = body.data.id;

  // Consultamos a Mercado Pago el detalle real del pago (nunca confiamos
  // solo en lo que llega en el webhook, por seguridad).
  const payment = new Payment(client);
  const detallePago = await payment.get({ id: paymentId });

  const ordenId = Number(detallePago.external_reference);
  console.log("external_reference recibido:", ordenId, "| tipo:", typeof ordenId);

  const estadoPago = detallePago.status; // approved, pending, rejected, etc.

  // Traducimos el estado de Mercado Pago a nuestro propio estado de orden.
  let nuevoEstado = "pendiente";
  if (estadoPago === "approved") nuevoEstado = "pagado";
  if (estadoPago === "rejected") nuevoEstado = "fallido";
  if (estadoPago === "cancelled") nuevoEstado = "cancelado";

  const { error, data } = await supabaseAdmin
    .from("orders")
    .update({ estado: nuevoEstado })
    .eq("id", ordenId)
    .select();

  console.log("Resultado del update:", { error, data });

  if (error) {
    console.error("Error actualizando orden:", error);
    return NextResponse.json({ error: "No se pudo actualizar la orden" }, { status: 500 });
  }

  return NextResponse.json({ recibido: true });
}