import { supabase } from "../../lib/supabase";

async function obtenerProducto(slug) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data;
}

export default async function ProductoPage({ params }) {
  const producto = await obtenerProducto(params.slug);

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