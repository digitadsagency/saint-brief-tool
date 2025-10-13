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
import { X, Plus, Star, DollarSign, Gift } from "lucide-react"
import { proceduresBusinessSchema, type ProceduresBusiness } from "@/lib/schemas"
import { type Language, getTranslation } from "@/lib/i18n"

interface FormStep3Props {
  data: ProceduresBusiness
  language: Language
  onSubmit: (data: ProceduresBusiness) => void
  onNext: () => void
  onBack: () => void
}

export default function FormStep3({ data, language, onSubmit, onNext, onBack }: FormStep3Props) {
  const [favoriteProcedures, setFavoriteProcedures] = React.useState<string[]>(data.favoriteProcedures || [])
  const [highValueServices, setHighValueServices] = React.useState<string[]>(data.highValueServices || [])
  const [accessibleServices, setAccessibleServices] = React.useState<string[]>(data.accessibleServices || [])
  
  const [newFavorite, setNewFavorite] = React.useState("")
  const [newHighValue, setNewHighValue] = React.useState("")
  const [newAccessible, setNewAccessible] = React.useState("")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<ProceduresBusiness>({
    resolver: zodResolver(proceduresBusinessSchema),
    defaultValues: data,
    mode: "onChange"
  })

  const watchedFavoriteProcedures = React.useMemo(() => watch("favoriteProcedures") || [], [watch])
  const watchedHighValueServices = React.useMemo(() => watch("highValueServices") || [], [watch])
  const watchedAccessibleServices = React.useMemo(() => watch("accessibleServices") || [], [watch])

  React.useEffect(() => {
    setFavoriteProcedures(watchedFavoriteProcedures)
  }, [watchedFavoriteProcedures])

  React.useEffect(() => {
    setHighValueServices(watchedHighValueServices)
  }, [watchedHighValueServices])

  React.useEffect(() => {
    setAccessibleServices(watchedAccessibleServices)
  }, [watchedAccessibleServices])

  const addItem = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, fieldName: string, clearInput: () => void) => {
    if (item.trim() && !list.includes(item.trim())) {
      const newList = [...list, item.trim()]
      setList(newList)
      setValue(fieldName as any, newList, { shouldValidate: true })
      clearInput()
    }
  }

  const removeItem = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, fieldName: string) => {
    const newList = list.filter(i => i !== item)
    setList(newList)
    setValue(fieldName as any, newList, { shouldValidate: true })
  }

  const onFormSubmit = (formData: ProceduresBusiness) => {
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
            <Star className="h-5 w-5" />
            {getTranslation(language, "step3Title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-8">
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            {/* Procedimientos favoritos */}
            <div className="space-y-4">
              <Label className="text-base font-medium flex items-center gap-2">
                <Star className="h-4 w-4" />
                Procedimientos principales *
              </Label>
              <p className="text-sm text-muted-foreground">
                👉 Menciona los tratamientos o procedimientos que más realizas o con los que más te identificas.
              </p>
              
              <div className="flex gap-2">
                <Input
                  value={newFavorite}
                  onChange={(e) => setNewFavorite(e.target.value)}
                  placeholder="Ej: Limpieza facial profunda"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addItem(newFavorite, favoriteProcedures, setFavoriteProcedures, "favoriteProcedures", () => setNewFavorite("")))}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={() => addItem(newFavorite, favoriteProcedures, setFavoriteProcedures, "favoriteProcedures", () => setNewFavorite(""))} 
                  size="icon"
                  disabled={favoriteProcedures.length >= 3}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Procedimientos favoritos:</Label>
                <div className="space-y-2">
                  {favoriteProcedures.map((procedure, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">{procedure}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(procedure, favoriteProcedures, setFavoriteProcedures, "favoriteProcedures")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                {favoriteProcedures.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay procedimientos agregados. Agrega al menos 2 para continuar.
                  </p>
                )}
              </div>
              {errors.favoriteProcedures && (
                <p className="text-sm text-red-500">{errors.favoriteProcedures.message}</p>
              )}
            </div>

            {/* Servicios de alto valor */}
            <div className="space-y-4">
              <Label className="text-base font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Procedimientos de mayor valor o margen *
              </Label>
              <p className="text-sm text-muted-foreground">
                👉 Que procedimiento o procedimientos que te dejan mas margen de ganancia.
              </p>
              
              <div className="flex gap-2">
                <Input
                  value={newHighValue}
                  onChange={(e) => setNewHighValue(e.target.value)}
                  placeholder="Ej: Láser fraccionado"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addItem(newHighValue, highValueServices, setHighValueServices, "highValueServices", () => setNewHighValue("")))}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={() => addItem(newHighValue, highValueServices, setHighValueServices, "highValueServices", () => setNewHighValue(""))} 
                  size="icon"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Servicios de alto valor:</Label>
                <div className="flex flex-wrap gap-2">
                  {highValueServices.map((service, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {service}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeItem(service, highValueServices, setHighValueServices, "highValueServices")}
                      />
                    </Badge>
                  ))}
                </div>
                {highValueServices.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay servicios agregados. Agrega al menos uno para continuar.
                  </p>
                )}
              </div>
              {errors.highValueServices && (
                <p className="text-sm text-red-500">{errors.highValueServices.message}</p>
              )}
            </div>

            {/* Servicios accesibles */}
            <div className="space-y-4">
              <Label className="text-base font-medium flex items-center gap-2">
                <Gift className="h-4 w-4" />
                Procedimientos Gancho *
              </Label>
              <p className="text-sm text-muted-foreground">
                👉 Procedimientos que son fáciles de vender y más pacientes buscan constantemente.
              </p>
              
              <div className="flex gap-2">
                <Input
                  value={newAccessible}
                  onChange={(e) => setNewAccessible(e.target.value)}
                  placeholder="Ej: Consulta dermatológica"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addItem(newAccessible, accessibleServices, setAccessibleServices, "accessibleServices", () => setNewAccessible("")))}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={() => addItem(newAccessible, accessibleServices, setAccessibleServices, "accessibleServices", () => setNewAccessible(""))} 
                  size="icon"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Servicios accesibles:</Label>
                <div className="flex flex-wrap gap-2">
                  {accessibleServices.map((service, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {service}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeItem(service, accessibleServices, setAccessibleServices, "accessibleServices")}
                      />
                    </Badge>
                  ))}
                </div>
                {accessibleServices.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay servicios agregados. Agrega al menos uno para continuar.
                  </p>
                )}
              </div>
              {errors.accessibleServices && (
                <p className="text-sm text-red-500">{errors.accessibleServices.message}</p>
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