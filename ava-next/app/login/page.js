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
    setCargando(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setCargando(false);

    if (error) {
      setError("Email o contraseña incorrectos");
      return;
    }

    router.push("/");
  }

  return (
    <main style={{ padding: "4rem 2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h1 style={{ fontFamily: "Georgia, serif", marginBottom: "2rem" }}>Iniciar sesión</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "0.75rem", border: "1px solid #ccc", borderRadius: "6px" }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: "0.75rem", border: "1px solid #ccc", borderRadius: "6px" }}
        />
        {error && <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>}
        <button
          type="submit"
          disabled={cargando}
          style={{
            padding: "0.9rem",
            backgroundColor: "#2d2d2d",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {cargando ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </main>
  );
}