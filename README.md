# robertvaliente.com

Sitio personal de Roberto Valiente. HTML estático, sin build ni dependencias.

## Estructura

```
index.html    portada — bio, notas, menciones y contacto
```

Una sola página, en español. Tipografía Newsreader + IBM Plex Mono
(Google Fonts), paleta en variables CSS al inicio del archivo.

## Deploy

Cloudflare Pages conectado a este repo (rama `main`).
Framework preset: None · Build command: vacío · Output directory: `/`

Cada push a `main` despliega solo. El dominio apunta vía CNAME al
proyecto de Pages, con el correo `hola@` en Cloudflare Email Routing.

## Pendiente

- `recursos-ia/` — recopilación de recursos sobre AI Safety
- Links de la sección Contacto más allá de email y LinkedIn
