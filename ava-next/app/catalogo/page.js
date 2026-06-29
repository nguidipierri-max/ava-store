import Link from "next/link";
import BotonCarrito from "../components/BotonCarrito";

export const metadata = {
  title: "Catálogo – AVA",
  description: "Explorá toda la colección de ropa fitness y yoga de AVA.",
};

async function getProductos() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/productos`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function Catalogo() {
  const productos = await getProductos();

  return (
    <main style={{ padding: "4rem 2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{
        fontFamily: "Georgia, serif",
        fontWeight: "normal",
        fontSize: "2.5rem",
        marginBottom: "2rem",
        color: "#2d2d2d"
      }}>
        Colección completa
      </h1>

      {productos.length === 0 ? (
        <p style={{ color: "#7a7a7a" }}>No hay productos disponibles en este momento.</p>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "2rem"
        }}>
          {productos.map((producto) => (
            <article key={producto.id} style={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)"
            }}>
              <Link
                href={`/catalogo/${producto.slug}`}
                style={{ textDecoration: "none" }}
                aria-label={`Ver detalle de ${producto.nombre}`}
              >
                <img
                  src={`/images/producto${producto.id}.jpg`}
                  alt={producto.nombre}
                  style={{ width: "100%", height: "250px", objectFit: "cover" }}
                />
                <div style={{ padding: "1rem" }}>
                  <h2 style={{
                    fontFamily: "Georgia, serif",
                    fontWeight: "normal",
                    color: "#2d2d2d",
                    marginBottom: "0.25rem",
                    fontSize: "1.1rem"
                  }}>
                    {producto.nombre}
                  </h2>
                  <p style={{ color: "#7a7a7a", marginBottom: "0.75rem" }}>
                    ${producto.precio.toLocaleString("es-AR")}
                  </p>
                </div>
              </Link>
              <BotonCarrito producto={producto} />
            </article>
          ))}
        </div>
      )}

      <Link href="/" style={{
        display: "inline-block",
        marginTop: "2rem",
        color: "#7a7a7a",
        textDecoration: "none",
        fontSize: "0.9rem"
      }}>
        ← Volver al inicio
      </Link>
    </main>
  );
}