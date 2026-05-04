function ProductCard({ producto, onAgregar }) {
    return (
      <article style={{
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)"
      }}>
        <div style={{
          width: "100%",
          height: "300px",
          backgroundColor: "#ede5dc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#b8a99a",
          fontSize: "0.9rem"
        }}>
          {producto.nombre}
        </div>
        <div style={{ padding: "1rem" }}>
          <h3 style={{
            fontFamily: "Georgia, serif",
            fontWeight: "normal",
            fontSize: "1.1rem",
            marginBottom: "0.25rem"
          }}>
            {producto.nombre}
          </h3>
          <p style={{ color: "#7a7a7a", fontSize: "0.95rem", marginBottom: "0.75rem" }}>
            ${producto.precio.toLocaleString("es-AR")}
          </p>
          <button
            onClick={() => onAgregar(producto)}
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
        </div>
      </article>
    );
  }
  
  export default ProductCard;