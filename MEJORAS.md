# 📋 MEJORAS — Plataforma Bootcamp (UI/UX)

Lista maestra de mejoras priorizadas. Marca cada tarea con `[x]` cuando esté lista.
Todas las tareas tocan `bootcamp-platform.html` salvo donde se indica.

---

## 🔴 FASE 1 · P0 — Fundamentos (bugs reales, riesgo bajo)

- [x] **1. Añadir `<head>` completo** — `<!DOCTYPE html>`, `<meta charset>`, **`<meta viewport>`** (crítico: hoy en móvil real se ve zoom-out), `lang="es"`, meta description.
- [ ] **2. Title dinámico + favicon** — `<title>` con el nombre del curso; favicon SVG inline (reemplaza el placeholder 🖼 del logo).
- [ ] **3. Optimizar carga de fuentes** — Mover `@import` de Google Fonts al `<head>` con `<link rel="preconnect">` (hoy bloquea el render).
- [ ] **4. Eliminar `alert()` nativo** — Los 4 usos en `saveMatBtn` → errores inline bajo el campo (patrón `modal-error` ya existente).
- [ ] **5. Editar el título del curso** — Hoy hardcodeado "セロトレード ACADEMY"; añadir `title` a `course.json`, editar desde menú admin, mostrarlo en topbar. *(también: `api/course.js` y `api/_lib/drive.js`)*

## 🟠 FASE 2 · P1 — Experiencia del alumno

- [ ] **6. Navegación ← anterior / siguiente →** — Botones bajo cada lección con el flujo lineal del curso.
- [ ] **7. Progreso del curso** — Lecciones completadas (localStorage por alumno), barra de progreso por módulo en sidebar, % total en topbar.
- [ ] **8. Limpiar títulos UUID** — Al subir, el auto-título es el nombre del archivo (UUID de Drive) → si parece UUID, dejar título vacío/limpio ("Imagen").
- [ ] **9. Lightbox de imágenes** — Click en imagen → modal con zoom y fondo oscuro.
- [ ] **10. Reproductor de audio con marca** — El `<audio controls>` nativo rompe la estética paper/ink → player custom (play/pausa, velocidad, progreso).
- [ ] **11. PDF con acciones claras** — Botones "Abrir en pestaña nueva" + "Descargar" en la cabecera.
- [ ] **12. Skeletons de carga** — Cajas animadas mientras cargan iframes de video/PDF.
- [ ] **13. Empty state de bienvenida** — "Selecciona una lección" → pantalla con estadísticas del curso (módulos, lecciones, % visto).
- [ ] **14. Footer** — Cierre de marca al final de cada lección.

## 🟡 FASE 3 · P2 — Experiencia del administrador

- [ ] **15. Drag & drop para reordenar** — Módulos, lecciones y materiales (hoy el orden es fijo).
- [ ] **16. Duplicar material / lección** — Clon con título "(copia)" — ideal para plantillas tipo YARIS/AQUA.
- [ ] **17. Dropzone con vista previa** — Miniatura de la imagen/PDF seleccionado antes de subir.
- [ ] **18. Validación de URL** — Avisar si el enlace YouTube/Drive no se reconoce antes de guardar.
- [ ] **19. Ajustes del curso en menú admin** — El menú del avatar (hoy solo "cerrar sesión") → también editar título + logo.
- [ ] **20. Conservar campos al cambiar de tipo** — Video→Texto no debería borrar lo ya escrito en la primera visita.
- [ ] **21. Feedback "guardando" en título inline** — Avisar mientras guarda el contenteditable.

## 🟢 FASE 4 · P3 — Pulido visual y microinteracciones

- [ ] **22. Hover con elevación en tarjetas** — `material:hover` con sombra sutil + transición.
- [ ] **23. Animaciones de entrada** — Fade/slide al cambiar de lección, abrir modales y paneles.
- [ ] **24. `:focus-visible`** — Estado de foco visible en botones/inputs.
- [ ] **25. Modales con focus-trap** — Foco atrapado + animación de escala (ya tienen Escape).
- [ ] **26. Scrollbar cross-browser** — Añadir `scrollbar-color` para Firefox.
- [ ] **27. Dark mode** — `prefers-color-scheme` (las variables CSS lo facilitan).
- [ ] **28. Print stylesheet** — Que una lección imprima limpia.
- [ ] **29. Atajos de teclado** — Flechas o `n`/`p` para navegar lecciones.
- [ ] **30. Toast con iconos + `aria-live`** — Mejor feedback de guardado.

## 🔵 FASE 5 · P4 — Rendimiento y robustez

- [ ] **31. Eliminar petición fallida de Drive** — Hoy cada imagen hace 2 requests: `uc?export=view` (bloqueada `ERR_BLOCKED_BY_ORB`) + fallback `/api/image` → cargar directo por proxy.
- [ ] **32. `loading="lazy"` en iframes** — Embeds fuera del primer pliegue.
- [ ] **33. Aviso "versión guardada"** — Si falla `/api/course` y se muestra caché local, avisar discreto.
- [ ] **34. Revisar contraste WCAG** — Verificar combinaciones (ej. `ink-soft` sobre `paper`).

## ✅ FASE 6 · Validación y despliegue

- [ ] **35. Prueba en móvil real** — Verificar viewport tras el fix #1 (el preview de escritorio no simula el zoom-out).
- [ ] **36. Prueba del flujo completo admin** — Login, subir archivo real a Drive, grabar audio, guardar curso.
- [ ] **37. Regresión de datos** — Asegurar que el `course.json` real (3 módulos, 5 lecciones) no se rompe al añadir el campo `title`.
- [ ] **38. Deploy en Vercel** — Verificar en producción + `Cache-Control` de la página.

---

## Orden de ejecución recomendado

1. **Fase 1** (P0) → **Fase 2** (P1 alumno) → **Fase 3** (P2 admin) → **Fase 4** (P3 pulido) → **Fase 5** (P4 rendimiento).
2. Las fases 1 y 2 dan el 80% de la percepción profesional y son independientes del resto.
3. La tarea 15 (drag & drop) es la única grande (L); el resto son S/M.
