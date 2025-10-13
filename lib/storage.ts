import React from "react"
import { brandBriefSchema, type BrandBrief } from "./schemas"
import { v4 as uuidv4 } from "uuid"

const STORAGE_KEY = "saint_brand_brief_v2"

export interface StorageData {
  brief: BrandBrief
  lastSaved: Date
  version: string
}

export function saveToStorage(brief: BrandBrief): boolean {
  try {
    if (typeof window === "undefined") return false
    
    const storageData: StorageData = {
      brief: {
        ...brief,
        id: brief.id || uuidv4(),
        timestamp: new Date()
      },
      lastSaved: new Date(),
      version: "2.0.0"
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData))
    return true
  } catch (error) {
    console.error("Error saving to localStorage:", error)
    return false
  }
}

export function loadFromStorage(): BrandBrief | null {
  try {
    if (typeof window === "undefined") return null
    
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    
    const storageData: StorageData = JSON.parse(stored)
    
    // Validar con Zod
    const result = brandBriefSchema.safeParse(storageData.brief)
    if (!result.success) {
      console.error("Invalid data in localStorage:", result.error)
      return null
    }
    
    return result.data
  } catch (error) {
    console.error("Error loading from localStorage:", error)
    return null
  }
}

export function clearStorage(): boolean {
  try {
    if (typeof window === "undefined") return false
    
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (error) {
    console.error("Error clearing localStorage:", error)
    return false
  }
}

export function hasStoredData(): boolean {
  try {
    if (typeof window === "undefined") return false
    
    return localStorage.getItem(STORAGE_KEY) !== null
  } catch (error) {
    console.error("Error checking localStorage:", error)
    return false
  }
}

export function getLastSavedTime(): Date | null {
  try {
    if (typeof window === "undefined") return null
    
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    
    const storageData: StorageData = JSON.parse(stored)
    return new Date(storageData.lastSaved)
  } catch (error) {
    console.error("Error getting last saved time:", error)
    return null
  }
}

// Hook para autosave
export function useAutoSave(brief: BrandBrief, delay: number = 1500) {
  const [isSaving, setIsSaving] = React.useState(false)
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null)
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsSaving(true)
      const success = saveToStorage(brief)
      if (success) {
        setLastSaved(new Date())
      }
      setIsSaving(false)
    }, delay)
    
    return () => clearTimeout(timer)
  }, [brief, delay])
  
  return { isSaving, lastSaved }
}

// Función para crear brief vacío
export function createEmptyBrief(): BrandBrief {
  return {
    id: uuidv4(),
    timestamp: new Date(),
    step1: {
      fullName: "",
      preferredName: "",
      specialty: "",
      cities: [],
      yearsExperience: 0
    },
    step2: {
      perception: [],
      whatNotAre: "",
      philosophy: ""
    },
    step3: {
      favoriteProcedures: [],
      highValueServices: [],
      accessibleServices: []
    },
    step4: {
      averageAge: "",
      predominantGender: "ambos",
      commonFears: []
    },
    step5: {
      whatMakesDifferent: "",
      keyTechnologies: []
    },
    step6: {
      mainObjective: [],
      monthlyNewConsultations: 0,
      inspiringAccounts: []
    },
    step7: {
      whySpecialty: "",
      markedCase: "",
      commonPhrase: "",
      fiveYearVision: "",
      mythToDebunk: "",
      frequentQuestions: [],
      curiosityTopic: ""
    },
    step8: {
      hasDoneAds: false,
      platforms: [],
      investmentAmount: "",
      results: "",
      bestFormats: [],
      whatDidntWork: ""
    },
    status: "draft"
  }
}