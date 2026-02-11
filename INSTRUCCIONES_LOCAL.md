# Instrucciones para Probar Localmente

## Problema que Tenías

Cuando ejecutabas `python -m http.server 8000`, solo servía los archivos HTML/CSS/JS estáticos, pero **NO** las APIs (Netlify Functions). Por eso veías:

- "Loading..." en vez de tu información
- Errores 404 para `/.netlify/functions/profile`, etc.
- Las secciones de experiencia, proyectos, etc. vacías

## Solución: Servidor de Desarrollo Local

He creado `local_server.py` que simula el ambiente de Netlify en tu computadora.

## Pasos para Probar Todo Localmente

### 1. Detén el Servidor Actual

Si tienes `python -m http.server 8000` corriendo, detenlo:
- Presiona `Ctrl+C` en la terminal

### 2. Asegúrate de que los Datos Estén Generados

```bash
python backend/scripts/generate_content.py
```

Deberías ver:
```
Generating content from resume_data.txt...
Generated profile.json
Generated experience.json
Generated education.json
Generated skills.json
Generated certificates.json
Generated projects.json (3 real + 17 placeholder projects)

All content files generated successfully in backend/data/
```

### 3. Inicia el Servidor de Desarrollo

```bash
python local_server.py
```

Deberías ver:
```
============================================================
  PORTFOLIO LOCAL DEVELOPMENT SERVER
============================================================

Serving frontend from: C:\Users\...\frontend
Serving API data from: C:\Users\...\backend\data

Server running at: http://localhost:8000

Available API endpoints:
  - http://localhost:8000/.netlify/functions/profile
  - http://localhost:8000/.netlify/functions/experience
  - http://localhost:8000/.netlify/functions/education
  - http://localhost:8000/.netlify/functions/skills
  - http://localhost:8000/.netlify/functions/certificates
  - http://localhost:8000/.netlify/functions/projects
  - http://localhost:8000/.netlify/functions/contact (POST)

Press Ctrl+C to stop the server
============================================================
```

### 4. Abre en el Navegador

Visita: **http://localhost:8000**

Ahora deberías ver:
- ✅ Tu nombre y título profesional
- ✅ Tu resumen profesional
- ✅ Todas tus habilidades técnicas
- ✅ Tu experiencia en Thomson Reuters
- ✅ Tu educación en IPN ESCOM
- ✅ Tus 3 certificaciones
- ✅ Los 20 proyectos (3 reales + 17 placeholders)
- ✅ El formulario de contacto funcionando
- ✅ Cambio de idioma EN/ES
- ✅ Cambio de tema claro/oscuro

## Agregar Imágenes y Videos de Proyectos

### Estructura de Carpetas

Cada proyecto tiene su carpeta en `frontend/media/projects/<slug>/`

**Tus proyectos reales:**
```
frontend/media/projects/
├── sweet-style/
│   └── screenshot-1.jpg          # 👈 Reemplaza con captura real
├── fluvi-traffic/
│   ├── simulation-view.jpg       # 👈 Reemplaza con captura real
│   └── demo.mp4                  # 👈 Reemplaza con video real (máx 10MB)
└── file-explorer/
    └── app-screen.jpg            # 👈 Reemplaza con captura real
```

### Cómo Agregar Media

1. **Toma capturas de pantalla de tus proyectos**
   - Formato: JPG o PNG
   - Tamaño recomendado: 1920x1080 o 1280x720
   - Optimiza las imágenes (usa TinyPNG.com o similar)

2. **Para videos** (como el demo de FLUVI):
   - Formato: MP4
   - Tamaño máximo: 10MB
   - Duración: 30-60 segundos
   - Usa compresión H.264

3. **Reemplaza los archivos placeholder**
   - Simplemente sobrescribe los archivos existentes
   - Mantén los mismos nombres de archivo

4. **Agrega más imágenes/videos** (opcional):
   - Edita `backend/scripts/generate_content.py`
   - Busca tu proyecto en la función `generate_projects()`
   - Agrega más items al array `media`:

   ```python
   "media": [
       {
           "type": "image",
           "src": "/media/projects/sweet-style/screenshot-1.jpg",
           "alt": {
               "en": "Dashboard view",
               "es": "Vista del panel"
           },
           "caption": {
               "en": "Main dashboard interface",
               "es": "Interfaz principal del panel"
           }
       },
       {
           "type": "image",
           "src": "/media/projects/sweet-style/screenshot-2.jpg",  # 👈 NUEVO
           "alt": {
               "en": "Product catalog",
               "es": "Catálogo de productos"
           },
           "caption": {
               "en": "Product listing page",
               "es": "Página de listado de productos"
           }
       }
   ]
   ```

5. **Regenera los datos**:
   ```bash
   python backend/scripts/generate_content.py
   ```

6. **Recarga el navegador** (Ctrl+F5 para limpiar caché)

### Agregar Enlaces a Proyectos

Si tus proyectos tienen:
- Repositorio de GitHub
- Demo en vivo
- Caso de estudio

Edita `backend/scripts/generate_content.py`:

```python
{
    "id": "sweet-style",
    "slug": "sweet-style",
    "title": { ... },
    # ... resto del proyecto ...
    "links": {
        "github": "https://github.com/connum925/sweet-style",      # 👈 TU LINK
        "demo": "https://sweet-style.herokuapp.com",                # 👈 TU LINK
        "caseStudy": "https://dev.to/connum925/sweet-style-case"   # 👈 TU LINK
    }
}
```

Luego regenera:
```bash
python backend/scripts/generate_content.py
```

## Verificar Que Todo Funciona

### Checklist de Pruebas Locales

- [ ] La página carga sin errores en la consola del navegador (F12)
- [ ] Se muestra tu nombre "Connor Urbano Mendoza"
- [ ] Se muestra tu título y resumen profesional
- [ ] La sección de habilidades muestra todas las tecnologías
- [ ] La sección de experiencia muestra Thomson Reuters con 7 logros
- [ ] La sección de educación muestra IPN ESCOM
- [ ] La sección de certificaciones muestra 3 certificados
- [ ] La sección de proyectos muestra 20 proyectos
- [ ] Puedes buscar y filtrar proyectos por tecnología
- [ ] Al hacer clic en "View Details" de un proyecto, abre la página de detalle
- [ ] La página de detalle muestra el carrusel de medios
- [ ] El formulario de contacto funciona (prueba enviando un mensaje)
- [ ] El cambio de idioma EN/ES traduce TODO el contenido
- [ ] El cambio de tema claro/oscuro funciona
- [ ] En móvil (F12 > Device Toolbar) todo se ve bien

### Probar Formulario de Contacto

1. Llena el formulario
2. Envía un mensaje de prueba
3. Deberías ver un mensaje de éxito
4. Verifica que se guardó en `backend/data/messages.jsonl`

```bash
# Ver mensajes guardados (cada línea es un mensaje)
type backend\data\messages.jsonl
```

## Siguiente Paso: Deploy a Netlify

Una vez que TODO funciona bien localmente y has agregado tus imágenes/videos:

1. Sigue las instrucciones en `DEPLOYMENT.md`
2. Push a GitHub
3. Conecta con Netlify
4. ¡Tu sitio estará en vivo!

## Problemas Comunes

### "Loading..." No Desaparece
- Verifica que ejecutaste `python local_server.py` (NO `python -m http.server`)
- Abre la consola del navegador (F12) y busca errores
- Verifica que los archivos JSON existen en `backend/data/`

### Imágenes No Cargan
- Verifica que las rutas en el código coinciden con los nombres de archivo
- Asegúrate de usar barras `/` (no `\`) en las rutas
- Verifica que los archivos existen en `frontend/media/projects/`

### Cambios No Se Reflejan
- Limpia el caché del navegador (Ctrl+Shift+Delete)
- Recarga con Ctrl+F5
- Si editaste el script Python, regenera datos: `python backend/scripts/generate_content.py`

---

¡Listo! Ahora puedes probar todo localmente antes de deployar a Netlify.
