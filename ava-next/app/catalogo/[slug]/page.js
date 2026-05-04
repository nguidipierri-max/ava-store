const productos = [
    { id: 1, nombre: "Calza High Impact", precio: 12999, slug: "calza-high-impact", descripcion: "Calza de alto impacto ideal para entrenamientos intensos. Tela compresiva, transpirable y de secado rápido." },
    { id: 2, nombre: "Top Yoga Lila", precio: 8999, slug: "top-yoga-lila", descripcion: "Top suave y cómodo pensado para yoga y pilates. Con soporte interno y breteles regulables." },
    { id: 3, nombre: "Conjunto Fitness Verde", precio: 19999, slug: "conjunto-fitness-verde", descripcion: "Conjunto completo para entrenar con estilo. Incluye calza y top a juego, diseño exclusivo AVA." },
  ];
  
  export function generateStaticParams() {
    return productos.map((p) => ({ slug: p.slug }));
  }
  
  export default function ProductoPage({ params }) {
    const producto = productos.find((p) => p.slug === params.slug);
  
    if (!producto) return <p>Producto no encontrado.</p>;
  
    return (
      <main style={{ padding: "4rem 2rem", maxWidth: "800px", margin: "0 auto" }}>
        <div style={{
          width: "100%",
          height: "400px",
          backgroundColor: "#ede5dc",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#b8a99a",
          fontSize: "1.2rem",
          marginBottom: "2rem"
        }}>
          {producto.nombre}
        </div>
        <h1 style={{
          fontFamily: "Georgia, serif",
          fontWeight: "normal",
          fontSize: "2rem",
          color: "#2d2d2d",
          marginBottom: "0.5rem"
        }}>
          {producto.nombre}
        </h1>
        <p style={{ color: "#7a7a7a", fontSize: "1.2rem", marginBottom: "1rem" }}>
          ${producto.precio.toLocaleString("es-AR")}
        </p>
        <p style={{ color: "#3a3a3a", lineHeight: "1.8", marginBottom: "2rem" }}>
          {producto.descripcion}
        </p>
        <button style={{
          padding: "0.9rem 2.5rem",
          backgroundColor: "#2d2d2d",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          fontSize: "0.85rem"
        }}>
          Agregar al carrito
        </button>
      </main>
    );
  }