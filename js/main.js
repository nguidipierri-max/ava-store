// ===== DATOS DE PRODUCTOS =====
const productos = [
    {
      id: 1,
      nombre: "Calza High Impact",
      precio: 12999,
      imagen: "images/producto1.jpg",
    },
    {
      id: 2,
      nombre: "Top Yoga Lila",
      precio: 8999,
      imagen: "images/producto2.jpg",
    },
    {
      id: 3,
      nombre: "Conjunto Fitness Verde",
      precio: 19999,
      imagen: "images/producto3.jpg",
    },
  ];
  
  // ===== CARRITO =====
  let carrito = [];
  
  // ===== FUNCIONES =====
  const formatearPrecio = (precio) => {
    return `$${precio.toLocaleString("es-AR")}`;
  };
  
  const agregarAlCarrito = (id) => {
    const producto = productos.find((p) => p.id === id);
    const itemExistente = carrito.find((p) => p.id === id);
  
    if (itemExistente) {
      itemExistente.cantidad += 1;
    } else {
      carrito.push({ ...producto, cantidad: 1 });
    }
  
    guardarCarrito();
    actualizarContadorCarrito();
    mostrarNotificacion(`"${producto.nombre}" agregado al carrito`);
  };
  
  const guardarCarrito = () => {
    localStorage.setItem("ava-carrito", JSON.stringify(carrito));
  };
  
  const cargarCarrito = () => {
    const guardado = localStorage.getItem("ava-carrito");
    if (guardado) {
      carrito = JSON.parse(guardado);
    }
  };
  
  const actualizarContadorCarrito = () => {
    const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    const contador = document.getElementById("carrito-contador");
    if (contador) {
      contador.textContent = total;
      contador.style.display = total > 0 ? "inline-block" : "none";
    }
  };
  
  const mostrarNotificacion = (mensaje) => {
    const notif = document.getElementById("notificacion");
    if (!notif) return;
    notif.textContent = mensaje;
    notif.classList.add("visible");
    setTimeout(() => notif.classList.remove("visible"), 2500);
  };
  
  // ===== EVENTOS: botones de agregar al carrito =====
  const iniciarBotonesCarrito = () => {
    const botones = document.querySelectorAll(".producto button");
    botones.forEach((boton, index) => {
      boton.addEventListener("click", () => {
        agregarAlCarrito(productos[index].id);
      });
    });
  };
  
  // ===== VALIDACIÓN DEL FORMULARIO =====
  const iniciarFormulario = () => {
    const form = document.querySelector("form");
    if (!form) return;
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const nombre = document.getElementById("nombre").value.trim();
      const email = document.getElementById("email").value.trim();
      const mensaje = document.getElementById("mensaje").value.trim();
  
      if (!nombre || !email || !mensaje) {
        alert("Por favor completá todos los campos.");
        return;
      }
  
      const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailValido) {
        alert("Por favor ingresá un email válido.");
        return;
      }
  
      mostrarNotificacion("¡Mensaje enviado! Te respondemos pronto.");
      form.reset();
    });
  };
  
  // ===== INICIO =====
  document.addEventListener("DOMContentLoaded", () => {
    cargarCarrito();
    iniciarBotonesCarrito();
    iniciarFormulario();
    actualizarContadorCarrito();
  });