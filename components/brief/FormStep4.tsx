"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Users, Calendar, Heart } from "lucide-react"
import { idealPatientSchema, type IdealPatient } from "@/lib/schemas"
import { type Language, getTranslation } from "@/lib/i18n"

interface FormStep4Props {
  data: IdealPatient
  language: Language
  onSubmit: (data: IdealPatient) => void
  onNext: () => void
  onBack: () => void
}

const ageRanges = [
  "18-25", "25-35", "35-45", "45-55", "55-65", "65+"
]

const commonFearsOptions = [
  "Dolor durante el procedimiento",
  "Resultados no naturales",
  "Efectos secundarios",
  "Costo del tratamiento",
  "Tiempo de recuperación",
  "Complicaciones médicas",
  "No obtener los resultados esperados",
  "Procedimientos invasivos",
  "Falta de experiencia del médico",
  "Tecnología obsoleta"
]

export default function FormStep4({ data, language, onSubmit, onNext, onBack }: FormStep4Props) {
  const [commonFears, setCommonFears] = React.useState<string[]>(data.commonFears || [])
  const [newFear, setNewFear] = React.useState("")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<IdealPatient>({
    resolver: zodResolver(idealPatientSchema),
    defaultValues: data,
    mode: "onChange"
  })

  const watchedCommonFears = React.useMemo(() => watch("commonFears") || [], [watch])

  React.useEffect(() => {
    setCommonFears(watchedCommonFears)
  }, [watchedCommonFears])

  const addFear = (fear: string) => {
    if (fear && !commonFears.includes(fear) && commonFears.length < 3) {
      const newFears = [...commonFears, fear]
      setCommonFears(newFears)
      setValue("commonFears", newFears, { shouldValidate: true })
    }
  }

  const removeFear = (fear: string) => {
    const newFears = commonFears.filter(f => f !== fear)
    setCommonFears(newFears)
    setValue("commonFears", newFears, { shouldValidate: true })
  }

  const addCustomFear = () => {
    if (newFear.trim() && !commonFears.includes(newFear.trim()) && commonFears.length < 3) {
      const newFears = [...commonFears, newFear.trim()]
      setCommonFears(newFears)
      setValue("commonFears", newFears, { shouldValidate: true })
      setNewFear("")
    }
  }

  const onFormSubmit = (formData: IdealPatient) => {
    onSubmit(formData)
    onNext()
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
            <Users className="h-5 w-5" />
            {getTranslation(language, "step4Title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-8">
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            {/* Edad promedio */}
            <div className="space-y-2">
              <Label htmlFor="averageAge" className="text-base font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Edad promedio de tu paciente *
              </Label>
              <Select
                value={watch("averageAge")}
                onValueChange={(value) => setValue("averageAge", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el rango de edad" />
                </SelectTrigger>
                <SelectContent>
                  {ageRanges.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range} años
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.averageAge && (
                <p className="text-sm text-red-500">{errors.averageAge.message}</p>
              )}
            </div>

            {/* Género predominante */}
            <div className="space-y-2">
              <Label className="text-base font-medium">
                Género *
              </Label>
              <div className="flex gap-4">
                {["mujer", "hombre", "ambos"].map((gender) => (
                  <div key={gender} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={gender}
                      name="gender"
                      value={gender}
                      checked={watch("predominantGender") === gender}
                      onChange={(e) => setValue("predominantGender", e.target.value as any)}
                      className="rounded"
                    />
                    <Label htmlFor={gender} className="text-sm">
                      {getTranslation(language, gender as any)}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.predominantGender && (
                <p className="text-sm text-red-500">{errors.predominantGender.message}</p>
              )}
            </div>

            {/* Miedos comunes */}
            <div className="space-y-4">
              <Label className="text-base font-medium flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Cuáles son los principales miedos de tu paciente *
              </Label>
              <p className="text-sm text-muted-foreground">
                Selecciona hasta 3 miedos más comunes de tus pacientes
              </p>
              
              {/* Agregar miedo desde lista */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Seleccionar de la lista:</Label>
                <Select onValueChange={addFear} disabled={commonFears.length >= 3}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un miedo común" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonFearsOptions.map((fear) => (
                      <SelectItem 
                        key={fear} 
                        value={fear}
                        disabled={commonFears.includes(fear)}
                      >
                        {fear}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Agregar miedo personalizado */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">O especifica uno personalizado:</Label>
                <div className="flex gap-2">
                  <Input
                    value={newFear}
                    onChange={(e) => setNewFear(e.target.value)}
                    placeholder="Escribe un miedo personalizado"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCustomFear())}
                    disabled={commonFears.length >= 3}
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    onClick={addCustomFear} 
                    size="icon"
                    disabled={commonFears.length >= 3}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Lista de miedos seleccionados */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Miedos seleccionados:</Label>
                <div className="space-y-2">
                  {commonFears.map((fear, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">{fear}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFear(fear)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                {commonFears.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay miedos agregados. Agrega al menos uno para continuar.
                  </p>
                )}
                <div className="text-sm text-muted-foreground">
                  Seleccionados: {commonFears.length}/3
                </div>
              </div>
              {errors.commonFears && (
                <p className="text-sm text-red-500">{errors.commonFears.message}</p>
              )}
            </div>

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
                disabled={!isValid}
                className="bg-black text-white hover:bg-gray-800"
              >
                {getTranslation(language, "next")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}