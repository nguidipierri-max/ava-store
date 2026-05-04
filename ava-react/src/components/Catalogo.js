import ProductCard from "./ProductCard";

const productos = [
  { id: 1, nombre: "Calza High Impact", precio: 12999 },
  { id: 2, nombre: "Top Yoga Lila", precio: 8999 },
  { id: 3, nombre: "Conjunto Fitness Verde", precio: 19999 },
];

function Catalogo({ onAgregar }) {
  return (
    <section id="catalogo" style={{ padding: "4rem 2rem", maxWidth: "1200px", margin: "0 auto" }}>
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
          <ProductCard
            key={producto.id}
            producto={producto}
            onAgregar={onAgregar}
          />
        ))}
      </div>
    </section>
  );
}

export default Catalogo;