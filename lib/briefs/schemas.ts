import { z } from "zod"
import type { BriefType } from "./types"

export const basicInfoSchema = z.object({
  fullName: z.string().default(""),
  preferredName: z.string().default(""),
  specialty: z.string().default(""),
  cities: z.array(z.string()).default([]),
  yearsExperience: z.string().default(""),
})

export const adsAnswersSchema = z.object({
  procedure1: z.string().default(""),
  procedure2: z.string().default(""),
  mainService: z.string().default(""),
  whyGrow: z.array(z.string()).default([]),
  whyGrowOther: z.string().default(""),
  currentCases: z.string().default(""),
  additionalCapacity: z.string().default(""),
  evidence: z.array(z.string()).default([]),
  whyChooseYou: z.string().default(""),
  hasTechnique: z.string().default(""),
  techniqueDetail: z.string().default(""),
  price: z.string().default(""),
  consultationHasCost: z.string().default(""),
  consultationPrice: z.string().default(""),
  whoResponds: z.string().default(""),
  responseTime: z.string().default(""),
  howSchedule: z.array(z.string()).default([]),
  followUp: z.string().default(""),
  hasPaidAds: z.string().default(""),
  previousService: z.string().default(""),
  previousInvestment: z.string().default(""),
  previousResults: z.string().default(""),
  campaignNotes: z.string().default(""),
  availableAssets: z.array(z.string()).default([]),
  instagram: z.string().default(""),
  website: z.string().default(""),
  facebook: z.string().default(""),
})

export const coreAnswersSchema = z.object({
  growth1: z.string().default(""),
  growth2: z.string().default(""),
  growth3: z.string().default(""),
  numberOne: z.string().default(""),
  whyGrow: z.array(z.string()).default([]),
  whyGrowOther: z.string().default(""),
  cases1: z.string().default(""),
  cases2: z.string().default(""),
  cases3: z.string().default(""),
  additionalCapacity: z.string().default(""),
  differentiators: z.array(z.string()).default([]),
  strongestExplain: z.string().default(""),
  somethingDifferent: z.string().default(""),
  proof: z.array(z.string()).default([]),
  documentedCases: z.string().default(""),
  patientAge: z.string().default(""),
  patientGender: z.string().default(""),
  patientOrigin: z.string().default(""),
  objection1: z.string().default(""),
  objection2: z.string().default(""),
  objection3: z.string().default(""),
  price: z.string().default(""),
  newPatientsMonth: z.string().default(""),
  whoResponds: z.string().default(""),
  whoRespondsOther: z.string().default(""),
  responseTime: z.string().default(""),
  howManage: z.array(z.string()).default([]),
  hasPaidAds: z.string().default(""),
  adsWhere: z.array(z.string()).default([]),
  adsInvestment: z.string().default(""),
  adsService: z.string().default(""),
  adsWorked: z.string().default(""),
  adsDidntWork: z.string().default(""),
  brandPerception: z.array(z.string()).default([]),
  brandOther: z.string().default(""),
  inspiringAccounts: z.array(z.string()).default([]),
})

export const premiumAnswersSchema = z.object({
  goals: z.array(z.string()).default([]),
  goalsOther: z.string().default(""),
  reasonableGoal: z.string().default(""),
  consultasActual: z.string().default(""),
  consultasMax: z.string().default(""),
  limitations: z.array(z.string()).default([]),
  limitationOther: z.string().default(""),
  funnelSteps: z.array(z.string()).default([]),
  funnelOther: z.string().default(""),
  team: z.string().default(""),
  tools: z.array(z.string()).default([]),
  crmName: z.string().default(""),
  requiredInfo: z.string().default(""),
  noScheduleCriteria: z.string().default(""),
  valuationPrice: z.string().default(""),
  valuationDuration: z.string().default(""),
  valuationMode: z.string().default(""),
  paidBefore: z.string().default(""),
  anticipation: z.string().default(""),
  availableHours: z.string().default(""),
  noShowProcess: z.array(z.string()).default([]),
  noShowOther: z.string().default(""),
  noShowDescription: z.string().default(""),
  existingMaterials: z.string().default(""),
  rules: z.string().default(""),
})

export const packageBriefSchema = z.object({
  id: z.string().optional(),
  timestamp: z.coerce.date().optional(),
  briefType: z.enum(["ads", "estandar", "premium"]),
  status: z.enum(["draft", "completed"]).default("draft"),
  basic: basicInfoSchema,
  ads: adsAnswersSchema.optional(),
  core: coreAnswersSchema.optional(),
  premium: premiumAnswersSchema.optional(),
})

export type BasicInfo = z.infer<typeof basicInfoSchema>
export type AdsAnswers = z.infer<typeof adsAnswersSchema>
export type CoreAnswers = z.infer<typeof coreAnswersSchema>
export type PremiumAnswers = z.infer<typeof premiumAnswersSchema>
export type PackageBrief = z.infer<typeof packageBriefSchema>

export function emptyBasic(): BasicInfo {
  return basicInfoSchema.parse({})
}

export function emptyAds(): AdsAnswers {
  return adsAnswersSchema.parse({})
}

export function emptyCore(): CoreAnswers {
  return coreAnswersSchema.parse({})
}

export function emptyPremium(): PremiumAnswers {
  return premiumAnswersSchema.parse({})
}

export function createEmptyPackageBrief(briefType: BriefType): PackageBrief {
  return {
    briefType,
    status: "draft",
    timestamp: new Date(),
    basic: emptyBasic(),
    ads: briefType === "ads" ? emptyAds() : undefined,
    core: briefType === "ads" ? undefined : emptyCore(),
    premium: briefType === "premium" ? emptyPremium() : undefined,
  }
}
