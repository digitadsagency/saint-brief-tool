"use client"

import type { ComponentType, ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, GitBranch, Settings } from "lucide-react"
import type { PremiumAnswers } from "@/lib/briefs/schemas"
import {
  PREMIUM_FUNNEL,
  PREMIUM_GOALS,
  PREMIUM_LIMITS,
  PREMIUM_NOSHOW,
  PREMIUM_TOOLS,
} from "@/lib/briefs/types"
import { FieldInput, FieldTextarea, OptionCards, Question, StepNav } from "./fields"

function Shell({
  icon: Icon,
  title,
  children,
}: {
  icon: ComponentType<{ className?: string }>
  title: string
  children: ReactNode
}) {
  return (
    <Card className="bg-white border-gray-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-[#CADCFF] to-[#C1FFDD]">
        <CardTitle className="text-black flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-8 space-y-6">{children}</CardContent>
    </Card>
  )
}

export function PremiumGoalStep({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: PremiumAnswers
  onChange: (data: PremiumAnswers) => void
  onNext: () => void
  onBack: () => void
}) {
  return (
    <Shell icon={Target} title="Objetivo y capacidad">
      <p className="text-sm text-muted-foreground">
        Ahora vamos a conocer cómo funciona tu proceso de pacientes para diseñar seguimiento, automatización y medición.
      </p>

      <Question label="¿Qué quieres que haya cambiado en tu práctica dentro de los próximos 6–12 meses?" hint="Elige máximo 3.">
        <OptionCards
          multiple
          max={3}
          options={PREMIUM_GOALS}
          values={data.goals}
          onChange={(values) => onChange({ ...data, goals: values as string[] })}
        />
        {data.goals.includes("Otro") && (
          <FieldInput value={data.goalsOther} onChange={(e) => onChange({ ...data, goalsOther: e.target.value })} placeholder="Otro" />
        )}
      </Question>

      <Question
        label="Si conoces los números, ¿cuál sería una meta razonable?"
        hint='Ej. pasar de 20 a 30 consultas mensuales. Si no sabes, escribe “No sé”.'
      >
        <FieldTextarea value={data.reasonableGoal} onChange={(e) => onChange({ ...data, reasonableGoal: e.target.value })} />
      </Question>

      <Question label="Actualmente, ¿aproximadamente cuántas consultas de valoración realizas por semana y cuántas PODRÍAS atender?">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldInput
            value={data.consultasActual}
            onChange={(e) => onChange({ ...data, consultasActual: e.target.value })}
            placeholder="Actuales"
          />
          <FieldInput
            value={data.consultasMax}
            onChange={(e) => onChange({ ...data, consultasMax: e.target.value })}
            placeholder="Capacidad máxima"
          />
        </div>
      </Question>

      <Question label="¿Existe actualmente alguna limitante para crecer?">
        <OptionCards
          multiple
          options={PREMIUM_LIMITS}
          values={data.limitations}
          onChange={(values) => onChange({ ...data, limitations: values as string[] })}
        />
        {data.limitations.includes("Otra") && (
          <FieldInput
            value={data.limitationOther}
            onChange={(e) => onChange({ ...data, limitationOther: e.target.value })}
            placeholder="Otra"
          />
        )}
      </Question>

      <StepNav onBack={onBack} onNext={onNext} />
    </Shell>
  )
}

export function PremiumFunnelStep({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: PremiumAnswers
  onChange: (data: PremiumAnswers) => void
  onNext: () => void
  onBack: () => void
}) {
  const usesCrm = data.tools.includes("CRM") || data.tools.includes("Software médico")

  return (
    <Shell icon={GitBranch} title="Funnel y calificación">
      <Question label="Cuando hoy llega un paciente nuevo por redes o publicidad, ¿qué sucede normalmente?">
        <OptionCards
          multiple
          options={PREMIUM_FUNNEL}
          values={data.funnelSteps}
          onChange={(values) => onChange({ ...data, funnelSteps: values as string[] })}
        />
        {data.funnelSteps.includes("Otro") && (
          <FieldInput value={data.funnelOther} onChange={(e) => onChange({ ...data, funnelOther: e.target.value })} placeholder="Otro" />
        )}
      </Question>

      <Question
        label="¿Quién participa actualmente en este proceso?"
        hint="Nombre + función. Ej. Ana — WhatsApp y agenda / Dr. X — valoración/cierre."
      >
        <FieldTextarea value={data.team} onChange={(e) => onChange({ ...data, team: e.target.value })} rows={4} />
      </Question>

      <Question label="¿Qué herramientas utilizan actualmente?">
        <OptionCards
          multiple
          options={PREMIUM_TOOLS}
          values={data.tools}
          onChange={(values) => onChange({ ...data, tools: values as string[] })}
        />
        {usesCrm && (
          <FieldInput
            value={data.crmName}
            onChange={(e) => onChange({ ...data, crmName: e.target.value })}
            placeholder="¿Cuál CRM o software?"
          />
        )}
      </Question>

      <Question
        label="Antes de darle una cita a alguien, ¿qué información necesitan conocer obligatoriamente?"
        hint="Ej. edad, procedimiento de interés, IMC, fotografías, ciudad, presupuesto, antecedentes..."
      >
        <FieldTextarea value={data.requiredInfo} onChange={(e) => onChange({ ...data, requiredInfo: e.target.value })} />
      </Question>

      <Question
        label="¿Existe algún criterio por el cual NO agendarían una valoración?"
        hint='Si no existe, escribe “Ninguno”.'
      >
        <FieldTextarea value={data.noScheduleCriteria} onChange={(e) => onChange({ ...data, noScheduleCriteria: e.target.value })} />
      </Question>

      <StepNav onBack={onBack} onNext={onNext} />
    </Shell>
  )
}

export function PremiumSystemsStep({
  data,
  onChange,
  onNext,
  onBack,
  submitting,
}: {
  data: PremiumAnswers
  onChange: (data: PremiumAnswers) => void
  onNext: () => void
  onBack: () => void
  submitting?: boolean
}) {
  return (
    <Shell icon={Settings} title="Valoración y sistemas">
      <Question label="¿Cómo funciona actualmente la valoración?">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldInput
            value={data.valuationPrice}
            onChange={(e) => onChange({ ...data, valuationPrice: e.target.value })}
            placeholder="Precio"
          />
          <FieldInput
            value={data.valuationDuration}
            onChange={(e) => onChange({ ...data, valuationDuration: e.target.value })}
            placeholder="Duración aproximada"
          />
        </div>
      </Question>

      <Question label="Modalidad">
        <OptionCards
          options={["Presencial", "Virtual", "Ambas"]}
          value={data.valuationMode}
          onChange={(value) => onChange({ ...data, valuationMode: value as string })}
        />
      </Question>

      <Question label="¿Se paga antes?">
        <OptionCards
          options={["Sí", "No"]}
          value={data.paidBefore}
          onChange={(value) => onChange({ ...data, paidBefore: value as string })}
        />
      </Question>

      <Question label="¿Con cuánta anticipación?">
        <FieldInput value={data.anticipation} onChange={(e) => onChange({ ...data, anticipation: e.target.value })} />
      </Question>

      <Question label="Horarios/días disponibles">
        <FieldInput value={data.availableHours} onChange={(e) => onChange({ ...data, availableHours: e.target.value })} />
      </Question>

      <Question label="¿Qué sucede si el paciente NO agenda o NO asiste?">
        <OptionCards
          multiple
          options={PREMIUM_NOSHOW}
          values={data.noShowProcess}
          onChange={(values) => onChange({ ...data, noShowProcess: values as string[] })}
        />
        {data.noShowProcess.includes("Otro") && (
          <FieldInput value={data.noShowOther} onChange={(e) => onChange({ ...data, noShowOther: e.target.value })} />
        )}
        <FieldTextarea
          value={data.noShowDescription}
          onChange={(e) => onChange({ ...data, noShowDescription: e.target.value })}
          placeholder="Si tienen un proceso específico, descríbelo brevemente."
        />
      </Question>

      <Question
        label="Comparte cualquier material que Saint deba respetar al construir el sistema"
        hint="Opcional. Links a cuestionarios, políticas, precios, scripts, formularios o restricciones."
      >
        <FieldTextarea
          value={data.existingMaterials}
          onChange={(e) => onChange({ ...data, existingMaterials: e.target.value })}
          rows={4}
        />
      </Question>

      <Question label="¿Existe alguna regla médica, operativa o legal importante que Saint deba conocer antes de automatizar el proceso?">
        <FieldTextarea value={data.rules} onChange={(e) => onChange({ ...data, rules: e.target.value })} />
      </Question>

      <StepNav onBack={onBack} onNext={onNext} nextLabel="Enviar Brief" submitting={submitting} />
    </Shell>
  )
}
