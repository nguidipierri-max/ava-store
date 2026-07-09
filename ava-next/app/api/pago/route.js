import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { supabase } from "../../lib/supabase";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

export async function POST(request) {
  const { orden_id } = await request.json();

  const { data: orden, error: errorOrden } = await supabase
    .from("orders")
    .select("*, order_items(*, products(*))")
    .eq("id", orden_id)
    .single();

  if (errorOrden || !orden) {
    console.error("ERROR AL BUSCAR ORDEN:", errorOrden);
    return NextResponse.json(
      { error: "Orden no encontrada" },
      { status: 404 }
    );
  }

  const items = orden.order_items.map((item) => ({
    title: item.products.nombre,
    quantity: item.cantidad,
    unit_price: Number(item.precio_unitario),
    currency_id: "ARS",
  }));

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
        auto_return: "approved",
      },
    });

    return NextResponse.json({ init_point: resultado.init_point });
  } catch (error) {
    console.error("ERROR MERCADO PAGO:", error);
    return NextResponse.json(
      { error: "No se pudo generar el pago" },
      { status: 500 }
    );
  }
}