import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { supabase } from "../../lib/supabase";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

// POST /api/pago — recibe el id de una orden ya creada y genera el link de pago.
export async function POST(request) {
  const { orden_id } = await request.json();

  // 1. Buscamos la orden y sus items en Supabase
  const { data: orden, error: errorOrden } = await supabase
    .from("orders")
    .select("*, order_items(*, products(*))")
    .eq("id", orden_id)
    .single();

  if (errorOrden || !orden) {
    return NextResponse.json(
      { error: "Orden no encontrada" },
      { status: 404 }
    );
  }

  // 2. Armamos los items en el formato que pide Mercado Pago
  const items = orden.order_items.map((item) => ({
    title: item.products.nombre,
    quantity: item.cantidad,
    unit_price: Number(item.precio_unitario),
    currency_id: "ARS",
  }));

  // 3. Creamos la preferencia de pago
  const preference = new Preference(client);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    const resultado = await preference.create({
      body: {
        items,
        external_reference: String(orden.id),
        payer: {
          email: "test_user_123456@testuser.com",
        },
        back_urls: {
          success: `${baseUrl}/pago/exito`,
          failure: `${baseUrl}/pago/error`,
          pending: `${baseUrl}/pago/pendiente`,
        },
      },
    });

    return NextResponse.json({ init_point: resultado.init_point });
  } catch (error) {
    return NextResponse.json(
      { error: "No se pudo generar el pago" },
      { status: 500 }
    );
  }
}