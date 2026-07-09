"use client";

import { useState } from "react";

export default function FormularioContacto() {
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });
  const [enviando, setEnviando] = useState(false);
  const [estado, setEstado] = useState(null); // null | "ok" | "error"

  async function enviar(e) {
    e.preventDefault();
    setEnviando(true);
    setEstado(null);

    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        setEstado("error");
        return;
      }

      setEstado("ok");
      setForm({ nombre: "", email: "", mensaje: "" });
    } catch (error) {
      setEstado("error");
    } finally {
      setEnviando(false);
    }
  }

  const inputStyle = {
    padding: "0.9rem 1rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "1rem",
    backgroundColor: "#fff",
  };

  return (
    <form
      onSubmit={enviar}
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <input
        type="text"
        placeholder="Tu nombre"
        required
        value={form.nombre}
        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
        style={inputStyle}
      />
      <input
        type="email"
        placeholder="Tu email"
        required
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        style={inputStyle}
      />
      <textarea
        placeholder="¿En qué te podemos ayudar?"
        rows="4"
        required
        value={form.mensaje}
        onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
        style={{ ...inputStyle, resize: "vertical" }}
      />
      <button
        type="submit"
        disabled={enviando}
        style={{
          padding: "0.9rem",
          backgroundColor: "#2d2d2d",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: enviando ? "not-allowed" : "pointer",
          opacity: enviando ? 0.7 : 1,
          fontSize: "0.9rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        }}
      >
        {enviando ? "Enviando..." : "Enviar mensaje"}
      </button>

      {estado === "ok" && (
        <p style={{ color: "#2e7d32", textAlign: "center", margin: 0 }}>
          ¡Gracias! Te vamos a contactar pronto.
        </p>
      )}
      {estado === "error" && (
        <p style={{ color: "#c0392b", textAlign: "center", margin: 0 }}>
          Ocurrió un error al enviar tu mensaje. Probá de nuevo.
        </p>
      )}
    </form>
  );
}