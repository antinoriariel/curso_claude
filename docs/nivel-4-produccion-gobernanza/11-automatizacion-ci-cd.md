---
sidebar_position: 1
title: "Capítulo 11: Automatización y CI/CD"
description: Claude Code en GitHub Actions, modo no interactivo, Routines, Claude Agent SDK y hooks en CI.
tags: [claude-code, ci-cd, github-actions, automatización, agent-sdk]
---

# Capitulo 11: Automatizacion y CI/CD

Claude Code no esta limitado a sesiones interactivas en tu terminal. Su verdadero potencial de escala aparece cuando lo integras en **pipelines de automatizacion**: revision automatica de PRs, validacion en CI, tareas programadas y agentes personalizados. Este capitulo te muestra como llevar Claude Code de tu terminal a tu infraestructura.

---

## 11.1 Claude Code en GitHub Actions

### Integracion nativa con @claude

Claude Code ofrece una integracion directa con GitHub. Al mencionarlo con **@claude** en un comentario de pull request, el agente puede:

- **Analizar diffs** del PR y sugerir mejoras.
- **Ejecutar tests** y reportar resultados.
- **Dejar comentarios inline** en lineas especificas del codigo.
- **Crear commits** con correcciones directamente en la rama.
- **Responder preguntas** sobre el codigo del PR.

### Configuracion basica

La integracion requiere instalar la **GitHub App de Claude Code** en tu repositorio y configurar un workflow en `.github/workflows/`.

### Workflow completo de code review automatizado

```yaml
name: Claude Code Review

on:
  pull_request:
    types: [opened, synchronize, reopened]
  issue_comment:
    types: [created]

permissions:
  contents: read
  pull-requests: write
  issues: write

jobs:
  claude-review:
    runs-on: ubuntu-latest
    if: |
      (github.event_name == 'pull_request') ||
      (github.event_name == 'issue_comment' &&
       contains(github.event.comment.body, '@claude'))
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Claude Code
        uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          github_token: ${{ secrets.GITHUB_TOKEN }}
          model: "claude-sonnet-4-20250514"
          prompt: |
            Revisa este pull request. Enfocate en:
            1. Errores logicos o bugs potenciales
            2. Problemas de seguridad
            3. Oportunidades de simplificacion
            4. Adherencia a las convenciones del proyecto
            Deja comentarios inline en las lineas relevantes.
```

### Uso con `claude -p` y token de GitHub

Para integraciones mas personalizadas, puedes invocar Claude Code directamente con el flag `-p` (modo no interactivo):

```yaml
jobs:
  custom-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Claude Code
        run: npm install -g @anthropic-ai/claude-code

      - name: Run analysis
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          claude -p "Analiza los cambios en este PR y genera un resumen \
          de los riesgos potenciales" \
          --output-format json > review-results.json
```

:::tip Secretos y seguridad
Nunca expongas tu `ANTHROPIC_API_KEY` en el codigo. Usa siempre **GitHub Secrets** para almacenar credenciales. Configura permisos minimos en el token de GitHub.
:::

---

## 11.2 Modo no interactivo

### El flag `-p`: Claude Code para scripts

El modo no interactivo transforma Claude Code de una herramienta conversacional a un **componente de pipeline**. Con `claude -p "prompt"`, envias una instruccion y recibes la respuesta sin interaccion humana.

```bash
# Uso basico
claude -p "Explica la funcion main en src/app.py"

# Piping de entrada
cat errors.log | claude -p "Analiza estos errores y sugiere correcciones"

# Combinando con herramientas Unix
git diff HEAD~3 | claude -p "Resume estos cambios para el changelog"
```

### Referencia de flags

| Flag | Descripcion | Ejemplo |
|------|-------------|---------|
| `-p "prompt"` | Ejecuta en modo no interactivo | `claude -p "analiza este codigo"` |
| `--output-format` | Formato de salida: `plain`, `json`, `stream-json` | `--output-format json` |
| `--verbose` | Muestra informacion detallada de ejecucion | `claude -p "..." --verbose` |
| `--max-turns N` | Limita el numero de turnos del agente | `--max-turns 5` |
| `--allowedTools` | Restringe las herramientas disponibles | `--allowedTools Read,Grep` |
| `--bare` | Solo muestra el resultado, sin metadatos | `claude -p "..." --bare` |
| `--model` | Selecciona el modelo a usar | `--model claude-haiku-4-20250506` |

### Formatos de salida

```bash
# Texto plano (default) - ideal para lectura humana
claude -p "Resume este archivo" --output-format plain

# JSON estructurado - ideal para procesamiento programatico
claude -p "Lista los TODO del proyecto" --output-format json

# JSON en streaming - ideal para pipelines en tiempo real
claude -p "Analiza el proyecto" --output-format stream-json
```

### Scripts completos para CI

**Ejemplo: Validacion de commits antes de merge**

```bash
#!/bin/bash
# validate-pr.sh - Script de validacion para CI

set -euo pipefail

echo "=== Validando PR ==="

# Analizar cambios
ANALYSIS=$(git diff origin/main...HEAD | claude -p \
  "Analiza este diff. Responde SOLO con un JSON:
   {\"risk\": \"low|medium|high\", \"issues\": [\"...\"], \"summary\": \"...\"}" \
  --output-format json --max-turns 3 --bare)

RISK=$(echo "$ANALYSIS" | jq -r '.result // .risk')

if [ "$RISK" = "high" ]; then
  echo "RIESGO ALTO detectado. Requiere revision manual."
  exit 1
fi

echo "Validacion completada: riesgo $RISK"
```

**Ejemplo: Generacion automatica de documentacion**

```bash
#!/bin/bash
# generate-docs.sh

claude -p "Lee src/ y genera documentacion JSDoc para todas las \
  funciones publicas que no la tengan. Edita los archivos directamente." \
  --max-turns 20 --allowedTools Read,Write,Edit,Grep,Glob
```

---

## 11.3 Routines

Las **Routines** son tareas programadas que Claude Code ejecuta de forma autonoma, sin necesidad de intervencion manual. Existen dos modalidades principales.

### (a) Routines en infraestructura Anthropic

Estas routines se ejecutan en los servidores de Anthropic. No necesitan tu maquina encendida.

**Caracteristicas:**
- Se activan por **cron**, **eventos de GitHub** (push, PR, issue) o **API**.
- Se crean desde la **web**, **Claude Desktop** o **CLI** con `/schedule`.
- Tienen acceso a los repositorios que configures.
- Los resultados se envian por notificacion o se publican en GitHub.

**Crear una routine desde CLI:**

```
> /schedule

Claude: Que tarea quieres programar?

> Revisa todos los PRs abiertos cada dia a las 9:00 AM.
  Para cada PR, deja un comentario con un resumen de los
  cambios y cualquier problema potencial.

Claude: Routine creada:
  - Nombre: "Daily PR Review"
  - Cron: 0 9 * * * (cada dia a las 9:00)
  - Repositorio: mi-org/mi-proyecto
```

**Ejemplos de routines utiles:**

| Routine | Trigger | Accion |
|---------|---------|--------|
| Revision diaria de PRs | Cron (9:00 AM) | Analiza PRs abiertos, deja comentarios |
| Triage de issues | Evento: issue creado | Clasifica, etiqueta, asigna |
| Resumen semanal | Cron (lunes 8:00) | Genera reporte de actividad del repo |
| Validacion de seguridad | Evento: push a main | Escanea dependencias y codigo |

### (b) Tareas programadas locales (Desktop)

Desde Claude Desktop, puedes programar tareas que se ejecutan en tu maquina local:

- Requieren que la maquina este encendida.
- Acceden a archivos y herramientas locales.
- Utiles para tareas que dependen del entorno local.

### /loop: polling rapido en sesion

Para tareas que necesitan **monitoreo continuo dentro de una sesion**, usa `/loop`:

```
> /loop 5m /status

Claude: Ejecutare /status cada 5 minutos.
  [09:00] Status: 3 tests pasando, 0 fallando
  [09:05] Status: 3 tests pasando, 0 fallando
  [09:10] Status: 2 tests pasando, 1 fallando ⚠
```

`/loop` es ideal para:
- Monitorear un deploy en progreso.
- Vigilar resultados de tests mientras desarrollas.
- Verificar que un servicio sigue respondiendo.

:::note /loop vs Routines
`/loop` funciona **dentro de una sesion activa** y se detiene cuando cierras Claude Code. Las Routines operan de forma independiente y persisten aunque cierres todo.
:::

---

## 11.4 Claude Agent SDK

### Claude Code como libreria

El **Claude Agent SDK** permite usar Claude Code como componente programatico dentro de tus propias aplicaciones. Disponible para **Python** y **TypeScript**, transforma al agente en una libreria que puedes importar y controlar.

### Primitivas del SDK

| Primitiva | Descripcion |
|-----------|-------------|
| **Query loop** | Ciclo principal de interaccion prompt-respuesta |
| **Agents** | Agentes configurables con instrucciones, modelo y herramientas |
| **Tools** | Herramientas disponibles para el agente (built-in + custom) |
| **MCP Servers** | Servidores MCP que el agente puede usar |
| **Skills** | Skills reutilizables definidas como archivos |
| **Permissions** | Control granular de lo que el agente puede hacer |

### Ejemplo en Python

```python
from claude_code_sdk import Agent, AgentConfig, query

import asyncio

async def main():
    # Configurar el agente
    config = AgentConfig(
        model="claude-sonnet-4-20250514",
        max_turns=10,
        allowed_tools=["Read", "Grep", "Glob"],
        system_prompt="Eres un agente de analisis de codigo. "
                      "Analiza el proyecto y reporta problemas.",
    )

    # Ejecutar una consulta
    async with Agent(config) as agent:
        response = await agent.query(
            "Encuentra todos los archivos con TODO comments "
            "y genera un reporte priorizado"
        )

        for message in response.messages:
            print(message.content)

asyncio.run(main())
```

### Ejemplo en TypeScript

```typescript
import { Agent, AgentConfig } from "@anthropic-ai/claude-code-sdk";

async function main() {
  const config: AgentConfig = {
    model: "claude-sonnet-4-20250514",
    maxTurns: 10,
    allowedTools: ["Read", "Grep", "Glob"],
    systemPrompt:
      "Eres un agente de analisis de codigo. " +
      "Analiza el proyecto y reporta problemas.",
  };

  const agent = new Agent(config);

  const response = await agent.query(
    "Encuentra funciones sin tests unitarios " +
    "y genera los tests faltantes"
  );

  for (const message of response.messages) {
    console.log(message.content);
  }
}

main();
```

### Casos de uso del SDK

- **Bots de Slack/Discord** que responden preguntas sobre el codigo.
- **Dashboards internos** que generan reportes de calidad.
- **Herramientas CLI personalizadas** especificas de tu organizacion.
- **Pipelines de procesamiento** que incluyen analisis de codigo como paso.

:::info Instalacion del SDK
```bash
# Python
pip install claude-code-sdk

# TypeScript / Node.js
npm install @anthropic-ai/claude-code-sdk
```
:::

---

## 11.5 Hooks en CI

Los hooks de Claude Code son especialmente valiosos en entornos CI/CD, donde necesitas **control estricto** sobre lo que el agente puede hacer. Se configuran en `.claude/settings.json` (compartido con el equipo) o en la configuracion del pipeline.

### PreToolUse: bloquear comandos peligrosos

En CI, debes evitar que Claude ejecute comandos destructivos. `PreToolUse` intercepta **antes** de que se ejecute una herramienta:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "python3 scripts/ci-guard.py \"$TOOL_INPUT\""
          }
        ]
      }
    ]
  }
}
```

**Script de guardia para CI:**

```python
#!/usr/bin/env python3
# scripts/ci-guard.py
import sys, json

BLOCKED_PATTERNS = [
    "rm -rf /",
    "git push --force",
    "DROP TABLE",
    "kubectl delete",
    "docker system prune",
    "shutdown",
    "reboot",
]

def check_command(tool_input: str) -> None:
    try:
        data = json.loads(tool_input)
        command = data.get("command", "").lower()
    except (json.JSONDecodeError, AttributeError):
        command = tool_input.lower()

    for pattern in BLOCKED_PATTERNS:
        if pattern.lower() in command:
            # Exit code != 0 bloquea la ejecucion
            print(json.dumps({
                "decision": "block",
                "reason": f"Comando bloqueado en CI: {pattern}"
            }))
            sys.exit(2)

if __name__ == "__main__":
    check_command(sys.argv[1] if len(sys.argv) > 1 else "")
```

### UserPromptSubmit: inyeccion de contexto CI

Inyecta automaticamente informacion del entorno CI en cada prompt:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'echo \"{\\\"additionalContext\\\": \\\"CI Environment: branch=$GITHUB_REF_NAME commit=$GITHUB_SHA runner=$RUNNER_OS pipeline=$GITHUB_WORKFLOW\\\"}\"'"
          }
        ]
      }
    ]
  }
}
```

Con esta configuracion, Claude recibe automaticamente el contexto del pipeline en cada interaccion: la rama actual, el SHA del commit, el sistema operativo del runner y el nombre del workflow.

### PostToolUse: audit logging

Registra cada accion del agente para auditoria y compliance:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'echo \"$(date -u +%Y-%m-%dT%H:%M:%SZ) | tool=$TOOL_NAME | session=$CLAUDE_SESSION_ID\" >> /var/log/claude-audit.log'"
          }
        ]
      }
    ]
  }
}
```

### Configuracion completa para CI

Un ejemplo integrado que combina las tres estrategias:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "python3 scripts/ci-guard.py \"$TOOL_INPUT\""
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c '[[ ! \"$TOOL_INPUT\" =~ \\.env ]] || (echo \"{\\\"decision\\\": \\\"block\\\", \\\"reason\\\": \\\"No se permite escribir archivos .env\\\"}\" && exit 2)'"
          }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'echo \"{\\\"additionalContext\\\": \\\"CI: branch=$GITHUB_REF_NAME sha=$GITHUB_SHA\\\"}\"'"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'echo \"$(date -u +%Y-%m-%dT%H:%M:%SZ) | $TOOL_NAME | exit=$TOOL_EXIT_CODE\" >> claude-audit.log'"
          }
        ]
      }
    ]
  }
}
```

---

## Conceptos clave del capitulo

:::tip Resumen
1. **GitHub Actions**: Claude Code se integra nativamente con PRs usando `@claude` o workflows personalizados con `claude -p`.
2. **Modo no interactivo**: El flag `-p` convierte a Claude Code en un componente de pipeline, con control fino via `--output-format`, `--max-turns` y `--allowedTools`.
3. **Routines**: Tareas programadas que se ejecutan sin intervencion, ya sea en infraestructura Anthropic (persistentes) o localmente (requieren maquina encendida).
4. **Agent SDK**: Python y TypeScript permiten usar Claude Code como libreria para construir agentes personalizados.
5. **Hooks en CI**: `PreToolUse` bloquea acciones peligrosas, `UserPromptSubmit` inyecta contexto, y `PostToolUse` registra acciones para auditoria.
:::

---

## Preguntas de autoevaluacion

1. **Que flag necesitas para ejecutar Claude Code en un script de CI sin interaccion humana?**

2. **Cual es la diferencia entre `/loop` y una Routine en infraestructura Anthropic?**

3. **Si necesitas evitar que Claude ejecute `git push --force` en CI, que tipo de hook usarias y como lo configurarias?**

4. **Que formato de `--output-format` elegirías para procesar la salida de Claude Code con `jq` en un script bash?**

5. **Nombra tres primitivas del Claude Agent SDK y describe brevemente para que sirve cada una.**

---

## Laboratorio

Practica los conceptos de este capitulo en el **Laboratorio L11.1**, donde configuraras un workflow de GitHub Actions con revision automatizada y hooks de seguridad para CI.
