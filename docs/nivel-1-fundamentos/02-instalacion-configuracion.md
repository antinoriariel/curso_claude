---
sidebar_position: 2
title: "Capitulo 2: Instalacion y Configuracion Inicial"
description: Requisitos del sistema, metodos de instalacion, autenticacion y primer arranque de Claude Code.
tags: [claude-code, instalacion, configuracion, setup]
---

# Capitulo 2: Instalacion y Configuracion Inicial

Antes de poder aprovechar Claude Code, necesitamos preparar el entorno correctamente. Este capitulo te guia paso a paso desde la verificacion de requisitos hasta el primer arranque exitoso, cubriendo los tres sistemas operativos principales y los distintos metodos de instalacion disponibles.

---

## 2.1 Requisitos del sistema y verificacion de entorno

Claude Code es una herramienta de linea de comandos que se ejecuta de forma nativa en macOS y Linux, y en Windows a traves de WSL2 (Windows Subsystem for Linux). Antes de instalar, verifica que tu sistema cumple con los requisitos minimos.

### Tabla de requisitos

| Componente | Requisito minimo | Recomendado |
|---|---|---|
| **Sistema operativo** | macOS 13+, Ubuntu 20.04+ / Debian 10+, Windows 11 con WSL2 | Ultima version estable del SO |
| **Node.js** | v18.0.0 | v20 LTS o superior |
| **npm** | v8+ (incluido con Node.js) | Ultima version estable |
| **RAM** | 4 GB | 8 GB o mas |
| **Almacenamiento** | 500 MB libres | 1 GB o mas |
| **Conexion a internet** | Requerida | Banda ancha estable |
| **Terminal** | Cualquier emulador de terminal | Terminal con soporte Unicode |

:::warning[Windows requiere WSL2]
Claude Code **no se ejecuta de forma nativa en Windows**. Debes tener instalado y configurado WSL2 con una distribucion de Linux (Ubuntu recomendado). Todos los comandos de este curso se ejecutan dentro del entorno WSL2, no en PowerShell ni en CMD.
:::

### Verificacion de entorno

Ejecuta los siguientes comandos en tu terminal para confirmar que cumples los requisitos:

```bash
# Verificar version del sistema operativo
sw_vers              # macOS
lsb_release -a       # Linux
wsl --version        # Windows (desde PowerShell)

# Verificar Node.js y npm
node --version    # Debe mostrar v18.x.x o superior
npm --version     # Debe mostrar v8.x.x o superior
```

Si Node.js no esta instalado o tienes una version anterior, utiliza `nvm` (Node Version Manager):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.bashrc
nvm install --lts
node --version
```

---

## 2.2 Instalacion

Existen tres metodos principales para instalar Claude Code. Elige el que mejor se adapte a tu entorno.

### Metodo 1: Instalacion global con npm (recomendado)

Este es el metodo mas directo y funciona en todos los sistemas operativos compatibles:

```bash
npm install -g @anthropic-ai/claude-code
```

:::note[Permisos en Linux/macOS]
Si obtienes un error de permisos, **no uses `sudo`**. Configura npm para instalar globales en tu directorio de usuario: `npm config set prefix '~/.npm-global'` y agrega `~/.npm-global/bin` a tu PATH.
:::

### Metodo 2: Gestores de paquetes del sistema

**macOS con Homebrew:**

```bash
brew install claude-code
```

**Linux (Debian/Ubuntu):** Consulta la documentacion oficial de Anthropic para agregar el repositorio apt e instalar con `sudo apt install claude-code`.

### Metodo 3: Script de instalacion directa

```bash
curl -fsSL https://cli.anthropic.com/install.sh | bash
```

### Configuracion de WSL2 en Windows

Si estas en Windows, sigue estos pasos antes de instalar Claude Code:

```powershell
# En PowerShell como Administrador:
wsl --install
# Reiniciar el equipo cuando se solicite
```

Una vez dentro de WSL2 (terminal Ubuntu), instala Node.js y Claude Code:

```bash
# Dentro de WSL2
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.bashrc && nvm install --lts
npm install -g @anthropic-ai/claude-code
```

### Solucion de problemas comunes

| Problema | Causa probable | Solucion |
|---|---|---|
| `command not found: claude` | PATH no configurado | Reiniciar la terminal o verificar `~/.bashrc` |
| Error de permisos con npm | npm requiere sudo | Configurar `npm prefix` al directorio del usuario |
| Node.js version antigua | nvm no activo | Ejecutar `nvm use --lts` |
| WSL2 no disponible | Virtualizacion desactivada | Activar VT-x/AMD-V en BIOS |
| Error de conexion | Firewall o proxy | Verificar configuracion de red y proxy |

---

## 2.3 Autenticacion

Claude Code requiere autenticacion para conectarse a los modelos de Anthropic. Existen varias opciones segun tu caso de uso.

### Opcion 1: OAuth con cuenta de Anthropic (recomendado para uso individual)

Este es el metodo mas sencillo. Al ejecutar `claude` por primera vez, se inicia un flujo de autenticacion en el navegador:

```bash
# Ejecutar Claude Code
claude

# El sistema mostrara algo similar a:
# ? How would you like to authenticate?
# > Anthropic (OAuth - recommended)
#   Anthropic (API Key)
#   Other provider
```

**Flujo paso a paso:**

1. Selecciona **"Anthropic (OAuth - recommended)"** con las teclas de flecha y presiona Enter.
2. Se abrira automaticamente tu navegador predeterminado con la pagina de inicio de sesion de Anthropic.
3. Inicia sesion con tu cuenta de Anthropic o crea una nueva.
4. Autoriza a Claude Code para acceder a tu cuenta.
5. El navegador mostrara una confirmacion. Puedes cerrarlo y volver a la terminal.
6. La terminal mostrara que la autenticacion fue exitosa.

```
✓ Authentication successful. Welcome to Claude Code!
```

:::tip[Autenticacion persistente]
Las credenciales se almacenan de forma segura en tu sistema. No necesitaras autenticarte de nuevo a menos que revoques el acceso o cambies de equipo.
:::

### Opcion 2: Clave API de Anthropic Console

Si prefieres usar una clave API directamente (util para scripts o entornos sin navegador):

```bash
# Configurar la clave API como variable de entorno
export ANTHROPIC_API_KEY="sk-ant-api03-xxxxxxxxxxxxx"

# Para hacerla persistente, agregarla al archivo de perfil
echo 'export ANTHROPIC_API_KEY="sk-ant-api03-xxxxxxxxxxxxx"' >> ~/.bashrc
source ~/.bashrc
```

Puedes obtener tu clave API desde [console.anthropic.com](https://console.anthropic.com/) en la seccion **API Keys**.

:::danger[Seguridad de las claves API]
Nunca compartas tu clave API ni la incluyas en repositorios de codigo. Usa variables de entorno o gestores de secretos para manejarla de forma segura.
:::

### Opcion 3: Proveedores externos

Claude Code tambien soporta proveedores como Amazon Bedrock y Google Vertex AI para entornos empresariales:

```bash
# Amazon Bedrock
export CLAUDE_CODE_USE_BEDROCK=1
export AWS_REGION="us-east-1"

# Google Vertex AI
export CLAUDE_CODE_USE_VERTEX=1
export CLOUD_ML_REGION="us-east5"
```

---

## 2.4 Primer arranque

Con la instalacion y autenticacion completadas, es momento de ejecutar Claude Code por primera vez.

### Ejecutar Claude Code

Navega al directorio de un proyecto existente (o crea uno nuevo) y ejecuta:

```bash
# Navegar a tu proyecto
cd ~/mi-proyecto

# Iniciar Claude Code
claude
```

### Onboarding guiado

En el primer arranque, Claude Code presenta un proceso de bienvenida que te guia a traves de las opciones basicas:

1. **Seleccion de tema**: Elige entre modo claro u oscuro para la interfaz.
2. **Permisos**: Claude Code te explica su modelo de permisos y te pide confirmar las operaciones que puede realizar de forma autonoma.
3. **Introduccion al REPL**: Se muestra una breve descripcion de como interactuar con la herramienta.

### Crear CLAUDE.md con /init

El comando `/init` genera un archivo `CLAUDE.md` en la raiz de tu proyecto. Este archivo actua como un contexto persistente que Claude Code lee automaticamente en cada sesion:

```bash
# Dentro de la sesion interactiva de Claude Code, escribe:
/init
```

Claude Code analizara la estructura de tu proyecto y generara un `CLAUDE.md` con informacion relevante como:

- Estructura del proyecto y tecnologias detectadas.
- Comandos de build y test identificados.
- Convenciones de codigo observadas.
- Instrucciones especificas para el asistente.

```markdown
# CLAUDE.md (ejemplo generado)

## Proyecto
Aplicacion web con React y TypeScript.

## Comandos
- Build: `npm run build`
- Test: `npm test`
- Lint: `npm run lint`

## Convenciones
- Usar TypeScript estricto
- Componentes funcionales con hooks
- Tests con Jest y React Testing Library
```

:::info[CLAUDE.md es tu aliado]
Puedes editar `CLAUDE.md` manualmente para agregar instrucciones especificas, como preferencias de estilo de codigo, patrones a seguir o restricciones del proyecto. Claude Code lo leera en cada sesion.
:::

### La interfaz REPL

Una vez dentro de Claude Code, veras una interfaz interactiva (REPL - Read-Eval-Print Loop):

```
╭──────────────────────────────────────╮
│ ● Claude Code                        │
│                                      │
│ Project: ~/mi-proyecto               │
│ Model: claude-sonnet-4-20250514      │
╰──────────────────────────────────────╯

>
```

El cursor `>` indica que Claude Code esta listo para recibir instrucciones en lenguaje natural. Simplemente escribe lo que necesitas, como si hablaras con un colega desarrollador.

---

## 2.5 Verificacion de la instalacion

Antes de continuar con el curso, verifica que todo esta funcionando correctamente.

### Verificar la version

```bash
claude --version
# Salida esperada (ejemplo):
# claude-code 1.0.x
```

### Consultar la ayuda

```bash
claude --help
# Mostrara todas las opciones de linea de comandos disponibles,
# incluyendo flags, modos de ejecucion y variables de entorno.
```

### Diagnostico con /doctor

Dentro de una sesion interactiva, el comando `/doctor` ejecuta una serie de verificaciones de salud del sistema:

```bash
# Dentro de la sesion de Claude Code:
/doctor
```

Salida esperada:

```
Doctor checks:
  ✓ Authentication valid
  ✓ Model access confirmed
  ✓ Node.js version compatible
  ✓ Network connectivity OK
  ✓ Permissions configured
```

Si alguna verificacion falla, `/doctor` proporcionara instrucciones especificas para resolver el problema.

### Prueba rapida

Realiza una prueba rapida para confirmar que Claude Code responde correctamente:

```bash
# Dentro de la sesion interactiva, escribe:
> Hola, confirma que estas funcionando correctamente
```

Claude Code deberia responder confirmando su operacion y mostrando informacion basica del entorno.

---

## Conceptos clave del capitulo

- **WSL2 es obligatorio en Windows**: Claude Code no se ejecuta nativamente en Windows; necesitas WSL2 con una distribucion de Linux.
- **Node.js 18+ es prerequisito**: Sin Node.js instalado, no podras instalar Claude Code via npm.
- **Tres metodos de instalacion**: npm global (recomendado), gestores de paquetes del sistema, o script directo.
- **OAuth es el metodo de autenticacion preferido**: Es el mas simple y seguro para uso individual.
- **CLAUDE.md es contexto persistente**: Generado con `/init`, proporciona a Claude Code informacion sobre tu proyecto en cada sesion.
- **/doctor diagnostica problemas**: Usa este comando para verificar que todo funciona correctamente.

---

## Preguntas de autoevaluacion

1. **Cual es el requisito minimo de Node.js para instalar Claude Code?** Explica por que es importante verificar la version antes de la instalacion.

2. **Por que Claude Code en Windows requiere WSL2 en lugar de ejecutarse nativamente?** Describe los pasos basicos para configurar WSL2.

3. **Cuales son las diferencias entre autenticarse con OAuth y con una clave API?** En que escenarios usarias cada metodo?

4. **Que funcion cumple el archivo CLAUDE.md y como se genera?** Describe al menos tres tipos de informacion que contiene.

5. **Que verificaciones realiza el comando `/doctor`?** Que harias si una de ellas falla?

---

## Laboratorio asociado

**[L2.1]** Instala Claude Code en tu sistema siguiendo el metodo apropiado para tu sistema operativo. Completa la autenticacion, ejecuta `/init` en un proyecto de prueba y verifica la instalacion con `/doctor`. Documenta cada paso y cualquier problema que encuentres durante el proceso.
