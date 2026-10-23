"use client"

import type { ComponentType, ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Megaphone, BadgeDollarSign, MessageSquare, ImageIcon } from "lucide-react"
import type { AdsAnswers } from "@/lib/briefs/schemas"
import {
  ADS_ASSETS,
  ADS_CASE_RANGES,
  ADS_EVIDENCE,
  ADS_EXTRA_RANGES,
  ADS_FOLLOW_UP,
  ADS_SCHEDULE,
  ADS_WHO_RESPONDS,
  ADS_WHY_GROW,
  RESPONSE_TIMES,
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

export function AdsGrowStep({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: AdsAnswers
  onChange: (data: AdsAnswers) => void
  onNext: () => void
  onBack: () => void
}) {
  return (
    <Shell icon={Megaphone} title="Qué queremos impulsar">
      <Question
        label="Si durante los próximos 3–6 meses Saint pudiera ayudarte a generar más pacientes para solamente DOS procedimientos o servicios, ¿cuáles elegirías?"
        hint="No escribas todos los servicios que realizas. Elige los dos que comercialmente más te interesa hacer crecer."
        required
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldInput
            value={data.procedure1}
            onChange={(e) => onChange({ ...data, procedure1: e.target.value })}
            placeholder="#1"
          />
          <FieldInput
            value={data.procedure2}
            onChange={(e) => onChange({ ...data, procedure2: e.target.value })}
            placeholder="#2"
          />
        </div>
      </Question>

      <Question label="Si tuvieras que elegir solamente UNO, ¿cuál sería?" required>
        <FieldInput
          value={data.mainService}
          onChange={(e) => onChange({ ...data, mainService: e.target.value })}
          placeholder="Servicio principal"
        />
      </Question>

      <Question label="¿Por qué quieres impulsar principalmente ese servicio?" hint="Elige máximo 3." required>
        <OptionCards
          multiple
          max={3}
          options={ADS_WHY_GROW}
          values={data.whyGrow}
          onChange={(values) => onChange({ ...data, whyGrow: values as string[] })}
        />
        {data.whyGrow.includes("Otro") && (
          <FieldInput
            value={data.whyGrowOther}
            onChange={(e) => onChange({ ...data, whyGrowOther: e.target.value })}
            placeholder="Especifica"
          />
        )}
      </Question>

      <Question label="Actualmente, ¿cuántos pacientes/casos de ese servicio realizas aproximadamente al mes?" required>
        <OptionCards
          options={ADS_CASE_RANGES}
          value={data.currentCases}
          onChange={(value) => onChange({ ...data, currentCases: value as string })}
        />
      </Question>

      <Question label="¿Cuántos casos ADICIONALES podrías atender al mes actualmente?" required>
        <OptionCards
          options={ADS_EXTRA_RANGES}
          value={data.additionalCapacity}
          onChange={(value) => onChange({ ...data, additionalCapacity: value as string })}
        />
      </Question>

      <StepNav onBack={onBack} onNext={onNext} />
    </Shell>
  )
}

export function AdsEvidenceStep({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: AdsAnswers
  onChange: (data: AdsAnswers) => void
  onNext: () => void
  onBack: () => void
}) {
  return (
    <Shell icon={ImageIcon} title="Evidencia y diferenciación">
      <Question label="¿Qué evidencia tienes específicamente del servicio que quieres anunciar?" required>
        <OptionCards
          multiple
          options={ADS_EVIDENCE}
          values={data.evidence}
          onChange={(values) => onChange({ ...data, evidence: values as string[] })}
        />
      </Question>

      <Question
        label="¿Qué razón CONCRETA podría tener un paciente para elegirte para este servicio?"
        hint='Evita “trato humano”, “calidad” o “empatía”. Si no identificas ninguna, escribe “No sé”.'
        required
      >
        <FieldTextarea
          value={data.whyChooseYou}
          onChange={(e) => onChange({ ...data, whyChooseYou: e.target.value })}
          placeholder="Experiencia, casos, técnica, tecnología, recuperación, especialización..."
        />
      </Question>

      <Question
        label="¿Existe alguna técnica, tecnología, proceso o característica particular relacionada con este servicio?"
        hint="Ejemplo: tipo de incisión, tecnología, anestesia, protocolo, recuperación, materiales..."
      >
        <OptionCards
          options={["Sí", "No", "No sé"]}
          value={data.hasTechnique}
          onChange={(value) => onChange({ ...data, hasTechnique: value as string })}
        />
        {data.hasTechnique === "Sí" && (
          <FieldTextarea
            value={data.techniqueDetail}
            onChange={(e) => onChange({ ...data, techniqueDetail: e.target.value })}
            placeholder="Explícala brevemente"
          />
        )}
      </Question>

      <StepNav onBack={onBack} onNext={onNext} />
    </Shell>
  )
}

export function AdsEconomicsStep({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: AdsAnswers
  onChange: (data: AdsAnswers) => void
  onNext: () => void
  onBack: () => void
}) {
  return (
    <Shell icon={BadgeDollarSign} title="Economics">
      <Question label="¿Cuál es aproximadamente el precio del servicio principal?" hint="Un rango está bien." required>
        <FieldInput
          value={data.price}
          onChange={(e) => onChange({ ...data, price: e.target.value })}
          placeholder="Ej: $45,000 – $70,000 MXN"
        />
      </Question>

      <Question label="¿La consulta tiene costo?" required>
        <OptionCards
          options={["Sí", "No"]}
          value={data.consultationHasCost}
          onChange={(value) => onChange({ ...data, consultationHasCost: value as string })}
        />
        {data.consultationHasCost === "Sí" && (
          <FieldInput
            value={data.consultationPrice}
            onChange={(e) => onChange({ ...data, consultationPrice: e.target.value })}
            placeholder="Costo de la consulta"
          />
        )}
      </Question>

      <StepNav onBack={onBack} onNext={onNext} />
    </Shell>
  )
}

export function AdsConversionStep({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: AdsAnswers
  onChange: (data: AdsAnswers) => void
  onNext: () => void
  onBack: () => void
}) {
  return (
    <Shell icon={MessageSquare} title="Conversión">
      <Question label="¿Quién responde actualmente a los pacientes interesados?" required>
        <OptionCards
          options={ADS_WHO_RESPONDS}
          value={data.whoResponds}
          onChange={(value) => onChange({ ...data, whoResponds: value as string })}
        />
      </Question>

      <Question label="Aproximadamente, ¿cuánto tardan normalmente en responder un mensaje nuevo?" required>
        <OptionCards
          options={RESPONSE_TIMES}
          value={data.responseTime}
          onChange={(value) => onChange({ ...data, responseTime: value as string })}
        />
      </Question>

      <Question label="¿Cómo agendan actualmente?" required>
        <OptionCards
          multiple
          options={ADS_SCHEDULE}
          values={data.howSchedule}
          onChange={(values) => onChange({ ...data, howSchedule: values as string[] })}
        />
      </Question>

      <Question label="¿Qué ocurre normalmente después de que alguien pregunta precio o información y no agenda?" required>
        <OptionCards
          options={ADS_FOLLOW_UP}
          value={data.followUp}
          onChange={(value) => onChange({ ...data, followUp: value as string })}
        />
      </Question>

      <StepNav onBack={onBack} onNext={onNext} />
    </Shell>
  )
}

export function AdsAssetsStep({
  data,
  onChange,
  onNext,
  onBack,
  submitting,
}: {
  data: AdsAnswers
  onChange: (data: AdsAnswers) => void
  onNext: () => void
  onBack: () => void
  submitting?: boolean
}) {
  return (
    <Shell icon={Megaphone} title="Histórico de ads y material">
      <Question label="¿Has utilizado publicidad pagada anteriormente?" required>
        <OptionCards
          options={["Sí", "No"]}
          value={data.hasPaidAds}
          onChange={(value) => onChange({ ...data, hasPaidAds: value as string })}
        />
      </Question>

      {data.hasPaidAds === "Sí" && (
        <>
          <Question label="¿Qué servicio anunciabas?">
            <FieldInput
              value={data.previousService}
              onChange={(e) => onChange({ ...data, previousService: e.target.value })}
            />
          </Question>
          <Question label="¿Cuánto invertías aproximadamente al mes?">
            <FieldInput
              value={data.previousInvestment}
              onChange={(e) => onChange({ ...data, previousInvestment: e.target.value })}
            />
          </Question>
          <Question label="¿Qué resultado recuerdas haber obtenido?" hint="Leads, mensajes, citas o procedimientos, aunque sea aproximado.">
            <FieldTextarea
              value={data.previousResults}
              onChange={(e) => onChange({ ...data, previousResults: e.target.value })}
            />
          </Question>
          <Question label="¿Hay alguna campaña, anuncio o mensaje que recuerdes que funcionó especialmente bien o mal?">
            <FieldTextarea
              value={data.campaignNotes}
              onChange={(e) => onChange({ ...data, campaignNotes: e.target.value })}
            />
          </Question>
        </>
      )}

      <Question label="¿Qué material tienes disponible actualmente para crear anuncios?" required>
        <OptionCards
          multiple
          options={ADS_ASSETS}
          values={data.availableAssets}
          onChange={(values) => onChange({ ...data, availableAssets: values as string[] })}
        />
      </Question>

      <Question label="Instagram">
        <FieldInput
          value={data.instagram}
          onChange={(e) => onChange({ ...data, instagram: e.target.value })}
          placeholder="@tu_cuenta"
        />
      </Question>
      <Question label="Sitio web, si existe">
        <FieldInput
          value={data.website}
          onChange={(e) => onChange({ ...data, website: e.target.value })}
          placeholder="https://"
        />
      </Question>
      <Question label="Facebook, si aplica">
        <FieldInput
          value={data.facebook}
          onChange={(e) => onChange({ ...data, facebook: e.target.value })}
        />
      </Question>

      <StepNav onBack={onBack} onNext={onNext} nextLabel="Enviar Brief" submitting={submitting} />
    </Shell>
  )
}
