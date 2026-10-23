import { BRIEF_CONFIG } from "./types"
import type { PackageBrief } from "./schemas"

const join = (value?: string[] | string) => {
  if (Array.isArray(value)) return value.filter(Boolean).join(", ")
  return value || ""
}

export function isPackageBrief(data: unknown): data is PackageBrief {
  return Boolean(data && typeof data === "object" && "briefType" in data && "basic" in data)
}

export function briefTypeLabel(brief: PackageBrief) {
  return BRIEF_CONFIG[brief.briefType]?.name || brief.briefType
}

export function flattenPackageBrief(brief: PackageBrief): Record<string, string> {
  const basic = brief.basic || ({} as PackageBrief["basic"])
  const ads = brief.ads
  const core = brief.core
  const premium = brief.premium

  return {
    "Tipo de Brief": briefTypeLabel(brief),
    "Nombre completo": basic.fullName || "",
    "Nombre profesional": basic.preferredName || "",
    Especialidad: basic.specialty || "",
    Ciudades: join(basic.cities),
    "Años de experiencia": basic.yearsExperience || "",
    "Ads procedimiento 1": ads?.procedure1 || "",
    "Ads procedimiento 2": ads?.procedure2 || "",
    "Ads servicio principal": ads?.mainService || "",
    "Ads por qué crecer": join(ads?.whyGrow),
    "Ads por qué otro": ads?.whyGrowOther || "",
    "Ads casos actuales": ads?.currentCases || "",
    "Ads capacidad extra": ads?.additionalCapacity || "",
    "Ads evidencia": join(ads?.evidence),
    "Ads por qué elegirte": ads?.whyChooseYou || "",
    "Ads técnica particular": ads?.hasTechnique || "",
    "Ads detalle técnica": ads?.techniqueDetail || "",
    "Ads precio": ads?.price || "",
    "Ads consulta con costo": ads?.consultationHasCost || "",
    "Ads precio consulta": ads?.consultationPrice || "",
    "Ads quién responde": ads?.whoResponds || "",
    "Ads tiempo respuesta": ads?.responseTime || "",
    "Ads cómo agendan": join(ads?.howSchedule),
    "Ads seguimiento": ads?.followUp || "",
    "Ads ha hecho ads": ads?.hasPaidAds || "",
    "Ads servicio anunciado": ads?.previousService || "",
    "Ads inversión previa": ads?.previousInvestment || "",
    "Ads resultados previos": ads?.previousResults || "",
    "Ads notas campaña": ads?.campaignNotes || "",
    "Ads material": join(ads?.availableAssets),
    Instagram: ads?.instagram || "",
    Website: ads?.website || "",
    Facebook: ads?.facebook || "",
    "Core crecimiento 1": core?.growth1 || "",
    "Core crecimiento 2": core?.growth2 || "",
    "Core crecimiento 3": core?.growth3 || "",
    "Core #1": core?.numberOne || "",
    "Core por qué crecer": join(core?.whyGrow),
    "Core por qué otro": core?.whyGrowOther || "",
    "Core casos #1": core?.cases1 || "",
    "Core casos #2": core?.cases2 || "",
    "Core casos #3": core?.cases3 || "",
    "Core capacidad extra": core?.additionalCapacity || "",
    "Core diferenciadores": join(core?.differentiators),
    "Core explicación": core?.strongestExplain || "",
    "Core algo diferente": core?.somethingDifferent || "",
    "Core proof": join(core?.proof),
    "Core casos documentados": core?.documentedCases || "",
    "Core edad paciente": core?.patientAge || "",
    "Core género": core?.patientGender || "",
    "Core origen": core?.patientOrigin || "",
    "Core objeción 1": core?.objection1 || "",
    "Core objeción 2": core?.objection2 || "",
    "Core objeción 3": core?.objection3 || "",
    "Core precio": core?.price || "",
    "Core pacientes nuevos/mes": core?.newPatientsMonth || "",
    "Core quién responde": core?.whoResponds || "",
    "Core quién responde otro": core?.whoRespondsOther || "",
    "Core tiempo respuesta": core?.responseTime || "",
    "Core gestión": join(core?.howManage),
    "Core ha hecho ads": core?.hasPaidAds || "",
    "Core ads dónde": join(core?.adsWhere),
    "Core ads inversión": core?.adsInvestment || "",
    "Core ads servicio": core?.adsService || "",
    "Core ads funcionó": core?.adsWorked || "",
    "Core ads no funcionó": core?.adsDidntWork || "",
    "Core percepción": join(core?.brandPerception),
    "Core percepción otra": core?.brandOther || "",
    "Core cuentas inspiradoras": join(core?.inspiringAccounts),
    "Premium metas": join(premium?.goals),
    "Premium metas otro": premium?.goalsOther || "",
    "Premium meta numérica": premium?.reasonableGoal || "",
    "Premium consultas actuales": premium?.consultasActual || "",
    "Premium consultas máx": premium?.consultasMax || "",
    "Premium limitantes": join(premium?.limitations),
    "Premium limitante otra": premium?.limitationOther || "",
    "Premium funnel": join(premium?.funnelSteps),
    "Premium funnel otro": premium?.funnelOther || "",
    "Premium equipo": premium?.team || "",
    "Premium herramientas": join(premium?.tools),
    "Premium CRM": premium?.crmName || "",
    "Premium info obligatoria": premium?.requiredInfo || "",
    "Premium no agendar": premium?.noScheduleCriteria || "",
    "Premium precio valoración": premium?.valuationPrice || "",
    "Premium duración valoración": premium?.valuationDuration || "",
    "Premium modalidad": premium?.valuationMode || "",
    "Premium paga antes": premium?.paidBefore || "",
    "Premium anticipación": premium?.anticipation || "",
    "Premium horarios": premium?.availableHours || "",
    "Premium no-show": join(premium?.noShowProcess),
    "Premium no-show otro": premium?.noShowOther || "",
    "Premium no-show detalle": premium?.noShowDescription || "",
    "Premium materiales": premium?.existingMaterials || "",
    "Premium reglas": premium?.rules || "",
  }
}

export function packageBriefRows(brief: PackageBrief): string[] {
  return Object.values(flattenPackageBrief(brief))
}

export function packageBriefHeaders(): string[] {
  return Object.keys(flattenPackageBrief({
    briefType: "premium",
    status: "draft",
    basic: {
      fullName: "",
      preferredName: "",
      specialty: "",
      cities: [],
      yearsExperience: "",
    },
  }))
}

function fieldHtml(label: string, value: string) {
  if (!value) return ""
  return `<div class="field"><strong>${label}:</strong> ${value}</div>`
}

export function createPackageEmailHTML(brief: PackageBrief) {
  const rows = flattenPackageBrief(brief)
  const timestamp = new Date().toLocaleString("es-ES")
  const fields = Object.entries(rows)
    .map(([label, value]) => fieldHtml(label, value))
    .join("")

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${briefTypeLabel(brief)}</title>
      <style>
        body { font-family: Helvetica, Arial, sans-serif; color: #2c3e50; background: #fff; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #CADCFF 0%, #C1FFDD 100%); padding: 30px; text-align: center; }
        .section { margin-top: 24px; padding: 20px; border-left: 4px solid #CADCFF; background: #f8f9fa; }
        .field { margin-bottom: 12px; padding: 10px; background: #fff; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${briefTypeLabel(brief)}</h1>
          <p>${timestamp}</p>
        </div>
        <div class="section">
          ${fields}
        </div>
      </div>
    </body>
    </html>
  `
}

export function createPackageEmailText(brief: PackageBrief) {
  const rows = flattenPackageBrief(brief)
  const timestamp = new Date().toLocaleString("es-ES")
  const lines = Object.entries(rows)
    .filter(([, value]) => value)
    .map(([label, value]) => `- ${label}: ${value}`)
    .join("\n")

  return `${briefTypeLabel(brief)}\nFecha: ${timestamp}\n\n${lines}\n`
}
