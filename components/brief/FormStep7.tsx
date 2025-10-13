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
import { X, Plus, BookOpen, MessageCircle, Eye, HelpCircle } from "lucide-react"
import { storytellingSchema, type Storytelling } from "@/lib/schemas"
import { type Language, getTranslation } from "@/lib/i18n"

interface FormStep7Props {
  data: Storytelling
  language: Language
  onSubmit: (data: Storytelling) => void
  onNext: () => void
  onBack: () => void
}

export default function FormStep7({ data, language, onSubmit, onNext, onBack }: FormStep7Props) {
  const [frequentQuestions, setFrequentQuestions] = React.useState<string[]>(data.frequentQuestions || [])
  const [newQuestion, setNewQuestion] = React.useState("")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<Storytelling>({
    resolver: zodResolver(storytellingSchema),
    defaultValues: data,
    mode: "onChange"
  })

  const watchedFrequentQuestions = React.useMemo(() => watch("frequentQuestions") || [], [watch])

  React.useEffect(() => {
    setFrequentQuestions(watchedFrequentQuestions)
  }, [watchedFrequentQuestions])

  const addQuestion = () => {
    if (newQuestion.trim() && !frequentQuestions.includes(newQuestion.trim())) {
      const newQuestions = [...frequentQuestions, newQuestion.trim()]
      setFrequentQuestions(newQuestions)
      setValue("frequentQuestions", newQuestions, { shouldValidate: true })
      setNewQuestion("")
    }
  }

  const removeQuestion = (question: string) => {
    const newQuestions = frequentQuestions.filter(q => q !== question)
    setFrequentQuestions(newQuestions)
    setValue("frequentQuestions", newQuestions, { shouldValidate: true })
  }

  const onFormSubmit = (formData: Storytelling) => {
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
            <BookOpen className="h-5 w-5" />
            {getTranslation(language, "step7Title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-8">
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            {/* Por qué elegiste tu especialidad */}
            <div className="space-y-2">
              <Label htmlFor="whySpecialty" className="text-base font-medium">
                {getTranslation(language, "whySpecialty")} *
              </Label>
              <Textarea
                id="whySpecialty"
                {...register("whySpecialty")}
                placeholder="Ej: Elegí dermatología porque me apasiona ayudar a las personas a sentirse cómodas en su propia piel"
                rows={3}
                className="w-full"
              />
              {errors.whySpecialty && (
                <p className="text-sm text-red-500">{errors.whySpecialty.message}</p>
              )}
            </div>

            {/* Caso que te marcó */}
            <div className="space-y-2">
              <Label htmlFor="markedCase" className="text-base font-medium">
                {getTranslation(language, "markedCase")} *
              </Label>
              <Textarea
                id="markedCase"
                {...register("markedCase")}
                placeholder="Ej: Una paciente de 35 años que recuperó su confianza después de un tratamiento de acné severo"
                rows={3}
                className="w-full"
              />
              {errors.markedCase && (
                <p className="text-sm text-red-500">{errors.markedCase.message}</p>
              )}
            </div>

            {/* Frase común */}
            <div className="space-y-2">
              <Label htmlFor="commonPhrase" className="text-base font-medium flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Frases que sueles decirle a tus pacientes *
              </Label>
              <p className="text-sm text-muted-foreground">
                (Que es eso que repites todos los días en consulta, pueden ser diferentes frases)
              </p>
              <Input
                id="commonPhrase"
                {...register("commonPhrase")}
                placeholder="Ejemplo: La piel es el reflejo de tu salud interior"
                className="w-full"
              />
              {errors.commonPhrase && (
                <p className="text-sm text-red-500">{errors.commonPhrase.message}</p>
              )}
            </div>

            {/* Visión a 5 años */}
            <div className="space-y-2">
              <Label htmlFor="fiveYearVision" className="text-base font-medium">
                {getTranslation(language, "fiveYearVision")} *
              </Label>
              <Textarea
                id="fiveYearVision"
                {...register("fiveYearVision")}
                placeholder="Ej: Ser referente en dermatología estética en México y tener mi propia clínica"
                rows={2}
                className="w-full"
              />
              {errors.fiveYearVision && (
                <p className="text-sm text-red-500">{errors.fiveYearVision.message}</p>
              )}
            </div>

            {/* Mito a derribar */}
            <div className="space-y-2">
              <Label htmlFor="mythToDebunk" className="text-base font-medium">
                Mayor mito que quieres desmitificar sobre tus procedimientos o tu especialidad *
              </Label>
              <Textarea
                id="mythToDebunk"
                {...register("mythToDebunk")}
                placeholder="Ej: Que todos los tratamientos estéticos son peligrosos o antinaturales"
                rows={2}
                className="w-full"
              />
              {errors.mythToDebunk && (
                <p className="text-sm text-red-500">{errors.mythToDebunk.message}</p>
              )}
            </div>

            {/* Preguntas frecuentes */}
            <div className="space-y-4">
              <Label className="text-base font-medium flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                {getTranslation(language, "frequentQuestions")} *
              </Label>
              <p className="text-sm text-muted-foreground">
                Preguntas que te hacen SIEMPRE en consulta (esas que repites 20 veces al mes)
              </p>
              
              <div className="flex gap-2">
                <Input
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Ej: ¿Duele el procedimiento?"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addQuestion())}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={addQuestion} 
                  size="icon"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Preguntas frecuentes:</Label>
                <div className="space-y-2">
                  {frequentQuestions.map((question, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">{question}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeQuestion(question)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                {frequentQuestions.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay preguntas agregadas. Agrega al menos una para continuar.
                  </p>
                )}
              </div>
              {errors.frequentQuestions && (
                <p className="text-sm text-red-500">{errors.frequentQuestions.message}</p>
              )}
            </div>

            {/* Tema de curiosidad */}
            <div className="space-y-2">
              <Label htmlFor="curiosityTopic" className="text-base font-medium flex items-center gap-2">
                <Eye className="h-4 w-4" />
                {getTranslation(language, "curiosityTopic")} *
              </Label>
              <Input
                id="curiosityTopic"
                {...register("curiosityTopic")}
                placeholder="Ej: Los tratamientos de rejuvenecimiento facial sin cirugía"
                className="w-full"
              />
              {errors.curiosityTopic && (
                <p className="text-sm text-red-500">{errors.curiosityTopic.message}</p>
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