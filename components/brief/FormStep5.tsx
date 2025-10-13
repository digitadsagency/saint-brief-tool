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
import { Badge } from "@/components/ui/badge"
import { X, Plus, Trophy, Settings } from "lucide-react"
import { differentiatorsSchema, type Differentiators } from "@/lib/schemas"
import { type Language, getTranslation } from "@/lib/i18n"

interface FormStep5Props {
  data: Differentiators
  language: Language
  onSubmit: (data: Differentiators) => void
  onNext: () => void
  onBack: () => void
}

export default function FormStep5({ data, language, onSubmit, onNext, onBack }: FormStep5Props) {
  const [keyTechnologies, setKeyTechnologies] = React.useState<string[]>(data.keyTechnologies || [])
  const [newTechnology, setNewTechnology] = React.useState("")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<Differentiators>({
    resolver: zodResolver(differentiatorsSchema),
    defaultValues: data,
    mode: "onChange"
  })

  const watchedKeyTechnologies = React.useMemo(() => watch("keyTechnologies") || [], [watch])

  React.useEffect(() => {
    setKeyTechnologies(watchedKeyTechnologies)
  }, [watchedKeyTechnologies])

  const addTechnology = () => {
    if (newTechnology.trim() && !keyTechnologies.includes(newTechnology.trim())) {
      const newTechnologies = [...keyTechnologies, newTechnology.trim()]
      setKeyTechnologies(newTechnologies)
      setValue("keyTechnologies", newTechnologies, { shouldValidate: true })
      setNewTechnology("")
    }
  }

  const removeTechnology = (technology: string) => {
    const newTechnologies = keyTechnologies.filter(t => t !== technology)
    setKeyTechnologies(newTechnologies)
    setValue("keyTechnologies", newTechnologies, { shouldValidate: true })
  }

  const onFormSubmit = (formData: Differentiators) => {
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
            <Trophy className="h-5 w-5" />
            {getTranslation(language, "step5Title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-8">
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            {/* Qué te hace diferente */}
            <div className="space-y-2">
              <Label htmlFor="whatMakesDifferent" className="text-base font-medium flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Cuales son tus diferenciadores mas grandes? *
              </Label>
              <p className="text-sm text-muted-foreground">
                👉 Uso tecnología de vanguardia, uso un enfoque personalizado humano, nadie mas hace este procedimiento.
              </p>
              <Textarea
                id="whatMakesDifferent"
                {...register("whatMakesDifferent")}
                placeholder="Ejemplo: Uso tecnología de vanguardia, uso un enfoque personalizado humano, nadie mas hace este procedimiento."
                rows={4}
                className="w-full"
              />
              {errors.whatMakesDifferent && (
                <p className="text-sm text-red-500">{errors.whatMakesDifferent.message}</p>
              )}
            </div>

            {/* Tecnologías clave */}
            <div className="space-y-4">
              <Label className="text-base font-medium flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Tecnologías, técnicas o certificaciones clave *
              </Label>
              <p className="text-sm text-muted-foreground">
                👉 __
              </p>
              
              <div className="flex gap-2">
                <Input
                  value={newTechnology}
                  onChange={(e) => setNewTechnology(e.target.value)}
                  placeholder="Ej: Dermatoscopía digital, Láser fraccionado, Certificación en medicina estética"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTechnology())}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={addTechnology} 
                  size="icon"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Tecnologías y certificaciones:</Label>
                <div className="flex flex-wrap gap-2">
                  {keyTechnologies.map((technology, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {technology}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeTechnology(technology)}
                      />
                    </Badge>
                  ))}
                </div>
                {keyTechnologies.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay tecnologías agregadas. Agrega al menos una para continuar.
                  </p>
                )}
              </div>
              {errors.keyTechnologies && (
                <p className="text-sm text-red-500">{errors.keyTechnologies.message}</p>
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