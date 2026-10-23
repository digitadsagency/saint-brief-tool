export type BriefType = "ads" | "estandar" | "premium"

export const BRIEF_CONFIG: Record<
  BriefType,
  {
    slug: BriefType
    name: string
    shortName: string
    description: string
    time: string
    steps: string[]
  }
> = {
  ads: {
    slug: "ads",
    name: "Brief Ads",
    shortName: "Ads",
    description: "Estrategia inicial de adquisición. Qué quieres impulsar, qué evidencia tienes y cómo atiendes a nuevos pacientes.",
    time: "7–10 min",
    steps: [
      "Datos básicos",
      "Qué impulsar",
      "Evidencia",
      "Economics",
      "Conversión",
      "Ads y material",
    ],
  },
  estandar: {
    slug: "estandar",
    name: "Brief Estándar",
    shortName: "Estándar",
    description: "Saint Core. Para entender tu práctica, qué vale la pena hacer crecer y por qué un paciente debería elegirte.",
    time: "12–18 min",
    steps: [
      "Datos básicos",
      "Qué crecer",
      "Por qué elegirte",
      "Proof",
      "Paciente",
      "Operación",
      "Marketing",
      "Marca",
    ],
  },
  premium: {
    slug: "premium",
    name: "Brief Premium",
    shortName: "Premium",
    description: "Saint Core más el módulo de crecimiento y conversión: funnel, seguimiento, capacidad y sistemas.",
    time: "20–30 min",
    steps: [
      "Datos básicos",
      "Qué crecer",
      "Por qué elegirte",
      "Proof",
      "Paciente",
      "Operación",
      "Marketing",
      "Marca",
      "Objetivo",
      "Funnel",
      "Sistemas",
    ],
  },
}

export const ADS_WHY_GROW = [
  "Tengo buenos resultados/casos",
  "Tengo mucha experiencia realizándolo",
  "Me gusta realizarlo",
  "Es rentable para mi práctica",
  "Actualmente existe demanda",
  "Tengo una técnica o ventaja particular",
  "Quiero posicionarme como referente",
  "Actualmente tengo capacidad disponible",
  "Otro",
]

export const CORE_WHY_GROW = [
  "Me gusta realizarlo",
  "Tengo buenos resultados/casos",
  "Es rentable",
  "Existe mucha demanda",
  "Quiero posicionarme como referente",
  "Tengo una técnica/ventaja particular",
  "Quiero realizar más casos para desarrollar experiencia",
  "Otro",
]

export const ADS_CASE_RANGES = ["0", "1–2", "3–5", "6–10", "11–20", "20+"]
export const ADS_EXTRA_RANGES = ["0", "1–2", "3–5", "6–10", "10+"]

export const ADS_EVIDENCE = [
  "Antes/después",
  "Fotografías de casos",
  "Testimonios",
  "Reseñas",
  "Videos de casos/procedimientos",
  "Muchos casos realizados aunque no estén documentados",
  "Credenciales/subespecialidad relevante",
  "Tecnología/técnica particular",
  "Ninguna todavía",
]

export const ADS_WHO_RESPONDS = [
  "Asistente",
  "Recepción",
  "Yo personalmente",
  "Equipo/call center",
  "Nadie consistentemente",
]

export const RESPONSE_TIMES = [
  "<5 min",
  "5–30 min",
  "30 min–2h",
  "2–6h",
  "Más de 6h",
  "No sé",
]

export const ADS_SCHEDULE = [
  "WhatsApp",
  "Llamada",
  "Calendario online",
  "CRM/software",
  "Otro",
]

export const ADS_FOLLOW_UP = [
  "Tenemos seguimiento definido",
  "Le escribimos algunas veces, sin proceso fijo",
  "Normalmente no damos seguimiento",
  "No sé",
]

export const ADS_ASSETS = [
  "Fotos profesionales",
  "Videos profesionales",
  "Reels/videos de redes",
  "Antes/después",
  "Testimonios",
  "Fotografías de procedimientos",
  "Material de clínica/equipo",
  "Prácticamente nada",
]

export const CORE_DIFFERENTIATORS = [
  "Tengo muchos casos realizados del procedimiento que quiero impulsar",
  "Tengo casos de antes/después particularmente buenos",
  "Tengo más experiencia que muchos médicos de mi mercado",
  "Tengo una subespecialidad directamente relacionada",
  "Utilizo una técnica diferente",
  "Utilizo tecnología/equipo que cambia significativamente la experiencia o resultado",
  "Tengo un proceso de recuperación diferente",
  "Tengo tiempos de recuperación particularmente buenos",
  "Tengo testimonios fuertes",
  "Tengo publicaciones/investigación/credenciales relevantes",
  "Tengo reconocimiento/reputación importante en mi ciudad",
  "Atiendo un nicho de pacientes muy específico",
  "Tengo una oferta/paquete particularmente competitivo",
  "Ninguna de las anteriores / todavía estamos construyendo esto",
]

export const CORE_PROOF = [
  "Antes/después",
  "Fotografías clínicas",
  "Testimonios escritos",
  "Testimonios en video",
  "Reseñas Google",
  "Videos de procedimientos",
  "Quirófano",
  "Casos complejos/interesantes",
  "Resultados cuantificables",
  "Publicaciones/congresos/certificaciones",
  "Ninguno todavía",
]

export const CORE_DOCUMENTED_CASES = ["0", "1–5", "6–15", "16–30", "30+"]

export const CORE_WHO_RESPONDS = [
  "Yo",
  "Asistente",
  "Recepción",
  "Call center/equipo",
  "Nadie de manera consistente",
  "Otro",
]

export const CORE_RESPONSE_TIMES = [
  "<5 minutos",
  "5–30 minutos",
  "30 min–2 horas",
  "2–6 horas",
  "Más de 6 horas",
  "No sé",
]

export const CORE_MANAGE = [
  "WhatsApp",
  "Instagram",
  "Agenda manual",
  "CRM",
  "Software médico",
  "Excel/Sheets",
  "Otro",
]

export const CORE_AD_PLATFORMS = ["Meta", "Google", "TikTok", "Otro"]

export const CORE_BRAND = [
  "Cercana/humana",
  "Científica/académica",
  "Premium/sofisticada",
  "Moderna/innovadora",
  "Autoridad/experta",
  "Tranquila/confiable",
  "Directa/práctica",
  "Aspiracional",
  "Educativa",
  "Otra",
]

export const PREMIUM_GOALS = [
  "Más consultas",
  "Más procedimientos/cirugías",
  "Mejor calidad de pacientes",
  "Mejor seguimiento de oportunidades",
  "Menos pacientes perdidos",
  "Menos trabajo manual para mi equipo",
  "Mejor medición/control",
  "Crecer un procedimiento específico",
  "Abrir/aumentar capacidad",
  "Otro",
]

export const PREMIUM_LIMITS = [
  "Agenda del médico",
  "Quirófano/hospital",
  "Asistente/recepción",
  "Seguimiento de pacientes",
  "Disponibilidad de citas",
  "Capacidad financiera del paciente",
  "No identifico ninguna",
  "Otra",
]

export const PREMIUM_FUNNEL = [
  "Escribe por WhatsApp",
  "Llama",
  "Llena formulario",
  "Lo contacta asistente",
  "Se precalifica",
  "Se le informa precio",
  "Se agenda valoración",
  "Paga valoración",
  "Recibe recordatorio",
  "Asiste",
  "Recibe seguimiento posterior",
  "Otro",
]

export const PREMIUM_TOOLS = [
  "WhatsApp",
  "WhatsApp Business",
  "Google Calendar",
  "Calendly",
  "CRM",
  "Software médico",
  "Excel/Sheets",
  "Formularios",
  "Agenda física/manual",
  "Otro",
]

export const PREMIUM_NOSHOW = [
  "Nada actualmente",
  "Seguimiento manual",
  "Recordatorios automáticos",
  "Se vuelve a contactar posteriormente",
  "Otro",
]
