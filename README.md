# robertvaliente.com

Sitio personal de Roberto Valiente. HTML estático, sin build ni dependencias.

## Estructura

```
index.html              portada — bio, notas, menciones y contacto
recursos-ia/index.html  nota — ¿Deberíamos tenerle miedo a la IA?
recursos-ia/mitchell/    redirige a /recursos-ia/#mitchell (la mini nota se integró a la nota como mirada 3)
recursos-ia/audio/       podcasts en español (mp3 mono 64k; Pages no acepta archivos de más de 25 MB)
juegomati/index.html    Mamba 81, juego de las tablas de multiplicar para Mati, en 3D con Three.js desde cdnjs (noindex, sin link desde la portada)
_redirects              /mamba y /mamba/* redirigen a /juegomati/ para que no se rompan los links antiguos
functions/api/records.js  ranking del juego (Pages Function + KV)
```

En español. Cada nota es una carpeta con su `index.html` y repite el
CSS de la portada (no hay hoja compartida). Tipografía Newsreader + IBM Plex Mono
(Google Fonts), paleta en variables CSS al inicio del archivo.

## Deploy

Cloudflare Pages conectado a este repo (rama `main`).
Framework preset: None · Build command: vacío · Output directory: `/`

Cada push a `main` despliega solo. El dominio apunta vía CNAME al
proyecto de Pages, con el correo `hola@` en Cloudflare Email Routing.

## Ranking de Mamba 81

`functions/api/records.js` guarda los puntajes en KV. En Pages hay que conectar un
namespace con el binding `RECORDS` y volver a desplegar. Sin eso el juego funciona
igual, solo con el récord personal de cada navegador.

Para borrar un apodo: en Cloudflare, KV → `mamba-records` → editar la clave `top`.

## Pendiente

- Links de la sección Contacto más allá de email y LinkedIn
