export default function PagoExito() {
    return (
      <main style={{ padding: "4rem 2rem", maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
        <h1 style={{ fontFamily: "Georgia, serif", color: "#2d2d2d", marginBottom: "1rem" }}>
          ¡Pago aprobado!
        </h1>
        <p style={{ color: "#7a7a7a", marginBottom: "2rem" }}>
          Tu compra fue procesada con éxito. Pronto recibirás tu pedido.
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
          SEGUIR COMPRANDO
        </a>
      </main>
    );
  }