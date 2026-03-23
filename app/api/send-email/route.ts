import { NextRequest, NextResponse } from 'next/server'
import { BrandBrief } from '@/lib/schemas'
const nodemailer = require('nodemailer')

// Función para crear el HTML del correo
function createEmailHTML(briefData: BrandBrief): string {
  const timestamp = new Date().toLocaleString('es-ES')
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Nuevo Brand Brief Completado</title>
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #2c3e50; margin: 0; padding: 0; background: #ffffff; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #CADCFF 0%, #C1FFDD 100%); padding: 30px; margin-bottom: 30px; text-align: center; border-bottom: 4px solid #CADCFF; }
        .header h1 { color: #2c3e50; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: 1px; }
        .header p { color: #2c3e50; margin: 10px 0 0 0; font-size: 14px; opacity: 0.8; }
        .section { margin-bottom: 25px; padding: 25px; background: #ffffff; border: 1px solid #e8f4fd; border-left: 4px solid #CADCFF; }
        .section h2 { color: #2c3e50; margin-top: 0; font-size: 18px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e8f4fd; padding-bottom: 10px; }
        .field { margin-bottom: 15px; padding: 15px; background: #f8f9fa; border-left: 3px solid #CADCFF; }
        .field strong { color: #2c3e50; font-weight: 600; }
        .highlight { background: linear-gradient(135deg, #f8f9fa 0%, #e8f4fd 100%); padding: 25px; border: 1px solid #CADCFF; margin: 25px 0; }
        .footer { text-align: center; margin-top: 40px; padding: 25px; background: linear-gradient(135deg, #f8f9fa 0%, #e8f4fd 100%); border-top: 2px solid #CADCFF; }
        .badge { display: inline-block; background: linear-gradient(135deg, #CADCFF 0%, #C1FFDD 100%); color: #2c3e50; padding: 4px 8px; font-size: 11px; font-weight: 500; margin: 2px; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid #CADCFF; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
        .stat-card { background: #ffffff; padding: 20px; border: 1px solid #CADCFF; text-align: center; }
        .stat-number { font-size: 20px; font-weight: 600; color: #2c3e50; }
        .stat-label { font-size: 12px; color: #6c757d; margin-top: 5px; text-transform: uppercase; letter-spacing: 0.5px; }
        .quote { background: linear-gradient(135deg, #f8f9fa 0%, #e8f4fd 100%); padding: 20px; border-left: 4px solid #CADCFF; font-style: italic; color: #495057; margin: 15px 0; }
        .icon { font-size: 16px; margin-right: 8px; }
        .divider { height: 1px; background: linear-gradient(90deg, #CADCFF 0%, #C1FFDD 100%); margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>NUEVO BRAND BRIEF COMPLETADO</h1>
          <p>Fecha: ${timestamp}</p>
        </div>

        <div class="highlight">
          <h3 style="margin-top: 0; color: #2c3e50; text-transform: uppercase; letter-spacing: 0.5px; font-size: 16px;">RESUMEN DEL CLIENTE</h3>
          <div class="stats">
            <div class="stat-card">
              <div class="stat-number">${briefData.step1?.fullName || 'N/A'}</div>
              <div class="stat-label">Nombre Completo</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${briefData.step1?.specialty || 'N/A'}</div>
              <div class="stat-label">Especialidad</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${briefData.step1?.yearsExperience || 'N/A'}</div>
              <div class="stat-label">Años de Experiencia</div>
            </div>
          </div>
          <div class="divider"></div>
          <p><strong>Nombre Preferido:</strong> ${briefData.step1?.preferredName || 'No especificado'}</p>
          <p><strong>Ciudades:</strong> ${(briefData.step1?.cities || []).join(', ') || 'No especificadas'}</p>
        </div>

        <div class="section">
          <h2>IDENTIDAD Y ESTILO</h2>
          <div class="field"><strong>Percepción Deseada:</strong> ${(briefData.step2?.perception || []).map(p => `<span class="badge">${p.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>`).join(' ')}</div>
          <div class="field"><strong>Qué NO Es:</strong> ${briefData.step2?.whatNotAre || 'No especificado'}</div>
          ${briefData.step2?.philosophy ? `<div class="quote"><strong>Filosofía:</strong> "${briefData.step2.philosophy}"</div>` : ''}
        </div>

        <div class="section">
          <h2>PROCEDIMIENTOS Y NEGOCIO</h2>
          <div class="field"><strong>Procedimientos Favoritos:</strong> ${(briefData.step3?.favoriteProcedures || []).join(', ') || 'No especificados'}</div>
          <div class="field"><strong>Servicios de Alto Valor:</strong> ${(briefData.step3?.highValueServices || []).join(', ') || 'No especificados'}</div>
          <div class="field"><strong>Servicios Accesibles:</strong> ${(briefData.step3?.accessibleServices || []).join(', ') || 'No especificados'}</div>
          <div class="field"><strong>¿Tiene casos de antes y después?</strong> ${briefData.step3?.hasBeforeAfterCases === true ? 'Sí' : briefData.step3?.hasBeforeAfterCases === false ? 'No' : 'No respondido'}</div>
          <div class="field"><strong>Procedimiento con más casos:</strong> ${briefData.step3?.mostCasesOf || 'No especificado'}</div>
          <div class="field"><strong>Cirugías/citas actuales al mes:</strong> ${briefData.step3?.currentMonthlyCount || 'No especificado'}</div>
          <div class="field"><strong>Citas deseadas al mes:</strong> ${briefData.step3?.desiredMonthlyAppointments || 'No especificado'}</div>
          <div class="field"><strong>Cirugías deseadas al mes:</strong> ${briefData.step3?.desiredMonthlySurgeries || 'No especificado'}</div>
          <div class="field"><strong>¿Tiene asistente propia?</strong> ${briefData.step3?.hasOwnAssistant || 'No especificado'}</div>
        </div>

        <div class="section">
          <h2>PACIENTE IDEAL</h2>
          <div class="field"><strong>Edad Promedio:</strong> ${briefData.step4?.averageAge || 'No especificada'}</div>
          <div class="field"><strong>Género Predominante:</strong> ${briefData.step4?.predominantGender || 'No especificado'}</div>
          <div class="field"><strong>Miedos Comunes:</strong> ${(briefData.step4?.commonFears || []).join(', ') || 'No especificados'}</div>
        </div>

        <div class="section">
          <h2>DIFERENCIADORES</h2>
          <div class="field"><strong>Qué Lo Hace Diferente:</strong> ${briefData.step5?.whatMakesDifferent || 'No especificado'}</div>
          <div class="field"><strong>Tecnologías Clave:</strong> ${(briefData.step5?.keyTechnologies || []).join(', ') || 'No especificadas'}</div>
        </div>

        <div class="section">
          <h2>METAS DE MARKETING</h2>
          <div class="field"><strong>Objetivos Principales:</strong> ${(briefData.step6?.mainObjective || []).map(o => `<span class="badge">${o.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>`).join(' ')}</div>
          <div class="field"><strong>Consultas Nuevas Mensuales Deseadas:</strong> ${briefData.step6?.monthlyNewConsultations || 'No especificado'}</div>
          <div class="field"><strong>Cuentas Inspiradoras:</strong> ${(briefData.step6?.inspiringAccounts || []).join(', ') || 'No especificadas'}</div>
        </div>

        <div class="section">
          <h2>STORYTELLING & CREATIVE VAULT</h2>
          <div class="field"><strong>Por Qué Eligió su Especialidad:</strong> ${briefData.step7?.whySpecialty || 'No especificado'}</div>
          <div class="field"><strong>Caso que Lo Marcó:</strong> ${briefData.step7?.markedCase || 'No especificado'}</div>
          ${briefData.step7?.commonPhrase ? `<div class="quote"><strong>Frase Común:</strong> "${briefData.step7.commonPhrase}"</div>` : ''}
          <div class="field"><strong>Visión a 5 Años:</strong> ${briefData.step7?.fiveYearVision || 'No especificada'}</div>
          <div class="field"><strong>Mito a Derribar:</strong> ${briefData.step7?.mythToDebunk || 'No especificado'}</div>
          <div class="field"><strong>Preguntas Frecuentes:</strong> ${(briefData.step7?.frequentQuestions || []).join(', ') || 'No especificadas'}</div>
          <div class="field"><strong>Tema de Curiosidad:</strong> ${briefData.step7?.curiosityTopic || 'No especificado'}</div>
        </div>

        <div class="section">
          <h2>HISTORIAL DE ANUNCIOS</h2>
          <div class="field"><strong>Ha Hecho Anuncios:</strong> ${briefData.step8?.hasDoneAds ? 'Sí' : 'No'}</div>
          <div class="field"><strong>Plataformas Usadas:</strong> ${(briefData.step8?.platforms || []).join(', ') || 'No especificadas'}</div>
          <div class="field"><strong>Inversión Mensual:</strong> ${briefData.step8?.investmentAmount || 'No especificada'}</div>
          <div class="field"><strong>Resultados Obtenidos:</strong> ${briefData.step8?.results || 'No especificados'}</div>
          <div class="field"><strong>Formatos que Funcionaron:</strong> ${(briefData.step8?.bestFormats || []).join(', ') || 'No especificados'}</div>
          <div class="field"><strong>Qué No Funcionó:</strong> ${briefData.step8?.whatDidntWork || 'No especificado'}</div>
        </div>

        <div class="footer">
          <p><strong>SAINT Agency</strong> - Brand Brief Tool</p>
          <p>Este correo fue generado automáticamente cuando se completó un nuevo brand brief.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Función para crear el texto plano del correo
function createEmailText(briefData: BrandBrief): string {
  const timestamp = new Date().toLocaleString('es-ES')
  
  return `
🎉 NUEVO BRAND BRIEF COMPLETADO
Fecha: ${timestamp}

📋 RESUMEN DEL CLIENTE:
- Nombre: ${briefData.step1?.fullName || 'No especificado'}
- Nombre Preferido: ${briefData.step1?.preferredName || 'No especificado'}
- Especialidad: ${briefData.step1?.specialty || 'No especificada'}
- Ciudades: ${(briefData.step1?.cities || []).join(', ') || 'No especificadas'}
- Años de Experiencia: ${briefData.step1?.yearsExperience || 'No especificado'}

🎨 IDENTIDAD Y ESTILO:
- Percepción Deseada: ${(briefData.step2?.perception || []).map(p => p.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())).join(', ') || 'No especificada'}
- Qué NO Es: ${briefData.step2?.whatNotAre || 'No especificado'}
- Filosofía: ${briefData.step2?.philosophy || 'No especificada'}

💼 PROCEDIMIENTOS Y NEGOCIO:
- Procedimientos Favoritos: ${(briefData.step3?.favoriteProcedures || []).join(', ') || 'No especificados'}
- Servicios de Alto Valor: ${(briefData.step3?.highValueServices || []).join(', ') || 'No especificados'}
- Servicios Accesibles: ${(briefData.step3?.accessibleServices || []).join(', ') || 'No especificados'}
- ¿Tiene casos de antes y después?: ${briefData.step3?.hasBeforeAfterCases === true ? 'Sí' : briefData.step3?.hasBeforeAfterCases === false ? 'No' : 'No respondido'}
- Procedimiento con más casos: ${briefData.step3?.mostCasesOf || 'No especificado'}
- Cirugías/citas actuales al mes: ${briefData.step3?.currentMonthlyCount || 'No especificado'}
- Citas deseadas al mes: ${briefData.step3?.desiredMonthlyAppointments || 'No especificado'}
- Cirugías deseadas al mes: ${briefData.step3?.desiredMonthlySurgeries || 'No especificado'}
- ¿Tiene asistente propia?: ${briefData.step3?.hasOwnAssistant || 'No especificado'}

👤 PACIENTE IDEAL:
- Edad Promedio: ${briefData.step4?.averageAge || 'No especificada'}
- Género Predominante: ${briefData.step4?.predominantGender || 'No especificado'}
- Miedos Comunes: ${(briefData.step4?.commonFears || []).join(', ') || 'No especificados'}

🏆 DIFERENCIADORES:
- Qué Lo Hace Diferente: ${briefData.step5?.whatMakesDifferent || 'No especificado'}
- Tecnologías Clave: ${(briefData.step5?.keyTechnologies || []).join(', ') || 'No especificadas'}

🚀 METAS DE MARKETING:
- Objetivos Principales: ${(briefData.step6?.mainObjective || []).map(o => o.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())).join(', ') || 'No especificados'}
- Consultas Nuevas Mensuales Deseadas: ${briefData.step6?.monthlyNewConsultations || 'No especificado'}
- Cuentas Inspiradoras: ${(briefData.step6?.inspiringAccounts || []).join(', ') || 'No especificadas'}

📖 STORYTELLING & CREATIVE VAULT:
- Por Qué Eligió su Especialidad: ${briefData.step7?.whySpecialty || 'No especificado'}
- Caso que Lo Marcó: ${briefData.step7?.markedCase || 'No especificado'}
- Frase Común: "${briefData.step7?.commonPhrase || 'No especificada'}"
- Visión a 5 Años: ${briefData.step7?.fiveYearVision || 'No especificada'}
- Mito a Derribar: ${briefData.step7?.mythToDebunk || 'No especificado'}
- Preguntas Frecuentes: ${(briefData.step7?.frequentQuestions || []).join(', ') || 'No especificadas'}
- Tema de Curiosidad: ${briefData.step7?.curiosityTopic || 'No especificado'}

📊 HISTORIAL DE ANUNCIOS:
- Ha Hecho Anuncios: ${briefData.step8?.hasDoneAds ? 'Sí' : 'No'}
- Plataformas Usadas: ${(briefData.step8?.platforms || []).join(', ') || 'No especificadas'}
- Inversión Mensual: ${briefData.step8?.investmentAmount || 'No especificada'}
- Resultados Obtenidos: ${briefData.step8?.results || 'No especificados'}
- Formatos que Funcionaron: ${(briefData.step8?.bestFormats || []).join(', ') || 'No especificados'}
- Qué No Funcionó: ${briefData.step8?.whatDidntWork || 'No especificado'}

---
SAINT Agency - Brand Brief Tool
Este correo fue generado automáticamente cuando se completó un nuevo brand brief.
  `
}

export async function POST(request: NextRequest) {
  try {
    // Verificar que tenemos las credenciales de email
    if (!process.env.GMAIL_EMAIL || !process.env.GMAIL_APP_PASSWORD) {
      return NextResponse.json(
        { success: false, message: 'Credenciales de email no configuradas' },
        { status: 500 }
      )
    }

    // Obtener los datos del request
    const briefData: BrandBrief = await request.json()
    
    // Crear el transporter de nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    })

    // Configurar el correo
    const mailOptions = {
      from: process.env.GMAIL_EMAIL,
      to: 'contacto@saintagency.com.mx, paolaloya16@gmail.com', // Enviar a ambos correos
      subject: `🎉 Nuevo Brand Brief - ${briefData.step1?.fullName || 'Cliente'} (${briefData.step1?.specialty || 'Especialidad'})`,
      text: createEmailText(briefData),
      html: createEmailHTML(briefData)
    }

    // Enviar el correo
    const info = await transporter.sendMail(mailOptions)
    
    console.log('Correo enviado exitosamente:', info.messageId)
    
    return NextResponse.json({
      success: true,
      message: 'Correo enviado exitosamente',
      messageId: info.messageId
    })
    
  } catch (error) {
    console.error('Error enviando correo:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Error desconocido enviando correo' 
      },
      { status: 500 }
    )
  }
}
