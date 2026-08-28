// Datos de contacto del estudio.
//
// Viven aquí y no en el frontmatter de cada componente porque el correo y los
// perfiles se repiten en el header, en el menú móvil y en el pie: una sola
// fuente evita que se queden desincronizados al actualizar uno solo.

export const CORREO = 'indiestudio404@gmail.com';

// PENDIENTE: URLs reales de cada perfil. De momento apuntan a la raíz de cada
// plataforma — no inventamos el usuario del estudio. Al tenerlas, se cambian
// solo aquí y quedan actualizadas en los tres sitios donde aparecen.
//
// El orden es deliberado: TikTok e Instagram primero porque son donde vive el
// trabajo en movimiento; Behance cierra porque es el archivo, no el escaparate.
export const REDES = [
	{ nombre: 'TikTok', icono: 'tiktok', href: 'https://tiktok.com' },
	{ nombre: 'Instagram', icono: 'instagram', href: 'https://instagram.com' },
	{ nombre: 'LinkedIn', icono: 'linkedin', href: 'https://linkedin.com' },
	{ nombre: 'Behance', icono: 'behance', href: 'https://behance.net' },
] as const;
