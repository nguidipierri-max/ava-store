import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Catalogo from "./components/Catalogo";

function App() {
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    const guardado = localStorage.getItem("ava-carrito-react");
    if (guardado) {
      setCarrito(JSON.parse(guardado));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("ava-carrito-react", JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((p) => p.id === producto.id);
      if (existe) {
        return prev.map((p) =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const cantidadTotal = carrito.reduce((acc, p) => acc + p.cantidad, 0);

  return (
    <div>
      <Navbar cantidadCarrito={cantidadTotal} />

      <section style={{
        minHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "4rem 2rem",
        background: "linear-gradient(135deg, #f5f0eb 0%, #ede5dc 100%)"
      }}>
        <h1 style={{
          fontFamily: "Georgia, serif",
          fontSize: "4rem",
          color: "#2d2d2d",
          fontWeight: "normal",
          marginBottom: "1rem"
        }}>
          Movete con intención.
        </h1>
        <p style={{ color: "#7a7a7a", fontSize: "1.1rem", marginBottom: "2rem" }}>
          Ropa diseñada para el yoga y el fitness que te acompaña en cada postura.
        </p>
        <a href="#catalogo" style={{
          padding: "0.9rem 2.5rem",
          backgroundColor: "#2d2d2d",
          color: "white",
          textDecoration: "none",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          fontSize: "0.85rem",
          borderRadius: "8px"
        }}>
          Ver colección
        </a>
      </section>

      <Catalogo onAgregar={agregarAlCarrito} />

      <footer style={{
        textAlign: "center",
        padding: "2rem",
        backgroundColor: "#2d2d2d",
        color: "white",
        fontSize: "0.85rem"
      }}>
        © 2026 AVA. Todos los derechos reservados.
      </footer>
    </div>
  );
}

export default App;