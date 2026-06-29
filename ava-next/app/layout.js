import "./globals.css";
import Link from "next/link";
import Carrito from "./components/Carrito";

export const metadata = {
  title: "AVA – Ropa Fitness & Yoga",
  description: "Ropa diseñada para el yoga y el fitness que te acompaña en cada postura.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, fontFamily: "Helvetica Neue, Arial, sans-serif", backgroundColor: "#faf9f7" }}>
        
        <header style={{
          position: "sticky",
          top: 0,
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e8e0d8",
          zIndex: 100,
          padding: "1rem 2rem"
        }}>
          <nav style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            maxWidth: "1200px",
            margin: "0 auto"
          }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <span style={{
                fontFamily: "Georgia, serif",
                fontSize: "1.8rem",
                letterSpacing: "0.3em",
                color: "#2d2d2d"
              }}>AVA</span>
            </Link>
            <ul style={{
              listStyle: "none",
              display: "flex",
              gap: "2rem",
              margin: 0,
              padding: 0,
              alignItems: "center"
            }}>
              <li><Link href="/" style={{ textDecoration: "none", color: "#3a3a3a", fontSize: "0.9rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Inicio</Link></li>
              <li><Link href="/catalogo" style={{ textDecoration: "none", color: "#3a3a3a", fontSize: "0.9rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Colección</Link></li>
              <li><Link href="/mis-ordenes" style={{ textDecoration: "none", color: "#3a3a3a", fontSize: "0.9rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Mis Órdenes</Link></li>
              <li><Link href="#contacto" style={{ textDecoration: "none", color: "#3a3a3a", fontSize: "0.9rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Contacto</Link></li>
              <li><Carrito /></li>
            </ul>
          </nav>
        </header>

        {children}

        <section id="contacto" style={{
          padding: "4rem 2rem",
          backgroundColor: "#f0ebe4",
          textAlign: "center"
        }}>
          <h2 style={{
            fontFamily: "Georgia, serif",
            fontWeight: "normal",
            fontSize: "2rem",
            color: "#2d2d2d",
            marginBottom: "2rem"
          }}>Contacto</h2>
          <form style={{
            maxWidth: "600px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "1rem"
          }}>
            <input
              type="text"
              placeholder="Tu nombre"
              style={{
                padding: "0.9rem 1rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "1rem",
                backgroundColor: "#fff"
              }}
            />
            <input
              type="email"
              placeholder="Tu email"
              style={{
                padding: "0.9rem 1rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "1rem",
                backgroundColor: "#fff"
              }}
            />
            <textarea
              placeholder="¿En qué te podemos ayudar?"
              rows="4"
              style={{
                padding: "0.9rem 1rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "1rem",
                backgroundColor: "#fff",
                resize: "vertical"
              }}
            />
            <button type="submit" style={{
              padding: "0.9rem",
              backgroundColor: "#2d2d2d",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "0.9rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase"
            }}>
              Enviar mensaje
            </button>
          </form>
        </section>

        <footer style={{
          textAlign: "center",
          padding: "2rem",
          backgroundColor: "#2d2d2d",
          color: "white",
          fontSize: "0.85rem"
        }}>
          © 2026 AVA. Todos los derechos reservados.
        </footer>

      </body>
    </html>
  );
}