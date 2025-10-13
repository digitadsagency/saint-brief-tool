"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type BrandBrief } from "@/lib/schemas"
import { type Language, getTranslation } from "@/lib/i18n"

interface PreviewPaneProps {
  data: BrandBrief
  language: Language
}

export function PreviewPane({ data, language }: PreviewPaneProps) {
  const formatDataForPreview = (data: BrandBrief) => {
    return {
      step1: {
        fullName: data.step1.fullName,
        preferredName: data.step1.preferredName,
        specialty: data.step1.specialty,
        cities: data.step1.cities,
        yearsExperience: data.step1.yearsExperience
      },
      step2: {
        perception: data.step2.perception,
        whatNotAre: data.step2.whatNotAre,
        philosophy: data.step2.philosophy
      },
      step3: {
        favoriteProcedures: data.step3.favoriteProcedures,
        highValueServices: data.step3.highValueServices,
        accessibleServices: data.step3.accessibleServices
      },
      step4: {
        averageAge: data.step4.averageAge,
        predominantGender: data.step4.predominantGender,
        commonFears: data.step4.commonFears
      },
      step5: {
        whatMakesDifferent: data.step5.whatMakesDifferent,
        keyTechnologies: data.step5.keyTechnologies
      },
      step6: {
        mainObjective: data.step6.mainObjective,
        monthlyNewConsultations: data.step6.monthlyNewConsultations,
        inspiringAccounts: data.step6.inspiringAccounts
      },
      step7: {
        whySpecialty: data.step7.whySpecialty,
        markedCase: data.step7.markedCase,
        commonPhrase: data.step7.commonPhrase,
        fiveYearVision: data.step7.fiveYearVision,
        mythToDebunk: data.step7.mythToDebunk,
        frequentQuestions: data.step7.frequentQuestions,
        curiosityTopic: data.step7.curiosityTopic
      },
      step8: {
        hasDoneAds: data.step8.hasDoneAds,
        platforms: data.step8.platforms,
        investmentAmount: data.step8.investmentAmount,
        results: data.step8.results,
        bestFormats: data.step8.bestFormats,
        whatDidntWork: data.step8.whatDidntWork
      }
    }
  }

  const previewData = formatDataForPreview(data)

  return (
    <Card className="h-fit sticky top-4 bg-white border-gray-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-[#CADCFF] to-[#C1FFDD]">
        <CardTitle className="flex items-center gap-2 text-black">
          <div className="w-2 h-2 bg-black rounded-full" />
          {getTranslation(language, "summaryTitle")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Información básica */}
        {previewData.step1.fullName && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-gray-700">Información básica</h4>
            <div className="space-y-1">
              <p className="text-sm"><strong>Nombre:</strong> {previewData.step1.fullName}</p>
              <p className="text-sm"><strong>Preferido:</strong> {previewData.step1.preferredName}</p>
              <p className="text-sm"><strong>Especialidad:</strong> {previewData.step1.specialty}</p>
              {previewData.step1.cities.length > 0 && (
                <p className="text-sm"><strong>Ciudades:</strong> {previewData.step1.cities.join(", ")}</p>
              )}
              {previewData.step1.yearsExperience > 0 && (
                <p className="text-sm"><strong>Experiencia:</strong> {previewData.step1.yearsExperience} años</p>
              )}
            </div>
          </div>
        )}

        {/* Identidad y estilo */}
        {previewData.step2.perception.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-gray-700">Identidad</h4>
            <div className="flex flex-wrap gap-1">
              {previewData.step2.perception.map((perception, index) => (
                <Badge key={index} className="text-xs bg-[#C1FFDD] text-black border-[#C1FFDD]">
                  {getTranslation(language, perception as any)}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Procedimientos favoritos */}
        {previewData.step3.favoriteProcedures.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-gray-700">Procedimientos favoritos</h4>
            <div className="flex flex-wrap gap-1">
              {previewData.step3.favoriteProcedures.map((procedure, index) => (
                <Badge key={index} className="text-xs bg-[#CADCFF] text-black border-[#CADCFF]">
                  {procedure}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Paciente ideal */}
        {(previewData.step4.averageAge || previewData.step4.predominantGender) && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-gray-700">Paciente ideal</h4>
            <div className="space-y-1">
              {previewData.step4.averageAge && (
                <p className="text-sm"><strong>Edad:</strong> {previewData.step4.averageAge}</p>
              )}
              {previewData.step4.predominantGender && (
                <p className="text-sm"><strong>Género:</strong> {getTranslation(language, previewData.step4.predominantGender as any)}</p>
              )}
            </div>
          </div>
        )}

        {/* Metas de marketing */}
        {previewData.step6.mainObjective && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-gray-700">Metas de marketing</h4>
            <div className="space-y-1">
              <p className="text-sm"><strong>Objetivo:</strong> {getTranslation(language, previewData.step6.mainObjective as any)}</p>
              {previewData.step6.monthlyNewConsultations > 0 && (
                <p className="text-sm"><strong>Consultas/mes:</strong> {previewData.step6.monthlyNewConsultations}</p>
              )}
            </div>
          </div>
        )}

        {/* Historial de anuncios */}
        {previewData.step8.hasDoneAds !== undefined && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-gray-700">Historial de anuncios</h4>
            <p className="text-sm">
              <strong>Experiencia:</strong> {previewData.step8.hasDoneAds ? "Sí" : "No"}
            </p>
            {previewData.step8.platforms && previewData.step8.platforms.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {previewData.step8.platforms.map((platform, index) => (
                  <Badge key={index} className="text-xs bg-[#C1FFDD] text-black border-[#C1FFDD]">
                    {platform}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Estado del formulario */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Estado:</span>
            <Badge className="bg-[#CADCFF] text-black border-[#CADCFF]">
              {data.status === "draft" ? "Borrador" : "Completado"}
            </Badge>
          </div>
          {data.timestamp && (
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-gray-600">Última actualización:</span>
              <span className="text-gray-500">
                {data.timestamp.toLocaleDateString(language === "es" ? "es-ES" : "en-US")}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}