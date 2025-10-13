# 📧 Configuración de Gmail para Notificaciones

Esta guía te explica cómo configurar Gmail para recibir notificaciones automáticas cuando se complete un brand brief.

## 🔐 Paso 1: Habilitar Verificación en 2 Pasos

1. **Ve a tu cuenta de Google:** https://myaccount.google.com/
2. **Seguridad** → **Verificación en 2 pasos**
3. **Activar** la verificación en 2 pasos si no está activada
4. **Sigue las instrucciones** para configurarla

## 🔑 Paso 2: Generar Contraseña de Aplicación

1. **Ve a:** https://myaccount.google.com/apppasswords
2. **Selecciona la aplicación:** "Correo"
3. **Selecciona el dispositivo:** "Otro (nombre personalizado)"
4. **Escribe:** "SAINT Brand Brief"
5. **Generar**
6. **Copia la contraseña** de 16 caracteres (ejemplo: `abcd efgh ijkl mnop`)

## ⚙️ Paso 3: Configurar Variables de Entorno

Agrega estas variables a tu archivo `.env.local`:

```env
# Gmail Configuration
GMAIL_EMAIL=tu-email@gmail.com
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
```

**⚠️ IMPORTANTE:**
- Usa tu dirección de Gmail completa
- Usa la contraseña de aplicación (NO tu contraseña normal)
- No incluyas espacios en la contraseña de aplicación

## 🧪 Paso 4: Probar la Configuración

1. **Reinicia el servidor:** `npm run dev`
2. **Completa un brand brief** de prueba
3. **Verifica tu correo** - deberías recibir una notificación

## 📧 Formato del Correo

El correo incluirá:
- ✅ **Asunto:** "🎉 Nuevo Brand Brief - [Nombre] ([Especialidad])"
- ✅ **Resumen completo** de todos los 8 pasos
- ✅ **Formato HTML** con diseño profesional
- ✅ **Versión texto plano** para compatibilidad

## 🔧 Solución de Problemas

### Error: "Invalid login"
- Verifica que la verificación en 2 pasos esté activada
- Usa la contraseña de aplicación, no tu contraseña normal
- Asegúrate de que no hay espacios en la contraseña

### Error: "Less secure app access"
- No uses "Acceso de aplicaciones menos seguras"
- Usa contraseñas de aplicación en su lugar

### No recibes correos
- Revisa la carpeta de spam
- Verifica que el correo se envía a la misma dirección configurada
- Revisa los logs del servidor para errores

## 📱 Configuración Adicional

### Para recibir en múltiples correos:
Modifica `app/api/send-email/route.ts` línea 85:
```typescript
to: 'correo1@gmail.com,correo2@gmail.com,correo3@gmail.com'
```

### Para cambiar el asunto:
Modifica `app/api/send-email/route.ts` línea 87:
```typescript
subject: `Tu mensaje personalizado - ${briefData.step1?.fullName || 'Cliente'}`
```

## 🚀 ¡Listo!

Una vez configurado, recibirás automáticamente un correo cada vez que alguien complete un brand brief con toda la información organizada y profesional.
