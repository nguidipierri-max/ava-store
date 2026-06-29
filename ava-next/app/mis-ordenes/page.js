"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function MisOrdenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function cargarOrdenes() {
      const { data: sesion } = await supabase.auth.getSession();
      const user = sesion?.session?.user;

      if (!user) {
        router.push("/login");
        return;
      }

      setUsuario(user);

      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*, products(nombre, slug))")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error) {
        setOrdenes(data);
      }
      setCargando(false);
    }

    cargarOrdenes();
  }, [router]);

  const estadoColor = {
    pagado: "#2e7d32",
    pendiente: "#b8860b",
    fallido: "#c62828",
    cancelado: "#757575",
  };

  if (cargando) {
    return (
      <main style={{ padding: "4rem 2rem", maxWidth: "700px", margin: "0 auto" }}>
        <p>Cargando tus órdenes...</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "4rem 2rem", maxWidth: "700px", margin: "0 auto" }}>
      <h1 style={{ fontFamily: "Georgia, serif", fontWeight: "normal", marginBottom: "2rem" }}>
        Mis órdenes
      </h1>

      {ordenes.length === 0 ? (
        <p style={{ color: "#7a7a7a" }}>Todavía no hiciste ninguna compra.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {ordenes.map((orden) => (
            <div
              key={orden.id}
              style={{
                border: "1px solid #e8e0d8",
                borderRadius: "10px",
                padding: "1.5rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <span style={{ fontWeight: "bold" }}>Orden #{orden.id}</span>
                <span
                  style={{
                    color: estadoColor[orden.estado] || "#2d2d2d",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    fontSize: "0.8rem",
                  }}
                >
                  {orden.estado}
                </span>
              </div>

              <p style={{ color: "#7a7a7a", fontSize: "0.85rem", marginBottom: "1rem" }}>
                {new Date(orden.created_at).toLocaleDateString("es-AR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
                {orden.order_items?.map((item) => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                    <span>{item.products?.nombre || `Producto #${item.product_id}`} x{item.cantidad}</span>
                    <span>${(item.precio_unitario * item.cantidad).toLocaleString("es-AR")}</span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "1px solid #e8e0d8", paddingTop: "0.75rem", display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                <span>Total:</span>
                <span>${orden.total.toLocaleString("es-AR")}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}