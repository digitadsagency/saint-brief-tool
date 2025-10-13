"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Send, CheckCircle } from "lucide-react"
import { adHistorySchema, type AdHistory, type BrandBrief } from "@/lib/schemas"
import { type Language, getTranslation } from "@/lib/i18n"
import { sendToGoogleSheets } from "@/lib/googleSheets"
import { sendEmailNotification } from "@/lib/email"
import { useState } from "react"

interface FormStep8Props {
  data: AdHistory
  briefData: BrandBrief
  language: Language
  onSubmit: (data: AdHistory) => void
  onNext: () => void
  onBack: () => void
}

const platformOptions = [
  "Meta Ads (Facebook/Instagram)",
  "Google Ads",
  "TikTok Ads",
  "LinkedIn Ads",
  "YouTube Ads",
  "Twitter Ads"
]

const formatOptions = [
  "Videos",
  "Reels/TikTok",
  "Carruseles",
  "Imágenes estáticas",
  "Stories",
  "Anuncios de texto"
]

export default function FormStep8({ data, briefData, language, onSubmit, onNext, onBack }: FormStep8Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [platforms, setPlatforms] = useState<string[]>(data.platforms || [])
  const [bestFormats, setBestFormats] = useState<string[]>(data.bestFormats || [])
  const [newPlatform, setNewPlatform] = useState("")
  const [newFormat, setNewFormat] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<AdHistory>({
    resolver: zodResolver(adHistorySchema),
    defaultValues: data,
    mode: "onChange"
  })

  const watchedValues = watch()

  React.useEffect(() => {
    setValue("platforms", platforms)
    setValue("bestFormats", bestFormats)
  }, [platforms, bestFormats, setValue])

  const addPlatform = (platform: string) => {
    if (platform && !platforms.includes(platform)) {
      setPlatforms(prev => [...prev, platform])
    }
  }

  const removePlatform = (platform: string) => {
    setPlatforms(prev => prev.filter(p => p !== platform))
  }

  const addCustomPlatform = () => {
    if (newPlatform.trim() && !platforms.includes(newPlatform.trim())) {
      setPlatforms(prev => [...prev, newPlatform.trim()])
      setNewPlatform("")
    }
  }

  const addFormat = (format: string) => {
    if (format && !bestFormats.includes(format)) {
      setBestFormats(prev => [...prev, format])
    }
  }

  const removeFormat = (format: string) => {
    setBestFormats(prev => prev.filter(f => f !== format))
  }

  const addCustomFormat = () => {
    if (newFormat.trim() && !bestFormats.includes(newFormat.trim())) {
      setBestFormats(prev => [...prev, newFormat.trim()])
      setNewFormat("")
    }
  }

  const handleFormSubmit = async (formData: AdHistory) => {
    setIsSubmitting(true)
    
    try {
      // Enviar a Google Sheets
      const sheetsResult = await sendToGoogleSheets(briefData)
      
      // Enviar notificación por correo
      const emailResult = await sendEmailNotification(briefData)
      
      if (sheetsResult.success) {
        console.log("Google Sheets:", sheetsResult.message)
        if (emailResult.success) {
          console.log("Email notification:", emailResult.message)
        } else {
          console.warn("Email notification failed:", emailResult.message)
        }
        
        onSubmit(formData)
        setIsSubmitted(true)
      } else {
        throw new Error(sheetsResult.message)
      }
      
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center min-h-[400px]"
      >
        <Card className="w-full max-w-md bg-white border-gray-200 shadow-lg">
          <CardContent className="pt-6 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-black mb-2">
              ¡Brief enviado exitosamente!
            </h2>
            <p className="text-gray-600 mb-6">
              Hemos recibido tu información y nos pondremos en contacto contigo pronto.
            </p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-black text-white hover:bg-gray-800"
            >
              Crear nuevo brief
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-white border-gray-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-[#CADCFF] to-[#C1FFDD]">
          <CardTitle className="text-black flex items-center gap-2">
            <Send className="h-5 w-5" />
            {getTranslation(language, "step8Title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-8">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* ¿Has hecho anuncios antes? */}
            <div className="space-y-4">
              <Label className="text-base font-medium">
                {getTranslation(language, "hasDoneAds")} *
              </Label>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasDoneAds-yes"
                    checked={watchedValues.hasDoneAds === true}
                    onCheckedChange={(checked) => setValue("hasDoneAds", !!checked)}
                  />
                  <Label htmlFor="hasDoneAds-yes">{getTranslation(language, "yes")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasDoneAds-no"
                    checked={watchedValues.hasDoneAds === false}
                    onCheckedChange={(checked) => setValue("hasDoneAds", !checked)}
                  />
                  <Label htmlFor="hasDoneAds-no">{getTranslation(language, "no")}</Label>
                </div>
              </div>
            </div>

            {/* Si ha hecho anuncios, mostrar campos adicionales */}
            {watchedValues.hasDoneAds && (
              <>
                {/* Plataformas */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">
                    {getTranslation(language, "platforms")}
                  </Label>
                  
                  {/* Agregar plataforma desde lista */}
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Seleccionar de la lista:</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {platformOptions.map((platform) => (
                        <div 
                          key={platform}
                          className={`p-2 border rounded cursor-pointer transition-all ${
                            platforms.includes(platform)
                              ? 'border-[#C1FFDD] bg-[#C1FFDD]/20'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => addPlatform(platform)}
                        >
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={platforms.includes(platform)}
                              onChange={() => addPlatform(platform)}
                            />
                            <span className="text-sm">{platform}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Agregar plataforma personalizada */}
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">O especifica una personalizada:</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newPlatform}
                        onChange={(e) => setNewPlatform(e.target.value)}
                        placeholder="Ej: LinkedIn Ads"
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCustomPlatform())}
                        className="flex-1"
                      />
                      <Button type="button" onClick={addCustomPlatform} size="icon">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Lista de plataformas seleccionadas */}
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Plataformas seleccionadas:</Label>
                    <div className="flex flex-wrap gap-2">
                      {platforms.map((platform, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {platform}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removePlatform(platform)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Monto de inversión */}
                <div className="space-y-2">
                  <Label htmlFor="investmentAmount" className="text-base font-medium">
                    {getTranslation(language, "investmentAmount")}
                  </Label>
                  <Input
                    id="investmentAmount"
                    {...register("investmentAmount")}
                    placeholder="Ej: 15,000 MXN mensuales"
                    className="w-full"
                  />
                </div>

                {/* Resultados */}
                <div className="space-y-2">
                  <Label htmlFor="results" className="text-base font-medium">
                    {getTranslation(language, "results")}
                  </Label>
                  <Textarea
                    id="results"
                    {...register("results")}
                    placeholder="Ej: Generaba 20-25 consultas nuevas por mes"
                    rows={3}
                    className="w-full"
                  />
                </div>

                {/* Mejores formatos */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">
                    {getTranslation(language, "bestFormats")}
                  </Label>
                  
                  {/* Agregar formato desde lista */}
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Seleccionar de la lista:</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {formatOptions.map((format) => (
                        <div 
                          key={format}
                          className={`p-2 border rounded cursor-pointer transition-all ${
                            bestFormats.includes(format)
                              ? 'border-[#C1FFDD] bg-[#C1FFDD]/20'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => addFormat(format)}
                        >
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={bestFormats.includes(format)}
                              onChange={() => addFormat(format)}
                            />
                            <span className="text-sm">{format}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Agregar formato personalizado */}
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">O especifica uno personalizado:</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newFormat}
                        onChange={(e) => setNewFormat(e.target.value)}
                        placeholder="Ej: Live streaming"
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCustomFormat())}
                        className="flex-1"
                      />
                      <Button type="button" onClick={addCustomFormat} size="icon">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Lista de formatos seleccionados */}
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Formatos seleccionados:</Label>
                    <div className="flex flex-wrap gap-2">
                      {bestFormats.map((format, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {format}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removeFormat(format)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Qué no funcionó */}
                <div className="space-y-2">
                  <Label htmlFor="whatDidntWork" className="text-base font-medium">
                    {getTranslation(language, "whatDidntWork")}
                  </Label>
                  <Textarea
                    id="whatDidntWork"
                    {...register("whatDidntWork")}
                    placeholder="Ej: Anuncios muy técnicos sin storytelling personal"
                    rows={3}
                    className="w-full"
                  />
                </div>
              </>
            )}

            {/* Botones de Navegación */}
            <div className="flex justify-between pt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onBack}
                className="border-[#CADCFF] text-black hover:bg-[#CADCFF] hover:text-black"
              >
                {getTranslation(language, "back")}
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-black text-white hover:bg-gray-800 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Enviar Brief
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
