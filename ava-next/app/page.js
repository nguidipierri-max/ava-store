import Link from "next/link";

const productos = [
  { id: 1, nombre: "Conjunto Hele", precio: 12999, slug: "conjunto-hele" },
  { id: 2, nombre: "Conjunto Angiu", precio: 8999, slug: "conjunto-angiu" },
  { id: 3, nombre: "Conjunto Strip", precio: 19999, slug: "conjunto-strip" },
];

export const metadata = {
  title: "AVA – Ropa Fitness & Yoga",
  description: "Ropa diseñada para el yoga y el fitness que te acompaña en cada postura.",
};

export default function Home() {
  return (
    <main>
      {/* HERO */}
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
        <Link href="/catalogo" style={{
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
        </Link>
      </section>

      {/* PREVIEW CATÁLOGO */}
      <section style={{ padding: "4rem 2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{
          fontFamily: "Georgia, serif",
          fontWeight: "normal",
          fontSize: "2rem",
          marginBottom: "2rem",
          color: "#2d2d2d"
        }}>
          Colección
        </h2>
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
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                cursor: "pointer"
              }}>
                <img
                  src={`/images/producto${producto.id}.jpg`}
                  alt={producto.nombre}
                  style={{ width: "100%", height: "250px", objectFit: "cover" }}
                />
                <div style={{ padding: "1rem" }}>
                  <h3 style={{
                    fontFamily: "Georgia, serif",
                    fontWeight: "normal",
                    color: "#2d2d2d",
                    marginBottom: "0.25rem"
                  }}>
                    {producto.nombre}
                  </h3>
                  <p style={{ color: "#7a7a7a" }}>
                    ${producto.precio.toLocaleString("es-AR")}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}