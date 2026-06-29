// Datos en memoria — capa provisoria antes de conectar Supabase (Clase 11-12).
// Toda la app debería leer productos desde acá, nunca desde un array repetido en cada page.js.

export const productos = [
    {
      id: 1,
      nombre: "Conjunto Hele",
      precio: 85000,
      slug: "conjunto-hele",
      descripcion: "Conjunto deportivo ideal para entrenamientos intensos. Tela compresiva, transpirable y de secado rápido.",
    },
    {
      id: 2,
      nombre: "Conjunto Angiu",
      precio: 65000,
      slug: "conjunto-angiu",
      descripcion: "Conjunto suave y cómodo pensado para yoga y pilates. Con soporte interno y diseño exclusivo AVA.",
    },
    {
      id: 3,
      nombre: "Conjunto Strip",
      precio: 92500,
      slug: "conjunto-strip",
      descripcion: "Conjunto completo para entrenar con estilo. Incluye calza y top a juego, diseño exclusivo AVA.",
    },
  ];
  
  export function getProductos() {
    return productos;
  }
  
  export function getProductoPorSlug(slug) {
    return productos.find((p) => p.slug === slug);
  }