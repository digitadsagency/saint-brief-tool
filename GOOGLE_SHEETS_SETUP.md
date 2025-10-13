# Configuración de Google Sheets

## 📋 Pasos para Configurar la Integración

### 1. Obtener el ID de tu Hoja de Cálculo

1. Ve a tu hoja de Google Sheets
2. Copia la URL de la hoja
3. El ID es la parte larga entre `/d/` y `/edit`

**Ejemplo:**
```
URL: https://docs.google.com/spreadsheets/d/1ABC123DEF456GHI789JKL/edit#gid=0
ID: 1ABC123DEF456GHI789JKL
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con:

```env
# Google Sheets Configuration
NEXT_PUBLIC_GOOGLE_SHEETS_ID=tu_spreadsheet_id_aqui
```

### 3. Configurar la Hoja de Cálculo

Tu hoja debe tener estas columnas (en este orden):

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q | R | S | T | U | V | W | X | Y | Z | AA | AB | AC | AD | AE | AF | AG |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Timestamp | Nombre Completo | Nombre Preferido | Especialidad | Ciudades | Años de Experiencia | Percepción Deseada | Qué NO Eres | Filosofía | Procedimientos Favoritos | Servicios de Alto Valor | Servicios Accesibles | Edad Promedio Paciente | Género Predominante | Miedos Comunes | Qué Te Hace Diferente | Tecnologías Clave | Objetivos Principales | Consultas Nuevas Mensuales | Cuentas Inspiradoras | Por Qué Elegiste Especialidad | Caso que Te Marcó | Frase Común | Visión a 5 Años | Mito a Derribar | Preguntas Frecuentes | Tema de Curiosidad | Ha Hecho Anuncios | Plataformas Usadas | Inversión Mensual | Resultados Obtenidos | Formatos que Funcionaron | Qué No Funcionó |

### 4. Configurar Permisos (Para Producción)

Para un entorno de producción, necesitarás:

1. **Crear un Service Account en Google Cloud Console**
2. **Descargar las credenciales JSON**
3. **Compartir tu hoja con el email del service account**

#### Pasos detallados:

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google Sheets
4. Ve a "Credenciales" → "Crear credenciales" → "Cuenta de servicio"
5. Descarga el archivo JSON de credenciales
6. Agrega estas variables a tu `.env.local`:

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=tu-service-account@proyecto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\ntu_private_key_aqui\n-----END PRIVATE KEY-----"
```

7. Comparte tu hoja de Google Sheets con el email del service account

### 5. Probar la Integración

1. Ejecuta `npm run dev`
2. Completa el formulario hasta el paso 8
3. Haz clic en "Enviar"
4. Verifica que los datos aparezcan en tu hoja de Google Sheets

## 🔧 Funcionalidades Implementadas

- ✅ **Envío automático** de todos los datos del formulario
- ✅ **Timestamp** de cuando se completó el formulario
- ✅ **Validación** antes del envío
- ✅ **Manejo de errores** con mensajes informativos
- ✅ **Formato estructurado** para fácil análisis

## 📊 Estructura de Datos

Los datos se envían como una fila con 33 columnas que incluyen:

- **Información básica** del médico/clínica
- **Identidad y estilo** de marca
- **Procedimientos y servicios**
- **Público objetivo**
- **Diferenciadores competitivos**
- **Metas de marketing**
- **Storytelling y casos**
- **Historial de anuncios**

## 🚨 Notas Importantes

- **Desarrollo**: Actualmente funciona en modo simulación
- **Producción**: Requiere configuración de Service Account
- **Seguridad**: Las credenciales deben estar en variables de entorno
- **Permisos**: La hoja debe ser compartida con el service account

## 🆘 Solución de Problemas

### Error: "Google Sheets ID no configurado"
- Verifica que `NEXT_PUBLIC_GOOGLE_SHEETS_ID` esté en tu `.env.local`

### Error: "Permission denied"
- Asegúrate de que la hoja esté compartida con el service account
- Verifica que las credenciales sean correctas

### Los datos no aparecen en la hoja
- Verifica que el ID de la hoja sea correcto
- Asegúrate de que la hoja tenga las columnas correctas
- Revisa la consola del navegador para errores
