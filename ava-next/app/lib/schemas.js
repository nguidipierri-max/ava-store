import { z } from "zod";

// Valida que un producto tenga la forma correcta.
export const productoSchema = z.object({
  id: z.number(),
  nombre: z.string().min(1),
  precio: z.number().positive(),
  slug: z.string().min(1),
  descripcion: z.string().optional(),
});