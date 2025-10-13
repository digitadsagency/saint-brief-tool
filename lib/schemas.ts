import { z } from "zod"

// Paso 1 - Datos básicos
export const basicInfoSchema = z.object({
  fullName: z.string().min(1, "El nombre completo es requerido"),
  preferredName: z.string().min(1, "El nombre preferido es requerido"),
  specialty: z.string().min(1, "La especialidad es requerida"),
  cities: z.array(z.string()).min(1, "Debes especificar al menos una ciudad"),
  yearsExperience: z.number().min(1, "Los años de experiencia son requeridos")
})

// Paso 2 - Identidad y estilo
export const identityStyleSchema = z.object({
  perception: z.array(z.enum([
    "cercano_humano",
    "elegante_aspiracional", 
    "innovador_tecnologico",
    "profesional_tecnico",
    "casual_directo"
  ])).min(3, "Debes elegir exactamente 3 opciones").max(3, "Debes elegir exactamente 3 opciones"),
  whatNotAre: z.string().min(1, "Esta respuesta es requerida"),
  philosophy: z.string().min(1, "Tu filosofía como médico es requerida")
})

// Paso 3 - Procedimientos y negocio
export const proceduresBusinessSchema = z.object({
  favoriteProcedures: z.array(z.string()).min(2, "Debes especificar al menos 2 procedimientos favoritos").max(3, "Máximo 3 procedimientos favoritos"),
  highValueServices: z.array(z.string()).min(1, "Debes especificar al menos un servicio de alto valor"),
  accessibleServices: z.array(z.string()).min(1, "Debes especificar al menos un servicio accesible")
})

// Paso 4 - Paciente ideal
export const idealPatientSchema = z.object({
  averageAge: z.string().min(1, "La edad promedio es requerida"),
  predominantGender: z.enum(["mujer", "hombre", "ambos"]),
  commonFears: z.array(z.string()).min(1, "Debes especificar al menos un miedo común").max(3, "Máximo 3 miedos comunes")
})

// Paso 5 - Diferenciadores
export const differentiatorsSchema = z.object({
  whatMakesDifferent: z.string().min(1, "Esta respuesta es requerida"),
  keyTechnologies: z.array(z.string()).min(1, "Debes especificar al menos una tecnología o certificación")
})

// Paso 6 - Metas de marketing
export const marketingGoalsSchema = z.object({
  mainObjective: z.array(z.enum([
    "mas_consultas",
    "mejor_reputacion",
    "nuevos_servicios",
    "expansión_geografica",
    "liderazgo_opinion"
  ])).min(1, "Debes seleccionar al menos un objetivo"),
  monthlyNewConsultations: z.number().min(1, "El número de consultas mensuales es requerido"),
  inspiringAccounts: z.array(z.string()).min(1, "Debes especificar al menos una cuenta que te inspire")
})

// Paso 7 - Storytelling & Creative Vault
export const storytellingSchema = z.object({
  whySpecialty: z.string().min(1, "Esta historia es requerida"),
  markedCase: z.string().min(1, "Este caso es requerido"),
  commonPhrase: z.string().min(1, "Esta frase es requerida"),
  fiveYearVision: z.string().min(1, "Tu visión a 5 años es requerida"),
  mythToDebunk: z.string().min(1, "El mito a derribar es requerido"),
  frequentQuestions: z.array(z.string()).min(1, "Debes especificar al menos una pregunta frecuente"),
  curiosityTopic: z.string().min(1, "El tema que genera más curiosidad es requerido")
})

// Paso 8 - Historial de anuncios
export const adHistorySchema = z.object({
  hasDoneAds: z.boolean(),
  platforms: z.array(z.string()).optional(),
  investmentAmount: z.string().optional(),
  results: z.string().optional(),
  bestFormats: z.array(z.string()).optional(),
  whatDidntWork: z.string().optional()
})

// Esquema maestro
export const brandBriefSchema = z.object({
  id: z.string().uuid().optional(),
  timestamp: z.date().default(() => new Date()),
  step1: basicInfoSchema,
  step2: identityStyleSchema,
  step3: proceduresBusinessSchema,
  step4: idealPatientSchema,
  step5: differentiatorsSchema,
  step6: marketingGoalsSchema,
  step7: storytellingSchema,
  step8: adHistorySchema,
  status: z.enum(["draft", "completed"]).default("draft")
})

export type BrandBrief = z.infer<typeof brandBriefSchema>
export type BasicInfo = z.infer<typeof basicInfoSchema>
export type IdentityStyle = z.infer<typeof identityStyleSchema>
export type ProceduresBusiness = z.infer<typeof proceduresBusinessSchema>
export type IdealPatient = z.infer<typeof idealPatientSchema>
export type Differentiators = z.infer<typeof differentiatorsSchema>
export type MarketingGoals = z.infer<typeof marketingGoalsSchema>
export type Storytelling = z.infer<typeof storytellingSchema>
export type AdHistory = z.infer<typeof adHistorySchema>

// Esquemas para validación por paso
export const stepSchemas = {
  1: basicInfoSchema,
  2: identityStyleSchema,
  3: proceduresBusinessSchema,
  4: idealPatientSchema,
  5: differentiatorsSchema,
  6: marketingGoalsSchema,
  7: storytellingSchema,
  8: adHistorySchema
} as const

// Datos de ejemplo para plantilla
export const templateData: Partial<BrandBrief> = {
  step1: {
    fullName: "Dr. María González",
    preferredName: "Dra. María",
    specialty: "Dermatología",
    cities: ["Ciudad de México", "Guadalajara"],
    yearsExperience: 8
  },
  step2: {
    perception: ["cercano_humano", "profesional_tecnico", "innovador_tecnologico"],
    whatNotAre: "No soy de dar resultados exagerados ni de prometer milagros",
    philosophy: "La belleza natural se potencia con la ciencia y el cuidado personalizado"
  },
  step3: {
    favoriteProcedures: ["Limpieza facial profunda", "Tratamiento anti-edad", "Dermatoscopía digital"],
    highValueServices: ["Láser fraccionado", "Botox", "Rellenos de ácido hialurónico"],
    accessibleServices: ["Consulta dermatológica", "Limpieza facial", "Tratamiento de acné"]
  },
  step4: {
    averageAge: "25-45",
    predominantGender: "mujer",
    commonFears: ["Dolor durante el procedimiento", "Resultados no naturales", "Efectos secundarios"]
  },
  step5: {
    whatMakesDifferent: "Uso de tecnología de vanguardia combinada con un enfoque personalizado y humano",
    keyTechnologies: ["Dermatoscopía digital", "Láser fraccionado", "Certificación en medicina estética"]
  },
  step6: {
    mainObjective: ["mas_consultas", "mejor_reputacion"],
    monthlyNewConsultations: 50,
    inspiringAccounts: ["@dermatologa_moderna", "@dr_skincare", "@medicina_estetica_mx"]
  },
  step7: {
    whySpecialty: "Elegí dermatología porque me apasiona ayudar a las personas a sentirse cómodas en su propia piel",
    markedCase: "Una paciente de 35 años que recuperó su confianza después de un tratamiento de acné severo",
    commonPhrase: "La piel es el reflejo de tu salud interior",
    fiveYearVision: "Ser referente en dermatología estética en México y tener mi propia clínica",
    mythToDebunk: "Que todos los tratamientos estéticos son peligrosos o antinaturales",
    frequentQuestions: ["¿Duele el procedimiento?", "¿Cuánto tiempo duran los resultados?", "¿Hay efectos secundarios?"],
    curiosityTopic: "Los tratamientos de rejuvenecimiento facial sin cirugía"
  },
  step8: {
    hasDoneAds: true,
    platforms: ["Meta Ads", "Google Ads"],
    investmentAmount: "15,000 MXN mensuales",
    results: "Generaba 20-25 consultas nuevas por mes",
    bestFormats: ["Videos", "Reels", "Carruseles"],
    whatDidntWork: "Anuncios muy técnicos sin storytelling personal"
  }
}