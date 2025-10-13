"use client"

import React from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  Heart,
  Stethoscope,
  Eye
} from "lucide-react"
import Link from "next/link"
import { type BrandBrief, brandBriefSchema } from "@/lib/schemas"
import { type Language, getTranslation } from "@/lib/i18n"
import { formatDataForPreview } from "@/lib/export"
import { exportToJSON, exportToPDF } from "@/lib/export"
import { useToast } from "@/components/ui/use-toast"

export default function BrandBriefViewPage() {
  const searchParams = useSearchParams()
  const [briefData, setBriefData] = React.useState<BrandBrief | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [language] = React.useState<Language>("es")
  const { toast } = useToast()

  React.useEffect(() => {
    const loadBriefData = () => {
      try {
        const dataParam = searchParams.get("data")
        if (!dataParam) {
          setIsLoading(false)
          return
        }

        const decodedData = atob(dataParam)
        const parsedData = JSON.parse(decodedData)
        
        // Validar con el esquema
        const result = brandBriefSchema.safeParse(parsedData)
        if (result.success) {
          setBriefData(result.data)
        } else {
          console.error("Invalid brief data:", result.error)
        }
      } catch (error) {
        console.error("Error loading brief data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadBriefData()
  }, [searchParams])

  const handleExportJSON = () => {
    if (!briefData) return
    
    try {
      exportToJSON(briefData, `saint-brand-brief-view-${Date.now()}.json`)
      toast({
        title: "Exportado exitosamente",
        description: "Archivo JSON descargado",
      })
    } catch (error) {
      console.error("Error exporting JSON:", error)
      toast({
        title: "Error al exportar",
        description: "No se pudo exportar el archivo",
        variant: "destructive"
      })
    }
  }

  const handleExportPDF = async () => {
    if (!briefData) return
    
    try {
      await exportToPDF(briefData, "brand-brief-view-content", `saint-brand-brief-view-${Date.now()}.pdf`)
      toast({
        title: "Exportado exitosamente",
        description: "Archivo PDF descargado",
      })
    } catch (error) {
      console.error("Error exporting PDF:", error)
      toast({
        title: "Error al exportar",
        description: "No se pudo exportar el archivo",
        variant: "destructive"
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Cargando Brand Brief...</p>
        </div>
      </div>
    )
  }

  if (!briefData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Eye className="h-12 w-12 text-muted-foreground mx-auto" />
          <h1 className="text-2xl font-bold">Brand Brief no encontrado</h1>
          <p className="text-muted-foreground">
            El enlace de vista no contiene datos válidos o ha expirado.
          </p>
          <Link href="/brand-brief">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Brand Brief
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const previewData = formatDataForPreview(briefData, language)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Stethoscope className="h-6 w-6 text-primary" />
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">SAINT</h1>
                <p className="text-sm text-muted-foreground">
                  Vista de Brand Brief Médico
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                Solo lectura
              </Badge>
              
              <Link href="/brand-brief">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">
              {getTranslation(language, "appTitle")}
            </h1>
            <p className="text-muted-foreground">
              {previewData.step1.commercialName || "Brand Brief Médico"}
            </p>
          </motion.div>

          {/* Export Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center gap-4 mb-8"
          >
            <Button onClick={handleExportJSON} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar JSON
            </Button>
            <Button onClick={handleExportPDF} variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
          </motion.div>

          {/* Brief Content */}
          <div id="brand-brief-view-content" className="space-y-6">
            {/* Información Básica */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Información Básica</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Cliente</h4>
                      <p className="text-lg font-semibold">
                        {previewData.step1.commercialName || "No especificado"}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Especialidad</h4>
                      <Badge variant="secondary" className="text-base">
                        {previewData.step1.specialty || "No especificado"}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Ubicación</h4>
                    <p className="text-base">
                      {previewData.step1.location || "No especificado"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Objetivos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Objetivos y KPIs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Objetivos</h4>
                    <div className="flex flex-wrap gap-2">
                      {previewData.step2.objectives?.map((objective: any, index: number) => (
                        <Badge key={index} variant="outline">
                          {getTranslation(language, objective as any)}
                        </Badge>
                      )) || (
                        <span className="text-muted-foreground">No especificado</span>
                      )}
                    </div>
                  </div>
                  
                  {previewData.step2.kpis && Object.keys(previewData.step2.kpis).length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">KPIs</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {previewData.step2.kpis.monthlyAppointments && (
                            <div className="text-center">
                              <p className="text-2xl font-bold text-primary">
                                {previewData.step2.kpis.monthlyAppointments}
                              </p>
                              <p className="text-sm text-muted-foreground">Citas/mes</p>
                            </div>
                          )}
                          {previewData.step2.kpis.desiredCAC && (
                            <div className="text-center">
                              <p className="text-2xl font-bold text-primary">
                                ${previewData.step2.kpis.desiredCAC}
                              </p>
                              <p className="text-sm text-muted-foreground">CAC deseado</p>
                            </div>
                          )}
                          {previewData.step2.kpis.targetCTR && (
                            <div className="text-center">
                              <p className="text-2xl font-bold text-primary">
                                {previewData.step2.kpis.targetCTR}%
                              </p>
                              <p className="text-sm text-muted-foreground">CTR meta</p>
                            </div>
                          )}
                          {previewData.step2.kpis.webConversionRate && (
                            <div className="text-center">
                              <p className="text-2xl font-bold text-primary">
                                {previewData.step2.kpis.webConversionRate}%
                              </p>
                              <p className="text-sm text-muted-foreground">Conv. web</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Servicios */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Servicios y Canales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Servicios a Promover</h4>
                    <div className="flex flex-wrap gap-2">
                      {previewData.step5.services?.map((service: any, index: number) => (
                        <Badge key={index} variant="outline">
                          {getTranslation(language, service as any)}
                        </Badge>
                      )) || (
                        <span className="text-muted-foreground">No especificado</span>
                      )}
                    </div>
                  </div>
                  
                  {previewData.step6.priorityChannels && previewData.step6.priorityChannels.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">Canales Prioritarios</h4>
                        <div className="flex flex-wrap gap-2">
                          {previewData.step6.priorityChannels.map((channel: any, index: number) => (
                            <Badge key={index} variant="secondary">
                              {getTranslation(language, channel as any)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Tono de Voz */}
            {previewData.step6.toneOfVoice && previewData.step6.toneOfVoice.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Marca y Contenido</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Tono de Voz</h4>
                      <div className="flex flex-wrap gap-2">
                        {previewData.step6.toneOfVoice.map((tone: any, index: number) => (
                          <Badge key={index} variant="outline">
                            {getTranslation(language, tone as any)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Metadatos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Información del Brief</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium text-muted-foreground">Estado</h4>
                      <Badge variant={previewData.status === "completed" ? "default" : "secondary"}>
                        {previewData.status === "completed" ? "Completado" : "Borrador"}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-medium text-muted-foreground">Fecha de creación</h4>
                      <p>{new Date(previewData.timestamp).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-muted-foreground">ID del Brief</h4>
                      <p className="font-mono text-xs">{previewData.id}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 SAINT Agency. Vista de Brand Brief Médico.</p>
            <p className="mt-1">
              Esta es una vista de solo lectura del Brand Brief.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
