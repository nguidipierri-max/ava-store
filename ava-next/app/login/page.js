"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    // Validación del lado del cliente
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("El email no tiene un formato válido.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setCargando(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setCargando(false);

    if (error) {
      setError("Email o contraseña incorrectos.");
      return;
    }

    router.push("/");
  }

  const inputStyle = {
    padding: "0.75rem",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "1rem",
    width: "100%",
    boxSizing: "border-box",
  };

  return (
    <main style={{ padding: "4rem 2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h1 style={{ fontFamily: "Georgia, serif", marginBottom: "2rem" }}>Iniciar sesión</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }} noValidate>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <label htmlFor="email" style={{ fontSize: "0.85rem", color: "#3a3a3a" }}>Email</label>
          <input
            id="email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-required="true"
            style={inputStyle}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <label htmlFor="password" style={{ fontSize: "0.85rem", color: "#3a3a3a" }}>Contraseña</label>
          <input
            id="password"
            type="password"
            placeholder="Tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-required="true"
            minLength={6}
            style={inputStyle}
          />
        </div>

        {error && (
          <p role="alert" style={{ color: "#c0392b", fontSize: "0.9rem", margin: 0 }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={cargando}
          aria-disabled={cargando}
          style={{
            padding: "0.9rem",
            backgroundColor: cargando ? "#7a7a7a" : "#2d2d2d",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: cargando ? "not-allowed" : "pointer",
            fontSize: "1rem",
            transition: "background-color 0.2s",
          }}
        >
          {cargando ? "Ingresando..." : "Ingresar"}
        </button>

        <p style={{ textAlign: "center", fontSize: "0.85rem", color: "#7a7a7a" }}>
          ¿No tenés cuenta?{" "}
          <a href="/registro" style={{ color: "#2d2d2d", textDecoration: "underline" }}>
            Registrate
          </a>
        </p>
      </form>
    </main>
  );
}