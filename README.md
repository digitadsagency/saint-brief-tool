# SAINT Brand Brief - Herramienta de Brief Médico

Una Single Page Application (SPA) interactiva para crear briefs de marca profesionales en el sector salud, desarrollada con Next.js 14, TypeScript, Tailwind CSS y shadcn/ui.

## 🚀 Características

- **Wizard Multi-pasos**: 7 pasos + resumen con validación en tiempo real
- **Autosave**: Guardado automático cada 1.5 segundos en localStorage
- **Vista Previa**: Panel lateral con resumen en tiempo real
- **Exportación**: JSON, PDF y Scope Draft
- **Integración Google Sheets**: Guardado automático en hoja de cálculo
- **Internacionalización**: Soporte ES/EN con toggle
- **Animaciones**: Transiciones suaves con Framer Motion
- **Responsive**: Diseño adaptativo para móvil y desktop
- **Validación**: Esquemas Zod para validación robusta

## 🛠️ Stack Tecnológico

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** (Componentes)
- **Framer Motion** (Animaciones)
- **React Hook Form** + **Zod** (Formularios y validación)
- **Lucide React** (Iconos)
- **Google Sheets API** (Integración)
- **html2canvas** + **jsPDF** (Exportación PDF)

## 📋 Pasos del Wizard

1. **Información de la clínica/doctor**
   - Tipo de cliente, nombre comercial, ubicación
   - Especialidad principal y sub-especialidades
   - Información profesional y certificaciones
   - Canales actuales (web, redes sociales, etc.)

2. **Objetivos y KPIs**
   - Objetivos de marketing (citas, posicionamiento, etc.)
   - Métricas numéricas (CAC, CTR, conversión)
   - Horizonte temporal y presupuesto
   - Priorización de servicios

3. **Público objetivo & ventaja competitiva**
   - Segmentación demográfica y geográfica
   - Dolores y motivaciones del paciente
   - Ventajas competitivas
   - Análisis de competencia

4. **Legal, cumplimiento y riesgos**
   - Jurisdicción y marco regulatorio
   - Cumplimiento (HIPAA, COFEPRIS, GDPR)
   - Material sensible y descargos
   - Revisión médica y restricciones

5. **Oferta, servicios y funnel**
   - Servicios a promover
   - Estacionalidad y calendario
   - Flujo de leads e integraciones
   - Criterios de calificación

6. **Marca y contenidos**
   - Identidad visual y tono de voz
   - Pilares de contenido
   - Lineamientos de imagen
   - Canales prioritarios

7. **Operación, agenda y métricas**
   - Horarios y protocolos
   - Operativa de agenda
   - Métricas clínicas
   - Contactos clave

8. **Resumen & Exportación**
   - Vista consolidada
   - Exportación JSON/PDF
   - Generación de Scope Draft
   - Enlace de vista compartible

## 🚀 Instalación y Configuración

### 1. Instalar dependencias

```bash
pnpm install
# o
npm install
# o
yarn install
```

### 2. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Google Sheets Integration
NEXT_PUBLIC_SHEET_ID=tu_google_sheet_id_aqui
ENABLE_SHEETS=true

# App Configuration
NEXT_PUBLIC_APP_NAME=SAINT Brand Brief
```

### 3. Configurar Google Sheets (Opcional)

Para habilitar la integración con Google Sheets:

1. Crea un proyecto en [Google Cloud Console](https://console.cloud.google.com/)
2. Habilita la Google Sheets API
3. Crea un Service Account y descarga las credenciales
4. Renombra el archivo a `credentials.json` y colócalo en `/lib/`
5. Comparte tu Google Sheet con el email del Service Account
6. Actualiza las credenciales en `/lib/googleSheets.ts`

### 4. Ejecutar en desarrollo

```bash
pnpm dev
# o
npm run dev
# o
yarn dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
SAINT BRIEF/
├── app/
│   ├── brand-brief/
│   │   ├── page.tsx          # Página principal del wizard
│   │   └── view/
│   │       └── page.tsx      # Vista de solo lectura
│   ├── globals.css           # Estilos globales
│   ├── layout.tsx            # Layout principal
│   └── page.tsx              # Página de inicio
├── components/
│   ├── brief/
│   │   ├── Stepper.tsx       # Componente de pasos
│   │   ├── PreviewPane.tsx   # Panel de vista previa
│   │   ├── FormStep1.tsx     # Formulario paso 1
│   │   ├── FormStep2.tsx     # Formulario paso 2
│   │   └── ExportButtons.tsx # Botones de exportación
│   └── ui/                   # Componentes shadcn/ui
├── lib/
│   ├── schemas.ts            # Esquemas Zod
│   ├── storage.ts            # Funciones de localStorage
│   ├── i18n.ts               # Internacionalización
│   ├── googleSheets.ts       # Integración Google Sheets
│   ├── export.ts             # Funciones de exportación
│   └── utils.ts              # Utilidades
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 🎯 Uso

### Crear un Brand Brief

1. Ve a `/brand-brief`
2. Completa cada paso del wizard
3. Los datos se guardan automáticamente
4. Usa la vista previa para revisar la información
5. Exporta el brief al finalizar

### Funciones Principales

- **Autosave**: Los datos se guardan automáticamente cada 1.5 segundos
- **Cargar borrador**: Recupera un brief guardado previamente
- **Plantilla**: Inicia con datos de ejemplo
- **Exportar JSON**: Descarga los datos completos
- **Exportar PDF**: Genera un PDF imprimible
- **Scope Draft**: Crea un texto base para propuestas
- **Enlace de vista**: Genera un enlace compartible de solo lectura

### Internacionalización

- Toggle ES/EN en el header
- Cambia automáticamente todos los textos
- Se guarda la preferencia en localStorage

## 🔧 Personalización

### Agregar nuevos pasos

1. Crea el esquema Zod en `lib/schemas.ts`
2. Agrega el componente del formulario en `components/brief/`
3. Actualiza el switch en `app/brand-brief/page.tsx`
4. Agrega las traducciones en `lib/i18n.ts`

### Modificar campos existentes

1. Actualiza el esquema Zod correspondiente
2. Modifica el componente del formulario
3. Actualiza las traducciones si es necesario

### Personalizar estilos

- Modifica `tailwind.config.ts` para colores personalizados
- Actualiza `app/globals.css` para estilos globales
- Los componentes usan las clases de Tailwind CSS

## 📊 Google Sheets Integration

La integración con Google Sheets guarda automáticamente:

- Timestamp
- ID del Brief
- Cliente y especialidad
- Objetivos principales
- KPIs meta
- Público objetivo
- Competidores
- Servicios a promover
- Jurisdicción y cumplimiento
- Responsable de revisión médica
- Tonalidad de marca
- Canales prioritarios
- Presupuesto mensual
- Contactos clave
- Estado del brief
- JSON completo (backup)

## 🚨 Consideraciones de Seguridad

- Las credenciales de Google Sheets son placeholders
- No subas archivos de credenciales reales al repositorio
- Usa variables de entorno para datos sensibles
- La integración con Google Sheets es opcional

## 📝 Licencia

Este proyecto es una herramienta profesional para SAINT Agency.

## 🤝 Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📞 Soporte

Para soporte técnico o preguntas sobre el proyecto, contacta al equipo de SAINT Agency.

---

**SAINT Agency** - Especialistas en Marketing Médico
