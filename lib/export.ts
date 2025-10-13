import { type BrandBrief } from "./schemas"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

// Función para enviar a Google Sheets (simulada)
export async function sendToGoogleSheets(data: BrandBrief): Promise<boolean> {
  try {
    // Simular envío a Google Sheets
    console.log("Sending data to Google Sheets:", data)
    
    // Aquí se implementaría la integración real con Google Sheets API
    // const response = await fetch('/api/google-sheets', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // })
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return true
  } catch (error) {
    console.error("Error sending to Google Sheets:", error)
    throw error
  }
}

// Función para exportar a JSON (mantenida para uso interno)
export function exportToJSON(data: BrandBrief, filename?: string): void {
  try {
    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement("a")
    link.href = url
    link.download = filename || `saint-brand-brief-${data.id || Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    console.log("JSON exported successfully")
  } catch (error) {
    console.error("Error exporting JSON:", error)
    throw error
  }
}

// Función para exportar a PDF
export async function exportToPDF(
  data: BrandBrief, 
  elementId: string = "brand-brief-content",
  filename?: string
): Promise<void> {
  try {
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error("Element not found for PDF export")
    }
    
    // Crear canvas del elemento
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff"
    })
    
    // Crear PDF
    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF("p", "mm", "a4")
    
    const imgWidth = 210 // A4 width in mm
    const pageHeight = 295 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    
    let position = 0
    
    // Agregar primera página
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
    
    // Agregar páginas adicionales si es necesario
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }
    
    // Descargar PDF
    pdf.save(filename || `saint-brand-brief-${data.id || Date.now()}.pdf`)
    
    console.log("PDF exported successfully")
  } catch (error) {
    console.error("Error exporting PDF:", error)
    throw error
  }
}

// Función para generar texto del Scope Draft
export function generateScopeDraft(data: BrandBrief, language: "es" | "en" = "es"): string {
  const t = language === "es" ? {
    title: "DRAFT DE ALCANCE - BRAND BRIEF MÉDICO",
    client: "Cliente",
    specialty: "Especialidad",
    objectives: "Objetivos",
    services: "Servicios a Promover",
    channels: "Canales Prioritarios",
    budget: "Presupuesto Mensual",
    timeline: "Timeline",
    deliverables: "Entregables",
    assumptions: "Supuestos",
    exclusions: "Exclusiones",
    medicalReview: "Revisión Médica",
    compliance: "Cumplimiento",
    contact: "Contacto"
  } : {
    title: "SCOPE DRAFT - MEDICAL BRAND BRIEF",
    client: "Client",
    specialty: "Specialty",
    objectives: "Objectives",
    services: "Services to Promote",
    channels: "Priority Channels",
    budget: "Monthly Budget",
    timeline: "Timeline",
    deliverables: "Deliverables",
    assumptions: "Assumptions",
    exclusions: "Exclusions",
    medicalReview: "Medical Review",
    compliance: "Compliance",
    contact: "Contact"
  }
  
  const scopeDraft = `
${t.title}
=====================================

${t.client}: ${data.step1.fullName}
${t.specialty}: ${data.step1.specialty}
${t.objectives}: ${data.step2.perception?.join(", ") || "No especificado"}
${t.services}: ${data.step3.favoriteProcedures?.join(", ") || "No especificado"}
${t.channels}: ${data.step5.keyTechnologies?.join(", ") || "No especificado"}
${t.budget}: ${data.step6.monthlyNewConsultations || "No especificado"}

${t.deliverables}:
- Estrategia de marca médica
- Plan de contenido educativo
- Campañas publicitarias segmentadas
- Optimización de conversión
- Reportes de rendimiento

${t.assumptions}:
- Cliente proporcionará contenido médico aprobado
- Acceso a métricas de la clínica
- Colaboración del equipo médico para revisión
- Presupuesto aprobado según rango especificado

${t.exclusions}:
- Desarrollo de sitio web (si no existe)
- Fotografía profesional (salvo especificado)
- Producción de video (salvo especificado)
- Gestión de redes sociales (solo estrategia)


${t.contact}:
Marketing: ${data.step6.inspiringAccounts?.join(", ") || "No especificado"}
Administración: ${data.step6.mainObjective || "No especificado"}
Compliance: ${data.step6.monthlyNewConsultations || "No especificado"}

---
Generado el: ${new Date().toLocaleDateString()}
ID Brief: ${data.id || "No especificado"}
  `.trim()
  
  return scopeDraft
}

// Función para exportar Scope Draft como texto
export function exportScopeDraft(data: BrandBrief, language: "es" | "en" = "es"): void {
  try {
    const scopeText = generateScopeDraft(data, language)
    const blob = new Blob([scopeText], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement("a")
    link.href = url
    link.download = `scope-draft-${data.step1.fullName?.replace(/\s+/g, "-") || "brief"}-${Date.now()}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    console.log("Scope draft exported successfully")
  } catch (error) {
    console.error("Error exporting scope draft:", error)
    throw error
  }
}

// Función para crear enlace de vista compartible
export function createViewLink(data: BrandBrief): string {
  try {
    // Serializar datos para URL
    const serializedData = btoa(JSON.stringify(data))
    const baseUrl = window.location.origin
    return `${baseUrl}/brand-brief/view?data=${encodeURIComponent(serializedData)}`
  } catch (error) {
    console.error("Error creating view link:", error)
    throw error
  }
}

// Función para copiar enlace al portapapeles
export async function copyViewLinkToClipboard(data: BrandBrief): Promise<boolean> {
  try {
    const viewLink = createViewLink(data)
    await navigator.clipboard.writeText(viewLink)
    console.log("View link copied to clipboard")
    return true
  } catch (error) {
    console.error("Error copying view link:", error)
    return false
  }
}

// Función para formatear datos para vista previa
export function formatDataForPreview(data: BrandBrief, language: "es" | "en" = "es"): Record<string, any> {
  return {
    id: data.id,
    timestamp: data.timestamp,
    status: data.status,
    step1: {
      fullName: data.step1.fullName,
      preferredName: data.step1.preferredName,
      specialty: data.step1.specialty,
      cities: data.step1.cities,
      yearsExperience: data.step1.yearsExperience,
      // Campos adicionales no disponibles en el nuevo esquema
      // subSpecialties: data.step1.subSpecialties,
      // certifications: data.step1.certifications,
      // website: data.step1.currentChannels?.website,
      // doctoralia: data.step1.currentChannels?.doctoralia,
      // googleBusiness: data.step1.currentChannels?.googleBusiness,
      // socialMedia: data.step1.currentChannels?.socialMedia
    },
    step2: {
      perception: data.step2.perception,
      whatNotAre: data.step2.whatNotAre,
      philosophy: data.step2.philosophy
      // Campos adicionales no disponibles en el nuevo esquema
      // monthlyAppointments: data.step2.kpis?.monthlyAppointments,
      // monthlyBudget: data.step2.monthlyBudget,
      // servicePriority: data.step2.servicePriority
    },
    step3: {
      favoriteProcedures: data.step3.favoriteProcedures,
      highValueServices: data.step3.highValueServices,
      accessibleServices: data.step3.accessibleServices
      // Campos adicionales no disponibles en el nuevo esquema
      // ageRange: data.step3.segments?.ageRange,
      // gender: data.step3.segments?.gender,
      // socioeconomicLevel: data.step3.segments?.socioeconomicLevel,
      // insuranceType: data.step3.segments?.insuranceType,
      // painPoints: data.step3.painPoints,
      // motivations: data.step3.motivations,
      // competitiveAdvantage: data.step3.competitiveAdvantage,
      // competitors: data.step3.competitors,
      // keywords: data.step3.keywords
    },
    step4: {
      averageAge: data.step4.averageAge,
      predominantGender: data.step4.predominantGender,
      commonFears: data.step4.commonFears
      // Campos adicionales no disponibles en el nuevo esquema
      // services: data.step4.services,
      // leadFlow: data.step4.leadFlow
    },
    step5: {
      whatMakesDifferent: data.step5.whatMakesDifferent,
      keyTechnologies: data.step5.keyTechnologies
      // Campos adicionales no disponibles en el nuevo esquema
      // contentTypes: data.step5.contentTypes,
      // productionCapability: data.step5.productionCapability,
      // recordingPermissions: data.step5.recordingPermissions,
      // toneOfVoice: data.step5.toneOfVoice,
      // contentPillars: data.step5.contentPillars,
      // priorityChannels: data.step5.priorityChannels,
      // contentFrequency: data.step5.contentFrequency,
      // editorialFlow: data.step5.editorialFlow
    },
    step6: {
      mainObjective: data.step6.mainObjective,
      monthlyNewConsultations: data.step6.monthlyNewConsultations,
      inspiringAccounts: data.step6.inspiringAccounts
      // Campos adicionales no disponibles en el nuevo esquema
      // schedules: data.step6.schedules,
      // agendaOperations: data.step6.agendaOperations,
      // clinicalMetrics: data.step6.clinicalMetrics,
      // access: data.step6.access,
      // keyContacts: data.step6.keyContacts
    }
  }
}
