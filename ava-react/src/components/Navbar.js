

function Navbar({ cantidadCarrito }) {
  return (
    <header role="banner" style={{
      position: "sticky",
      top: 0,
      backgroundColor: "#ffffff",
      borderBottom: "1px solid #e8e0d8",
      zIndex: 100,
      padding: "1rem 2rem"
    }}>
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{
            fontFamily: "Georgia, serif",
            fontSize: "1.8rem",
            letterSpacing: "0.3em",
            color: "#2d2d2d"
          }}>AVA</span>
          {cantidadCarrito > 0 && (
            <span style={{
              background: "#b8a99a",
              color: "white",
              borderRadius: "50%",
              padding: "2px 8px",
              fontSize: "0.8rem"
            }}>
              {cantidadCarrito}
            </span>
          )}
        </div>
        <ul style={{
          listStyle: "none",
          display: "flex",
          gap: "2rem",
          margin: 0,
          padding: 0
        }}>
          <li><a href="#catalogo" style={{ textDecoration: "none", color: "#3a3a3a", fontSize: "0.9rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Catálogo</a></li>
          <li><a href="#nosotras" style={{ textDecoration: "none", color: "#3a3a3a", fontSize: "0.9rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Nosotras</a></li>
          <li><a href="#contacto" style={{ textDecoration: "none", color: "#3a3a3a", fontSize: "0.9rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Contacto</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;