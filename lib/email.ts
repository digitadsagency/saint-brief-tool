import { BrandBrief } from './schemas'

// Función para enviar correo usando nuestra API route
export async function sendEmailNotification(briefData: BrandBrief): Promise<{ success: boolean; message: string }> {
  try {
    console.log('Enviando notificación por correo...')
    
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(briefData),
    })

    const result = await response.json()
    
    if (response.ok && result.success) {
      console.log('Correo enviado exitosamente:', result.message)
      return {
        success: true,
        message: result.message
      }
    } else {
      console.error('Error enviando correo:', result.message)
      return {
        success: false,
        message: result.message || 'Error enviando notificación por correo'
      }
    }
    
  } catch (error) {
    console.error('Error enviando notificación por correo:', error)
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}
