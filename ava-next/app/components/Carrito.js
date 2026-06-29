"use client";
import { useState, useEffect } from "react";

export default function Carrito() {
  const [carrito, setCarrito] = useState([]);
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    const guardado = localStorage.getItem("ava-carrito-next");
    if (guardado) setCarrito(JSON.parse(guardado));

    window.addEventListener("ava-carrito-actualizado", () => {
      const nuevo = localStorage.getItem("ava-carrito-next");
      if (nuevo) setCarrito(JSON.parse(nuevo));
    });
  }, []);

  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  const cantidadTotal = carrito.reduce((acc, p) => acc + p.cantidad, 0);

  const cambiarCantidad = (id, delta) => {
    const nuevo = carrito.map(p =>
      p.id === id ? { ...p, cantidad: Math.max(1, p.cantidad + delta) } : p
    );
    setCarrito(nuevo);
    localStorage.setItem("ava-carrito-next", JSON.stringify(nuevo));
  };

  const quitar = (id) => {
    const nuevo = carrito.filter(p => p.id !== id);
    setCarrito(nuevo);
    localStorage.setItem("ava-carrito-next", JSON.stringify(nuevo));
  };

  const vaciar = () => {
    setCarrito([]);
    localStorage.removeItem("ava-carrito-next");
  };

  const finalizarCompra = async () => {
    try {
      const items = carrito.map(p => ({
        product_id: p.id,
        cantidad: p.cantidad,
        precio_unitario: p.precio,
      }));

      const resOrden = await fetch("/api/ordenes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      if (!resOrden.ok) {
        alert("No se pudo crear la orden. Probá de nuevo.");
        return;
      }

      const orden = await resOrden.json();

      const resPago = await fetch("/api/pago", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orden_id: orden.id }),
      });

      if (!resPago.ok) {
        alert("No se pudo generar el pago. Probá de nuevo.");
        return;
      }

      const { init_point } = await resPago.json();
      window.location.href = init_point;

    } catch (error) {
      console.error("Error en checkout:", error);
      alert("Ocurrió un error al procesar la compra.");
    }
  };

  return (
    <>
      {/* Botón carrito en el nav */}
      <button
        onClick={() => setAbierto(true)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "0.9rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#3a3a3a",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem"
        }}
      >
        🛒 {cantidadTotal > 0 && (
          <span style={{
            background: "#b8a99a",
            color: "white",
            borderRadius: "50%",
            width: "20px",
            height: "20px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.75rem"
          }}>{cantidadTotal}</span>
        )}
      </button>

      {/* Panel del carrito */}
      {abierto && (
        <div style={{
          position: "fixed",
          top: 0, right: 0,
          width: "420px",
          height: "100vh",
          backgroundColor: "#fff",
          boxShadow: "-4px 0 20px rgba(0,0,0,0.15)",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          padding: "2rem"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <h2 style={{ fontFamily: "Georgia, serif", fontWeight: "normal", margin: 0, fontSize: "1.5rem" }}>Tu carrito</h2>
            <button onClick={() => setAbierto(false)} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer" }}>✕</button>
          </div>

          {carrito.length === 0 ? (
            <p style={{ color: "#7a7a7a", textAlign: "center", marginTop: "4rem" }}>Tu carrito está vacío.</p>
          ) : (
            <>
              <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
                {carrito.map(p => (
                  <div key={p.id} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem",
                    backgroundColor: "#faf9f7",
                    borderRadius: "8px"
                  }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: "bold", fontSize: "0.95rem" }}>{p.nombre}</p>
                      <p style={{ margin: "0.2rem 0 0", color: "#7a7a7a", fontSize: "0.85rem" }}>
                        ${p.precio.toLocaleString("es-AR")}
                      </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <button onClick={() => cambiarCantidad(p.id, -1)} style={{
                        width: "28px", height: "28px", borderRadius: "50%",
                        border: "1px solid #ddd", background: "#fff",
                        cursor: "pointer", fontSize: "1rem"
                      }}>−</button>
                      <span style={{ width: "20px", textAlign: "center" }}>{p.cantidad}</span>
                      <button onClick={() => cambiarCantidad(p.id, 1)} style={{
                        width: "28px", height: "28px", borderRadius: "50%",
                        border: "1px solid #ddd", background: "#fff",
                        cursor: "pointer", fontSize: "1rem"
                      }}>+</button>
                    </div>
                    <button onClick={() => quitar(p.id)} style={{
                      background: "#e74c3c", color: "white",
                      border: "none", borderRadius: "6px",
                      padding: "0.3rem 0.7rem", cursor: "pointer",
                      fontSize: "0.8rem"
                    }}>Quitar</button>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "1px solid #e8e0d8", paddingTop: "1.5rem", marginTop: "1rem" }}>
                <p style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "1.1rem" }}>
                  <span>Total:</span>
                  <span>${total.toLocaleString("es-AR")}</span>
                </p>
                <button onClick={vaciar} style={{
                  width: "100%", padding: "0.85rem",
                  backgroundColor: "#fff", color: "#2d2d2d",
                  border: "1px solid #2d2d2d", borderRadius: "8px",
                  cursor: "pointer", marginBottom: "0.75rem",
                  fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase"
                }}>Vaciar carrito</button>
                <button onClick={finalizarCompra} style={{
                  width: "100%", padding: "0.85rem",
                  backgroundColor: "#2d2d2d", color: "white",
                  border: "none", borderRadius: "8px",
                  cursor: "pointer", fontSize: "0.85rem",
                  letterSpacing: "0.1em", textTransform: "uppercase"
                }}>Finalizar compra</button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}