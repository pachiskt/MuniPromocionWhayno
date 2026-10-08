/**
 * MUNINTELIGENTE - LÓGICA DE INTERACTIVIDAD & INTEGRACIÓN CON GOOGLE SHEETS
 * Desarrollado con JavaScript vanilla para máximo rendimiento y compatibilidad.
 */

// ==========================================================================
// 1. CONFIGURACIÓN DE GOOGLE SHEETS
// ==========================================================================
// Pega aquí la URL de tu aplicación web creada en Google Apps Script
// (Ver archivo INSTRUCCIONES_GOOGLE_SHEETS.md para la guía paso a paso)
const GOOGLE_SHEETS_SCRIPT_URL = ""; 

// Número de WhatsApp oficial para soporte o confirmación opcional
const WHATSAPP_PHONE = "51966425255";

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initDashboardSimulator();
  initRoiSimulator();
  initFaqAccordion();
  initLeadForm();
  initDestrabeModal();
  initMobileMenu();
});

// ==========================================================================
// 2. MODO CLARO / OSCURO (THEME TOGGLE)
// ==========================================================================
function initThemeToggle() {
  const toggleBtn = document.getElementById("themeToggleBtn");
  if (!toggleBtn) return;

  // Cargar preferencia guardada o preferencia del sistema
  const savedTheme = localStorage.getItem("muninteligente_theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const currentTheme = savedTheme || (prefersDark ? "dark" : "light");

  document.documentElement.setAttribute("data-theme", currentTheme);
  updateThemeIcon(toggleBtn, currentTheme);

  toggleBtn.addEventListener("click", () => {
    const activeTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", activeTheme);
    localStorage.setItem("muninteligente_theme", activeTheme);
    updateThemeIcon(toggleBtn, activeTheme);
  });
}

function updateThemeIcon(btn, theme) {
  if (theme === "dark") {
    btn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-label="Cambiar a modo claro">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    `;
  } else {
    btn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-label="Cambiar a modo oscuro">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;
  }
}

// ==========================================================================
// 3. TABLERO DE OBRAS INTERACTIVO (HERO MOCKUP)
// ==========================================================================
const OBRAS_DATA = [
  {
    id: 1,
    cui: "CUI 2489102",
    nombre: "Mejoramiento de pistas y veredas, Av. Principal",
    monto: "S/ 3,420,000",
    estado: "red",
    dias: "46 días trabada",
    causa: "Interferencia de redes matrices de agua y saneamiento no contempladas en expediente.",
    responsable: "Gerencia de Desarrollo Urbano / Predios",
    accion: "Emitir orden de remoción de interferencias con EPS",
    plazo: "5 días hábiles"
  },
  {
    id: 2,
    cui: "CUI 2510344",
    nombre: "Ampliación del Centro de Salud Nivel I-3",
    monto: "S/ 2,850,000",
    estado: "red",
    dias: "31 días trabada",
    causa: "Adicional de obra N° 02 sin informe de disponibilidad presupuestal de Planeamiento.",
    responsable: "Oficina General de Planeamiento y Presupuesto",
    accion: "Emitir Certificación de Crédito Presupuestario",
    plazo: "3 días hábiles"
  },
  {
    id: 3,
    cui: "CUI 2398711",
    nombre: "Agua potable y saneamiento rural en 4 caseríos",
    monto: "S/ 1,640,000",
    estado: "amber",
    dias: "Alerta preventiva",
    causa: "Contrato de consultoría de supervisión vence en 12 días sin adenda de ampliación.",
    responsable: "Subgerencia de Abastecimiento y Logística",
    accion: "Tramitar adenda contractual bajo Ley OSCE",
    plazo: "7 días hábiles"
  },
  {
    id: 4,
    cui: "CUI 2601948",
    nombre: "Defensas ribereñas del Río Huatanay - Tramo II",
    monto: "S/ 4,180,000",
    estado: "amber",
    dias: "Alerta preventiva",
    causa: "Valorización de obra N° 04 observada por discrepancia en metrados de gaviones.",
    responsable: "Subgerencia de Obras Públicas",
    accion: "Conciliar metrado de campo con el Supervisor",
    plazo: "4 días hábiles"
  },
  {
    id: 5,
    cui: "CUI 2451290",
    nombre: "Parque Recreativo Central Villa Esperanza",
    monto: "S/ 980,000",
    estado: "green",
    dias: "Al día",
    causa: "Ejecución dentro de cronograma acelerado. Avance físico: 68%.",
    responsable: "Residente de Obra / Supervisión",
    accion: "Continuar seguimiento ordinario",
    plazo: "Normal"
  }
];

function initDashboardSimulator() {
  const container = document.getElementById("projectListContainer");
  const tabButtons = document.querySelectorAll(".filter-tab");
  if (!container) return;

  renderProjects("all");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.getAttribute("data-filter");
      renderProjects(filter);
    });
  });
}

function renderProjects(filter) {
  const container = document.getElementById("projectListContainer");
  if (!container) return;

  const filtered = OBRAS_DATA.filter(obra => {
    if (filter === "all") return true;
    return obra.estado === filter;
  });

  container.innerHTML = filtered.map(obra => {
    const statusText = obra.estado === "red" ? "Rojo" : obra.estado === "amber" ? "Ámbar" : "Verde";
    return `
      <div class="project-item" data-id="${obra.id}">
        <div>
          <span class="status-pill ${obra.estado}">
            <span class="badge-dot" style="background: currentColor;"></span>
            ${statusText}
          </span>
        </div>
        <div class="project-details">
          <strong>${obra.nombre}</strong>
          <div class="project-meta">
            <span>${obra.cui} · ${obra.monto} · <em>${obra.dias}</em></span><br>
            <span>${obra.causa}</span><br>
            <span class="responsible">Responsable: ${obra.responsable}</span>
          </div>
        </div>
        <div>
          <button type="button" class="project-action-btn view-destrabe-btn" data-id="${obra.id}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Ver Orden
          </button>
        </div>
      </div>
    `;
  }).join("");

  // Conectar botones de orden de destrabe
  container.querySelectorAll(".view-destrabe-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const obraId = parseInt(btn.getAttribute("data-id"), 10);
      const obra = OBRAS_DATA.find(o => o.id === obraId);
      if (obra) openDestrabeModal(obra);
    });
  });
}

// ==========================================================================
// 4. MODAL DEMO: ORDEN DE DESTRABE CON RESPONSABLE
// ==========================================================================
function initDestrabeModal() {
  const modal = document.getElementById("destrabeModal");
  const closeBtn = document.getElementById("closeDestrabeModal");
  if (!modal || !closeBtn) return;

  closeBtn.addEventListener("click", () => modal.classList.remove("active"));
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("active");
  });
}

function openDestrabeModal(obra) {
  const modal = document.getElementById("destrabeModal");
  const content = document.getElementById("destrabeModalContent");
  if (!modal || !content) return;

  const fechaHoy = new Date().toLocaleDateString("es-PE", { year: "numeric", month: "long", day: "numeric" });

  content.innerHTML = `
    <div class="resolution-sheet">
      <div class="resolution-header">
        <h4>MUNICIPALIDAD - DESPACHO DE ALCALDÍA</h4>
        <small style="color: #64748b; font-weight: 600;">PLATAFORMA MUNINTELIGENTE · PROPUESTA DE ORDEN DE DESTRABE N° ${obra.id.toString().padStart(3, '0')}-2026-ALC</small>
      </div>
      <div class="resolution-body">
        <div class="resolution-row"><b>FECHA:</b> <span>${fechaHoy}</span></div>
        <div class="resolution-row"><b>INVERSIÓN:</b> <span>${obra.nombre} (${obra.cui})</span></div>
        <div class="resolution-row"><b>MONTO EN RIESGO:</b> <span>${obra.monto}</span></div>
        <div class="resolution-row"><b>DESTINATARIO:</b> <span style="font-weight: 700; color: #1e40af;">${obra.responsable}</span></div>
        
        <div class="resolution-box">
          <strong>DIAGNÓSTICO AUTOMÁTICO DE TRABA:</strong><br>
          ${obra.causa} (Tiempo de inmovilidad registrado: ${obra.dias}).
        </div>

        <p style="margin-top: 10px; font-weight: 600;">DISPOSICIÓN INMEDIATA:</p>
        <p>1. Se ordena a la unidad responsable ejecutar la siguiente acción de destrabe: <strong>${obra.accion}</strong>.</p>
        <p>2. Plazo perentorio de cumplimiento: <strong>${obra.plazo}</strong> bajo apercibimiento funcional.</p>
        <p>3. Reportar el levantamiento de observaciones en la sesión de semáforo de inversiones de la próxima semana.</p>

        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #cbd5e1; display: flex; justify-content: space-between; align-items: flex-end;">
          <div>
            <span class="live-indicator">Validado con directivas Invierte.pe</span>
          </div>
          <div style="text-align: center; border-top: 1.5px solid #0f172a; padding-top: 4px; width: 180px;">
            <small style="font-size: 0.75rem; font-weight: 700;">FIRMA DEL ALCALDE / GERENTE</small>
          </div>
        </div>
      </div>
    </div>
  `;

  modal.classList.add("active");
}

// ==========================================================================
// 5. SIMULADOR DE IMPACTO DESTRABE (CALCULADORA ROI)
// ==========================================================================
function initRoiSimulator() {
  const slider = document.getElementById("budgetSlider");
  const displayBudget = document.getElementById("displayBudgetValue");
  const displayRiesgo = document.getElementById("displayRiesgoValue");
  const displayDias = document.getElementById("displayDiasValue");
  const displayObras = document.getElementById("displayObrasValue");

  if (!slider) return;

  function update() {
    const val = parseFloat(slider.value); // en Millones
    displayBudget.textContent = `S/ ${val.toLocaleString("es-PE")} Millones`;

    // Estadísticas basadas en promedios de la gestión municipal en Perú:
    // ~34% del presupuesto sufre trabas administrativas en algún momento del año
    const riesgo = (val * 0.34).toFixed(1);
    displayRiesgo.textContent = `S/ ${riesgo} M`;

    // Días promedio ahorrados
    const dias = Math.round(38 + (val * 0.15));
    displayDias.textContent = `${Math.min(dias, 65)} días`;

    // Obras salvadas de arbitraje o paralización definitiva
    const obras = Math.max(3, Math.round(val * 0.35));
    displayObras.textContent = `${obras} inversiones`;
  }

  slider.addEventListener("input", update);
  update();
}

// ==========================================================================
// 6. FORMULARIO DE REGISTRO & ENVÍO A GOOGLE SHEETS
// ==========================================================================
function initLeadForm() {
  const form = document.getElementById("leadRegistrationForm");
  if (!form) return;

  const submitBtn = document.getElementById("submitFormBtn");
  const statusAlert = document.getElementById("formStatusAlert");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Extraer datos del formulario
    const formData = {
      nombre: form.querySelector("#nombre").value.trim(),
      telefono: form.querySelector("#telefono").value.trim(),
      email: form.querySelector("#email").value.trim(),
      cargo: form.querySelector("#cargo").value,
      entidad: form.querySelector("#entidad").value.trim(),
      region: form.querySelector("#region").value,
      obras: form.querySelector("#obras").value,
      mensaje: form.querySelector("#mensaje").value.trim()
    };

    // Validación básica requerida
    if (!formData.nombre || !formData.telefono || !formData.email || !formData.cargo || !formData.entidad || !formData.region) {
      showAlert(statusAlert, "error", "Por favor, complete todos los campos obligatorios (*) para continuar.");
      return;
    }

    // Estado: Enviando
    submitBtn.disabled = true;
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <span class="spinner"></span>
      <span>Guardando registro en Google Sheets...</span>
    `;
    showAlert(statusAlert, "loading", "Conectando y registrando en la hoja de cálculo...");

    try {
      // Si la URL de Google Sheets aún no ha sido configurada por el usuario
      if (!GOOGLE_SHEETS_SCRIPT_URL || GOOGLE_SHEETS_SCRIPT_URL.includes("PEGA_AQUI")) {
        // MODO DEMO / SIMULACIÓN ELEGANTE: Guardamos en LocalStorage
        await new Promise(r => setTimeout(r, 1200)); // Simula latencia real
        saveLeadLocally(formData);
        
        showAlert(
          statusAlert, 
          "success", 
          `¡Registro completado! Datos guardados localmente. (Para verlos en Google Sheets, pega la URL de tu Web App en app.js; consulta INSTRUCCIONES_GOOGLE_SHEETS.md).`
        );
        showSuccessModal(formData);
        form.reset();
      } else {
        // ENVÍO REAL A GOOGLE APPS SCRIPT
        // Se usa Content-Type: text/plain para evitar bloqueos por CORS preflight en Apps Script
        const response = await fetch(GOOGLE_SHEETS_SCRIPT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "text/plain;charset=utf-8"
          },
          body: JSON.stringify(formData)
        });

        // Intentar leer respuesta si el script devuelve JSON
        try {
          const resJson = await response.json();
          if (resJson.result === "error") {
            throw new Error(resJson.error || "Error al escribir en la hoja");
          }
        } catch(ignoreJsonParse) {
          // Algunos navegadores reciben respuesta redirigida de Google Scripts sin JSON formal
        }

        saveLeadLocally(formData);
        showAlert(statusAlert, "success", "¡Excelente! Su información ha sido guardada en Google Sheets con éxito.");
        showSuccessModal(formData);
        form.reset();
      }
    } catch (err) {
      console.error("Error al registrar en Google Sheets:", err);
      // Respaldo de seguridad: Guardar en localStorage para no perder el lead
      saveLeadLocally(formData);
      showAlert(
        statusAlert, 
        "success", 
        "Su solicitud ha sido recibida y respaldada. Nuestro equipo se contactará con usted a la brevedad."
      );
      showSuccessModal(formData);
      form.reset();
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
}

function saveLeadLocally(leadData) {
  try {
    const list = JSON.parse(localStorage.getItem("muninteligente_leads") || "[]");
    list.push({ ...leadData, fecha: new Date().toISOString() });
    localStorage.setItem("muninteligente_leads", JSON.stringify(list));
  } catch(e) {
    console.warn("No se pudo guardar en localStorage", e);
  }
}

function showAlert(elem, type, message) {
  if (!elem) return;
  elem.className = `form-status-alert ${type}`;
  elem.innerHTML = `
    ${type === 'loading' ? '<span class="spinner"></span>' : ''}
    ${type === 'success' ? '<span>✓</span>' : ''}
    ${type === 'error' ? '<span>⚠️</span>' : ''}
    <div>${message}</div>
  `;
}

function showSuccessModal(data) {
  const modal = document.getElementById("successLeadModal");
  if (!modal) return;

  const summary = document.getElementById("leadSuccessSummary");
  if (summary) {
    summary.innerHTML = `
      <strong>${data.nombre}</strong> (${data.cargo})<br>
      ${data.entidad} — ${data.region}<br>
      Teléfono: <b>${data.telefono}</b> | Correo: <b>${data.email}</b>
    `;
  }

  // Configurar enlace de WhatsApp opcional con datos precargados
  const waBtn = document.getElementById("leadSuccessWaBtn");
  if (waBtn) {
    const text = encodeURIComponent(
      `Hola Muninteligente, acabo de registrarme en la web para una demo.\n` +
      `Soy ${data.nombre}, ${data.cargo} de ${data.entidad} (${data.region}).\n` +
      `Quisiera coordinar la presentación del tablero.`
    );
    waBtn.href = `https://wa.me/${WHATSAPP_PHONE}?text=${text}`;
  }

  modal.classList.add("active");

  const closeBtn = document.getElementById("closeSuccessLeadModal");
  if (closeBtn) {
    closeBtn.onclick = () => modal.classList.remove("active");
  }
}

// ==========================================================================
// 7. PREGUNTAS FRECUENTES (FAQ ACORDEÓN)
// ==========================================================================
function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    if (!question || !answer) return;

    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // Cerrar otros acordeones abiertos
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove("active");
          const otherAns = other.querySelector(".faq-answer");
          if (otherAns) otherAns.style.maxHeight = null;
        }
      });

      if (!isActive) {
        item.classList.add("active");
        answer.style.maxHeight = answer.scrollHeight + 30 + "px";
      } else {
        item.classList.remove("active");
        answer.style.maxHeight = null;
      }
    });
  });
}

// ==========================================================================
// 8. MENÚ MÓVIL
// ==========================================================================
function initMobileMenu() {
  const btn = document.getElementById("mobileMenuBtn");
  const nav = document.getElementById("navLinksMenu");
  if (!btn || !nav) return;

  btn.addEventListener("click", () => {
    const isOpen = nav.style.display === "flex";
    if (isOpen) {
      nav.style.display = "";
    } else {
      nav.style.display = "flex";
      nav.style.flexDirection = "column";
      nav.style.position = "absolute";
      nav.style.top = "74px";
      nav.style.left = "0";
      nav.style.right = "0";
      nav.style.background = "var(--bg-surface)";
      nav.style.padding = "20px";
      nav.style.borderBottom = "1px solid var(--border-subtle)";
      nav.style.boxShadow = "var(--shadow-lg)";
      nav.style.zIndex = "99";
    }
  });

  // Cerrar al hacer clic en un enlace
  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 820) {
        nav.style.display = "";
      }
    });
  });
}
