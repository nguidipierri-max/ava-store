export default function PagoPendiente() {
    return (
      <main style={{ padding: "4rem 2rem", maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
        <h1 style={{ fontFamily: "Georgia, serif", color: "#2d2d2d", marginBottom: "1rem" }}>
          Pago pendiente
        </h1>
        <p style={{ color: "#7a7a7a", marginBottom: "2rem" }}>
          Tu pago está siendo procesado. Te avisaremos cuando se confirme.
        </p>
        <a href="/catalogo" style={{
          padding: "0.9rem 2.5rem",
          backgroundColor: "#2d2d2d",
          color: "white",
          borderRadius: "8px",
          textDecoration: "none",
          letterSpacing: "0.1em",
          fontSize: "0.85rem"
        }}>
          VOLVER AL CATÁLOGO
        </a>
      </main>
    );
  }