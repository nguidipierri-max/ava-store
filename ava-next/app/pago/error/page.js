export default function PagoError() {
    return (
      <main style={{ padding: "4rem 2rem", maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
        <h1 style={{ fontFamily: "Georgia, serif", color: "#2d2d2d", marginBottom: "1rem" }}>
          El pago no se pudo procesar
        </h1>
        <p style={{ color: "#7a7a7a", marginBottom: "2rem" }}>
          Hubo un problema con tu pago. Podés intentarlo de nuevo.
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