"use client";

export default function BotonCarrito({ producto }) {
  const agregar = () => {
    const guardado = localStorage.getItem("ava-carrito-next");
    const carrito = guardado ? JSON.parse(guardado) : [];
    
    const existe = carrito.find(p => p.id === producto.id);
    if (existe) {
      existe.cantidad += 1;
    } else {
      carrito.push({ ...producto, cantidad: 1 });
    }
    
    localStorage.setItem("ava-carrito-next", JSON.stringify(carrito));
    window.dispatchEvent(new Event("ava-carrito-actualizado"));
  };

  return (
    <button
      onClick={agregar}
      style={{
        width: "100%",
        padding: "0.85rem",
        backgroundColor: "#2d2d2d",
        color: "white",
        border: "none",
        cursor: "pointer",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        fontSize: "0.8rem",
        borderRadius: "0 0 8px 8px"
      }}
    >
      Agregar al carrito
    </button>
  );
}