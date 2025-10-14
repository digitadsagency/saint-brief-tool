import { NextRequest, NextResponse } from 'next/server'
const nodemailer = require('nodemailer')

export async function GET() {
  try {
    // Verificar variables de entorno
    if (!process.env.GMAIL_EMAIL || !process.env.GMAIL_APP_PASSWORD) {
      return NextResponse.json({
        success: false,
        message: 'Variables de entorno no configuradas',
        details: {
          GMAIL_EMAIL: process.env.GMAIL_EMAIL ? '✅ Configurado' : '❌ No configurado',
          GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD ? '✅ Configurado' : '❌ No configurado'
        }
      })
    }

    // Crear transporter
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    })

    // Configurar correo de prueba
    const mailOptions = {
      from: process.env.GMAIL_EMAIL,
      to: 'contacto@saintagency.com.mx',
      subject: '🧪 Prueba de Email - SAINT Brand Brief',
      text: 'Este es un correo de prueba para verificar que la configuración de email funciona correctamente.',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">🧪 Prueba de Email - SAINT Brand Brief</h2>
          <p>Este es un correo de prueba para verificar que la configuración de email funciona correctamente.</p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
          <p><strong>Estado:</strong> ✅ Sistema de email funcionando</p>
        </div>
      `
    }

    // Enviar correo
    const info = await transporter.sendMail(mailOptions)
    
    return NextResponse.json({
      success: true,
      message: 'Correo de prueba enviado exitosamente',
      messageId: info.messageId,
      details: {
        from: process.env.GMAIL_EMAIL,
        to: 'contacto@saintagency.com.mx',
        subject: '🧪 Prueba de Email - SAINT Brand Brief'
      }
    })
    
  } catch (error) {
    console.error('Error en prueba de email:', error)
    return NextResponse.json({
      success: false,
      message: 'Error enviando correo de prueba',
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}
