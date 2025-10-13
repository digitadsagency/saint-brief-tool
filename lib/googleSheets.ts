import { BrandBrief } from './schemas'

// Función para enviar datos a Google Sheets usando nuestra API route
export async function sendToGoogleSheets(briefData: BrandBrief): Promise<{ success: boolean; message: string }> {
  try {
    console.log('Enviando datos a Google Sheets...')
    
    const response = await fetch('/api/send-to-sheets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(briefData),
    })

    const result = await response.json()
    
    if (response.ok && result.success) {
      console.log('Datos enviados exitosamente:', result.message)
      return {
        success: true,
        message: result.message
      }
    } else {
      console.error('Error enviando datos:', result.message)
      return {
        success: false,
        message: result.message || 'Error enviando datos a Google Sheets'
      }
    }
    
  } catch (error) {
    console.error('Error enviando a Google Sheets:', error)
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}

// Función para obtener los headers de las columnas
export function getSheetHeaders(): string[] {
  return [
    'Timestamp',
    'Nombre Completo',
    'Nombre Preferido',
    'Especialidad',
    'Ciudades',
    'Años de Experiencia',
    'Percepción Deseada',
    'Qué NO Eres',
    'Filosofía',
    'Procedimientos Favoritos',
    'Servicios de Alto Valor',
    'Servicios Accesibles',
    'Edad Promedio Paciente',
    'Género Predominante',
    'Miedos Comunes',
    'Qué Te Hace Diferente',
    'Tecnologías Clave',
    'Objetivos Principales',
    'Consultas Nuevas Mensuales',
    'Cuentas Inspiradoras',
    'Por Qué Elegiste Especialidad',
    'Caso que Te Marcó',
    'Frase Común',
    'Visión a 5 Años',
    'Mito a Derribar',
    'Preguntas Frecuentes',
    'Tema de Curiosidad',
    'Ha Hecho Anuncios',
    'Plataformas Usadas',
    'Inversión Mensual',
    'Resultados Obtenidos',
    'Formatos que Funcionaron',
    'Qué No Funcionó'
  ]
}
