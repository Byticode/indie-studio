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

// Opciones del formulario de contacto. Viven aquí porque las valida el
// endpoint del servidor además de pintarlas el <select>: si estuvieran solo en
// el componente, la validación de servidor sería una segunda copia a mano y
// las dos se separarían al primer cambio.
export const DESAFIOS = [
	'Mi marca no refleja lo que realmente somos',
	'Tengo tráfico, pero no convierte',
	'Necesito contenido que sostenga la atención',
	'Voy a lanzar algo nuevo',
] as const;

export const PRESUPUESTOS = [
	'$1,000 – $3,000',
	'$3,000 – $10,000',
	'Más de $10,000',
	'Prefiero hablarlo',
] as const;
