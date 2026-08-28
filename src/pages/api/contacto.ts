// Recepción del formulario de contacto.
//
// Es la única ruta que necesita servidor: el resto del sitio se sigue
// prerenderizando. Atiende dos clientes con el mismo código:
//
//   · con JS  → el formulario manda `Accept: application/json` y espera JSON
//               con los errores por campo, para pintarlos en línea.
//   · sin JS  → POST nativo del navegador; se responde con un 303 a /gracias,
//               que es una página de verdad y no un volcado de JSON.
//
// La validación se repite aquí entera aunque el navegador ya valide: lo del
// cliente es comodidad, no seguridad — a este endpoint se le puede escribir
// directamente con curl.
export const prerender = false;

import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { RESEND_API_KEY, CONTACTO_REMITENTE } from 'astro:env/server';
import { CORREO, DESAFIOS, PRESUPUESTOS } from '../../datos/estudio';

// Sin dominio propio verificado por DNS, Resend solo entrega desde su
// remitente de pruebas y únicamente a la dirección dueña de la cuenta.
const REMITENTE = CONTACTO_REMITENTE ?? 'indie studio <onboarding@resend.dev>';

// Topes de longitud: cortan el abuso antes de llegar a Resend, y de paso
// evitan que un correo de 2 MB se cuele como "mensaje".
const LIMITES = { nombre: 120, empresa: 120, email: 254, mensaje: 4000 } as const;

// Un humano no rellena seis campos en menos de tres segundos.
const MS_MINIMOS = 3000;

type Errores = Record<string, string>;

const leer = (datos: FormData, campo: string) => {
	const valor = datos.get(campo);
	return typeof valor === 'string' ? valor.trim() : '';
};

/** Formato de correo deliberadamente laxo: rechazar direcciones válidas raras
 *  cuesta más que aceptar alguna inválida, que rebotará sola. */
const correoValido = (valor: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor);

function validar(datos: FormData) {
	const campos = {
		nombre: leer(datos, 'nombre'),
		empresa: leer(datos, 'empresa'),
		email: leer(datos, 'email'),
		desafio: leer(datos, 'desafio'),
		presupuesto: leer(datos, 'presupuesto'),
		mensaje: leer(datos, 'mensaje'),
	};

	const errores: Errores = {};

	if (!campos.nombre) errores.nombre = 'Dinos cómo te llamas.';
	else if (campos.nombre.length > LIMITES.nombre) errores.nombre = 'Nombre demasiado largo.';

	if (!campos.empresa) errores.empresa = 'Falta el nombre de la empresa.';
	else if (campos.empresa.length > LIMITES.empresa) errores.empresa = 'Nombre demasiado largo.';

	if (!campos.email) errores.email = 'Necesitamos un correo para responderte.';
	else if (campos.email.length > LIMITES.email || !correoValido(campos.email))
		errores.email = 'Ese correo no parece válido.';

	if (!campos.desafio) errores.desafio = 'Elige el desafío que más se acerque.';
	else if (!DESAFIOS.includes(campos.desafio as (typeof DESAFIOS)[number]))
		errores.desafio = 'Esa opción no existe.';

	// El presupuesto es opcional; si viene, tiene que ser una de las opciones.
	if (campos.presupuesto && !PRESUPUESTOS.includes(campos.presupuesto as (typeof PRESUPUESTOS)[number]))
		errores.presupuesto = 'Esa opción no existe.';

	if (campos.mensaje.length > LIMITES.mensaje) errores.mensaje = 'El mensaje es demasiado largo.';

	return { campos, errores };
}

/** ¿Es un bot? Dos señales silenciosas, ningún CAPTCHA. */
function huelePorBot(datos: FormData) {
	// Campo trampa: invisible para personas, irresistible para bots.
	if (leer(datos, 'sitio-web')) return true;

	// Marca de tiempo que pone el JS al cargar. Sin JS no viene y no se aplica.
	const marca = Number(leer(datos, 'abierto'));
	return Number.isFinite(marca) && marca > 0 && Date.now() - marca < MS_MINIMOS;
}

const esFetch = (peticion: Request) =>
	(peticion.headers.get('accept') ?? '').includes('application/json');

const json = (cuerpo: unknown, status: number) =>
	new Response(JSON.stringify(cuerpo), {
		status,
		headers: { 'content-type': 'application/json; charset=utf-8' },
	});

const redirigir = (sitio: URL, estado: 'ok' | 'error') =>
	// 303 y no 302: obliga al navegador a pasar a GET, así recargar /gracias
	// no reenvía el formulario.
	new Response(null, {
		status: 303,
		headers: { location: new URL(`/gracias?estado=${estado}`, sitio).toString() },
	});

export const POST: APIRoute = async ({ request, url }) => {
	const conJs = esFetch(request);

	let datos: FormData;
	try {
		// formData() cubre tanto el POST nativo (urlencoded) como el fetch.
		datos = await request.formData();
	} catch {
		return conJs
			? json({ ok: false, mensaje: 'No pudimos leer el formulario.' }, 400)
			: redirigir(url, 'error');
	}

	// A un bot se le responde que todo fue bien: si le dices que lo has
	// detectado, prueba otra cosa. No se envía nada.
	if (huelePorBot(datos)) {
		return conJs ? json({ ok: true }, 200) : redirigir(url, 'ok');
	}

	const { campos, errores } = validar(datos);
	if (Object.keys(errores).length > 0) {
		return conJs ? json({ ok: false, errores }, 422) : redirigir(url, 'error');
	}

	if (!RESEND_API_KEY) {
		console.error('[contacto] falta RESEND_API_KEY: el mensaje no se ha enviado.');
		return conJs
			? json(
					{
						ok: false,
						mensaje: `El envío no está configurado. Escríbenos a ${CORREO} mientras lo arreglamos.`,
					},
					503,
				)
			: redirigir(url, 'error');
	}

	const lineas = [
		`Nombre:      ${campos.nombre}`,
		`Empresa:     ${campos.empresa}`,
		`Email:       ${campos.email}`,
		`Desafío:     ${campos.desafio}`,
		`Presupuesto: ${campos.presupuesto || '(no indicado)'}`,
		'',
		campos.mensaje || '(sin mensaje)',
	].join('\n');

	try {
		const { error } = await new Resend(RESEND_API_KEY).emails.send({
			from: REMITENTE,
			to: [CORREO],
			// Responder en el gestor de correo contesta al cliente, no a Resend.
			replyTo: campos.email,
			subject: `Propuesta · ${campos.empresa} — ${campos.nombre}`,
			text: lineas,
		});

		if (error) {
			console.error('[contacto] Resend rechazó el envío:', error);
			return conJs
				? json(
						{ ok: false, mensaje: `No pudimos enviarlo. Escríbenos a ${CORREO}.` },
						502,
					)
				: redirigir(url, 'error');
		}
	} catch (fallo) {
		console.error('[contacto] error de red al contactar con Resend:', fallo);
		return conJs
			? json({ ok: false, mensaje: `No pudimos enviarlo. Escríbenos a ${CORREO}.` }, 502)
			: redirigir(url, 'error');
	}

	return conJs ? json({ ok: true }, 200) : redirigir(url, 'ok');
};

// Un GET a esta ruta no tiene sentido; que lo diga en lugar de dar un 500.
export const GET: APIRoute = () => new Response('Método no permitido', { status: 405 });
