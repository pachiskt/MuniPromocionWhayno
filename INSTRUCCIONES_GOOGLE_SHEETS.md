# 📋 Guía de Conexión: Formulario a Google Sheets

Esta guía explica en 4 sencillos pasos cómo conectar el formulario de la Landing Page de **Muninteligente** con una hoja de cálculo de Google Sheets de forma **100% gratuita y sin intermediarios de pago**, utilizando **Google Apps Script**.

---

## Paso 1: Crear la Hoja de Google Sheets

1. Abre tu navegador y ve a [sheets.google.com](https://sheets.google.com).
2. Crea una **Hoja de cálculo en blanco**.
3. Nómbrala, por ejemplo: `Muninteligente - Registro de Prospectos`.
4. En la primera fila (Fila 1), coloca los siguientes encabezados de columnas:
   - **A1:** `Fecha y Hora`
   - **B1:** `Nombre Completo`
   - **C1:** `Teléfono / WhatsApp`
   - **D1:** `Correo Electrónico`
   - **E1:** `Cargo / Rol`
   - **F1:** `Municipalidad / Entidad`
   - **G1:** `Región`
   - **H1:** `N° Obras / Proyectos`
   - **I1:** `Mensaje / Consulta`

---

## Paso 2: Abrir el Editor de Apps Script

1. En el menú superior de tu Google Sheet, ve a:
   **Extensiones** > **Apps Script**
2. Se abrirá una pestaña con un archivo llamado `Código.gs`.
3. Borra todo el código que aparezca allí y **pega exactamente el siguiente código**:

```javascript
function doPost(e) {
  var lock = LockService.getScriptLock();
  // Esperar hasta 10 segundos para evitar colisiones de concurrencia
  lock.tryLock(10000);
  
  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getActiveSheet();
    
    // Si la hoja no tiene encabezados, los crea automáticamente
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Fecha y Hora", 
        "Nombre Completo", 
        "Teléfono / WhatsApp", 
        "Correo Electrónico", 
        "Cargo", 
        "Municipalidad / Entidad", 
        "Región", 
        "N° Obras", 
        "Mensaje / Consulta"
      ]);
    }
    
    // Parsear los datos recibidos
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch(err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }
    
    var timestamp = new Date().toLocaleString("es-PE", {
      timeZone: "America/Lima",
      hour12: true
    });
    
    // Insertar la fila con los datos
    sheet.appendRow([
      timestamp,
      data.nombre || '',
      data.telefono || '',
      data.email || '',
      data.cargo || '',
      data.entidad || '',
      data.region || '',
      data.obras || '',
      data.mensaje || ''
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        result: 'success', 
        message: 'Registro guardado exitosamente',
        timestamp: timestamp
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        result: 'error', 
        error: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

4. Haz clic en el ícono de **Guardar** (disquete) o presiona `Ctrl + S`.

---

## Paso 3: Implementar como Aplicación Web (Web App)

1. En la esquina superior derecha de Apps Script, haz clic en el botón azul **Implementar** (o *Deploy*) > **Nueva implementación**.
2. En el engranaje ⚙️ (Seleccionar tipo), elige **Aplicación web**.
3. Llena la configuración así:
   - **Descripción:** `Muninteligente Form Webhook`
   - **Ejecutar como:** **Yo** (`tu-correo@gmail.com`)
   - **Quién tiene acceso:** **Cualquier usuario** (*Anyone*) ⚠️ *(¡MUY IMPORTANTE! Si seleccionas "Solo yo", el formulario no podrá guardar los datos de los visitantes).*
4. Haz clic en **Implementar**.
5. Google te pedirá "Autorizar acceso". Haz clic en **Revisar permisos** > Selecciona tu cuenta > Haz clic en **Avanzado** (o *Advanced*) > Haz clic en **Ir a Proyecto (no seguro)** > Haz clic en **Permitir**.
6. Copia la **URL de la aplicación web** que termina en `/exec`.  
   *(Ejemplo: `https://script.google.com/macros/s/AKfycbx.../exec`)*

---

## Paso 4: Pegar tu URL en `app.js`

1. Abre el archivo [app.js](file:///c:/Users/PachisKT/Downloads/LandingPage%20Muni/app.js).
2. En las primeras líneas, ubica la constante:
   ```javascript
   const GOOGLE_SHEETS_SCRIPT_URL = "PEGA_AQUI_TU_URL_DE_APPS_SCRIPT";
   ```
3. Reemplázala por tu URL copiada y guarda el archivo.
4. ¡Listo! Cada vez que un alcalde o funcionario llene el formulario, aparecerá al instante en tu Google Sheet en tiempo real.
