import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { BrandBrief } from '@/lib/schemas'
import { briefTypeLabel, isPackageBrief, packageBriefHeaders, packageBriefRows } from '@/lib/briefs/format'

// Configuración de Google Sheets
const GOOGLE_SHEETS_CONFIG = {
  SPREADSHEET_ID: process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID || '',
  SHEET_NAME: 'Brand Briefs',
}

// Función para preparar los datos en formato de fila para Google Sheets
function prepareDataForSheets(briefData: BrandBrief | Record<string, unknown>): string[] {
  const timestamp = new Date().toLocaleString('es-ES')

  if (isPackageBrief(briefData)) {
    return [timestamp, ...packageBriefRows(briefData)]
  }

  const legacy = briefData as BrandBrief
  
  return [
    // Timestamp
    timestamp,
    
    // Paso 1 - Datos básicos
    legacy.step1?.fullName || '',
    legacy.step1?.preferredName || '',
    legacy.step1?.specialty || '',
    (legacy.step1?.cities || []).join(', '),
    legacy.step1?.yearsExperience?.toString() || '',
    
    // Paso 2 - Identidad y estilo
    (legacy.step2?.perception || []).join(', '),
    legacy.step2?.whatNotAre || '',
    legacy.step2?.philosophy || '',
    
    // Paso 3 - Procedimientos y negocio
    (legacy.step3?.favoriteProcedures || []).join(', '),
    (legacy.step3?.highValueServices || []).join(', '),
    (legacy.step3?.accessibleServices || []).join(', '),
    legacy.step3?.hasBeforeAfterCases === true ? 'Sí' : legacy.step3?.hasBeforeAfterCases === false ? 'No' : '',
    legacy.step3?.mostCasesOf || '',
    legacy.step3?.currentMonthlyCount || '',
    legacy.step3?.desiredMonthlyAppointments || '',
    legacy.step3?.desiredMonthlySurgeries || '',
    legacy.step3?.hasOwnAssistant || '',
    
    // Paso 4 - Paciente ideal
    legacy.step4?.averageAge || '',
    legacy.step4?.predominantGender || '',
    (legacy.step4?.commonFears || []).join(', '),
    
    // Paso 5 - Diferenciadores
    legacy.step5?.whatMakesDifferent || '',
    (legacy.step5?.keyTechnologies || []).join(', '),
    
    // Paso 6 - Metas de marketing
    (legacy.step6?.mainObjective || []).join(', '),
    legacy.step6?.monthlyNewConsultations?.toString() || '',
    (legacy.step6?.inspiringAccounts || []).join(', '),
    
    // Paso 7 - Storytelling
    legacy.step7?.whySpecialty || '',
    legacy.step7?.markedCase || '',
    legacy.step7?.commonPhrase || '',
    legacy.step7?.fiveYearVision || '',
    legacy.step7?.mythToDebunk || '',
    (legacy.step7?.frequentQuestions || []).join(', '),
    legacy.step7?.curiosityTopic || '',
    
    // Paso 8 - Historial de anuncios
    legacy.step8?.hasDoneAds ? 'Sí' : 'No',
    (legacy.step8?.platforms || []).join(', '),
    legacy.step8?.investmentAmount || '',
    legacy.step8?.results || '',
    (legacy.step8?.bestFormats || []).join(', '),
    legacy.step8?.whatDidntWork || ''
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
    const briefData = await request.json()
    
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
    const sheetName = isPackageBrief(briefData)
      ? briefTypeLabel(briefData)
      : GOOGLE_SHEETS_CONFIG.SHEET_NAME

    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: GOOGLE_SHEETS_CONFIG.SPREADSHEET_ID,
    })
    const sheetExists = spreadsheet.data.sheets?.some(
      (sheet) => sheet.properties?.title === sheetName
    )

    if (!sheetExists) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: GOOGLE_SHEETS_CONFIG.SPREADSHEET_ID,
        requestBody: {
          requests: [{ addSheet: { properties: { title: sheetName } } }],
        },
      })

      if (isPackageBrief(briefData)) {
        await sheets.spreadsheets.values.update({
          spreadsheetId: GOOGLE_SHEETS_CONFIG.SPREADSHEET_ID,
          range: `${sheetName}!A1`,
          valueInputOption: 'RAW',
          requestBody: {
            values: [['Timestamp', ...packageBriefHeaders()]],
          },
        })
      }
    }
    
    // Obtener el rango actual para encontrar la siguiente fila vacía
    const rangeResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEETS_CONFIG.SPREADSHEET_ID,
      range: `${sheetName}!A:A`,
    })

    const nextRow = (rangeResponse.data.values?.length || 0) + 1
    const appendRange = `${sheetName}!A${nextRow}`
    
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
