# robertvaliente.com

Sitio personal de Roberto Valiente. HTML estático, sin build ni dependencias.

## Estructura

```
index.html              portada — bio, notas, menciones y contacto
recursos-ia/index.html  nota — ¿Deberíamos tenerle miedo a la IA?
recursos-ia/audio/       podcasts en español (mp3 mono 64k; Pages no acepta archivos de más de 25 MB)
```

En español. Cada nota es una carpeta con su `index.html` y repite el
CSS de la portada (no hay hoja compartida). Tipografía Newsreader + IBM Plex Mono
(Google Fonts), paleta en variables CSS al inicio del archivo.

## Deploy

Cloudflare Pages conectado a este repo (rama `main`).
Framework preset: None · Build command: vacío · Output directory: `/`

Cada push a `main` despliega solo. El dominio apunta vía CNAME al
proyecto de Pages, con el correo `hola@` en Cloudflare Email Routing.

## Pendiente

- Links de la sección Contacto más allá de email y LinkedIn
