"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Admin() {
  const [autorizado, setAutorizado] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [ordenes, setOrdenes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [vista, setVista] = useState("ordenes");
  const router = useRouter();

  const [form, setForm] = useState({
    id: null,
    nombre: "",
    precio: "",
    slug: "",
    descripcion: "",
    stock: "",
  });

  useEffect(() => {
    async function verificarAcceso() {
      const { data: sesion } = await supabase.auth.getSession();
      const user = sesion?.session?.user;

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: perfil } = await supabase
        .from("profiles")
        .select("rol")
        .eq("id", user.id)
        .single();

      if (perfil?.rol !== "admin") {
        router.push("/");
        return;
      }

      setAutorizado(true);
      cargarOrdenes();
      cargarProductos();
      setCargando(false);
    }

    verificarAcceso();
  }, [router]);

  async function cargarOrdenes() {
    const { data } = await supabase
      .from("orders")
      .select("*, order_items(*, products(nombre))")
      .order("created_at", { ascending: false });
    setOrdenes(data || []);
  }

  async function cargarProductos() {
    const res = await fetch("/api/productos");
    const data = await res.json();
    setProductos(data || []);
  }

  function editarProducto(producto) {
    setForm({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      slug: producto.slug,
      descripcion: producto.descripcion || "",
      stock: producto.stock,
    });
  }

  function limpiarForm() {
    setForm({ id: null, nombre: "", precio: "", slug: "", descripcion: "", stock: "" });
  }

  async function guardarProducto(e) {
    e.preventDefault();

    const payload = {
      ...form,
      precio: Number(form.precio),
      stock: Number(form.stock),
    };

    const metodo = form.id ? "PUT" : "POST";

    const res = await fetch("/api/productos", {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      limpiarForm();
      cargarProductos();
    } else {
      const data = await res.json();
      alert(data.error || "No se pudo guardar el producto");
    }
  }

  async function borrarProducto(id) {
    if (!confirm("¿Seguro que querés borrar este producto?")) return;

    const res = await fetch(`/api/productos?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      cargarProductos();
    } else {
      alert("No se pudo borrar el producto");
    }
  }

  if (cargando) {
    return (
      <main style={{ padding: "4rem 2rem" }}>
        <p>Verificando acceso...</p>
      </main>
    );
  }

  if (!autorizado) return null;

  return (
    <main style={{ padding: "3rem 2rem", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ fontFamily: "Georgia, serif", fontWeight: "normal", marginBottom: "2rem" }}>
        Panel de administración
      </h1>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <button
          onClick={() => setVista("ordenes")}
          style={{
            padding: "0.6rem 1.2rem",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            backgroundColor: vista === "ordenes" ? "#2d2d2d" : "#e8e0d8",
            color: vista === "ordenes" ? "white" : "#2d2d2d",
          }}
        >
          Órdenes
        </button>
        <button
          onClick={() => setVista("productos")}
          style={{
            padding: "0.6rem 1.2rem",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            backgroundColor: vista === "productos" ? "#2d2d2d" : "#e8e0d8",
            color: vista === "productos" ? "white" : "#2d2d2d",
          }}
        >
          Productos
        </button>
      </div>

      {vista === "ordenes" && (
        <div>
          <h2 style={{ fontFamily: "Georgia, serif", fontWeight: "normal" }}>
            Todas las órdenes ({ordenes.length})
          </h2>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #2d2d2d", textAlign: "left" }}>
                <th style={{ padding: "0.5rem" }}>ID</th>
                <th style={{ padding: "0.5rem" }}>Productos</th>
                <th style={{ padding: "0.5rem" }}>Total</th>
                <th style={{ padding: "0.5rem" }}>Estado</th>
                <th style={{ padding: "0.5rem" }}>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((orden) => (
                <tr key={orden.id} style={{ borderBottom: "1px solid #e8e0d8" }}>
                  <td style={{ padding: "0.5rem" }}>#{orden.id}</td>
                  <td style={{ padding: "0.5rem" }}>
                    {orden.order_items?.map((item) => item.products?.nombre).join(", ")}
                  </td>
                  <td style={{ padding: "0.5rem" }}>${orden.total.toLocaleString("es-AR")}</td>
                  <td style={{ padding: "0.5rem", textTransform: "uppercase", fontSize: "0.8rem" }}>
                    {orden.estado}
                  </td>
                  <td style={{ padding: "0.5rem" }}>
                    {new Date(orden.created_at).toLocaleDateString("es-AR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {vista === "productos" && (
        <div>
          <h2 style={{ fontFamily: "Georgia, serif", fontWeight: "normal" }}>
            {form.id ? `Editando producto #${form.id}` : "Crear nuevo producto"}
          </h2>

          <form onSubmit={guardarProducto} style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: "400px", marginBottom: "2rem" }}>
            <input
              placeholder="Nombre"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              required
              style={{ padding: "0.6rem", border: "1px solid #ccc", borderRadius: "6px" }}
            />
            <input
              placeholder="Precio"
              type="number"
              value={form.precio}
              onChange={(e) => setForm({ ...form, precio: e.target.value })}
              required
              style={{ padding: "0.6rem", border: "1px solid #ccc", borderRadius: "6px" }}
            />
            <input
              placeholder="Slug (ej: conjunto-nuevo)"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              required
              style={{ padding: "0.6rem", border: "1px solid #ccc", borderRadius: "6px" }}
            />
            <textarea
              placeholder="Descripción"
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              rows={3}
              style={{ padding: "0.6rem", border: "1px solid #ccc", borderRadius: "6px" }}
            />
            <input
              placeholder="Stock"
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              required
              style={{ padding: "0.6rem", border: "1px solid #ccc", borderRadius: "6px" }}
            />
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button type="submit" style={{ padding: "0.7rem 1.2rem", backgroundColor: "#2d2d2d", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                {form.id ? "Guardar cambios" : "Crear producto"}
              </button>
              {form.id && (
                <button type="button" onClick={limpiarForm} style={{ padding: "0.7rem 1.2rem", backgroundColor: "#e8e0d8", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                  Cancelar
                </button>
              )}
            </div>
          </form>

          <h2 style={{ fontFamily: "Georgia, serif", fontWeight: "normal" }}>
            Catálogo ({productos.length})
          </h2>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #2d2d2d", textAlign: "left" }}>
                <th style={{ padding: "0.5rem" }}>Nombre</th>
                <th style={{ padding: "0.5rem" }}>Precio</th>
                <th style={{ padding: "0.5rem" }}>Stock</th>
                <th style={{ padding: "0.5rem" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid #e8e0d8" }}>
                  <td style={{ padding: "0.5rem" }}>{p.nombre}</td>
                  <td style={{ padding: "0.5rem" }}>${p.precio.toLocaleString("es-AR")}</td>
                  <td style={{ padding: "0.5rem" }}>{p.stock}</td>
                  <td style={{ padding: "0.5rem" }}>
                    <button onClick={() => editarProducto(p)} style={{ marginRight: "0.5rem", padding: "0.3rem 0.7rem", cursor: "pointer", border: "1px solid #2d2d2d", borderRadius: "6px", background: "white" }}>
                      Editar
                    </button>
                    <button onClick={() => borrarProducto(p.id)} style={{ padding: "0.3rem 0.7rem", cursor: "pointer", border: "none", borderRadius: "6px", background: "#e74c3c", color: "white" }}>
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}