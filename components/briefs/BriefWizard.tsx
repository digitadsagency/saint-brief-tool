"use client"

import React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Instagram, Languages, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Stepper } from "@/components/brief/Stepper"
import { useToast } from "@/components/ui/use-toast"
import { sendEmailNotification } from "@/lib/email"
import { sendToGoogleSheets } from "@/lib/googleSheets"
import { createEmptyPackageBrief, emptyAds, emptyCore, emptyPremium, type PackageBrief } from "@/lib/briefs/schemas"
import { clearPackageBrief, loadPackageBrief, savePackageBrief } from "@/lib/briefs/storage"
import { BRIEF_CONFIG, type BriefType } from "@/lib/briefs/types"
import { useLanguage } from "@/lib/i18n"
import { AdsAssetsStep, AdsConversionStep, AdsEconomicsStep, AdsEvidenceStep, AdsGrowStep } from "./AdsSteps"
import { BasicStep } from "./BasicStep"
import {
  CoreBrandStep,
  CoreGrowStep,
  CoreMarketingStep,
  CoreOpsStep,
  CorePatientStep,
  CoreProofStep,
  CoreWhyYouStep,
} from "./CoreSteps"
import { PremiumFunnelStep, PremiumGoalStep, PremiumSystemsStep } from "./PremiumSteps"

export function BriefWizard({ briefType }: { briefType: BriefType }) {
  const config = BRIEF_CONFIG[briefType]
  const totalSteps = config.steps.length
  const [currentStep, setCurrentStep] = React.useState(1)
  const [brief, setBrief] = React.useState<PackageBrief>(() => createEmptyPackageBrief(briefType))
  const [language, setLanguage] = useLanguage()
  const [submitting, setSubmitting] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)
  const { toast } = useToast()

  React.useEffect(() => {
    const saved = loadPackageBrief(briefType)
    if (saved) {
      setBrief(saved)
      toast({
        title: "Borrador cargado",
        description: `Se cargó tu borrador de ${config.name}.`,
      })
    }
  }, [briefType, config.name, toast])

  React.useEffect(() => {
    const timer = setTimeout(() => {
      savePackageBrief(brief)
    }, 1200)
    return () => clearTimeout(timer)
  }, [brief])

  const goNext = () => setCurrentStep((step) => Math.min(totalSteps, step + 1))
  const goBack = () => {
    if (currentStep === 1) return
    setCurrentStep((step) => step - 1)
  }

  const submit = async () => {
    setSubmitting(true)
    const payload = { ...brief, status: "completed" as const, timestamp: new Date() }
    try {
      const sheets = await sendToGoogleSheets(payload as any)
      const email = await sendEmailNotification(payload as any)
      if (!sheets.success && !email.success) {
        throw new Error(sheets.message || email.message || "No se pudo enviar el brief")
      }
      setBrief(payload)
      setSubmitted(true)
      clearPackageBrief(briefType)
    } catch (error) {
      toast({
        title: "Error al enviar",
        description: error instanceof Error ? error.message : "Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const ads = brief.ads || emptyAds()
  const core = brief.core || emptyCore()
  const premium = brief.premium || emptyPremium()

  const renderStep = () => {
    if (briefType === "ads") {
      switch (currentStep) {
        case 1:
          return (
            <BasicStep
              data={brief.basic}
              briefType={briefType}
              onChange={(basic) => setBrief((prev) => ({ ...prev, basic }))}
              onNext={goNext}
              onBack={goBack}
            />
          )
        case 2:
          return <AdsGrowStep data={ads} onChange={(next) => setBrief((prev) => ({ ...prev, ads: next }))} onNext={goNext} onBack={goBack} />
        case 3:
          return <AdsEvidenceStep data={ads} onChange={(next) => setBrief((prev) => ({ ...prev, ads: next }))} onNext={goNext} onBack={goBack} />
        case 4:
          return <AdsEconomicsStep data={ads} onChange={(next) => setBrief((prev) => ({ ...prev, ads: next }))} onNext={goNext} onBack={goBack} />
        case 5:
          return <AdsConversionStep data={ads} onChange={(next) => setBrief((prev) => ({ ...prev, ads: next }))} onNext={goNext} onBack={goBack} />
        case 6:
          return (
            <AdsAssetsStep
              data={ads}
              onChange={(next) => setBrief((prev) => ({ ...prev, ads: next }))}
              onNext={submit}
              onBack={goBack}
              submitting={submitting}
            />
          )
      }
    }

    if (currentStep === 1) {
      return (
        <BasicStep
          data={brief.basic}
          briefType={briefType}
          onChange={(basic) => setBrief((prev) => ({ ...prev, basic }))}
          onNext={goNext}
          onBack={goBack}
        />
      )
    }

    const coreProps = {
      data: core,
      onChange: (next: typeof core) => setBrief((prev) => ({ ...prev, core: next })),
      onNext: goNext,
      onBack: goBack,
    }

    switch (currentStep) {
      case 2:
        return <CoreGrowStep {...coreProps} />
      case 3:
        return <CoreWhyYouStep {...coreProps} />
      case 4:
        return <CoreProofStep {...coreProps} />
      case 5:
        return <CorePatientStep {...coreProps} />
      case 6:
        return <CoreOpsStep {...coreProps} />
      case 7:
        return <CoreMarketingStep {...coreProps} />
      case 8:
        return (
          <CoreBrandStep
            {...coreProps}
            nextLabel={briefType === "premium" ? "Siguiente" : "Enviar Brief"}
            submitting={briefType === "estandar" ? submitting : false}
            onNext={briefType === "premium" ? goNext : submit}
          />
        )
      case 9:
        return (
          <PremiumGoalStep
            data={premium}
            onChange={(next) => setBrief((prev) => ({ ...prev, premium: next }))}
            onNext={goNext}
            onBack={goBack}
          />
        )
      case 10:
        return (
          <PremiumFunnelStep
            data={premium}
            onChange={(next) => setBrief((prev) => ({ ...prev, premium: next }))}
            onNext={goNext}
            onBack={goBack}
          />
        )
      case 11:
        return (
          <PremiumSystemsStep
            data={premium}
            onChange={(next) => setBrief((prev) => ({ ...prev, premium: next }))}
            onNext={submit}
            onBack={goBack}
            submitting={submitting}
          />
        )
    }

    return null
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-white border-gray-200 shadow-lg">
          <CardContent className="pt-6 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-black mb-2">¡Brief enviado!</h2>
            <p className="text-gray-600 mb-6">
              Recibimos tu {config.name}. El equipo de Saint se pondrá en contacto contigo.
            </p>
            <Link href="/">
              <Button className="bg-black text-white hover:bg-gray-800">Volver al inicio</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gradient-to-r from-[#CADCFF] to-[#C1FFDD] py-2 sm:py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <Image src="/saint-logo.png" alt="SAINT Logo" width={80} height={80} className="object-contain sm:w-[120px] sm:h-[120px]" />
            </Link>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-sm font-medium bg-black text-white px-3 py-1 rounded-full">
                {config.shortName}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage(language === "es" ? "en" : "es")}
                className="border-black text-black hover:bg-black hover:text-white"
              >
                <Languages className="h-4 w-4 mr-2" />
                {language === "es" ? "EN" : "ES"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Stepper currentStep={currentStep} totalSteps={totalSteps} language={language} stepTitles={config.steps} />
      </div>

      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${briefType}-${currentStep}`}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="hidden lg:block">
            <Card className="h-fit sticky top-4 bg-white border-gray-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-[#CADCFF] to-[#C1FFDD]">
                <CardTitle className="text-black">{config.name}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-3 text-sm">
                <p><strong>Nombre:</strong> {brief.basic.fullName || "—"}</p>
                <p><strong>Especialidad:</strong> {brief.basic.specialty || "—"}</p>
                <p><strong>Ciudades:</strong> {brief.basic.cities.join(", ") || "—"}</p>
                {briefType === "ads" && <p><strong>Servicio #1:</strong> {ads.mainService || ads.procedure1 || "—"}</p>}
                {briefType !== "ads" && <p><strong>Procedimiento #1:</strong> {core.numberOne || "—"}</p>}
                <p className="text-muted-foreground">{config.time}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <footer className="bg-gray-50 py-6">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={() => {
              clearPackageBrief(briefType)
              setBrief(createEmptyPackageBrief(briefType))
              setCurrentStep(1)
            }}
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Limpiar
          </Button>
          <a
            href="https://www.instagram.com/sainttagency/?hl=es"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-black"
          >
            <Instagram className="h-4 w-4" />
            @sainttagency
          </a>
        </div>
      </footer>
    </div>
  )
}
