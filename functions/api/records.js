// Ranking de Mamba 81. Guarda en KV (binding RECORDS) un solo documento con los mejores puntajes.
const MAX_PUNTOS = 126; // 2 triples de 3 y luego 30 de 4 en Modo Mamba
const MAX_FILAS = 50;
const ESPERA_MS = 15000;
const APODO = /^[\p{L}\p{N}][\p{L}\p{N} ._-]{1,13}$/u;
const VETADAS_EN_CUALQUIER_PARTE = ['conchetumadre', 'culiao', 'culia', 'weon', 'hueon', 'maricon', 'mierda', 'hitler', 'nazi'];
const VETADAS_EXACTAS = ['puta', 'puto', 'pene', 'sexo', 'verga', 'zorra', 'ctm', 'pico', 'poto', 'caca'];

const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
});
const leerTop = async (kv) => (await kv.get('top', { type: 'json' })) || [];
const mismoApodo = (a, b) => a.toLowerCase() === b.toLowerCase();

function apodoVetado(apodo) {
  const plano = apodo.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
  return VETADAS_EXACTAS.includes(plano) || VETADAS_EN_CUALQUIER_PARTE.some((v) => plano.includes(v));
}
async function huellaDe(ip) {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip));
  return [...new Uint8Array(hash)].slice(0, 8).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function onRequestGet({ env }) {
  if (!env.RECORDS) return json({ activo: false, top: [] });
  return json({ activo: true, top: await leerTop(env.RECORDS) });
}

export async function onRequestPost({ request, env }) {
  if (!env.RECORDS) return json({ error: 'El ranking todavía no está activo.' }, 503);

  const origen = request.headers.get('origin');
  if (origen && new URL(origen).host !== new URL(request.url).host) return json({ error: 'Origen no permitido.' }, 403);

  let datos;
  try { datos = await request.json(); } catch { return json({ error: 'Datos inválidos.' }, 400); }

  const apodo = String(datos.apodo ?? '').trim().replace(/\s+/g, ' ');
  const puntos = datos.puntos;
  if (!Number.isInteger(puntos) || puntos < 0 || puntos > MAX_PUNTOS) return json({ error: 'Ese puntaje no es posible.' }, 400);
  if (!APODO.test(apodo)) return json({ error: 'El apodo debe tener entre 2 y 14 letras o números.' }, 400);
  if (apodoVetado(apodo)) return json({ error: 'Elige otro apodo.' }, 400);

  // La IP solo se guarda como huella y se borra sola a los 60 segundos.
  const claveIp = 'ip:' + await huellaDe(request.headers.get('cf-connecting-ip') || 'local');
  const antes = await env.RECORDS.get(claveIp);
  if (antes && Date.now() - Number(antes) < ESPERA_MS) return json({ error: 'Espera unos segundos y vuelve a intentarlo.' }, 429);
  await env.RECORDS.put(claveIp, String(Date.now()), { expirationTtl: 60 });

  const top = await leerTop(env.RECORDS);
  const fecha = new Date().toISOString().slice(0, 10);
  const i = top.findIndex((f) => mismoApodo(f.apodo, apodo));
  const mejoro = i < 0 || puntos > top[i].puntos;
  if (i >= 0) top[i] = { apodo: top[i].apodo, puntos: Math.max(top[i].puntos, puntos), ultimo: puntos, partidos: (top[i].partidos || 1) + 1, fecha };
  else top.push({ apodo, puntos, ultimo: puntos, partidos: 1, fecha });

  const ordenado = top.sort((a, b) => b.puntos - a.puntos).slice(0, MAX_FILAS);
  await env.RECORDS.put('top', JSON.stringify(ordenado));
  return json({ top: ordenado, puesto: ordenado.findIndex((f) => mismoApodo(f.apodo, apodo)) + 1, mejoro });
}
