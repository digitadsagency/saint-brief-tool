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
import { X, Plus, Target, Calendar, Users } from "lucide-react"
import { marketingGoalsSchema, type MarketingGoals } from "@/lib/schemas"
import { type Language, getTranslation } from "@/lib/i18n"

interface FormStep6Props {
  data: MarketingGoals
  language: Language
  onSubmit: (data: MarketingGoals) => void
  onNext: () => void
  onBack: () => void
}

const objectiveOptions = [
  { value: "mas_consultas", label: "masConsultas" },
  { value: "mejor_reputacion", label: "mejorReputacion" },
  { value: "nuevos_servicios", label: "nuevosServicios" },
  { value: "expansion_geografica", label: "expansionGeografica" },
  { value: "liderazgo_opinion", label: "liderazgoOpinion" }
]

export default function FormStep6({ data, language, onSubmit, onNext, onBack }: FormStep6Props) {
  const [inspiringAccounts, setInspiringAccounts] = React.useState<string[]>(data.inspiringAccounts || [])
  const [newAccount, setNewAccount] = React.useState("")
  const [selectedObjectives, setSelectedObjectives] = React.useState<string[]>(data.mainObjective || [])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<MarketingGoals>({
    resolver: zodResolver(marketingGoalsSchema),
    defaultValues: data,
    mode: "onChange"
  })

  const watchedInspiringAccounts = React.useMemo(() => watch("inspiringAccounts") || [], [watch])

  React.useEffect(() => {
    setInspiringAccounts(watchedInspiringAccounts)
  }, [watchedInspiringAccounts])

  const addAccount = () => {
    if (newAccount.trim() && !inspiringAccounts.includes(newAccount.trim())) {
      const newAccounts = [...inspiringAccounts, newAccount.trim()]
      setInspiringAccounts(newAccounts)
      setValue("inspiringAccounts", newAccounts, { shouldValidate: true, shouldDirty: true })
      setNewAccount("")
    }
  }

  const removeAccount = (account: string) => {
    const newAccounts = inspiringAccounts.filter(a => a !== account)
    setInspiringAccounts(newAccounts)
    setValue("inspiringAccounts", newAccounts, { shouldValidate: true, shouldDirty: true })
  }

  const toggleObjective = (objective: string) => {
    const newObjectives = selectedObjectives.includes(objective)
      ? selectedObjectives.filter(obj => obj !== objective)
      : [...selectedObjectives, objective]
    
    setSelectedObjectives(newObjectives)
    setValue("mainObjective", newObjectives as any, { shouldValidate: true, shouldDirty: true })
  }

  const onFormSubmit = (formData: MarketingGoals) => {
    onSubmit(formData)
    onNext()
  }

  // Debug temporal para ver el estado del formulario
  React.useEffect(() => {
    console.log("FormStep6 - isValid:", isValid)
    console.log("FormStep6 - errors:", errors)
    console.log("FormStep6 - watched values:", {
      mainObjective: watch("mainObjective"),
      monthlyNewConsultations: watch("monthlyNewConsultations"),
      inspiringAccounts: watch("inspiringAccounts")
    })
  }, [isValid, errors, watch])

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
            <Target className="h-5 w-5" />
            {getTranslation(language, "step6Title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-8">
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            {/* Objetivos principales */}
            <div className="space-y-2">
              <Label className="text-base font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                {getTranslation(language, "mainObjective")} *
              </Label>
              <p className="text-sm text-muted-foreground">
                Selecciona todos los objetivos que te interesan para los próximos 6 meses
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {objectiveOptions.map((option) => (
                  <div 
                    key={option.value}
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedObjectives.includes(option.value)
                        ? 'border-[#C1FFDD] bg-[#C1FFDD]/20'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleObjective(option.value)}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 border-2 rounded ${
                        selectedObjectives.includes(option.value)
                          ? 'bg-[#C1FFDD] border-[#C1FFDD]'
                          : 'border-gray-300'
                      }`}>
                        {selectedObjectives.includes(option.value) && (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <span className="font-medium">{getTranslation(language, option.label as any)}</span>
                    </div>
                  </div>
                ))}
              </div>
              {errors.mainObjective && (
                <p className="text-sm text-red-500">{errors.mainObjective.message}</p>
              )}
            </div>

            {/* Consultas nuevas mensuales */}
            <div className="space-y-2">
              <Label htmlFor="monthlyNewConsultations" className="text-base font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {getTranslation(language, "monthlyNewConsultations")} *
              </Label>
              <Input
                id="monthlyNewConsultations"
                type="number"
                min="1"
                max="1000"
                {...register("monthlyNewConsultations", { valueAsNumber: true })}
                placeholder="Ej: 50"
                className="w-full"
              />
              {errors.monthlyNewConsultations && (
                <p className="text-sm text-red-500">{errors.monthlyNewConsultations.message}</p>
              )}
            </div>

            {/* Cuentas inspiradoras */}
            <div className="space-y-4">
              <Label className="text-base font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                {getTranslation(language, "inspiringAccounts")} *
              </Label>
              <p className="text-sm text-muted-foreground">
                Médicos, marcas o cuentas que te inspiran en redes sociales
              </p>
              
              <div className="flex gap-2">
                <Input
                  value={newAccount}
                  onChange={(e) => setNewAccount(e.target.value)}
                  placeholder="Ej: @dermatologa_moderna, @dr_skincare"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAccount())}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={addAccount} 
                  size="icon"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Cuentas inspiradoras:</Label>
                <div className="flex flex-wrap gap-2">
                  {inspiringAccounts.map((account, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {account}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeAccount(account)}
                      />
                    </Badge>
                  ))}
                </div>
                {inspiringAccounts.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay cuentas agregadas. Agrega al menos una para continuar.
                  </p>
                )}
              </div>
              {errors.inspiringAccounts && (
                <p className="text-sm text-red-500">{errors.inspiringAccounts.message}</p>
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