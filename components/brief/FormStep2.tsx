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
import { Heart, User, Zap, Briefcase, Smile } from "lucide-react"
import { identityStyleSchema, type IdentityStyle } from "@/lib/schemas"
import { type Language, getTranslation } from "@/lib/i18n"

interface FormStep2Props {
  data: IdentityStyle
  language: Language
  onSubmit: (data: IdentityStyle) => void
  onNext: () => void
  onBack: () => void
}

const perceptionOptions = [
  { value: "cercano_humano", label: "cercanoHumano", icon: Heart, description: "Cercano y humano" },
  { value: "elegante_aspiracional", label: "eleganteAspiracional", icon: User, description: "Elegante y aspiracional" },
  { value: "innovador_tecnologico", label: "innovadorTecnologico", icon: Zap, description: "Innovador y tecnológico" },
  { value: "profesional_tecnico", label: "profesionalTecnico", icon: Briefcase, description: "Profesional técnico" },
  { value: "casual_directo", label: "casualDirecto", icon: Smile, description: "Casual y directo" }
]

export function FormStep2({ data, language, onSubmit, onNext, onBack }: FormStep2Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<IdentityStyle>({
    resolver: zodResolver(identityStyleSchema),
    defaultValues: data,
    mode: "onChange"
  })

  const watchedPerception = React.useMemo(() => watch("perception") || [], [watch])
  const [selectedPerceptions, setSelectedPerceptions] = React.useState<string[]>(watchedPerception)

  React.useEffect(() => {
    setSelectedPerceptions(watchedPerception)
  }, [watchedPerception])

  const togglePerception = (value: string) => {
    let newPerceptions: string[]
    if (selectedPerceptions.includes(value)) {
      newPerceptions = selectedPerceptions.filter(p => p !== value)
    } else if (selectedPerceptions.length < 3) {
      newPerceptions = [...selectedPerceptions, value]
    } else {
      return // No hacer nada si ya hay 3 seleccionados
    }
    
    setSelectedPerceptions(newPerceptions)
    setValue("perception", newPerceptions as any, { shouldValidate: true })
  }

  const onFormSubmit = (formData: IdentityStyle) => {
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
            <Heart className="h-5 w-5" />
            {getTranslation(language, "step2Title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-8">
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            {/* Percepción */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-base font-medium">
                  {getTranslation(language, "perception")} *
                </Label>
                <p className="text-sm text-muted-foreground">
                  Selecciona exactamente 3 opciones que mejor describan cómo quieres que te perciban
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {perceptionOptions.map((option) => (
                  <div 
                    key={option.value}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedPerceptions.includes(option.value)
                        ? 'border-[#C1FFDD] bg-[#C1FFDD]/20'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => togglePerception(option.value)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 border-2 rounded ${
                        selectedPerceptions.includes(option.value)
                          ? 'bg-[#C1FFDD] border-[#C1FFDD]'
                          : 'border-gray-300'
                      }`}>
                        {selectedPerceptions.includes(option.value) && (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <option.icon className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium">{getTranslation(language, option.label as any)}</p>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-sm text-muted-foreground">
                Seleccionados: {selectedPerceptions.length}/3
              </div>
              
              {errors.perception && (
                <p className="text-sm text-red-500">{errors.perception.message}</p>
              )}
            </div>

            {/* Qué NO eres */}
            <div className="space-y-2">
              <Label htmlFor="whatNotAre" className="text-base font-medium">
                Qué NO eres como médico *
              </Label>
              <p className="text-sm text-muted-foreground">
                👉 Cuéntanos qué cosas no van contigo o qué prácticas no representan tu estilo profesional.
              </p>
              <Textarea
                id="whatNotAre"
                {...register("whatNotAre")}
                placeholder="Ejemplo: No soy de prometer milagros ni de exagerar resultados."
                rows={3}
                className="w-full"
              />
              {errors.whatNotAre && (
                <p className="text-sm text-red-500">{errors.whatNotAre.message}</p>
              )}
            </div>

            {/* Filosofía */}
            <div className="space-y-2">
              <Label htmlFor="philosophy" className="text-base font-medium">
                Tu filosofía como médico en una frase *
              </Label>
              <p className="text-sm text-muted-foreground">
                👉 Resume tu manera de entender la medicina o el trato con tus pacientes en una sola frase.
              </p>
              <Textarea
                id="philosophy"
                {...register("philosophy")}
                placeholder='Ejemplo: "La belleza natural se potencia con la ciencia y el cuidado personalizado."'
                rows={2}
                className="w-full"
              />
              {errors.philosophy && (
                <p className="text-sm text-red-500">{errors.philosophy.message}</p>
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