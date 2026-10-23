import { createEmptyPackageBrief, type PackageBrief } from "./schemas"
import type { BriefType } from "./types"

const storageKey = (type: BriefType) => `saint_package_brief_${type}_v1`

export function savePackageBrief(brief: PackageBrief): boolean {
  try {
    if (typeof window === "undefined") return false
    localStorage.setItem(
      storageKey(brief.briefType),
      JSON.stringify({
        brief: { ...brief, timestamp: new Date() },
        lastSaved: new Date(),
      })
    )
    return true
  } catch (error) {
    console.error("Error saving brief:", error)
    return false
  }
}

export function loadPackageBrief(type: BriefType): PackageBrief | null {
  try {
    if (typeof window === "undefined") return null
    const stored = localStorage.getItem(storageKey(type))
    if (!stored) return null
    const parsed = JSON.parse(stored)
    if (!parsed?.brief) return null
    return {
      ...createEmptyPackageBrief(type),
      ...parsed.brief,
      briefType: type,
      basic: { ...createEmptyPackageBrief(type).basic, ...parsed.brief.basic },
      ads: type === "ads" ? { ...createEmptyPackageBrief("ads").ads, ...parsed.brief.ads } : undefined,
      core: type === "ads" ? undefined : { ...createEmptyPackageBrief(type).core, ...parsed.brief.core },
      premium: type === "premium" ? { ...createEmptyPackageBrief("premium").premium, ...parsed.brief.premium } : undefined,
    }
  } catch (error) {
    console.error("Error loading brief:", error)
    return null
  }
}

export function clearPackageBrief(type: BriefType): boolean {
  try {
    if (typeof window === "undefined") return false
    localStorage.removeItem(storageKey(type))
    return true
  } catch (error) {
    console.error("Error clearing brief:", error)
    return false
  }
}
