# Muninteligente 🏛️

**Tablero de Control de Inversiones y Destrabe de Obras para Alcaldes y Gobiernos Locales en el Perú.**

Plataforma GovTech desarrollada en colaboración con **Whayno Consultores (Cusco, Perú)** para el seguimiento de la ejecución presupuestal, alertas tempranas de obras en riesgo (*Semáforo Rojo, Ámbar y Verde*) y emisión asistida de órdenes de destrabe administrativas.

---

## 🚀 Características

- **Diseño Web Moderno y Responsivo:** Estética institucional de alto impacto con soporte nativo para **Modo Claro** y **Modo Oscuro** (Theme Switcher persistente).
- **Tablero Interactivo en el Hero:** Filtro dinámico de obras críticas, cálculo de días paralizados y simulador de emisión de *Orden de Destrabe / Decreto Administrativo*.
- **Simulador de Presupuesto e Impacto:** Estimación en tiempo real del presupuesto expuesto a trabas y días de paralización evitables.
- **Formulario de Registro con Google Sheets:** Captura directa de leads y prospectos municipales guardados en tiempo real en una hoja de cálculo sin costos adicionales vía Google Apps Script.
- **Acceso Rápido a Demo:** Enlace directo al tablero interactivo desplegado.

---

## 📁 Estructura del Proyecto

```
├── index.html                    # Página principal y estructura semántica SEO
├── styles.css                    # Sistema de diseño, variables CSS y microanimaciones
├── app.js                        # Lógica de interactividad y envío a Google Sheets
├── INSTRUCCIONES_GOOGLE_SHEETS.md# Guía paso a paso para configurar Google Sheets Web App
└── README.md                     # Documentación del repositorio
```

---

## ⚙️ Conexión con Google Sheets

Para vincular el formulario con tu propia hoja de cálculo:
1. Sigue los 4 pasos detallados en [INSTRUCCIONES_GOOGLE_SHEETS.md](./INSTRUCCIONES_GOOGLE_SHEETS.md).
2. Pega tu URL de Google Apps Script en la variable `GOOGLE_SHEETS_SCRIPT_URL` dentro de `app.js`.

---

© 2026 Muninteligente · Whayno Consultores.
