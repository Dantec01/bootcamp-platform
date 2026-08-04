# Memoria del proyecto: plataforma de bootcamp

## Objetivo

Sitio pequeño de lecciones para alumnos, con edición exclusiva de un administrador. La interfaz original se conserva: mismos botones, modales, árbol de módulos, edición de materiales y vistas previas.

## Arquitectura acordada

- Frontend: `bootcamp-platform.html`, servido estáticamente por Vercel.
- Backend mínimo: funciones Node.js en `api/` de Vercel.
- Base de contenido: `course.json` en la carpeta raíz de Google Drive. Guarda título, módulos, lecciones, textos y enlaces.
- Archivos: Google Drive. La API crea estas carpetas bajo la carpeta raíz al recibir la primera subida:
  - `lecciones/` para PDFs.
  - `imagenes/` para imágenes.
  - `audios/` para audios grabados o subidos.
- Videos: se cargan manualmente en YouTube o Google Drive. El administrador pega el enlace en el modal existente y la plataforma lo incrusta.
- No hay acceso de alumno ni base de datos. El curso es público; solo editar exige sesión de administrador.

## PDFs de lecciones

Sí se usarán como respaldo y material oficial descargable dentro de `lecciones/`. El texto breve y editable de una lección vive en `course.json`; un PDF no debe ser la única fuente si se espera editar ese contenido desde la plataforma.

## Seguridad

- La contraseña ya no está dentro del HTML. `ADMIN_PASSWORD` vive solo en las variables de entorno de Vercel.
- El login crea una cookie HTTP-only firmada por `SESSION_SECRET` y dura 12 horas.
- La cuenta de servicio de Google debe recibir acceso de **Editor** a la carpeta raíz. No compartir la clave privada ni publicar `course.json`.
- Los archivos subidos desde la plataforma se comparten como “cualquiera con el enlace puede ver”, requisito para embeberlos. Los videos pueden seguir las mismas reglas de YouTube/Drive.

## Variables para Vercel

Copiar los nombres de `.env.example` en Project Settings → Environment Variables:

| Variable | Uso |
| --- | --- |
| `ADMIN_PASSWORD` | Contraseña del administrador. |
| `SESSION_SECRET` | Secreto aleatorio largo para firmar la cookie. |
| `GOOGLE_DRIVE_ROOT_FOLDER_ID` | ID de la carpeta raíz de Drive. |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | JSON en una línea de una cuenta de servicio de Google Cloud. |

Para desarrollo local se puede usar adicionalmente `GOOGLE_SERVICE_ACCOUNT_JSON_FILE` con la ruta absoluta al archivo JSON descargado. Esta variable no se utiliza en Vercel.

## Preparación de Google Drive

1. Crear una carpeta raíz, por ejemplo `Bootcamp`.
2. Crear una cuenta de servicio en Google Cloud y habilitar Google Drive API.
3. Descargar su clave JSON y colocar su contenido completo en `GOOGLE_SERVICE_ACCOUNT_JSON`.
4. Compartir la carpeta raíz con el correo de la cuenta de servicio como **Editor**.
5. Copiar el ID de la URL de la carpeta a `GOOGLE_DRIVE_ROOT_FOLDER_ID`.

## Configuración local realizada (2026-08-03)

- Carpeta raíz verificada: `Bootcamp` (`1dP-Lz5pM2myaJUD6bjqCz2zmTytvAr_r`).
- Cuenta de servicio verificada: `drive-uploader@healthy-mark-504406-m5.iam.gserviceaccount.com`.
- La clave se lee localmente desde el archivo JSON descargado mediante `GOOGLE_SERVICE_ACCOUNT_JSON_FILE`; no se copió al proyecto.
- Cliente OAuth local configurado; el secreto y los tokens viven exclusivamente en `.env.local`.
- La API confirmó acceso de la cuenta de servicio a la carpeta. `course.json` se creará automáticamente en la primera edición que guardes como administrador.

> Actualización: la cuenta de servicio puede leer la carpeta, pero Google impide que cree archivos en una carpeta de Drive personal porque no posee cuota de almacenamiento. Para la carpeta de Gmail se usa OAuth de la cuenta propietaria mediante `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET` y `GOOGLE_OAUTH_REFRESH_TOKEN`. Las cuentas de servicio siguen siendo válidas si el proyecto se traslada a una unidad compartida de Google Workspace.

## Despliegue

1. Subir este proyecto a GitHub.
2. Importarlo en Vercel.
3. Definir las cuatro variables anteriores para Production (y Preview si se desea).
4. Desplegar. La raíz `/` se redirige mediante `vercel.json` a la pantalla existente.

## Límites conocidos

Las funciones serverless de Vercel no son adecuadas para archivos grandes. La interfaz limita las subidas a unos 4 MB; para documentos o medios mayores, subir el archivo manualmente a Drive y pegar el enlace. Esto coincide con el flujo manual previsto para videos.
