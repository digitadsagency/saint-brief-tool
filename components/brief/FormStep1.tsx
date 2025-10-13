"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X, Plus, User, Stethoscope, MapPin, Calendar } from "lucide-react"
import { basicInfoSchema, type BasicInfo } from "@/lib/schemas"
import { type Language, getTranslation } from "@/lib/i18n"

interface FormStep1Props {
  data: BasicInfo
  language: Language
  onSubmit: (data: BasicInfo) => void
  onNext: () => void
  onBack: () => void
}

export function FormStep1({ data, language, onSubmit, onNext, onBack }: FormStep1Props) {
  const [cities, setCities] = React.useState<string[]>(data.cities || [])
  const [newCity, setNewCity] = React.useState("")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<BasicInfo>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: data,
    mode: "onChange"
  })

  const watchedValues = watch()

  React.useEffect(() => {
    setValue("cities", cities)
  }, [cities, setValue])

  const addCity = () => {
    if (newCity.trim() && !cities.includes(newCity.trim())) {
      setCities(prev => [...prev, newCity.trim()])
      setNewCity("")
    }
  }

  const removeCity = (city: string) => {
    setCities(prev => prev.filter(c => c !== city))
  }

  const onFormSubmit = (formData: BasicInfo) => {
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
            <User className="h-5 w-5" />
            {getTranslation(language, "step1Title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-8">
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            {/* Nombre completo */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-base font-medium">
                {getTranslation(language, "fullName")} *
              </Label>
              <Input
                id="fullName"
                {...register("fullName")}
                placeholder="Ej: Dr. María González Pérez"
                className="w-full"
              />
              {errors.fullName && (
                <p className="text-sm text-red-500">{errors.fullName.message}</p>
              )}
            </div>

            {/* Nombre preferido */}
            <div className="space-y-2">
              <Label htmlFor="preferredName" className="text-base font-medium">
                {getTranslation(language, "preferredName")} *
              </Label>
              <Input
                id="preferredName"
                {...register("preferredName")}
                placeholder="Ej: Dra. María"
                className="w-full"
              />
              {errors.preferredName && (
                <p className="text-sm text-red-500">{errors.preferredName.message}</p>
              )}
            </div>

            {/* Especialidad */}
            <div className="space-y-2">
              <Label htmlFor="specialty" className="text-base font-medium flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                {getTranslation(language, "specialty")} *
              </Label>
              <Input
                id="specialty"
                {...register("specialty")}
                placeholder="Ej: Dermatología, Cardiología, Ginecología"
                className="w-full"
              />
              {errors.specialty && (
                <p className="text-sm text-red-500">{errors.specialty.message}</p>
              )}
            </div>

            {/* Ciudades */}
            <div className="space-y-4">
              <Label className="text-base font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {getTranslation(language, "cities")} *
              </Label>
              
              {/* Agregar ciudad */}
              <div className="flex gap-2">
                <Input
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  placeholder="Agregar ciudad"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCity())}
                  className="flex-1"
                />
                <Button type="button" onClick={addCity} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Lista de ciudades */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Ciudades agregadas:</Label>
                <div className="flex flex-wrap gap-2">
                  {cities.map((city, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {city}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeCity(city)}
                      />
                    </Badge>
                  ))}
                </div>
                {cities.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay ciudades agregadas. Agrega al menos una para continuar.
                  </p>
                )}
              </div>
              {errors.cities && (
                <p className="text-sm text-red-500">{errors.cities.message}</p>
              )}
            </div>

            {/* Años de experiencia */}
            <div className="space-y-2">
              <Label htmlFor="yearsExperience" className="text-base font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {getTranslation(language, "yearsExperience")} *
              </Label>
              <Input
                id="yearsExperience"
                type="number"
                min="0"
                max="50"
                {...register("yearsExperience", { valueAsNumber: true })}
                placeholder="Ej: 8"
                className="w-full"
              />
              {errors.yearsExperience && (
                <p className="text-sm text-red-500">{errors.yearsExperience.message}</p>
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