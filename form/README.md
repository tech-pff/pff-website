# Formulario de contacto del sitio web (PFF)
 
Estado: funcionando y probado (16 oct 2026). Aviso de Privacidad (resumen) publicado en el formulario.
 
## Flujo
Página Contacto (Google Sites, embed HTML personalizado) -> `fetch` POST (JSON como text/plain) -> Apps Script web app (`doPost`) -> 1) guarda respuesta en el Google Form "Contacto Sitio web PFFSC" y 2) envía correo a agalan@pffsc.com (replyTo = correo del visitante) -> responde `{"ok":true}` -> la página muestra "Gracias". Si falla o tarda más de 20 s, la página muestra un error con mailto a notificaciones@pffsc.com.
 
## Piezas
- **Embed HTML:** archivo `contacto-embed.html` (v2). Incluye casilla de consentimiento (antes del botón) y panel desplegable "Ver resumen" con el aviso corto (texto en "usted", aprobado).
- **Apps Script:** vinculado al Google Form (⋮ > Editor de secuencia de comandos). Funciones: `doPost`, `guardarEnFormulario`, `avisarPorCorreo`, `reply`; utilidades `prueba`, `listarPreguntas`, `ultimaRespuesta`.
- **URL web app:** https://script.google.com/macros/s/AKfycbwctvhvw62tOi4WLxDM2q8GCPB_uP5BAGDTwjQCsa33yjtTjoNAmVvtkp0I7qHFw9Ni/exec (Ejecutar como: agalan@pffsc.com; acceso: Cualquier usuario).
- **IDs de preguntas del Form** (el script escribe por ID, no por título): Nombre 2112769541, Correo electrónico 1099652640, Teléfono 1843605867, Mensaje 890081274. Si se borra y recrea una pregunta, su ID cambia: correr `listarPreguntas` y actualizar `IDS`.

## Reglas de mantenimiento
- Después de editar el script: **Implementar > Gestionar implementaciones > ✏️ > Nueva versión**. Guardar no basta; la URL /exec sigue corriendo la versión anterior.
- Para cambiar destinatarios del aviso: constante `NOTIFY` en el script (+ nueva versión).
- Las notificaciones nativas de Google Forms solo llegan a la cuenta que las activó; el aviso real lo envía el script.