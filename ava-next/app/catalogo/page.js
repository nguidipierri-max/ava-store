import Link from "next/link";

const productos = [
  { id: 1, nombre: "Calza High Impact", precio: 12999, slug: "calza-high-impact" },
  { id: 2, nombre: "Top Yoga Lila", precio: 8999, slug: "top-yoga-lila" },
  { id: 3, nombre: "Conjunto Fitness Verde", precio: 19999, slug: "conjunto-fitness-verde" },
];

export const metadata = {
  title: "Catálogo – AVA",
  description: "Explorá toda la colección de ropa fitness y yoga de AVA.",
};

export default function Catalogo() {
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
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "2rem"
      }}>
        {productos.map((producto) => (
          <Link key={producto.id} href={`/catalogo/${producto.slug}`} style={{ textDecoration: "none" }}>
            <article style={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)"
            }}>
              <div style={{
                width: "100%",
                height: "250px",
                backgroundColor: "#ede5dc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#b8a99a"
              }}>
                {producto.nombre}
              </div>
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
                <p style={{ color: "#7a7a7a" }}>
                  ${producto.precio.toLocaleString("es-AR")}
                </p>
              </div>
            </article>
          </Link>
        ))}
      </div>
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