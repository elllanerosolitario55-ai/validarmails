# 🌎 Email Validator Internacional

Aplicación web para verificar emails activos y válidos de **Europa, Norteamérica, Centroamérica, Caribe y Sudamérica**, lista para desplegar en Netlify.

![Preview](https://img.shields.io/badge/Status-Ready_to_Deploy-success)
![Netlify](https://img.shields.io/badge/Netlify-Ready-00C7B7?logo=netlify)
![Countries](https://img.shields.io/badge/Countries-111-blue)

## ✨ Características

- ✅ **Validación de formato** - Verifica que el email tenga formato correcto
- ✅ **Verificación de dominio** - Comprueba que el dominio existe (DNS)
- ✅ **Verificación MX** - Confirma que el dominio tiene servidor de correo
- ✅ **Detección de emails temporales** - Filtra dominios desechables
- 🌍 **Identificación geográfica** - Detecta el país de origen del email
- 📊 **Estadísticas por región** - Agrupa resultados por continente y país
- 📁 **Exportación** - Descarga resultados en TXT o CSV

## 🌎 Regiones Soportadas (111 países/territorios)

| Región | Países | Total |
|--------|--------|-------|
| 🇪🇺 **Europa** | España, Alemania, Francia, Italia, Reino Unido, Portugal, Países Bajos, Bélgica, Suiza, Austria, Polonia, Suecia, Noruega, Dinamarca, Finlandia, Irlanda, Grecia, República Checa, Hungría, Rumanía, Bulgaria, Croacia, Eslovaquia, Eslovenia, Serbia, Ucrania, Rusia, Turquía, Islandia, Luxemburgo, Malta, Chipre, Estonia, Letonia, Lituania, Albania, Macedonia del Norte, Montenegro, Bosnia, Kosovo, Moldavia, Bielorrusia, Andorra, Mónaco, San Marino, Liechtenstein, Vaticano, Gibraltar, Islas Feroe, Åland, Isla de Man, Jersey, Guernsey, Georgia, Armenia, Azerbaiyán | 56 |
| 🇺🇸 **Norteamérica** | Estados Unidos, Canadá, México, Groenlandia, Bermudas, San Pedro y Miquelón | 6 |
| 🌎 **Centroamérica** | Guatemala, Belice, El Salvador, Honduras, Nicaragua, Costa Rica, Panamá | 7 |
| 🏝️ **Caribe** | Cuba, República Dominicana, Puerto Rico, Jamaica, Haití, Trinidad y Tobago, Bahamas, Barbados, Antigua y Barbuda, San Cristóbal y Nieves, Santa Lucía, San Vicente y Granadinas, Granada, Dominica, Aruba, Curazao, Sint Maarten, Bonaire, Islas Caimán, Islas Vírgenes Británicas, Islas Vírgenes de EE.UU., Islas Turcas y Caicos, Anguila, Montserrat, Martinica, Guadalupe, San Bartolomé, San Martín (Francia) | 28 |
| 🇧🇷 **Sudamérica** | Argentina, Brasil, Chile, Colombia, Perú, Venezuela, Ecuador, Bolivia, Paraguay, Uruguay, Guyana, Surinam, Guayana Francesa, Islas Malvinas | 14 |

## 🚀 Despliegue en Netlify

### Opción 1: Deploy directo desde GitHub

1. **Sube el proyecto a GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/tu-usuario/email-validator-es.git
   git push -u origin main
   ```

2. **Conecta con Netlify**
   - Ve a [app.netlify.com](https://app.netlify.com)
   - Click en "Add new site" → "Import an existing project"
   - Selecciona tu repositorio de GitHub
   - Configuración automática (se usa `netlify.toml`)
   - Click en "Deploy site"

### Opción 2: Deploy manual con Netlify CLI

1. **Instala Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Autentícate**
   ```bash
   netlify login
   ```

3. **Despliega**
   ```bash
   cd email-validator-es
   netlify deploy --prod
   ```

### Opción 3: Drag & Drop

1. Ve a [app.netlify.com/drop](https://app.netlify.com/drop)
2. Arrastra la carpeta `public` al navegador
3. ⚠️ Nota: Esta opción NO incluye las funciones serverless

## 📁 Estructura del Proyecto

```
email-validator-es/
├── public/
│   └── index.html          # Frontend principal
├── netlify/
│   └── functions/
│       └── validate-email.js   # API de validación
├── netlify.toml            # Configuración de Netlify
├── package.json
└── README.md
```

## 🔧 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev
# O con Netlify CLI directamente:
netlify dev
```

Esto inicia un servidor en `http://localhost:8888` con las funciones activas.

## 📡 API Endpoints

### POST `/.netlify/functions/validate-email`

**Validar un email:**
```json
{
  "email": "usuario@ejemplo.es"
}
```

**Validar múltiples emails (máx. 100):**
```json
{
  "emails": ["email1@ejemplo.es", "email2@gmail.com"]
}
```

**Respuesta:**
```json
{
  "email": "usuario@ejemplo.es",
  "valid": true,
  "spanish": true,
  "reason": null,
  "checks": {
    "format": true,
    "disposable": false,
    "domain": true,
    "mx": true
  }
}
```

## 🇪🇸 Dominios Españoles Detectados

- Dominios `.es`
- Telefónica / Movistar
- Orange, Vodafone, Jazztel
- MásMóvil, Pepephone, Simyo, Lowi
- Digi, Finetwork, O2
- Euskaltel, Telecable, R
- Y más...

## ⚠️ Limitaciones

- La verificación MX confirma que el dominio puede recibir emails, pero no garantiza que el buzón específico exista
- Algunos servidores de correo bloquean verificaciones SMTP adicionales por seguridad
- Se limita a 100 emails por petición batch

## 📄 Licencia

MIT © 2025
