"use client"

import type { ComponentType, ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Trophy, Camera, Users, Briefcase, Megaphone, Heart } from "lucide-react"
import type { CoreAnswers } from "@/lib/briefs/schemas"
import {
  CORE_AD_PLATFORMS,
  CORE_BRAND,
  CORE_DIFFERENTIATORS,
  CORE_DOCUMENTED_CASES,
  CORE_MANAGE,
  CORE_PROOF,
  CORE_RESPONSE_TIMES,
  CORE_WHO_RESPONDS,
  CORE_WHY_GROW,
} from "@/lib/briefs/types"
import { ChipList, FieldInput, FieldTextarea, OptionCards, Question, StepNav } from "./fields"

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

export function CoreGrowStep({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: CoreAnswers
  onChange: (data: CoreAnswers) => void
  onNext: () => void
  onBack: () => void
}) {
  return (
    <Shell icon={Star} title="Qué queremos hacer crecer">
      <p className="text-sm text-muted-foreground">
        No queremos conocer todos los procedimientos que realizas. Queremos entender cuáles vale la pena hacer crecer.
      </p>

      <Question
        label="Si Saint pudiera ayudarte a generar MÁS pacientes para sólo 3 procedimientos/servicios durante los próximos 12 meses, ¿cuáles elegirías?"
        hint="No escribas toda tu cartera. Elige máximo 3."
        required
      >
        <div className="space-y-3">
          <FieldInput value={data.growth1} onChange={(e) => onChange({ ...data, growth1: e.target.value })} placeholder="1." />
          <FieldInput value={data.growth2} onChange={(e) => onChange({ ...data, growth2: e.target.value })} placeholder="2." />
          <FieldInput value={data.growth3} onChange={(e) => onChange({ ...data, growth3: e.target.value })} placeholder="3." />
        </div>
      </Question>

      <Question
        label="De esos tres, ¿cuál sería tu #1?"
        hint="El procedimiento/servicio que más te interesaría hacer crecer si tuvieras que elegir solamente uno."
        required
      >
        <FieldInput value={data.numberOne} onChange={(e) => onChange({ ...data, numberOne: e.target.value })} />
      </Question>

      <Question label="¿Por qué quieres hacer crecer ese procedimiento?">
        <OptionCards
          multiple
          options={CORE_WHY_GROW}
          values={data.whyGrow}
          onChange={(values) => onChange({ ...data, whyGrow: values as string[] })}
        />
        {data.whyGrow.includes("Otro") && (
          <FieldInput
            value={data.whyGrowOther}
            onChange={(e) => onChange({ ...data, whyGrowOther: e.target.value })}
            placeholder="Otro"
          />
        )}
      </Question>

      <Question label="Actualmente, ¿aproximadamente cuántos casos/pacientes al mes tienes de cada uno?" hint="Aunque sea aproximado.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">#1</p>
            <FieldInput value={data.cases1} onChange={(e) => onChange({ ...data, cases1: e.target.value })} />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">#2</p>
            <FieldInput value={data.cases2} onChange={(e) => onChange({ ...data, cases2: e.target.value })} />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">#3</p>
            <FieldInput value={data.cases3} onChange={(e) => onChange({ ...data, cases3: e.target.value })} />
          </div>
        </div>
      </Question>

      <Question label="¿Cuántos MÁS podrías atender al mes sin afectar tu operación?">
        <FieldInput
          value={data.additionalCapacity}
          onChange={(e) => onChange({ ...data, additionalCapacity: e.target.value })}
          placeholder="pacientes/procedimientos adicionales"
        />
      </Question>

      <StepNav onBack={onBack} onNext={onNext} />
    </Shell>
  )
}

export function CoreWhyYouStep({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: CoreAnswers
  onChange: (data: CoreAnswers) => void
  onNext: () => void
  onBack: () => void
}) {
  return (
    <Shell icon={Trophy} title="Por qué alguien debería elegirte">
      <Question label="Para cada afirmación, marca si REALMENTE aplica a tu práctica.">
        <OptionCards
          multiple
          options={CORE_DIFFERENTIATORS}
          values={data.differentiators}
          onChange={(values) => onChange({ ...data, differentiators: values as string[] })}
        />
      </Question>

      <Question
        label="De las opciones que marcaste, explícanos las 1–3 más fuertes con datos concretos."
        hint='Evita “trato personalizado”, “calidad” o “empatía”. Buscamos técnica, experiencia, casos, resultados, tecnología, proceso o credenciales.'
        required
      >
        <FieldTextarea
          value={data.strongestExplain}
          onChange={(e) => onChange({ ...data, strongestExplain: e.target.value })}
          rows={4}
        />
      </Question>

      <Question
        label="¿Existe algo que hagas diferente DURANTE el procedimiento, consulta o tratamiento?"
        hint='Si no existe algo realmente diferente, escribe “No sé / ninguno identificado”.'
      >
        <FieldTextarea
          value={data.somethingDifferent}
          onChange={(e) => onChange({ ...data, somethingDifferent: e.target.value })}
        />
      </Question>

      <StepNav onBack={onBack} onNext={onNext} />
    </Shell>
  )
}

export function CoreProofStep({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: CoreAnswers
  onChange: (data: CoreAnswers) => void
  onNext: () => void
  onBack: () => void
}) {
  return (
    <Shell icon={Camera} title="Proof">
      <Question label="¿Qué evidencia tienes actualmente?">
        <OptionCards
          multiple
          options={CORE_PROOF}
          values={data.proof}
          onChange={(values) => onChange({ ...data, proof: values as string[] })}
        />
      </Question>

      <Question label="¿Aproximadamente cuántos casos documentados tienes del procedimiento #1?">
        <OptionCards
          options={CORE_DOCUMENTED_CASES}
          value={data.documentedCases}
          onChange={(value) => onChange({ ...data, documentedCases: value as string })}
        />
      </Question>

      <StepNav onBack={onBack} onNext={onNext} />
    </Shell>
  )
}

export function CorePatientStep({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: CoreAnswers
  onChange: (data: CoreAnswers) => void
  onNext: () => void
  onBack: () => void
}) {
  return (
    <Shell icon={Users} title="Paciente y compra">
      <Question label="¿Quién suele ser tu paciente para el servicio #1?">
        <div className="space-y-4">
          <FieldInput
            value={data.patientAge}
            onChange={(e) => onChange({ ...data, patientAge: e.target.value })}
            placeholder="Edad aproximada"
          />
          <OptionCards
            options={["Mujer", "Hombre", "Ambos"]}
            value={data.patientGender}
            onChange={(value) => onChange({ ...data, patientGender: value as string })}
          />
          <OptionCards
            options={["Local", "Nacional", "Internacional", "Mezcla"]}
            value={data.patientOrigin}
            onChange={(value) => onChange({ ...data, patientOrigin: value as string })}
          />
        </div>
      </Question>

      <Question label="¿Cuáles son las 3 preguntas, miedos u objeciones que más escuchas antes de que un paciente compre/agende?">
        <div className="space-y-3">
          <FieldTextarea value={data.objection1} onChange={(e) => onChange({ ...data, objection1: e.target.value })} placeholder="1." rows={2} />
          <FieldTextarea value={data.objection2} onChange={(e) => onChange({ ...data, objection2: e.target.value })} placeholder="2." rows={2} />
          <FieldTextarea value={data.objection3} onChange={(e) => onChange({ ...data, objection3: e.target.value })} placeholder="3." rows={2} />
        </div>
      </Question>

      <Question label="¿Cuál es aproximadamente el precio del servicio/procedimiento principal?" hint="Un rango está perfecto.">
        <FieldInput value={data.price} onChange={(e) => onChange({ ...data, price: e.target.value })} />
      </Question>

      <StepNav onBack={onBack} onNext={onNext} />
    </Shell>
  )
}

export function CoreOpsStep({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: CoreAnswers
  onChange: (data: CoreAnswers) => void
  onNext: () => void
  onBack: () => void
}) {
  return (
    <Shell icon={Briefcase} title="Operación comercial">
      <Question label="Aproximadamente, ¿cuántas consultas/pacientes nuevos recibes actualmente al mes?">
        <FieldInput value={data.newPatientsMonth} onChange={(e) => onChange({ ...data, newPatientsMonth: e.target.value })} />
      </Question>

      <Question label="¿Quién responde actualmente a los pacientes que llegan por redes/anuncios?">
        <OptionCards
          options={CORE_WHO_RESPONDS}
          value={data.whoResponds}
          onChange={(value) => onChange({ ...data, whoResponds: value as string })}
        />
        {data.whoResponds === "Otro" && (
          <FieldInput
            value={data.whoRespondsOther}
            onChange={(e) => onChange({ ...data, whoRespondsOther: e.target.value })}
            placeholder="Especifica"
          />
        )}
      </Question>

      <Question label="Normalmente, ¿qué tan rápido responden?">
        <OptionCards
          options={CORE_RESPONSE_TIMES}
          value={data.responseTime}
          onChange={(value) => onChange({ ...data, responseTime: value as string })}
        />
      </Question>

      <Question label="¿Cómo gestionan actualmente esos pacientes?">
        <OptionCards
          multiple
          options={CORE_MANAGE}
          values={data.howManage}
          onChange={(values) => onChange({ ...data, howManage: values as string[] })}
        />
      </Question>

      <StepNav onBack={onBack} onNext={onNext} />
    </Shell>
  )
}

export function CoreMarketingStep({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: CoreAnswers
  onChange: (data: CoreAnswers) => void
  onNext: () => void
  onBack: () => void
}) {
  return (
    <Shell icon={Megaphone} title="Marketing anterior">
      <Question label="¿Has realizado publicidad pagada anteriormente?">
        <OptionCards
          options={["Sí", "No"]}
          value={data.hasPaidAds}
          onChange={(value) => onChange({ ...data, hasPaidAds: value as string })}
        />
      </Question>

      {data.hasPaidAds === "Sí" && (
        <>
          <Question label="¿Dónde?">
            <OptionCards
              multiple
              options={CORE_AD_PLATFORMS}
              values={data.adsWhere}
              onChange={(values) => onChange({ ...data, adsWhere: values as string[] })}
            />
          </Question>
          <Question label="¿Cuánto inviertes aproximadamente al mes?">
            <FieldInput value={data.adsInvestment} onChange={(e) => onChange({ ...data, adsInvestment: e.target.value })} />
          </Question>
          <Question label="¿Qué procedimiento/servicio promocionabas?">
            <FieldInput value={data.adsService} onChange={(e) => onChange({ ...data, adsService: e.target.value })} />
          </Question>
          <Question label="¿Qué recuerdas que funcionó particularmente bien?">
            <FieldTextarea value={data.adsWorked} onChange={(e) => onChange({ ...data, adsWorked: e.target.value })} />
          </Question>
          <Question label="¿Qué recuerdas que NO funcionó?">
            <FieldTextarea value={data.adsDidntWork} onChange={(e) => onChange({ ...data, adsDidntWork: e.target.value })} />
          </Question>
        </>
      )}

      <StepNav onBack={onBack} onNext={onNext} />
    </Shell>
  )
}

export function CoreBrandStep({
  data,
  onChange,
  onNext,
  onBack,
  nextLabel = "Enviar Brief",
  submitting,
}: {
  data: CoreAnswers
  onChange: (data: CoreAnswers) => void
  onNext: () => void
  onBack: () => void
  nextLabel?: string
  submitting?: boolean
}) {
  return (
    <Shell icon={Heart} title="Dirección de marca">
      <Question label="¿Cómo quieres que se perciba tu marca?" hint="Elige máximo 3.">
        <OptionCards
          multiple
          max={3}
          options={CORE_BRAND}
          values={data.brandPerception}
          onChange={(values) => onChange({ ...data, brandPerception: values as string[] })}
        />
        {data.brandPerception.includes("Otra") && (
          <FieldInput
            value={data.brandOther}
            onChange={(e) => onChange({ ...data, brandOther: e.target.value })}
            placeholder="Otra"
          />
        )}
      </Question>

      <Question label="Comparte hasta 3 cuentas/médicos/marcas cuya comunicación te guste." hint="Opcional.">
        <ChipList
          items={data.inspiringAccounts}
          onAdd={(account) => {
            if (data.inspiringAccounts.length >= 3) return
            onChange({ ...data, inspiringAccounts: [...data.inspiringAccounts, account] })
          }}
          onRemove={(account) =>
            onChange({ ...data, inspiringAccounts: data.inspiringAccounts.filter((item) => item !== account) })
          }
          placeholder="@cuenta"
        />
      </Question>

      <StepNav onBack={onBack} onNext={onNext} nextLabel={nextLabel} submitting={submitting} />
    </Shell>
  )
}
