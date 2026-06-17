---
sidebar_position: 1
title: "Capitulo 4: Sistema de Configuracion Jerarquica"
description: Archivos de configuracion, settings.json, variables de entorno, modos de permisos y configuracion de modelos.
tags: [claude-code, configuracion, settings, permisos]
---

# Capitulo 4: Sistema de Configuracion Jerarquica

Claude Code no se configura en un solo lugar. Su comportamiento final es el resultado de **multiples capas de configuracion** que se aplican en un orden especifico de precedencia. Entender esta jerarquia es fundamental para controlar el agente de forma predecible, tanto a nivel personal como a nivel de equipo u organizacion.

## 4.1 Archivos de configuracion: scope global, proyecto, local, managed

Claude Code soporta cinco niveles de configuracion. Cada nivel puede sobreescribir los valores del nivel anterior. La regla general es: **lo mas especifico gana**.

### Diagrama de precedencia

```
  Prioridad mas ALTA (gana sobre todo)
  ┌─────────────────────────────────────────────┐
  │  5. ~/.claude/settings.json                 │  Global (usuario)
  ├─────────────────────────────────────────────┤
  │  4. .claude/settings.json                   │  Proyecto (compartido)
  ├─────────────────────────────────────────────┤
  │  3. .claude/settings.local.json             │  Proyecto (personal)
  ├─────────────────────────────────────────────┤
  │  2. Flags de CLI (--model, --permission, …) │  Invocacion
  ├─────────────────────────────────────────────┤
  │  1. Managed settings (organizacion)         │  Empresa / politica
  └─────────────────────────────────────────────┘
  Prioridad mas BAJA
```

:::info Nota sobre precedencia
La documentacion oficial indica que la configuracion *managed* (gestionada por la organizacion) tiene la prioridad mas baja en cuanto a valores por defecto, pero puede **forzar restricciones** que ningun nivel superior puede sobreescribir. Es decir, un administrador puede bloquear herramientas incluso si el usuario las permite en su configuracion global.
:::

### Nivel 1: Managed settings (organizacion)

Son configuraciones definidas por la organizacion a traves de la consola de administracion de Anthropic. Se aplican automaticamente cuando el usuario se autentica con una cuenta gestionada.

- **Caso de uso**: la empresa bloquea el uso de `Bash` sin restricciones, o fuerza un modelo especifico.
- **Ubicacion**: no es un archivo local; se descarga del servidor al iniciar sesion.

### Nivel 2: Flags de CLI

Los flags pasados directamente al comando `claude` tienen efecto solo durante esa ejecucion:

```bash
claude --model claude-sonnet-4-20250514 --permission-mode plan "Analiza este codigo"
```

### Nivel 3: settings.local.json (proyecto, personal)

Archivo ubicado en `.claude/settings.local.json` dentro del repositorio. Esta pensado para preferencias personales del desarrollador que **no deben compartirse** con el equipo.

```
mi-proyecto/
  .claude/
    settings.local.json   # gitignored automaticamente
```

### Nivel 4: settings.json (proyecto, compartido)

Archivo ubicado en `.claude/settings.json` dentro del repositorio. Se versiona con Git y define las reglas compartidas del equipo.

```
mi-proyecto/
  .claude/
    settings.json          # versionado, compartido con el equipo
```

### Nivel 5: settings.json (global, usuario)

Archivo en el directorio home del usuario. Aplica a todos los proyectos donde no exista una configuracion mas especifica.

**Rutas por sistema operativo:**

| Sistema operativo | Ruta                                    |
|-------------------|-----------------------------------------|
| macOS / Linux     | `~/.claude/settings.json`               |
| Windows           | `%USERPROFILE%\.claude\settings.json`   |

:::tip Buena practica
Usa el archivo de proyecto compartido (`.claude/settings.json`) para reglas del equipo (permisos, hooks, modelo). Reserva el global (`~/.claude/settings.json`) para preferencias puramente personales como atajos o variables de entorno de tu maquina.
:::

---

## 4.2 settings.json: schema completo y campos disponibles

El archivo `settings.json` acepta los mismos campos en cualquiera de sus scopes (global, proyecto, local). A continuacion se muestra un ejemplo anotado con los campos mas comunes.

### Ejemplo completo anotado

```json
{
  // --- Permisos ---
  "permissions": {
    "allow": [
      "Bash(npm run build)",
      "Bash(npm test)",
      "Bash(git status)",
      "Bash(git diff)",
      "Read",
      "Write",
      "Edit"
    ],
    "deny": [
      "Bash(rm -rf /)",
      "Bash(git push --force)"
    ]
  },

  // --- Hooks (eventos del ciclo de vida) ---
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Ejecutando herramienta Bash...'"
          }
        ]
      }
    ],
    "PostToolUse": [],
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "notify-send 'Claude Code' 'Tarea completada'"
          }
        ]
      }
    ]
  },

  // --- Variables de entorno ---
  "env": {
    "NODE_ENV": "development",
    "DEBUG": "true"
  },

  // --- Modelo por defecto ---
  "model": "claude-sonnet-4-20250514",

  // --- Memoria automatica ---
  "autoMemoryEnabled": true,
  "autoMemoryDirectory": ".claude/memory"
}
```

### Descripcion de campos principales

| Campo                  | Tipo     | Descripcion                                                                 |
|------------------------|----------|-----------------------------------------------------------------------------|
| `permissions.allow`    | string[] | Lista de herramientas y patrones permitidos sin pedir confirmacion          |
| `permissions.deny`     | string[] | Lista de herramientas y patrones bloqueados permanentemente                 |
| `hooks`                | object   | Comandos que se ejecutan en eventos del ciclo de vida del agente            |
| `env`                  | object   | Variables de entorno inyectadas en la sesion de Claude Code                 |
| `model`                | string   | Modelo por defecto para las sesiones                                        |
| `autoMemoryEnabled`    | boolean  | Activa o desactiva la memoria automatica entre sesiones                     |
| `autoMemoryDirectory`  | string   | Directorio donde se almacena la memoria automatica                          |

:::warning Sintaxis JSON estricta
El archivo `settings.json` debe ser JSON valido. Los comentarios (`//`) mostrados arriba son solo para fines didacticos. En tu archivo real, **no incluyas comentarios** ya que causaran un error de parseo.
:::

---

## 4.3 Variables de entorno

Claude Code lee multiples variables de entorno que modifican su comportamiento. Puedes definirlas en tu shell, en tu archivo `.bashrc`/`.zshrc`, o directamente en el campo `env` de `settings.json`.

### Catalogo de variables principales

| Variable                             | Descripcion                                                        | Valor por defecto |
|--------------------------------------|--------------------------------------------------------------------|-------------------|
| `ANTHROPIC_API_KEY`                  | Clave de API para autenticacion directa con Anthropic              | (ninguno)         |
| `CLAUDE_CODE_SAFE_MODE`              | Activa el modo seguro, deshabilitando ejecucion de comandos        | `false`           |
| `CLAUDE_AUTOCOMPACT_PCT_THRESHOLD`   | Porcentaje de uso de contexto que dispara la compactacion automatica| `80`              |
| `CLAUDE_CODE_SIMPLE`                 | Activa el modo de salida simplificada (sin Markdown)               | `false`           |
| `CLAUDE_CODE_MAX_TURNS`              | Limite maximo de turnos en una sesion                               | (sin limite)      |
| `CLAUDE_CODE_USE_BEDROCK`            | Usa Amazon Bedrock como backend en lugar de la API directa         | `false`           |
| `CLAUDE_CODE_USE_VERTEX`             | Usa Google Vertex AI como backend                                  | `false`           |
| `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` | Desactiva telemetria y trafico no esencial                   | `false`           |

### Configurar variables en diferentes sistemas

**Linux / macOS (bash/zsh):**

```bash
# En el archivo ~/.bashrc o ~/.zshrc
export ANTHROPIC_API_KEY="sk-ant-..."
export CLAUDE_AUTOCOMPACT_PCT_THRESHOLD=70
```

**Windows (PowerShell):**

```powershell
# En el perfil de PowerShell ($PROFILE)
$env:ANTHROPIC_API_KEY = "sk-ant-..."
$env:CLAUDE_AUTOCOMPACT_PCT_THRESHOLD = "70"
```

**Windows (cmd):**

```cmd
set ANTHROPIC_API_KEY=sk-ant-...
set CLAUDE_AUTOCOMPACT_PCT_THRESHOLD=70
```

**Dentro de settings.json (aplica a todas las sesiones del proyecto):**

```json
{
  "env": {
    "ANTHROPIC_API_KEY": "sk-ant-...",
    "CLAUDE_AUTOCOMPACT_PCT_THRESHOLD": "70",
    "NODE_ENV": "development"
  }
}
```

:::warning Seguridad de claves API
Nunca incluyas tu `ANTHROPIC_API_KEY` en archivos que se versionan con Git (como `.claude/settings.json`). Usa variables de entorno del sistema o el archivo `.claude/settings.local.json` que esta automaticamente en `.gitignore`.
:::

---

## 4.4 Modos de permisos

Claude Code opera con un sistema de permisos que controla que acciones puede realizar el agente sin pedir confirmacion. El modo de permisos se selecciona al iniciar la sesion o mediante flags de CLI.

### Modos disponibles

| Modo               | Flag CLI              | Descripcion                                                              |
|--------------------|-----------------------|--------------------------------------------------------------------------|
| **Default**        | (ninguno)             | Pide confirmacion para cada herramienta que no este en la lista `allow`  |
| **AcceptEdits**    | `--permission-mode acceptedits` | Permite lectura y escritura de archivos sin confirmacion. Pide confirmacion para Bash y otras herramientas |
| **Plan**           | `--permission-mode plan`        | Solo lectura. Claude analiza y planifica pero no modifica nada           |
| **Auto**           | `--permission-mode auto`        | Permite todas las herramientas de la lista `allow` sin confirmacion. Sigue pidiendo confirmacion para las no listadas |
| **BypassPermissions** | `--dangerously-skip-permissions` | Permite **todo** sin confirmacion alguna                             |

### Tabla comparativa detallada

| Accion                        | Default | AcceptEdits | Plan | Auto | BypassPermissions |
|-------------------------------|---------|-------------|------|------|-------------------|
| Leer archivos                 | Pide    | Permite     | Permite | Permite | Permite       |
| Escribir/editar archivos      | Pide    | Permite     | Bloquea | Segun allow | Permite   |
| Ejecutar comandos Bash        | Pide    | Pide        | Bloquea | Segun allow | Permite   |
| Busqueda web                  | Pide    | Pide        | Permite | Segun allow | Permite   |
| Herramientas MCP              | Pide    | Pide        | Bloquea | Segun allow | Permite   |
| Comandos destructivos         | Pide    | Pide        | Bloquea | Pide        | Permite   |

### Seleccionar el modo adecuado

```bash
# Modo plan: ideal para revision de codigo sin riesgo de modificaciones
claude --permission-mode plan "Revisa este PR y dame feedback"

# Modo acceptedits: util cuando confias en las ediciones pero quieres controlar comandos
claude --permission-mode acceptedits "Refactoriza el modulo de autenticacion"

# Modo auto: para flujos automatizados con lista allow bien definida
claude --permission-mode auto "Ejecuta los tests y corrige los que fallen"
```

:::warning Riesgo de BypassPermissions
El modo `--dangerously-skip-permissions` desactiva **todas** las protecciones. Nunca lo uses en entornos de produccion ni con repositorios que contengan datos sensibles. Esta pensado exclusivamente para entornos de desarrollo aislados y sandboxes desechables.
:::

:::tip Recomendacion para equipos
Define los permisos base en `.claude/settings.json` del proyecto con una lista `allow` restrictiva. Luego cada desarrollador puede relajar permisos en su `.claude/settings.local.json` segun su nivel de confianza, sin afectar al resto del equipo.
:::

---

## 4.5 Configuracion de modelos por defecto y cadenas de respaldo

Claude Code permite seleccionar que modelo usar por defecto y definir cadenas de respaldo para garantizar alta disponibilidad.

### Configurar el modelo por defecto

**En settings.json:**

```json
{
  "model": "claude-sonnet-4-20250514"
}
```

**Mediante flag de CLI (sobreescribe settings.json):**

```bash
claude --model claude-sonnet-4-20250514 "Analiza este proyecto"
```

**Modelos disponibles comunes:**

| Modelo                         | Caso de uso tipico                                    |
|--------------------------------|-------------------------------------------------------|
| `claude-sonnet-4-20250514`     | Equilibrio entre capacidad y velocidad. Uso general   |
| `claude-opus-4-20250514`       | Tareas complejas que requieren razonamiento profundo   |
| `claude-haiku-3-20250307`      | Tareas rapidas y de bajo costo                         |

### Cadenas de respaldo (fallback)

Cuando se usa Claude Code a traves de proveedores como Amazon Bedrock o Google Vertex AI, es posible configurar cadenas de respaldo. Si el modelo principal no esta disponible (por limite de tasa, mantenimiento, etc.), Claude Code intenta automaticamente con el siguiente modelo de la cadena.

```bash
# Uso con Bedrock y modelo especifico
CLAUDE_CODE_USE_BEDROCK=1 claude --model us.anthropic.claude-sonnet-4-20250514-v1:0
```

### Ejemplo practico: configuracion por proyecto

Un equipo puede definir un modelo economico para tareas rutinarias y reservar el modelo mas potente para tareas criticas:

```json
{
  "model": "claude-sonnet-4-20250514"
}
```

Y un desarrollador individual puede sobreescribirlo en su `settings.local.json`:

```json
{
  "model": "claude-opus-4-20250514"
}
```

:::tip Optimizacion de costos
Usa `claude-sonnet-4-20250514` como modelo por defecto para el equipo. Reserva `claude-opus-4-20250514` para sesiones donde necesites razonamiento profundo (refactorizaciones arquitectonicas, debugging complejo). La diferencia de costo puede ser significativa a escala.
:::

---

## Conceptos clave del capitulo

:::tip Resumen
- Claude Code tiene **cinco niveles de configuracion** con precedencia ascendente: managed, CLI flags, local, proyecto, global.
- El archivo `settings.json` centraliza permisos, hooks, variables de entorno y modelo por defecto.
- Las **variables de entorno** permiten controlar comportamiento sin modificar archivos de configuracion.
- Los **modos de permisos** (Default, AcceptEdits, Plan, Auto, BypassPermissions) controlan el nivel de autonomia del agente.
- La **configuracion de modelos** permite optimizar costos y disponibilidad segun el tipo de tarea.
- Siempre separa la configuracion compartida (`.claude/settings.json`) de la personal (`.claude/settings.local.json`).
:::

---

## Autoevaluacion

1. Si defines `model: "claude-opus-4-20250514"` en `.claude/settings.json` y ejecutas `claude --model claude-sonnet-4-20250514`, cual modelo se usa y por que?

2. Un companero de equipo reporta que Claude Code le pide confirmacion para ejecutar `npm test` a pesar de que esta en la lista `allow` del proyecto. Que podria estar causando este comportamiento?

3. Cual es la diferencia entre definir una variable de entorno en tu `.bashrc` y definirla en el campo `env` de `settings.json`?

4. En que escenarios usarias el modo `Plan` en lugar del modo `Default`?

5. Tu organizacion necesita que ningun desarrollador pueda ejecutar `git push --force` a traves de Claude Code. Donde y como configurarias esta restriccion para que ningun nivel pueda sobreescribirla?

---

## Laboratorio asociado

Practica los conceptos de este capitulo en el **[Laboratorio L4.1: Configuracion Jerarquica en Practica](/laboratorios/L4-1-configuracion-settings)**.
