"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "lucide-react"
import type { BasicInfo } from "@/lib/briefs/schemas"
import type { BriefType } from "@/lib/briefs/types"
import { ChipList, FieldInput, Question, StepNav } from "./fields"

export function BasicStep({
  data,
  briefType,
  onChange,
  onNext,
  onBack,
}: {
  data: BasicInfo
  briefType: BriefType
  onChange: (data: BasicInfo) => void
  onNext: () => void
  onBack: () => void
}) {
  return (
    <Card className="bg-white border-gray-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-[#CADCFF] to-[#C1FFDD]">
        <CardTitle className="text-black flex items-center gap-2">
          <User className="h-5 w-5" />
          Datos básicos
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-8 space-y-6">
        <Question label="Nombre completo" required>
          <FieldInput
            value={data.fullName}
            onChange={(e) => onChange({ ...data, fullName: e.target.value })}
            placeholder="Ej: Dr. Juan Pérez González"
          />
        </Question>

        {briefType !== "ads" && (
          <Question
            label="¿Cómo prefieres que aparezca tu nombre profesionalmente?"
            hint="Ej. Dr. Juan Pérez / Juan Pérez MD / Dr. Juan Pérez González"
            required
          >
            <FieldInput
              value={data.preferredName}
              onChange={(e) => onChange({ ...data, preferredName: e.target.value })}
              placeholder="Ej: Dr. Juan Pérez"
            />
          </Question>
        )}

        <Question
          label={briefType === "ads" ? "Especialidad / subespecialidad" : "Especialidad y subespecialidad"}
          hint={briefType === "ads" ? undefined : "Escribe únicamente especialidades/subespecialidades médicas formales."}
          required
        >
          <FieldInput
            value={data.specialty}
            onChange={(e) => onChange({ ...data, specialty: e.target.value })}
            placeholder="Ej: Cirugía plástica, Dermatología estética"
          />
        </Question>

        <Question label="¿En qué ciudad(es) atiendes actualmente?" required>
          <ChipList
            items={data.cities}
            onAdd={(city) => onChange({ ...data, cities: [...data.cities, city] })}
            onRemove={(city) => onChange({ ...data, cities: data.cities.filter((item) => item !== city) })}
            placeholder="Agregar ciudad"
          />
        </Question>

        <Question label="¿Cuántos años llevas ejerciendo tu especialidad?" required>
          <FieldInput
            value={data.yearsExperience}
            onChange={(e) => onChange({ ...data, yearsExperience: e.target.value })}
            placeholder="Ej: 8"
          />
        </Question>

        <StepNav onBack={onBack} onNext={onNext} hideBack />
      </CardContent>
    </Card>
  )
}
