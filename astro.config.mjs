// @ts-check
import { defineConfig, envField } from 'astro/config';
import vercel from '@astrojs/vercel';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // El sitio sigue siendo estático: la portada se prerenderiza igual que antes.
  // El adaptador solo existe para las dos rutas que piden servidor —
  // /api/contacto y /gracias—, que se marcan con `export const prerender = false`.
  adapter: vercel(),

  // Variables declaradas, no leídas a pelo del entorno: así el endpoint sabe
  // si falta la clave en lugar de fallar con un error de Resend indescifrable.
  // Todas opcionales a propósito — el sitio tiene que compilar y arrancar en
  // local sin credenciales; quien avisa de que faltan es el propio endpoint.
  env: {
    schema: {
      RESEND_API_KEY: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      // Remitente. Sin dominio propio, el de pruebas de Resend solo entrega a
      // la dirección con la que se creó la cuenta.
      CONTACTO_REMITENTE: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
    },
  },

  vite: {
    plugins: [tailwindcss()]
  }
});
