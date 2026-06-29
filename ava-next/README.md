# AVA — E-commerce de ropa fitness/yoga

Proyecto integrador — Programación Web (71.38), ITBA
Repositorio: `github.com/nguidipierri-max/ava-store` (carpeta `ava-next`)
Deploy: `ava-store-seven.vercel.app`

## Cómo correr el proyecto en local

```bash
cd ava-next
npm install
npm run dev
```

Necesita un archivo `.env.local` con las variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SECRET_KEY`, `MERCADOPAGO_ACCESS_TOKEN`, `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`, `MERCADOPAGO_WEBHOOK_SECRET`, `NEXT_PUBLIC_SITE_URL`.

## 1. Modelo de negocio

AVA es una tienda online de indumentaria deportiva (conjuntos de yoga y entrenamiento). El modelo es e-commerce directo al consumidor (D2C):

- Catálogo público de productos, sin necesidad de cuenta para navegar.
- Registro/login requerido para finalizar una compra.
- Checkout vía Mercado Pago (Checkout Pro), con conciliación automática del estado de la orden mediante webhooks.
- Stack: Next.js 14 (App Router) + Supabase (Postgres + Auth + RLS) + Mercado Pago.

## 2. Flujo end-to-end (E2E)

1. **Catálogo** (`GET /api/productos`, `GET /api/productos/[slug]`): lee productos desde Supabase.
2. **Carrito**: se mantiene en `localStorage` del lado del cliente (componentes `Carrito.jsx` / `BotonCarrito.jsx`).
3. **Creación de orden** (`POST /api/ordenes`): recibe los items del carrito, crea una fila en `orders` (estado inicial `pendiente`) y sus `order_items` asociados.
4. **Generación de pago** (`POST /api/pago`): busca la orden en Supabase, arma una preferencia de pago con el SDK de Mercado Pago y devuelve la URL de checkout (`init_point`).
5. **Pago**: el usuario completa el pago en Mercado Pago (Checkout Pro).
6. **Webhook** (`POST /api/webhook`): Mercado Pago notifica el evento. El endpoint:
   - Nunca confía en el payload crudo del webhook — vuelve a consultar el pago real contra la API de Mercado Pago (`Payment.get`).
   - Extrae `external_reference` (id de la orden) y `status` del pago.
   - Traduce el estado de MP a un estado propio (`pagado` / `fallido` / `cancelado` / `pendiente`).
   - Actualiza la orden en Supabase usando un cliente con permisos de servicio (ver sección 4, "Decisiones técnicas").

**Verificado en vivo en esta sesión:** flujo completo desde la creación del carrito hasta la actualización del estado de la orden a `pagado` en la base de datos, disparado por una notificación real de Mercado Pago (no simulada). Orden de prueba: id `17`, operación de Mercado Pago `165512435313`.

## 3. Casos edge contemplados

| Caso | Manejo |
|---|---|
| Carrito vacío al crear orden | `POST /api/ordenes` devuelve `400` con mensaje de error |
| Stock insuficiente al crear orden | `POST /api/ordenes` consulta el stock real de cada producto antes de crear la orden; si la cantidad pedida supera el stock disponible, devuelve `409` con el detalle (producto, disponible, solicitado) — **verificado end-to-end** |
| Pago aprobado (`approved`) | Orden pasa a `pagado` y se descuenta el stock de cada producto de la orden — **verificado end-to-end en esta sesión** (ej.: stock de "Conjunto Angiu" bajó de 50 a 49 tras un pago real) |
| Pago rechazado (`rejected`) | Orden pasa a `fallido` — lógica implementada, comparte el mismo código verificado para `approved`; no se pudo reproducir en vivo por inestabilidad puntual del checkout de Mercado Pago durante la sesión de pruebas |
| Pago cancelado (`cancelled`) | Orden pasa a `cancelado` — mismo caso que el anterior |
| Webhook duplicado (reintento de Mercado Pago) | Antes de descontar stock, se verifica si la orden ya estaba en `pagado`; si ya lo estaba, no se vuelve a descontar — **verificado end-to-end** (probado con curl reenviando el mismo `payment_id`) |
| Estado desconocido / no contemplado | Por defecto, la orden queda en `pendiente` (fail-safe) |
| Webhook con evento que no es de pago | El endpoint responde `200` sin procesar nada (`type !== "payment"`) |
| Orden inexistente para el `external_reference` recibido | El `UPDATE` no afecta filas; no rompe el endpoint (se recomienda como mejora futura loguear este caso explícitamente) |
| Fallo de conexión a Supabase | Se captura el error y se responde `500` con detalle en logs del servidor |
| Usuario sin permisos de administrador accede a `/admin` | Se verifica el rol del perfil (`profiles.rol`) contra Supabase al cargar la página; si no es `admin`, redirige a `/` |
| Usuario no logueado accede a `/mis-ordenes` o `/admin` | Redirige a `/login` |

## 4. Decisiones técnicas relevantes

- **Verificación de pagos contra la fuente de verdad**: el webhook no usa los datos que vienen en el body de la notificación para decidir el estado final; siempre vuelve a consultar el pago contra la API de Mercado Pago con el `access token` del servidor. Esto evita que una notificación falsificada pueda marcar una orden como pagada.
- **Cliente de Supabase con permisos elevados en el backend**: la tabla `orders` tiene Row Level Security (RLS) activado. El cliente Supabase usado en el resto de la app (`anon key`) respeta esas políticas, lo cual es correcto para operaciones iniciadas por el usuario. Sin embargo, el webhook corre sin sesión de usuario (es una llamada servidor-a-servidor desde Mercado Pago), por lo que necesita un cliente separado (`supabaseAdmin`, en `app/lib/supabase-admin.js`) inicializado con la *secret key* del proyecto, que se salta RLS. Este cliente **se usa exclusivamente en endpoints de servidor** y nunca se expone al navegador.
- **Conversión explícita de tipos**: `external_reference` llega como string desde la API de Mercado Pago; la columna `id` en Supabase es numérica (`int8`). Se castea con `Number()` antes de la consulta para evitar fallos silenciosos de comparación de tipos.

## 5. Roles y panel de administración

La tabla `profiles` tiene una columna `rol` (`cliente` por defecto, asignada automáticamente al registrarse mediante un trigger de Supabase). Un usuario con `rol = 'admin'` tiene acceso a `/admin`, donde puede:

- Ver **todas** las órdenes de todos los usuarios (no solo las propias), con producto, total, estado y fecha.
- Crear, editar y borrar productos del catálogo (`POST` / `PUT` / `DELETE` en `/api/productos`), incluyendo el campo `stock`.

El control de acceso se hace en dos capas: la página verifica el rol del usuario logueado contra Supabase antes de renderizar el panel (y redirige si no es admin), y los endpoints de escritura de productos usan el cliente `supabaseAdmin` para no depender de las políticas de RLS pensadas para clientes.

## 6. Infraestructura de despliegue

El proyecto está desplegado en Vercel (`ava-store-seven.vercel.app`), con deploy automático en cada push a `main` (CI/CD). Las variables de entorno (incluida `SUPABASE_SECRET_KEY` y `NEXT_PUBLIC_SITE_URL`) están configuradas en el panel de Vercel para los ambientes de Production y Preview.

El webhook de Mercado Pago (`MODO PRODUCTIVO`) apunta directamente a `https://ava-store-seven.vercel.app/api/webhook` — el flujo de pagos y conciliación de órdenes funciona de forma autónoma, sin depender de que ningún servidor local esté corriendo.

### Limitación encontrada durante el desarrollo local

Para probar webhooks contra un servidor corriendo en `localhost` (antes del deploy final), fue necesario exponerlo públicamente:

- El entorno de desarrollo corre en macOS 11 (Big Sur), que no es compatible con `ngrok` (crashea al abrir túneles) ni con `cloudflared` (requiere una versión de Go no soportada en ese sistema).
- Se probó `localtunnel`, que sí expone el puerto local, pero antepone una pantalla de advertencia HTML a las peticiones nuevas. Mercado Pago, al hacer un `POST` automático (no un clic humano), no puede pasar esa pantalla, por lo que el webhook nunca llegaba a destino (0% de notificaciones entregadas, confirmado en el panel de Mercado Pago).
- Se reemplazó por `localhost.run` (túnel SSH), que no antepone ninguna pantalla intermedia y permitió validar el webhook durante el desarrollo. Su plan gratuito reconecta y cambia de subdominio sin aviso, por lo que **no se usa en el entregable final** — el webhook de producción apunta directamente a Vercel.

## 7. Pendientes / mejoras futuras

- Loguear explícitamente el caso en que un webhook llega con un `external_reference` que no corresponde a ninguna orden existente.
- Verificar la firma del webhook (`MERCADOPAGO_WEBHOOK_SECRET`) antes de procesar la notificación, como capa adicional de seguridad.
- Reproducir en un ambiente más estable los casos de pago rechazado/cancelado de punta a punta (la lógica está implementada y comparte código con el camino de éxito ya verificado).
- Ajustar las políticas de RLS de `orders` y `order_items` para que un cliente solo pueda leer/escribir sus propias filas a nivel de base de datos (hoy el filtrado por usuario se hace en el código del frontend, no en la política de RLS en sí; RLS está activo pero las políticas actuales son permisivas).
- Agregar tests automatizados (unitarios o de integración) para los endpoints críticos (`/api/ordenes`, `/api/webhook`).