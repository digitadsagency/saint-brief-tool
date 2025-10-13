import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { BrandBrief } from '@/lib/schemas'

// Configuración de Google Sheets
const GOOGLE_SHEETS_CONFIG = {
  SPREADSHEET_ID: process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID || '',
  SHEET_NAME: 'Brand Briefs',
}

// Función para preparar los datos en formato de fila para Google Sheets
function prepareDataForSheets(briefData: BrandBrief): string[] {
  const timestamp = new Date().toLocaleString('es-ES')
  
  return [
    // Timestamp
    timestamp,
    
    // Paso 1 - Datos básicos
    briefData.step1?.fullName || '',
    briefData.step1?.preferredName || '',
    briefData.step1?.specialty || '',
    (briefData.step1?.cities || []).join(', '),
    briefData.step1?.yearsExperience?.toString() || '',
    
    // Paso 2 - Identidad y estilo
    (briefData.step2?.perception || []).join(', '),
    briefData.step2?.whatNotAre || '',
    briefData.step2?.philosophy || '',
    
    // Paso 3 - Procedimientos y negocio
    (briefData.step3?.favoriteProcedures || []).join(', '),
    (briefData.step3?.highValueServices || []).join(', '),
    (briefData.step3?.accessibleServices || []).join(', '),
    
    // Paso 4 - Paciente ideal
    briefData.step4?.averageAge || '',
    briefData.step4?.predominantGender || '',
    (briefData.step4?.commonFears || []).join(', '),
    
    // Paso 5 - Diferenciadores
    briefData.step5?.whatMakesDifferent || '',
    (briefData.step5?.keyTechnologies || []).join(', '),
    
    // Paso 6 - Metas de marketing
    (briefData.step6?.mainObjective || []).join(', '),
    briefData.step6?.monthlyNewConsultations?.toString() || '',
    (briefData.step6?.inspiringAccounts || []).join(', '),
    
    // Paso 7 - Storytelling
    briefData.step7?.whySpecialty || '',
    briefData.step7?.markedCase || '',
    briefData.step7?.commonPhrase || '',
    briefData.step7?.fiveYearVision || '',
    briefData.step7?.mythToDebunk || '',
    (briefData.step7?.frequentQuestions || []).join(', '),
    briefData.step7?.curiosityTopic || '',
    
    // Paso 8 - Historial de anuncios
    briefData.step8?.hasDoneAds ? 'Sí' : 'No',
    (briefData.step8?.platforms || []).join(', '),
    briefData.step8?.investmentAmount || '',
    briefData.step8?.results || '',
    (briefData.step8?.bestFormats || []).join(', '),
    briefData.step8?.whatDidntWork || ''
  ]
}

export async function POST(request: NextRequest) {
  try {
    // Verificar que tenemos el ID de la hoja
    if (!GOOGLE_SHEETS_CONFIG.SPREADSHEET_ID) {
      return NextResponse.json(
        { success: false, message: 'Google Sheets ID no configurado' },
        { status: 500 }
      )
    }

    // Obtener los datos del request
    const briefData: BrandBrief = await request.json()
    
    // Preparar los datos para enviar
    const dataToSend = prepareDataForSheets(briefData)
    
    console.log('Datos preparados para Google Sheets:', dataToSend)
    console.log('ID de la hoja:', GOOGLE_SHEETS_CONFIG.SPREADSHEET_ID)
    
    // Configurar autenticación con Service Account
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      return NextResponse.json(
        { success: false, message: 'Credenciales de Service Account no configuradas' },
        { status: 500 }
      )
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const sheets = google.sheets({ version: 'v4', auth })
    
    // Obtener el rango actual para encontrar la siguiente fila vacía
    const rangeResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEETS_CONFIG.SPREADSHEET_ID,
      range: `${GOOGLE_SHEETS_CONFIG.SHEET_NAME}!A:A`,
    })

    const nextRow = (rangeResponse.data.values?.length || 0) + 1
    const appendRange = `${GOOGLE_SHEETS_CONFIG.SHEET_NAME}!A${nextRow}`
    
    console.log(`Escribiendo en fila ${nextRow}`)
    
    // Escribir los datos
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SHEETS_CONFIG.SPREADSHEET_ID,
      range: appendRange,
      valueInputOption: 'RAW',
      requestBody: {
        values: [dataToSend],
      },
    })

    console.log('Respuesta de Google Sheets:', response.data)
    
    return NextResponse.json({
      success: true,
      message: 'Datos enviados exitosamente a Google Sheets'
    })
    
  } catch (error) {
    console.error('Error enviando a Google Sheets:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Error desconocido' 
      },
      { status: 500 }
    )
  }
}
