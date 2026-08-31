// Datos que comparten las páginas legales.
//
// Están aquí y no dentro de cada página porque el titular, el domicilio y la
// lista de encargados se repiten en Privacidad y en Cookies: duplicarlos
// garantiza que un día digan cosas distintas.
//
// ⚠️  PENDIENTE — SIN RELLENAR NO SE PUBLICA
// Los valores entre corchetes son marcadores deliberados: no inventamos la
// razón social, el NIF ni el domicilio de nadie. Salen visibles en la página
// justamente para que no se escapen a producción sin querer.
export const TITULAR = {
	nombre: '[Razón social o nombre y apellidos del titular]',
	identificacion: '[NIF / CIF]',
	domicilio: '[Domicilio fiscal completo]',
	// La autoridad de control depende del país. En España es la AEPD.
	autoridad: {
		nombre: '[Autoridad de control competente — en España, la AEPD]',
		web: 'https://www.aepd.es',
	},
} as const;

// Fecha de la última revisión. Cámbiala cada vez que se toque el contenido:
// una política legal sin fecha no vale nada porque nadie sabe qué versión aceptó.
export const ACTUALIZADO = '31 de agosto de 2026';

/** Terceros que reciben datos personales, con el motivo real por el que los
 *  reciben. La lista sale de auditar qué carga y qué llama el sitio, no de una
 *  plantilla: si mañana se añade analítica, esta lista tiene que crecer. */
export const ENCARGADOS = [
	{
		nombre: 'Vercel Inc.',
		pais: 'Estados Unidos',
		motivo:
			'Aloja el sitio y ejecuta el formulario. Sus registros de servidor guardan la dirección IP, el navegador y la fecha de cada visita.',
	},
	{
		nombre: 'Resend (Plus Five Five, Inc.)',
		pais: 'Estados Unidos',
		motivo: 'Entrega el correo generado por el formulario de contacto.',
	},
	{
		nombre: 'Google LLC',
		pais: 'Estados Unidos',
		motivo:
			'Sirve las tipografías del sitio (Google Fonts) y aloja el buzón donde se reciben los mensajes. Al cargar las tipografías, tu navegador comunica su dirección IP a Google.',
	},
	{
		nombre: 'Pexels GmbH',
		pais: 'Alemania',
		motivo:
			'Aloja una de las imágenes del portafolio. Al mostrarla, tu navegador comunica su dirección IP a Pexels.',
	},
] as const;

/** Campos que pide el formulario, con si son obligatorios. Es la fuente de
 *  verdad de "qué datos tratamos": si se añade un campo al formulario, aquí
 *  se ve que hay que declararlo. */
export const DATOS_FORMULARIO = [
	{ campo: 'Nombre', obligatorio: true },
	{ campo: 'Empresa', obligatorio: true },
	{ campo: 'Email corporativo', obligatorio: true },
	{ campo: 'Desafío principal', obligatorio: true },
	{ campo: 'Rango de presupuesto', obligatorio: false },
	{ campo: 'Mensaje libre', obligatorio: false },
] as const;
