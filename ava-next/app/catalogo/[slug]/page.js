const productos = [
    { id: 1, nombre: "Conjunto Hele", precio: 12999, slug: "conjunto-hele", descripcion: "Conjunto deportivo ideal para entrenamientos intensos. Tela compresiva, transpirable y de secado rápido." },
    { id: 2, nombre: "Conjunto Angiu", precio: 8999, slug: "conjunto-angiu", descripcion: "Conjunto suave y cómodo pensado para yoga y pilates. Con soporte interno y diseño exclusivo AVA." },
    { id: 3, nombre: "Conjunto Strip", precio: 19999, slug: "conjunto-strip", descripcion: "Conjunto completo para entrenar con estilo. Incluye calza y top a juego, diseño exclusivo AVA." },
  ];
  
  export function generateStaticParams() {
    return productos.map((p) => ({ slug: p.slug }));
  }
  
  export default function ProductoPage({ params }) {
    const producto = productos.find((p) => p.slug === params.slug);
  
    if (!producto) return <p>Producto no encontrado.</p>;
  
    return (
      <main style={{ padding: "4rem 2rem", maxWidth: "800px", margin: "0 auto" }}>
        <img
          src={`/images/producto${producto.id}.jpg`}
          alt={producto.nombre}
          style={{
            width: "100%",
            height: "400px",
            objectFit: "cover",
            borderRadius: "8px",
            marginBottom: "2rem"
          }}
        />
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