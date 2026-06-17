---
sidebar_position: 3
title: "Capítulo 6: Hooks — Automatización del Ciclo de Vida"
description: Arquitectura de hooks, eventos del ciclo, tipos de handler, matchers, filtros y patrones de producción.
tags: [claude-code, hooks, automatización, eventos, handlers]
---

# Capitulo 6: Hooks — Automatizacion del Ciclo de Vida

Los hooks son el mecanismo que convierte a Claude Code de un agente conversacional en una **plataforma de automatizacion programable**. Mientras que los skills y las instrucciones en CLAUDE.md guian al modelo mediante lenguaje natural, los hooks operan en un plano completamente diferente: son **deterministas, imperativos e ineludibles**. Si un hook esta configurado, se ejecuta. Sin excepcion.

Este capitulo te ensenara a controlar cada punto del ciclo de vida de Claude Code con precision quirurgica.

---

## 6.1 Arquitectura de hooks: eventos y tipos de handler

### Que es un hook

Un hook es una **accion automatica que se dispara en un punto especifico del ciclo de vida** de una sesion de Claude Code. A diferencia de las instrucciones en CLAUDE.md (que el modelo puede interpretar, priorizar o incluso ignorar), un hook se ejecuta de forma determinista cada vez que se produce el evento asociado.

### Hooks vs. Skills: dos mecanismos complementarios

| Caracteristica | Hooks | Skills |
|---------------|-------|--------|
| Ejecucion | Determinista, siempre se ejecuta | Guiada por el LLM, puede no activarse |
| Control | Imperativo (codigo/scripts) | Declarativo (lenguaje natural) |
| Quien decide | El sistema (configuracion) | El modelo (interpretacion) |
| Puede bloquear | Si (exit code 2) | No directamente |
| Visibilidad | Transparente, auditable | Depende del contexto del modelo |
| Caso de uso tipico | Seguridad, formato, logging | Flujos de trabajo contextuales |

Esta distincion es fundamental: los hooks son para lo que **debe** ocurrir; los skills para lo que **deberia** ocurrir.

### Los cinco tipos de handler

Cada hook puede ejecutar una accion mediante uno de estos cinco mecanismos:

1. **Shell command (`command`)**: ejecuta un script o comando del sistema operativo. Es el tipo mas comun y versatil. Recibe datos del evento como JSON en stdin y puede devolver resultados en stdout.

2. **HTTP endpoint (`url`)**: envia una peticion POST a una URL con el payload del evento en formato JSON. Ideal para integraciones con servicios externos (Slack, webhooks, APIs).

3. **LLM prompt (`prompt`)**: envia un prompt a Claude para que tome una decision basada en el contexto del evento. Util para validaciones que requieren comprension semantica.

4. **MCP tool (`mcp_tool`)**: invoca una herramienta expuesta por un servidor MCP conectado. Permite integrar hooks con el ecosistema de herramientas externas.

5. **Agent (`agent`)**: lanza un subagente especializado para manejar el evento. Apropiado para tareas complejas que requieren multiples pasos.

### Taxonomia de eventos

Claude Code expone eventos agrupados en seis categorias logicas. Cada evento representa un punto preciso del ciclo de vida donde puedes inyectar logica:

| Grupo | Evento | Descripcion |
|-------|--------|-------------|
| **Sesion** | `SessionStart` | Inicio o reanudacion de sesion |
| | `SessionEnd` | Finalizacion de sesion |
| | `Setup` | Preparacion del entorno (CI) |
| **Prompt / Turno** | `UserPromptSubmit` | Usuario envia un prompt (antes de procesar) |
| | `Stop` | Claude termina de responder |
| | `Notification` | Se genera una notificacion al usuario |
| **Herramientas** | `PreToolUse` | Antes de ejecutar una herramienta |
| | `PostToolUse` | Despues de ejecutar una herramienta exitosamente |
| | `PostToolBatch` | Despues de ejecutar un lote de herramientas |
| | `PermissionRequest` | Se solicita permiso al usuario |
| **Subagentes / Tareas** | `SubagentStart` | Un subagente comienza ejecucion |
| | `SubagentStop` | Un subagente finaliza ejecucion |
| | `TaskStart` | Una tarea interna comienza |
| | `TaskStop` | Una tarea interna finaliza |
| **Compactacion / Worktrees** | `Compact` | Se compacta la ventana de contexto |
| | `WorktreeCreate` | Se crea un worktree de git |
| | `WorktreeDelete` | Se elimina un worktree |
| **MCP / Elicitacion** | `McpToolCall` | Se invoca una herramienta MCP |
| | `McpToolResult` | Se recibe resultado de herramienta MCP |

:::info Eventos en expansion
La lista de eventos crece con cada version de Claude Code. Los eventos listados aqui cubren los mas utilizados y estables. Consulta la documentacion oficial para la lista completa actualizada.
:::

---

## 6.2 Eventos del ciclo

Entender **cuando** se dispara cada evento y **que informacion recibe** es esencial para disenar hooks efectivos.

### Flujo de eventos en una sesion tipica

El siguiente diagrama muestra el orden en que se disparan los eventos durante una interaccion normal:

```
┌─────────────────────────────────────────────────────────┐
│                    SESION DE CLAUDE CODE                 │
│                                                         │
│  ┌──────────────┐                                       │
│  │ SessionStart │ ◄── Inicio o reanudacion              │
│  └──────┬───────┘                                       │
│         │                                               │
│         ▼                                               │
│  ┌──────────────┐                                       │
│  │    Setup      │ ◄── Solo en modo CI / headless        │
│  └──────┬───────┘                                       │
│         │                                               │
│  ┌──────┴──────────────────────────────────────┐        │
│  │          CICLO DE TURNOS (se repite)         │        │
│  │                                              │        │
│  │  ┌───────────────────┐                       │        │
│  │  │ UserPromptSubmit  │ ◄── Puede bloquear    │        │
│  │  └────────┬──────────┘                       │        │
│  │           │                                  │        │
│  │           ▼                                  │        │
│  │  ┌─────────────────────────────────┐         │        │
│  │  │   CICLO DE HERRAMIENTAS         │         │        │
│  │  │                                 │         │        │
│  │  │  ┌──────────────┐               │         │        │
│  │  │  │ PreToolUse   │ ◄── Bloquear? │         │        │
│  │  │  └──────┬───────┘               │         │        │
│  │  │         │ permitido             │         │        │
│  │  │         ▼                       │         │        │
│  │  │  ┌──────────────────┐           │         │        │
│  │  │  │ PermissionRequest│ (si aplica)│        │        │
│  │  │  └──────┬───────────┘           │         │        │
│  │  │         │                       │         │        │
│  │  │         ▼                       │         │        │
│  │  │  ┌──────────────┐               │         │        │
│  │  │  │ [Ejecucion]  │               │         │        │
│  │  │  └──────┬───────┘               │         │        │
│  │  │         │                       │         │        │
│  │  │         ▼                       │         │        │
│  │  │  ┌──────────────┐               │         │        │
│  │  │  │ PostToolUse  │               │         │        │
│  │  │  └──────────────┘               │         │        │
│  │  │                                 │         │        │
│  │  └────────┬────────────────────────┘         │        │
│  │           │                                  │        │
│  │           ▼                                  │        │
│  │  ┌────────────────┐                          │        │
│  │  │ PostToolBatch  │                          │        │
│  │  └────────┬───────┘                          │        │
│  │           │                                  │        │
│  │           ▼                                  │        │
│  │  ┌────────────────┐                          │        │
│  │  │     Stop       │ ◄── Claude termina       │        │
│  │  └────────────────┘                          │        │
│  │                                              │        │
│  └──────────────────────────────────────────────┘        │
│         │                                               │
│         ▼                                               │
│  ┌──────────────┐                                       │
│  │  SessionEnd  │ ◄── Cierre de sesion                  │
│  └──────────────┘                                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Detalle de cada evento clave

#### SessionStart

Se dispara al **iniciar o reanudar** una sesion. Es el primer evento del ciclo y el lugar ideal para:
- Inyectar contexto adicional (variables de entorno, estado del proyecto).
- Verificar prerequisitos del entorno.
- Registrar el inicio de sesion para auditoria.

```json
{
  "type": "SessionStart",
  "session_id": "sess_abc123",
  "is_resume": false,
  "cwd": "/home/user/project"
}
```

#### Setup

Se dispara **solo en modo CI o headless** (`claude --ci` o `claude -p`). Permite preparar el entorno antes de que comience la interaccion:
- Instalar dependencias.
- Configurar variables de entorno.
- Validar credenciales.

#### UserPromptSubmit

Se dispara **antes de que Claude procese el prompt del usuario**. Este evento es critico porque puede **bloquear** el procesamiento:
- Exit code 0: permitir el prompt.
- Exit code 2: bloquear el prompt (no se procesa).

Casos de uso: filtrar prompts que contengan informacion sensible, aplicar politicas de uso, redirigir consultas.

```json
{
  "type": "UserPromptSubmit",
  "prompt": "borra todos los archivos del servidor de produccion",
  "session_id": "sess_abc123"
}
```

#### PreToolUse

Se dispara **antes de cada invocacion de herramienta**. Es el guardian mas poderoso del sistema:
- Exit code 0: permitir la ejecucion.
- Exit code 2: bloquear la ejecucion (la herramienta no se ejecuta).

El hook recibe informacion completa sobre la herramienta y sus argumentos:

```json
{
  "type": "PreToolUse",
  "tool_name": "Bash",
  "tool_input": {
    "command": "rm -rf /important-data"
  },
  "session_id": "sess_abc123"
}
```

#### PostToolUse

Se dispara **despues de que una herramienta se ejecuta exitosamente**. Es puramente observacional (no puede bloquear) y es ideal para:
- Ejecutar formateo automatico despues de ediciones.
- Registrar que herramientas se usaron y con que parametros.
- Disparar acciones secundarias basadas en resultados.

```json
{
  "type": "PostToolUse",
  "tool_name": "Edit",
  "tool_input": {
    "file_path": "/src/app.ts",
    "old_string": "...",
    "new_string": "..."
  },
  "tool_output": "File edited successfully",
  "session_id": "sess_abc123"
}
```

#### PostToolBatch

Se dispara **despues de que un lote completo de herramientas termina de ejecutarse**. Util cuando necesitas una accion que responda al conjunto de operaciones, no a cada una individualmente (por ejemplo, ejecutar tests despues de multiples ediciones).

#### PermissionRequest

Se dispara **cuando Claude necesita solicitar permiso al usuario** para ejecutar una accion. Permite automatizar respuestas a dialogos de permisos en entornos controlados.

#### Stop

Se dispara **cuando Claude termina de generar su respuesta**. Casos de uso comunes:
- Enviar notificaciones (Slack, email) de que la tarea termino.
- Registrar metricas de la sesion.
- Ejecutar validaciones finales.

```json
{
  "type": "Stop",
  "stop_reason": "end_turn",
  "session_id": "sess_abc123"
}
```

#### SessionEnd

Se dispara al **cerrar la sesion**. Ultimo evento del ciclo, ideal para limpieza de recursos, envio de reportes finales y cierre de conexiones.

---

## 6.3 Tipos de handler

Cada hook se define en `settings.json` dentro del objeto `hooks`. La estructura general es:

```json
{
  "hooks": {
    "<NombreDelEvento>": [
      {
        "type": "<tipo_de_handler>",
        "matcher": "<patron_opcional>",
        // ... configuracion especifica del handler
      }
    ]
  }
}
```

Veamos cada tipo de handler en detalle.

### Shell command (`command`)

El tipo mas utilizado. Ejecuta un comando del sistema operativo. El hook recibe el payload del evento como **JSON en stdin** y puede devolver resultados en **stdout**.

**Configuracion:**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "type": "command",
        "matcher": "Edit",
        "command": "npx prettier --write \"$FILE_PATH\""
      }
    ]
  }
}
```

**Script completo que procesa JSON de stdin:**

```bash
#!/bin/bash
# hooks/validate-edit.sh
# Lee el JSON del evento desde stdin
INPUT=$(cat)

# Extrae campos con jq
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Logica de validacion
if [[ "$FILE_PATH" == *.env* ]]; then
  echo "BLOQUEADO: no se permite editar archivos .env"
  exit 2  # Bloquear
fi

# Permitir
exit 0
```

**Configuracion para usar el script:**

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "type": "command",
        "matcher": "Edit",
        "command": "bash ./hooks/validate-edit.sh"
      }
    ]
  }
}
```

**JSON de entrada que recibe el script (stdin):**

```json
{
  "type": "PreToolUse",
  "tool_name": "Edit",
  "tool_input": {
    "file_path": "/src/config/.env.production",
    "old_string": "API_KEY=sk-old",
    "new_string": "API_KEY=sk-new"
  },
  "session_id": "sess_abc123"
}
```

**JSON de salida que puede devolver (stdout):**

```json
{
  "decision": "block",
  "reason": "No se permite editar archivos .env desde Claude Code"
}
```

### HTTP endpoint (`url`)

Envia una peticion **POST** a una URL con el payload del evento. La respuesta HTTP determina el comportamiento:
- **2xx**: exito (equivalente a exit code 0).
- **4xx**: bloqueo (equivalente a exit code 2).

```json
{
  "hooks": {
    "Stop": [
      {
        "type": "url",
        "url": "https://hooks.slack.com/services/T00/B00/xxx",
        "timeout": 5000
      }
    ]
  }
}
```

El servidor recibe un POST con el payload completo del evento:

```json
{
  "type": "Stop",
  "stop_reason": "end_turn",
  "session_id": "sess_abc123",
  "timestamp": "2025-07-15T10:30:00Z"
}
```

### LLM prompt (`prompt`)

Envia un prompt a Claude para que evalue el evento y tome una decision. Util para validaciones que requieren **comprension semantica** del contenido.

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "type": "prompt",
        "prompt": "Evalua si el siguiente prompt del usuario contiene instrucciones potencialmente destructivas para el sistema de archivos. Responde SOLO con 'allow' o 'block'. Prompt del usuario: {{prompt}}"
      }
    ]
  }
}
```

:::warning Latencia del handler LLM
Los handlers de tipo `prompt` incurren en una llamada adicional al LLM, lo que anade latencia significativa (1-5 segundos). Usalos solo cuando la validacion requiere comprension semantica que no puedas resolver con un script.
:::

### MCP tool (`mcp_tool`)

Invoca una herramienta expuesta por un servidor MCP conectado. Combina la potencia de los hooks con el ecosistema de herramientas MCP.

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "type": "mcp_tool",
        "server": "mi-servidor-mcp",
        "tool": "registrar_actividad",
        "matcher": "Bash"
      }
    ]
  }
}
```

### Agent (`agent`)

Lanza un subagente especializado para procesar el evento. El subagente tiene acceso completo a las herramientas de Claude Code y puede ejecutar flujos complejos.

```json
{
  "hooks": {
    "Stop": [
      {
        "type": "agent",
        "prompt": "Revisa los cambios realizados en esta sesion. Si hay archivos TypeScript modificados, ejecuta el linter y reporta cualquier error encontrado."
      }
    ]
  }
}
```

### Tabla comparativa de handlers

| Handler | Latencia | Complejidad | Puede bloquear | Caso de uso ideal |
|---------|----------|-------------|----------------|-------------------|
| `command` | Baja | Media | Si | Validacion, formato, logging |
| `url` | Media | Baja | Si | Webhooks, notificaciones |
| `prompt` | Alta | Baja | Si | Validacion semantica |
| `mcp_tool` | Media | Media | Si | Integracion con herramientas |
| `agent` | Alta | Alta | No tipicamente | Tareas complejas post-evento |

---

## 6.4 Matchers, filtros y control de flujo

### Matchers: cuando se ejecuta un hook

Un **matcher** define **para que herramientas o condiciones** se activa un hook. Sin matcher, el hook se ejecuta para **todos** los casos del evento asociado.

**Matcher por nombre de herramienta:**

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "type": "command",
        "matcher": "Bash",
        "command": "bash ./hooks/validate-bash.sh"
      }
    ]
  }
}
```

Este hook solo se activa cuando Claude intenta usar la herramienta `Bash`.

**Matcher con patron glob:**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "type": "command",
        "matcher": "Edit",
        "command": "npx prettier --write \"$EDITED_FILE\"",
        "if": "tool_input.file_path matches '*.ts' or tool_input.file_path matches '*.tsx'"
      }
    ]
  }
}
```

**Sin matcher (se ejecuta para todas las herramientas):**

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "type": "command",
        "command": "bash ./hooks/audit-all-tools.sh"
      }
    ]
  }
}
```

### Codigos de salida: el sistema de control

Los codigos de salida de un handler shell determinan el flujo:

| Codigo | Significado | Efecto |
|--------|------------|--------|
| `0` | Exito / permitir | La operacion continua normalmente |
| `1` | Error del hook | Se registra el error, la operacion continua |
| `2` | Bloquear | La operacion se cancela (solo en eventos bloqueantes) |

:::warning Solo algunos eventos son bloqueantes
Solo `UserPromptSubmit` y `PreToolUse` respetan el exit code 2 para bloquear. En eventos como `PostToolUse` o `Stop`, el exit code 2 se trata como un error, no como un bloqueo (la accion ya ocurrio).
:::

### Filtros condicionales con `if`

El campo `"if"` permite agregar condiciones adicionales que se evaluan antes de ejecutar el handler:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "type": "command",
        "matcher": "Bash",
        "command": "bash ./hooks/block-dangerous.sh",
        "if": "tool_input.command contains 'rm -rf' or tool_input.command contains 'dd '"
      }
    ]
  }
}
```

### Timeout

Cada handler tiene un **timeout configurable** (por defecto **10 segundos**). Si el handler no responde en ese tiempo, se considera fallido:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "type": "command",
        "matcher": "Bash",
        "command": "bash ./hooks/security-check.sh",
        "timeout": 30000
      }
    ]
  }
}
```

El timeout se especifica en **milisegundos**. Para hooks que llaman a servicios externos, considera aumentar el valor.

### Multiples hooks por evento

Un mismo evento puede tener **multiples hooks** que se ejecutan en orden. Si cualquiera bloquea, la operacion se cancela:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "type": "command",
        "matcher": "Bash",
        "command": "bash ./hooks/check-security.sh"
      },
      {
        "type": "command",
        "matcher": "Bash",
        "command": "bash ./hooks/log-command.sh"
      },
      {
        "type": "command",
        "matcher": "Edit",
        "command": "bash ./hooks/check-file-permissions.sh"
      }
    ]
  }
}
```

---

## 6.5 Patrones de produccion

Esta seccion presenta patrones probados en entornos reales, listos para copiar y adaptar.

### Patron 1: Auto-formato despues de edicion

Ejecuta Prettier automaticamente cada vez que Claude edita un archivo TypeScript o JavaScript:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "type": "command",
        "matcher": "Edit",
        "command": "bash -c 'INPUT=$(cat); FILE=$(echo \"$INPUT\" | jq -r \".tool_input.file_path\"); if [[ \"$FILE\" =~ \\.(ts|tsx|js|jsx)$ ]]; then npx prettier --write \"$FILE\" 2>/dev/null; fi'"
      }
    ]
  }
}
```

**Version con script separado** (recomendada para mantenimiento):

```bash
#!/bin/bash
# hooks/auto-format.sh
INPUT=$(cat)
FILE=$(echo "$INPUT" | jq -r '.tool_input.file_path')

# Solo formatear archivos JS/TS
if [[ "$FILE" =~ \.(ts|tsx|js|jsx|json|css|scss)$ ]]; then
  npx prettier --write "$FILE" 2>/dev/null
  echo "Formateado: $FILE"
fi
```

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "type": "command",
        "matcher": "Edit",
        "command": "bash ./hooks/auto-format.sh"
      }
    ]
  }
}
```

### Patron 2: Bloqueo de comandos peligrosos

Previene la ejecucion de comandos destructivos:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "type": "command",
        "matcher": "Bash",
        "command": "bash -c 'INPUT=$(cat); CMD=$(echo \"$INPUT\" | jq -r \".tool_input.command\"); DANGEROUS_PATTERNS=(\"rm -rf /\" \"rm -rf ~\" \"dd if=\" \"mkfs.\" \":(){ :|:& };:\" \"> /dev/sda\" \"chmod -R 777 /\" \"git push --force origin main\"); for pattern in \"${DANGEROUS_PATTERNS[@]}\"; do if echo \"$CMD\" | grep -qF \"$pattern\"; then echo \"BLOQUEADO: comando peligroso detectado: $pattern\"; exit 2; fi; done; exit 0'"
      }
    ]
  }
}
```

**Version con script separado** (recomendada):

```bash
#!/bin/bash
# hooks/block-dangerous.sh
INPUT=$(cat)
CMD=$(echo "$INPUT" | jq -r '.tool_input.command')

# Lista de patrones peligrosos
DANGEROUS_PATTERNS=(
  "rm -rf /"
  "rm -rf ~"
  "dd if="
  "mkfs."
  ":(){ :|:& };:"
  "> /dev/sda"
  "chmod -R 777 /"
  "git push --force origin main"
  "DROP TABLE"
  "DROP DATABASE"
)

for pattern in "${DANGEROUS_PATTERNS[@]}"; do
  if echo "$CMD" | grep -qF "$pattern"; then
    echo "BLOQUEADO: comando peligroso detectado -> $pattern"
    exit 2
  fi
done

exit 0
```

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "type": "command",
        "matcher": "Bash",
        "command": "bash ./hooks/block-dangerous.sh"
      }
    ]
  }
}
```

### Patron 3: Audit logging de todas las invocaciones

Registra cada herramienta ejecutada en un archivo de log con formato estructurado:

```bash
#!/bin/bash
# hooks/audit-log.sh
INPUT=$(cat)
TOOL=$(echo "$INPUT" | jq -r '.tool_name')
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
SESSION=$(echo "$INPUT" | jq -r '.session_id')
TOOL_INPUT=$(echo "$INPUT" | jq -c '.tool_input')

LOG_DIR="$HOME/.claude/logs"
mkdir -p "$LOG_DIR"

echo "{\"timestamp\":\"$TIMESTAMP\",\"session\":\"$SESSION\",\"tool\":\"$TOOL\",\"input\":$TOOL_INPUT}" \
  >> "$LOG_DIR/audit-$(date -u +%Y-%m-%d).jsonl"
```

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "type": "command",
        "command": "bash ./hooks/audit-log.sh"
      }
    ]
  }
}
```

Este patron genera archivos JSONL diarios que puedes analizar con `jq`:

```bash
# Ver todas las herramientas usadas hoy
cat ~/.claude/logs/audit-$(date -u +%Y-%m-%d).jsonl | jq '.tool'

# Contar invocaciones por herramienta
cat ~/.claude/logs/audit-$(date -u +%Y-%m-%d).jsonl | jq -r '.tool' | sort | uniq -c | sort -rn
```

### Patron 4: Notificaciones Slack al finalizar

Envia un mensaje a Slack cuando Claude termina una tarea:

```bash
#!/bin/bash
# hooks/notify-slack.sh
INPUT=$(cat)
SESSION=$(echo "$INPUT" | jq -r '.session_id')
REASON=$(echo "$INPUT" | jq -r '.stop_reason // "unknown"')

SLACK_WEBHOOK="${SLACK_WEBHOOK_URL}"

if [ -n "$SLACK_WEBHOOK" ]; then
  curl -s -X POST "$SLACK_WEBHOOK" \
    -H "Content-Type: application/json" \
    -d "{
      \"text\": \"Claude Code ha finalizado una tarea\",
      \"blocks\": [
        {
          \"type\": \"section\",
          \"text\": {
            \"type\": \"mrkdwn\",
            \"text\": \"*Claude Code* ha terminado de trabajar.\n- Session: \`$SESSION\`\n- Razon: \`$REASON\`\n- Hora: $(date -u +%H:%M:%S) UTC\"
          }
        }
      ]
    }"
fi
```

```json
{
  "hooks": {
    "Stop": [
      {
        "type": "command",
        "command": "bash ./hooks/notify-slack.sh",
        "timeout": 5000
      }
    ]
  }
}
```

### Patron 5: Inyeccion de contexto en SessionStart

Carga automaticamente informacion del proyecto al iniciar cada sesion:

```bash
#!/bin/bash
# hooks/inject-context.sh

# Informacion del entorno
echo "=== Contexto del proyecto ==="
echo "Branch actual: $(git branch --show-current 2>/dev/null || echo 'no git')"
echo "Ultimo commit: $(git log --oneline -1 2>/dev/null || echo 'sin commits')"
echo "Node version: $(node --version 2>/dev/null || echo 'no instalado')"
echo "Archivos modificados: $(git diff --name-only 2>/dev/null | wc -l) archivos"

# Estado de dependencias
if [ -f "package.json" ]; then
  echo "Proyecto Node.js detectado"
  if [ ! -d "node_modules" ]; then
    echo "ADVERTENCIA: node_modules no encontrado, ejecutar npm install"
  fi
fi

# Variables de entorno criticas
echo "CI: ${CI:-false}"
echo "NODE_ENV: ${NODE_ENV:-development}"
```

```json
{
  "hooks": {
    "SessionStart": [
      {
        "type": "command",
        "command": "bash ./hooks/inject-context.sh"
      }
    ]
  }
}
```

### Patron 6: Validacion pre-commit

Ejecuta validaciones antes de que Claude haga un commit:

```bash
#!/bin/bash
# hooks/pre-commit-check.sh
INPUT=$(cat)
CMD=$(echo "$INPUT" | jq -r '.tool_input.command')

# Solo actuar en comandos git commit
if echo "$CMD" | grep -q "git commit"; then
  # Verificar que no hay archivos sensibles staged
  SENSITIVE=$(git diff --cached --name-only | grep -E '\.(env|pem|key|secret)' || true)
  if [ -n "$SENSITIVE" ]; then
    echo "BLOQUEADO: archivos sensibles detectados en staging:"
    echo "$SENSITIVE"
    exit 2
  fi

  # Verificar que los tests pasan
  if [ -f "package.json" ] && grep -q '"test"' package.json; then
    echo "Ejecutando tests antes del commit..."
    npm test --silent 2>/dev/null
    if [ $? -ne 0 ]; then
      echo "BLOQUEADO: los tests fallan. Corrige antes de hacer commit."
      exit 2
    fi
  fi

  echo "Validacion pre-commit OK"
fi

exit 0
```

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "type": "command",
        "matcher": "Bash",
        "command": "bash ./hooks/pre-commit-check.sh"
      }
    ]
  }
}
```

### Donde colocar los hooks

Los hooks se definen en archivos `settings.json` en distintos niveles:

| Archivo | Alcance | Uso tipico |
|---------|---------|------------|
| `~/.claude/settings.json` | Global (usuario) | Preferencias personales, logging |
| `.claude/settings.json` | Proyecto | Formato, seguridad del proyecto |
| `.claude/settings.local.json` | Proyecto (local) | Overrides personales no commiteados |

:::tip Separacion de responsabilidades
Coloca hooks de seguridad y formato en `.claude/settings.json` (nivel de proyecto, se commitea al repo). Coloca hooks de notificaciones personales en `~/.claude/settings.json` (nivel de usuario, no se comparte).
:::

---

## Conceptos clave del capitulo

:::tip Resumen ejecutivo
1. **Los hooks son deterministas**: a diferencia de los skills, siempre se ejecutan cuando el evento ocurre. Son el mecanismo de control imperativo de Claude Code.

2. **Cinco tipos de handler** cubren todos los escenarios: `command` para scripts, `url` para webhooks, `prompt` para validacion semantica, `mcp_tool` para integraciones MCP, y `agent` para flujos complejos.

3. **Exit code 2 bloquea**: en eventos `PreToolUse` y `UserPromptSubmit`, un exit code 2 cancela la operacion. Es la base del sistema de seguridad por hooks.

4. **Matchers filtran por herramienta**: sin matcher, el hook se ejecuta para todas las herramientas del evento. Con matcher, solo para las especificadas.

5. **Timeout de 10 segundos por defecto**: los hooks deben ser rapidos. Si necesitas mas tiempo, configura el timeout explicitamente.

6. **Tres niveles de configuracion**: global (usuario), proyecto (compartido), y local (personal). Los hooks de seguridad van en el proyecto; las preferencias personales en el nivel de usuario.
:::

---

## Autoevaluacion

1. **Un hook con `"matcher": "Edit"` en el evento `PreToolUse` devuelve exit code 2. Que ocurre?**
   Claude no ejecuta la herramienta Edit. La operacion se bloquea y Claude recibe un mensaje indicando que el hook impidio la accion.

2. **Cual es la diferencia fundamental entre un hook y un skill en Claude Code?**
   Un hook es determinista e imperativo: siempre se ejecuta cuando ocurre su evento. Un skill es guiado por el LLM: Claude decide si activarlo basandose en el contexto. Los hooks son para lo que *debe* ocurrir; los skills para lo que *deberia* ocurrir.

3. **Tienes un hook de tipo `command` sin `"matcher"` en el evento `PreToolUse`. Para cuantas herramientas se ejecuta?**
   Para todas las herramientas. Sin matcher, el hook se dispara en cada invocacion de cualquier herramienta asociada al evento.

4. **Necesitas validar si un prompt del usuario contiene solicitudes inapropiadas basandote en el significado semantico del texto. Que tipo de handler usarias y por que?**
   El handler de tipo `prompt`, porque requiere comprension semantica que un script shell no puede lograr. Sin embargo, hay que considerar la latencia adicional que introduce la llamada al LLM.

5. **Tu hook de notificacion a Slack tarda 15 segundos en ejecutarse y falla intermitentemente. Que dos configuraciones deberias revisar?**
   El `timeout` (por defecto 10 segundos, deberia aumentarse a al menos 20000 ms) y la ubicacion del hook (deberia estar en el evento `Stop` y no en `PreToolUse` para no bloquear el flujo de trabajo).

---

## Laboratorio

Pon en practica estos conceptos en el **[Laboratorio L6.1: Construyendo un sistema de hooks](/laboratorios/L6-1-sistema-hooks)**, donde implementaras un pipeline completo con validacion de seguridad, auto-formato y notificaciones.
