const NOTIFY = 'agalan@pffsc.com'; // agregar notificaciones@pffsc.com 

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);

    // basic validation: server checks + browser
    if (!d.nombre || !d.correo || !d.mensaje || d.consent !== true) {
      return reply({ ok: false, error: 'Faltan datos obligatorios.'});
    }

    guardarEnFormulario(d);
    avisarPorCorreo(d);
    return reply({ ok: true });

  } catch (err) {
    return reply({ ok: false, error: String(err) });
  }
};

const IDS = {
  nombre:   2112769541,
  correo:   1099652640,
  telefono: 1843605867,
  mensaje:  890081274
};

// writes real response into Form (shows up in Respuestas)
function guardarEnFormulario(d) {
  const form = FormApp.getActiveForm();
  const resp = form.createResponse();

  resp.withItemResponse(form.getItemById(IDS.nombre).asTextItem().createResponse(d.nombre));
  resp.withItemResponse(form.getItemById(IDS.correo).asTextItem().createResponse(d.correo));
  if (d.telefono) {
    resp.withItemResponse(form.getItemById(IDS.telefono).asTextItem().createResponse(d.telefono));
  }
  resp.withItemResponse(form.getItemById(IDS.mensaje).asParagraphTextItem().createResponse(d.mensaje));

  resp.submit();
};

// send email with full message (reply goes straight to visitor)
function avisarPorCorreo(d) {
  MailApp.sendEmail({
    to: NOTIFY,
    replyTo: d.correo,
    subject: 'Nuevo mensaje del sitio web: ' + d.nombre,
    body: 'Nombre: ' + d.nombre + '\nCorreo: ' + d.correo + '\nTeléfono: ' + d.telefono + '\n\nMensaje:\n ' + d.mensaje,
  });
};

// helper: turn object into JSON reply 
function reply(obj) {
  return ContentService
  .createTextOutput(JSON.stringify(obj))
  .setMimeType(ContentService.MimeType.JSON);
};

// manual test from editor (simulates website)
function prueba() {
  const fake = { postData: { contents: JSON.stringify({
    nombre: 'PRUEBA script', correo: 'agalan@pffsc.com', telefono: '', mensaje: 'prueba desde editor.', consent: true
  })}};
  Logger.log(doPost(fake).getContent());
};

function listarPreguntas() {
  FormApp.getActiveForm().getItems().forEach(function (item) {
    Logger.log(JSON.stringify(item.getTitle()) + '  |  ' + item.getType() + '  |  id ' + item.getId());
  });
}

function ultimaRespuesta() {
  const rs = FormApp.getActiveForm().getResponses();
  const last = rs[rs.length - 1];
  Logger.log('Fecha: ' + last.getTimestamp());
  last.getItemResponses().forEach(function (ir) {
    Logger.log(JSON.stringify(ir.getItem().getTitle()) + ' = ' + JSON.stringify(ir.getResponse()));
  });
}