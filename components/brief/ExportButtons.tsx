"use client"

import React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Download, 
  FileText, 
  Share2, 
  FileJson, 
  FileImage,
  Copy,
  Check
} from "lucide-react"
import { type BrandBrief } from "@/lib/schemas"
import { type Language, getTranslation } from "@/lib/i18n"
import { 
  exportToJSON, 
  exportToPDF, 
  exportScopeDraft, 
  createViewLink,
  copyViewLinkToClipboard 
} from "@/lib/export"
// import { appendRow } from "@/lib/googleSheets" // Comentado temporalmente
import { useToast } from "@/components/ui/use-toast"

interface ExportButtonsProps {
  data: BrandBrief
  language: Language
  onSave?: () => void
  className?: string
}

export function ExportButtons({ data, language, onSave, className }: ExportButtonsProps) {
  const [isExporting, setIsExporting] = React.useState(false)
  const [isGeneratingLink, setIsGeneratingLink] = React.useState(false)
  const [linkCopied, setLinkCopied] = React.useState(false)
  const { toast } = useToast()

  const handleExportJSON = async () => {
    try {
      setIsExporting(true)
      exportToJSON(data, `saint-brand-brief-${data.step1.fullName?.replace(/\s+/g, "-") || "brief"}-${Date.now()}.json`)
      
      // Guardar en Google Sheets si está habilitado (deshabilitado temporalmente)
      // const sheetsSuccess = await appendRow(data)
      // if (sheetsSuccess) {
      //   toast({
      //     title: getTranslation(language, "savedToSheets"),
      //     description: "Los datos se han guardado en Google Sheets",
      //   })
      // }
      
      toast({
        title: getTranslation(language, "exportedSuccessfully"),
        description: "Archivo JSON descargado exitosamente",
      })
    } catch (error) {
      console.error("Error exporting JSON:", error)
      toast({
        title: getTranslation(language, "exportError"),
        description: "Error al exportar el archivo JSON",
        variant: "destructive"
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportPDF = async () => {
    try {
      setIsExporting(true)
      await exportToPDF(data, "brand-brief-content", `saint-brand-brief-${data.step1.fullName?.replace(/\s+/g, "-") || "brief"}-${Date.now()}.pdf`)
      
      toast({
        title: getTranslation(language, "exportedSuccessfully"),
        description: "Archivo PDF descargado exitosamente",
      })
    } catch (error) {
      console.error("Error exporting PDF:", error)
      toast({
        title: getTranslation(language, "exportError"),
        description: "Error al exportar el archivo PDF",
        variant: "destructive"
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportScopeDraft = () => {
    try {
      exportScopeDraft(data, language)
      toast({
        title: getTranslation(language, "exportedSuccessfully"),
        description: "Scope Draft descargado exitosamente",
      })
    } catch (error) {
      console.error("Error exporting scope draft:", error)
      toast({
        title: getTranslation(language, "exportError"),
        description: "Error al exportar el Scope Draft",
        variant: "destructive"
      })
    }
  }

  const handleCreateViewLink = async () => {
    try {
      setIsGeneratingLink(true)
      const success = await copyViewLinkToClipboard(data)
      
      if (success) {
        setLinkCopied(true)
        setTimeout(() => setLinkCopied(false), 3000)
        
        toast({
          title: "Enlace copiado",
          description: "El enlace de vista se ha copiado al portapapeles",
        })
      } else {
        throw new Error("Failed to copy to clipboard")
      }
    } catch (error) {
      console.error("Error creating view link:", error)
      toast({
        title: "Error",
        description: "No se pudo copiar el enlace al portapapeles",
        variant: "destructive"
      })
    } finally {
      setIsGeneratingLink(false)
    }
  }

  const handleSave = async () => {
    try {
      if (onSave) {
        onSave()
      }
      
      // Guardar en Google Sheets si está habilitado (deshabilitado temporalmente)
      // const sheetsSuccess = await appendRow(data)
      // if (sheetsSuccess) {
      //   toast({
      //     title: getTranslation(language, "savedToSheets"),
      //     description: "Los datos se han guardado en Google Sheets",
      //   })
      // } else {
        toast({
          title: getTranslation(language, "savedSuccessfully"),
          description: "Datos guardados localmente",
        })
      // }
    } catch (error) {
      console.error("Error saving:", error)
      toast({
        title: "Error al guardar",
        description: "No se pudieron guardar los datos",
        variant: "destructive"
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            {getTranslation(language, "exportOptions")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Botones principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              onClick={handleExportJSON}
              disabled={isExporting}
              className="w-full"
              variant="outline"
            >
              <FileJson className="h-4 w-4 mr-2" />
              {getTranslation(language, "exportJSON")}
            </Button>
            
            <Button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="w-full"
              variant="outline"
            >
              <FileImage className="h-4 w-4 mr-2" />
              {getTranslation(language, "exportPDF")}
            </Button>
          </div>

          {/* Botones secundarios */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              onClick={handleExportScopeDraft}
              className="w-full"
              variant="outline"
            >
              <FileText className="h-4 w-4 mr-2" />
              {getTranslation(language, "generateScopeDraft")}
            </Button>
            
            <Button
              onClick={handleCreateViewLink}
              disabled={isGeneratingLink}
              className="w-full"
              variant="outline"
            >
              {linkCopied ? (
                <Check className="h-4 w-4 mr-2" />
              ) : (
                <Copy className="h-4 w-4 mr-2" />
              )}
              {getTranslation(language, "createViewLink")}
            </Button>
          </div>

          {/* Botón de guardar */}
          <Button
            onClick={handleSave}
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            {getTranslation(language, "save")}
          </Button>

          {/* Información adicional */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• JSON: Datos completos del brief</p>
            <p>• PDF: Vista imprimible del resumen</p>
            <p>• Scope Draft: Texto base para propuesta</p>
            <p>• Enlace: Vista compartible de solo lectura</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
