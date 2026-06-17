---
sidebar_position: 3
title: "Capítulo 13: Proyecto Integrador"
description: Diseño e implementación de un sistema automatizado de gestión de calidad de código que integra todos los conceptos del curso.
tags: [claude-code, proyecto-integrador, evaluación, calidad-de-código]
---

# Capítulo 13: Proyecto Integrador

Este capítulo final representa la culminación de todo el curso. Aquí diseñarás e implementarás un **Sistema Automatizado de Gestión de Calidad de Código** que integra cada concepto aprendido: memoria del proyecto, skills, hooks, MCP, subagentes y CI/CD.

---

## 13.1 Especificación y alcance del proyecto

### Descripción general

El proyecto consiste en construir un sistema completo que automatice la gestión de calidad de código en un repositorio real. Este sistema debe ser capaz de analizar código, detectar problemas, ejecutar pruebas, verificar seguridad y orquestar despliegues, todo coordinado a través de Claude Code.

### Lo que el sistema DEBE hacer

- Establecer estándares de código mediante configuración declarativa
- Analizar automáticamente cada cambio antes de que se integre
- Ejecutar pruebas y reportar cobertura
- Detectar vulnerabilidades de seguridad
- Bloquear prácticas prohibidas antes de que se ejecuten
- Formatear código automáticamente después de cada modificación
- Orquestar flujos de despliegue con validaciones de seguridad
- Integrarse con GitHub para gestión de PRs e issues
- Funcionar tanto localmente como en CI/CD

### Lo que el sistema NO debe hacer

- Reemplazar la revisión humana de código (complementa, no sustituye)
- Tomar decisiones de arquitectura sin supervisión
- Desplegar a producción sin aprobación explícita
- Modificar configuraciones de infraestructura crítica
- Almacenar credenciales o secretos en archivos de configuración

### Tabla de requisitos

| ID | Requisito | Prioridad | Componente |
|----|-----------|-----------|------------|
| R01 | CLAUDE.md con estándares del proyecto | Alta | Memoria |
| R02 | Reglas modulares por área del código | Alta | Memoria |
| R03 | Skill de revisión de código (/review) | Alta | Skills |
| R04 | Skill de despliegue (/deploy) | Alta | Skills |
| R05 | Skill de análisis de seguridad (/security-check) | Media | Skills |
| R06 | Integración con GitHub MCP | Alta | MCP |
| R07 | Integración con MCP de monitoreo | Media | MCP |
| R08 | Hook de bloqueo de malas prácticas | Alta | Hooks |
| R09 | Hook de auto-formateo | Media | Hooks |
| R10 | Hook de inyección de contexto | Media | Hooks |
| R11 | Subagente de escaneo de seguridad | Alta | Subagentes |
| R12 | Subagente de ejecución de pruebas | Alta | Subagentes |
| R13 | Pipeline de CI/CD en GitHub Actions | Alta | Integración |
| R14 | Documentación completa del sistema | Alta | Documentación |

### Entregables

1. **Archivos de configuración**: `CLAUDE.md`, `.claude/rules/`, `settings.json`, `settings.local.json`
2. **Skills personalizados**: archivos `SKILL.md` para `/review`, `/deploy`, `/security-check`
3. **Definiciones de subagentes**: `AGENTS.md` con subagentes registrados
4. **Configuración MCP**: servidores conectados y configurados
5. **Hooks de automatización**: pre/post tool use y session start
6. **Pipeline CI/CD**: workflow de GitHub Actions
7. **Documentación**: guía de usuario, decisiones de arquitectura, métricas

---

## 13.2 Arquitectura de la solución

### Diagrama de arquitectura

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SISTEMA DE CALIDAD DE CÓDIGO                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────┐    ┌──────────────────────────────────┐   │
│  │   CAPA DE MEMORIA   │    │       CAPA DE INTERFAZ           │   │
│  │                     │    │                                  │   │
│  │  CLAUDE.md          │    │  /review    → Skill revisión     │   │
│  │  .claude/rules/     │    │  /deploy    → Skill despliegue   │   │
│  │    api.md           │    │  /security-check → Skill segur.  │   │
│  │    frontend.md      │    │                                  │   │
│  │    tests.md         │    └──────────┬───────────────────────┘   │
│  │  settings.json      │               │                           │
│  └────────┬────────────┘               │                           │
│           │                            ▼                           │
│           │              ┌──────────────────────────┐              │
│           └─────────────►│     CLAUDE CODE (CORE)   │◄────────┐   │
│                          │                          │         │   │
│                          │  Orquesta todos los      │         │   │
│                          │  componentes del sistema  │         │   │
│                          └─────┬──────┬──────┬──────┘         │   │
│                                │      │      │                │   │
│              ┌─────────────────┘      │      └────────────┐   │   │
│              ▼                        ▼                   ▼   │   │
│  ┌───────────────────┐  ┌──────────────────┐  ┌─────────────┐│   │
│  │  CAPA DE HOOKS    │  │ CAPA DE AGENTES  │  │  CAPA MCP   ││   │
│  │                   │  │                  │  │             ││   │
│  │  PreToolUse:      │  │  security-scan   │  │  GitHub     ││   │
│  │   bloqueo malas   │  │   (Haiku, R/O)   │  │  Sentry     ││   │
│  │   prácticas       │  │                  │  │  Database   ││   │
│  │                   │  │  test-runner      │  │             ││   │
│  │  PostToolUse:     │  │   (Bash only)    │  │             ││   │
│  │   auto-formateo   │  │                  │  │             ││   │
│  │                   │  │  AGENTS.md       │  │             ││   │
│  │  SessionStart:    │  │   (registro)     │  │             ││   │
│  │   contexto init   │  │                  │  │             ││   │
│  └───────────────────┘  └──────────────────┘  └─────────────┘│   │
│                                                               │   │
│  ┌────────────────────────────────────────────────────────────┘   │
│  │                                                                │
│  │  ┌──────────────────────────────────────────────────────┐     │
│  │  │              CAPA DE INTEGRACIÓN CI/CD               │     │
│  │  │                                                      │     │
│  │  │  GitHub Actions Workflow                             │     │
│  │  │    ├── Trigger: Pull Request                         │     │
│  │  │    ├── Step 1: Ejecutar subagente security-scan      │     │
│  │  │    ├── Step 2: Ejecutar subagente test-runner         │     │
│  │  │    ├── Step 3: Análisis de calidad con /review       │     │
│  │  │    └── Step 4: Reportar resultados en PR             │     │
│  │  └──────────────────────────────────────────────────────┘     │
│  │                                                                │
└──┴────────────────────────────────────────────────────────────────┘
```

### Flujo de datos

1. El desarrollador realiza cambios en el código
2. **SessionStart** inyecta contexto del proyecto y estado actual
3. Claude Code carga **CLAUDE.md** y las **reglas modulares** relevantes
4. Al solicitar una acción, **PreToolUse** valida que no se violen estándares
5. Tras cada herramienta, **PostToolUse** aplica formateo automático
6. Los **skills** orquestan flujos complejos (revisión, despliegue, seguridad)
7. Los **subagentes** ejecutan tareas especializadas en paralelo
8. Los **servidores MCP** conectan con servicios externos (GitHub, monitoreo)
9. El **pipeline CI/CD** reproduce el flujo completo en cada Pull Request

---

## 13.3 Implementación fase 1: sistema de memoria y configuración

### Paso 1: Crear CLAUDE.md

Este archivo es la base de todo el sistema. Define los estándares que Claude Code seguirá en cada interacción.

```markdown title="CLAUDE.md"
# Sistema de Gestión de Calidad - Proyecto Integrador

## Comandos de compilación y pruebas
- Instalar dependencias: `npm install`
- Ejecutar pruebas: `npm test`
- Ejecutar pruebas con cobertura: `npm run test:coverage`
- Lint: `npm run lint`
- Build: `npm run build`
- Verificación completa: `npm run lint && npm test && npm run build`

## Estándares de código
- Lenguaje: TypeScript estricto (strict: true)
- Estilo: Prettier + ESLint con configuración del proyecto
- Cobertura mínima de pruebas: 80%
- Cada función pública debe tener documentación JSDoc
- Máximo 50 líneas por función, máximo 200 líneas por archivo

## Convenciones de nomenclatura
- Archivos: kebab-case (user-service.ts)
- Clases: PascalCase (UserService)
- Variables y funciones: camelCase (getUserById)
- Constantes: UPPER_SNAKE_CASE (MAX_RETRIES)
- Interfaces: PascalCase con prefijo I solo si hay conflicto (UserResponse)

## Estructura del proyecto
- src/api/ → Controladores y rutas de la API
- src/services/ → Lógica de negocio
- src/models/ → Modelos de datos
- src/utils/ → Utilidades compartidas
- tests/ → Pruebas organizadas en espejo de src/

## Reglas de seguridad
- NUNCA hardcodear credenciales, tokens o secretos
- Usar variables de entorno para toda configuración sensible
- Validar toda entrada de usuario con zod o joi
- Sanitizar datos antes de insertarlos en consultas

## Reglas de Git
- Mensajes de commit en formato Conventional Commits
- Una rama por feature: feature/nombre-descriptivo
- Squash merge para mantener historial limpio
```

### Paso 2: Crear reglas modulares

Crea el directorio `.claude/rules/` con reglas específicas por área.

```markdown title=".claude/rules/api.md"
---
globs: src/api/**
---

# Reglas para la capa API

- Cada endpoint debe validar el body de la petición con un schema zod
- Los controladores no deben contener lógica de negocio directamente
- Toda respuesta debe seguir el formato: { success: boolean, data?: T, error?: string }
- Los errores deben capturarse con middleware centralizado
- Cada ruta debe tener rate limiting configurado
- Documentar cada endpoint con comentarios que generen OpenAPI
```

```markdown title=".claude/rules/frontend.md"
---
globs: src/frontend/**
---

# Reglas para el frontend

- Componentes funcionales con hooks, no clases
- Props tipadas con interfaces explícitas
- Separar lógica de presentación: usar custom hooks
- No usar any; preferir unknown cuando el tipo es incierto
- Los componentes no deben superar 150 líneas
- Agrupar imports: externos, internos, estilos
```

```markdown title=".claude/rules/tests.md"
---
globs: tests/**
---

# Reglas para pruebas

- Usar el patrón Arrange-Act-Assert (AAA)
- Cada prueba debe testear una sola cosa
- Nombres descriptivos: "debe retornar 404 cuando el usuario no existe"
- Usar fixtures para datos de prueba, no datos inline
- Mockear dependencias externas, nunca la unidad bajo prueba
- Incluir casos de error, no solo el camino feliz
```

### Paso 3: Configurar settings.json

```json title=".claude/settings.json"
{
  "permissions": {
    "allow": [
      "Bash(npm run lint)",
      "Bash(npm test)",
      "Bash(npm run test:coverage)",
      "Bash(npm run build)",
      "Bash(npx prettier --write *)",
      "Read(*)",
      "Edit(*)",
      "Write(src/**)",
      "Write(tests/**)"
    ],
    "deny": [
      "Bash(rm -rf /)",
      "Bash(git push --force)",
      "Bash(npm publish)",
      "Write(.env*)",
      "Write(**/credentials*)"
    ]
  },
  "env": {
    "NODE_ENV": "development",
    "LOG_LEVEL": "info"
  },
  "hooks": {}
}
```

### Paso 4: Configurar settings.local.json

```json title=".claude/settings.local.json"
{
  "permissions": {
    "allow": [
      "Bash(code *)",
      "Bash(npm run dev)"
    ]
  },
  "env": {
    "EDITOR": "code",
    "DEBUG": "true"
  }
}
```

:::note Recuerda
El archivo `settings.local.json` es personal y debe incluirse en `.gitignore`. Cada miembro del equipo puede tener su propia configuración local sin afectar al resto.
:::

---

## 13.4 Implementación fase 2: skills y comandos personalizados

### Skill /review: Revisión automatizada de código

Crea el directorio `.claude/skills/` y dentro el archivo para el skill de revisión.

```markdown title=".claude/skills/review/SKILL.md"
---
name: review
description: Analiza el diff actual, ejecuta linter, verifica cobertura de pruebas y sugiere mejoras.
---

# Instrucciones para /review

Ejecuta una revisión completa del código con los siguientes pasos, en orden:

## Paso 1: Análisis del diff
- Ejecuta `git diff --staged` para obtener los cambios preparados
- Si no hay cambios staged, ejecuta `git diff` para cambios no staged
- Identifica los archivos modificados y clasifícalos por área (api, frontend, tests, utils)

## Paso 2: Verificación de lint
- Ejecuta `npm run lint` y captura la salida
- Si hay errores de lint, lista cada uno con su ubicación y sugerencia de corrección
- Clasifica los errores por severidad: error, warning, info

## Paso 3: Cobertura de pruebas
- Ejecuta `npm run test:coverage` para obtener el reporte de cobertura
- Verifica que la cobertura total sea >= 80%
- Identifica archivos modificados que no tienen pruebas correspondientes
- Sugiere qué pruebas deberían añadirse

## Paso 4: Revisión de calidad
- Verifica el cumplimiento de las convenciones definidas en CLAUDE.md
- Detecta funciones que excedan 50 líneas
- Identifica código duplicado
- Busca TODO/FIXME/HACK sin issue asociado
- Verifica que las funciones públicas tengan JSDoc

## Paso 5: Reporte
Genera un reporte con el siguiente formato:

```
## Reporte de Revisión

**Fecha**: [fecha actual]
**Archivos revisados**: [cantidad]
**Estado general**: [APROBADO/REQUIERE CAMBIOS/RECHAZADO]

### Lint
- Errores: [n]
- Warnings: [n]

### Cobertura
- Total: [n]%
- Archivos sin cobertura: [lista]

### Hallazgos de calidad
[Lista numerada de hallazgos con severidad y ubicación]

### Acciones requeridas
[Lista de acciones que el desarrollador debe tomar]
```
```

### Skill /deploy: Despliegue con validaciones

```markdown title=".claude/skills/deploy/SKILL.md"
---
name: deploy
description: Ejecuta el pipeline de despliegue completo con pruebas, build y validaciones de seguridad.
---

# Instrucciones para /deploy

Ejecuta el pipeline de despliegue siguiendo estrictamente este orden. Si cualquier paso falla, DETÉN el proceso y reporta el error.

## Paso 1: Pre-validación
- Verifica que estás en la rama correcta (main o release/*)
- Verifica que no hay cambios sin commitear (`git status --porcelain`)
- Verifica que la rama está actualizada con el remoto (`git fetch && git status`)

## Paso 2: Pruebas completas
- Ejecuta `npm run lint` — DETENER si falla
- Ejecuta `npm test` — DETENER si falla
- Ejecuta `npm run test:coverage` — DETENER si cobertura < 80%

## Paso 3: Build
- Ejecuta `npm run build` — DETENER si falla
- Verifica que el directorio dist/ se generó correctamente
- Verifica el tamaño del bundle (advertir si supera 5MB)

## Paso 4: Validación de seguridad
- Ejecuta `npm audit --production` para verificar vulnerabilidades
- Si hay vulnerabilidades críticas o altas, DETENER
- Verifica que no haya archivos .env o secretos en el build

## Paso 5: Despliegue
- Solicita confirmación EXPLÍCITA del usuario antes de continuar
- Ejecuta el comando de despliegue configurado
- Verifica que el despliegue fue exitoso
- Registra la versión desplegada y el timestamp

## Paso 6: Post-despliegue
- Ejecuta smoke tests si están configurados
- Notifica el resultado del despliegue
- Genera un resumen con: versión, commit, duración, estado
```

### Skill /security-check: Análisis de seguridad

```markdown title=".claude/skills/security-check/SKILL.md"
---
name: security-check
description: Realiza un análisis de seguridad del código fuente buscando vulnerabilidades comunes.
---

# Instrucciones para /security-check

Realiza un análisis de seguridad exhaustivo del proyecto.

## Paso 1: Dependencias
- Ejecuta `npm audit` y analiza los resultados
- Clasifica vulnerabilidades por severidad
- Sugiere actualizaciones para dependencias vulnerables

## Paso 2: Secretos expuestos
- Busca patrones de secretos en el código: API keys, tokens, contraseñas
- Patrones a buscar: cadenas que parecen tokens (base64 largos), variables con nombres como SECRET, KEY, PASSWORD, TOKEN que tengan valores hardcodeados
- Verifica que .gitignore incluya .env, *.pem, *.key
- Verifica que no haya archivos sensibles trackeados en Git

## Paso 3: Vulnerabilidades de código
- Busca inyección SQL: consultas construidas con concatenación de strings
- Busca XSS: renderizado de HTML sin sanitización
- Busca SSRF: URLs construidas con input del usuario sin validación
- Busca path traversal: acceso a archivos con input sin sanitizar
- Verifica el uso correcto de CORS, CSP y otros headers de seguridad

## Paso 4: Reporte de seguridad
Genera un reporte clasificando cada hallazgo como:
- CRÍTICO: debe corregirse antes de cualquier despliegue
- ALTO: debe corregirse en el próximo sprint
- MEDIO: planificar corrección
- BAJO: mejora recomendada
```

---

## 13.5 Implementación fase 3: MCP y automatización externa

### Conexión con GitHub MCP Server

Configura el servidor MCP de GitHub para gestionar PRs e issues directamente desde Claude Code.

```json title=".claude/settings.json (sección mcpServers)"
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "sentry": {
      "command": "npx",
      "args": ["-y", "@sentry/mcp-server"],
      "env": {
        "SENTRY_AUTH_TOKEN": "${SENTRY_TOKEN}",
        "SENTRY_ORG": "${SENTRY_ORG}"
      }
    }
  }
}
```

:::caution Seguridad
Los tokens nunca se hardcodean en el archivo de configuración. Usa variables de entorno (`${GITHUB_TOKEN}`) que se resuelven desde el entorno del sistema o desde un gestor de secretos.
:::

### Conexión con MCP de monitoreo

Para monitoreo de errores en producción, el servidor MCP de Sentry permite a Claude Code consultar errores recientes, agrupar incidencias y sugerir correcciones basadas en los stack traces.

Con esta integración, puedes pedirle a Claude Code cosas como:

- "Muéstrame los errores de las últimas 24 horas en producción"
- "Crea un issue en GitHub para el error más frecuente de Sentry"
- "Analiza el stack trace del error PROJ-1234 y sugiere una corrección"

### Configuración de hooks

Agrega los hooks al `settings.json` del proyecto.

```json title=".claude/settings.json (sección hooks)"
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hook": "python .claude/hooks/pre-tool-validate.py"
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hook": "python .claude/hooks/post-tool-format.py"
      }
    ],
    "SessionStart": [
      {
        "hook": "python .claude/hooks/session-context.py"
      }
    ]
  }
}
```

### Hook PreToolUse: bloqueo de malas prácticas

```python title=".claude/hooks/pre-tool-validate.py"
#!/usr/bin/env python3
"""
Hook PreToolUse: valida que los comandos Bash no contengan
prácticas prohibidas antes de ejecutarlos.
"""
import sys
import json

BLOCKED_PATTERNS = [
    "rm -rf /",
    "git push --force main",
    "git push --force master",
    "npm publish",
    "DROP TABLE",
    "DROP DATABASE",
    "chmod 777",
    "> /dev/sda",
]

BLOCKED_FILE_PATTERNS = [
    ".env",
    "credentials",
    "secrets",
    ".pem",
    ".key",
]

def main():
    input_data = json.loads(sys.stdin.read())
    tool_name = input_data.get("tool_name", "")
    tool_input = input_data.get("tool_input", {})

    if tool_name == "Bash":
        command = tool_input.get("command", "")
        for pattern in BLOCKED_PATTERNS:
            if pattern.lower() in command.lower():
                result = {
                    "decision": "block",
                    "reason": f"Comando bloqueado: contiene '{pattern}'"
                }
                print(json.dumps(result))
                return

    if tool_name == "Write":
        file_path = tool_input.get("file_path", "")
        for pattern in BLOCKED_FILE_PATTERNS:
            if pattern in file_path.lower():
                result = {
                    "decision": "block",
                    "reason": f"Escritura bloqueada: archivo sensible '{file_path}'"
                }
                print(json.dumps(result))
                return

    print(json.dumps({"decision": "approve"}))

if __name__ == "__main__":
    main()
```

### Hook PostToolUse: auto-formateo

```python title=".claude/hooks/post-tool-format.py"
#!/usr/bin/env python3
"""
Hook PostToolUse: ejecuta formateo automático sobre archivos
modificados con Write o Edit.
"""
import sys
import json
import subprocess

def main():
    input_data = json.loads(sys.stdin.read())
    tool_name = input_data.get("tool_name", "")
    tool_input = input_data.get("tool_input", {})

    file_path = tool_input.get("file_path", "")

    if file_path.endswith((".ts", ".tsx", ".js", ".jsx", ".json")):
        subprocess.run(
            ["npx", "prettier", "--write", file_path],
            capture_output=True, timeout=30
        )

if __name__ == "__main__":
    main()
```

### Hook SessionStart: inyección de contexto

```python title=".claude/hooks/session-context.py"
#!/usr/bin/env python3
"""
Hook SessionStart: inyecta contexto del proyecto al iniciar sesión.
Muestra el estado del repositorio y recordatorios importantes.
"""
import subprocess
import json

def get_git_info():
    branch = subprocess.run(
        ["git", "branch", "--show-current"],
        capture_output=True, text=True
    ).stdout.strip()

    status = subprocess.run(
        ["git", "status", "--short"],
        capture_output=True, text=True
    ).stdout.strip()

    return branch, status

def main():
    branch, status = get_git_info()
    changes = len(status.splitlines()) if status else 0

    context_lines = [
        f"Rama actual: {branch}",
        f"Archivos modificados: {changes}",
    ]

    if changes > 0:
        context_lines.append("NOTA: Hay cambios sin commitear.")

    if branch == "main" or branch == "master":
        context_lines.append(
            "ADVERTENCIA: Estas en la rama principal. "
            "Crea una rama feature/ antes de hacer cambios."
        )

    print("\n".join(context_lines))

if __name__ == "__main__":
    main()
```

---

## 13.6 Implementación fase 4: subagentes y orquestación

### Subagente: security-scanner

Este subagente se ejecuta con permisos mínimos (solo lectura) y utiliza un modelo ligero para mantener costos bajos.

```markdown title="AGENTS.md (sección security-scanner)"
## security-scanner

Subagente especializado en análisis de seguridad del código fuente.

### Configuración
- **Modelo**: Haiku (costo optimizado para análisis repetitivo)
- **Permisos**: Solo lectura. No puede modificar archivos ni ejecutar comandos destructivos.
- **Herramientas permitidas**: Read, Grep, Glob
- **Herramientas bloqueadas**: Write, Edit, Bash

### Instrucciones
Analiza el código fuente buscando:
1. Secretos hardcodeados (API keys, tokens, contraseñas)
2. Patrones de inyección (SQL, XSS, SSRF)
3. Dependencias con vulnerabilidades conocidas
4. Configuraciones de seguridad débiles
5. Permisos de archivos incorrectos

Genera un reporte JSON con el formato:
```json
{
  "scan_date": "ISO-8601",
  "files_scanned": 0,
  "findings": [
    {
      "severity": "critical|high|medium|low",
      "type": "secret|injection|dependency|config",
      "file": "path/to/file",
      "line": 0,
      "description": "Descripción del hallazgo",
      "recommendation": "Cómo corregirlo"
    }
  ],
  "summary": {
    "critical": 0,
    "high": 0,
    "medium": 0,
    "low": 0
  }
}
```
```

### Subagente: test-runner

```markdown title="AGENTS.md (sección test-runner)"
## test-runner

Subagente especializado en ejecución y análisis de pruebas.

### Configuración
- **Modelo**: Sonnet (balance entre capacidad y costo)
- **Permisos**: Bash limitado a comandos de pruebas.
- **Herramientas permitidas**: Bash(npm test*), Bash(npx jest*), Read, Grep
- **Herramientas bloqueadas**: Write, Edit, Bash(rm *), Bash(git *)

### Instrucciones
Ejecuta la suite de pruebas completa y analiza los resultados:
1. Ejecuta `npm test` y captura toda la salida
2. Si hay fallos, analiza el stack trace de cada prueba fallida
3. Ejecuta `npm run test:coverage` para obtener cobertura
4. Identifica archivos con cobertura inferior al 80%
5. Sugiere pruebas que deberían añadirse

Genera un reporte con:
- Total de pruebas: pasaron / fallaron / omitidas
- Cobertura por archivo
- Detalle de pruebas fallidas con causa probable
- Sugerencias de mejora priorizadas
```

### Registro en AGENTS.md

El archivo `AGENTS.md` completo en la raíz del proyecto:

```markdown title="AGENTS.md"
# Subagentes del Sistema de Calidad

Este archivo registra los subagentes disponibles para el sistema
de gestión de calidad de código.

## security-scanner

Subagente de análisis de seguridad.
- Modelo: Haiku
- Alcance: Solo lectura sobre todo el código fuente
- Propósito: Detectar vulnerabilidades y secretos expuestos
- Invocación: Se ejecuta automáticamente en cada PR y bajo demanda

## test-runner

Subagente de ejecución de pruebas.
- Modelo: Sonnet
- Alcance: Ejecución de comandos npm test y lectura de resultados
- Propósito: Ejecutar pruebas, analizar fallos y reportar cobertura
- Invocación: Se ejecuta en cada PR y antes de cada despliegue
```

### GitHub Action: pipeline de calidad automatizado

```yaml title=".github/workflows/quality-pipeline.yml"
name: Quality Pipeline

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

permissions:
  contents: read
  pull-requests: write
  issues: write

jobs:
  quality-check:
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
      - name: Checkout del código
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Configurar Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Instalar dependencias
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Pruebas con cobertura
        run: npm run test:coverage

      - name: Build
        run: npm run build

      - name: Auditoría de seguridad
        run: npm audit --production --audit-level=high
        continue-on-error: true

      - name: Instalar Claude Code
        run: npm install -g @anthropic-ai/claude-code

      - name: Análisis de calidad con Claude Code
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          claude -p "Ejecuta /review sobre los cambios de este PR. \
            Analiza el diff con respecto a la rama main. \
            Genera un reporte de calidad detallado." \
            --output-format json > quality-report.json

      - name: Análisis de seguridad con Claude Code
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          claude -p "Ejecuta /security-check sobre el código. \
            Enfócate en los archivos modificados en este PR." \
            --output-format json > security-report.json

      - name: Comentar resultados en PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const quality = fs.readFileSync('quality-report.json', 'utf8');
            const security = fs.readFileSync('security-report.json', 'utf8');

            const body = `## Reporte Automatizado de Calidad

            ### Análisis de Código
            \`\`\`
            ${quality}
            \`\`\`

            ### Análisis de Seguridad
            \`\`\`
            ${security}
            \`\`\`

            *Generado automáticamente por el Sistema de Calidad*`;

            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: body
            });
```

---

## 13.7 Documentación y presentación final

### Contenido esperado de la documentación

#### 1. Registros de decisiones de arquitectura (ADR)

Cada decisión técnica importante debe documentarse. Ejemplo de formato:

```markdown
# ADR-001: Uso de Haiku para el subagente de seguridad

## Estado: Aceptado

## Contexto
El subagente de seguridad se ejecuta frecuentemente (cada PR) y realiza
análisis que no requieren razonamiento complejo.

## Decisión
Usar el modelo Haiku para el subagente security-scanner.

## Consecuencias
- Positivas: Reduce costos de API en un 90% comparado con Sonnet
- Positivas: Menor latencia en cada ejecución
- Negativas: Puede perder patrones de vulnerabilidad sutiles
- Mitigación: Las revisiones críticas usan Sonnet via /security-check
```

#### 2. Guía de usuario del sistema

La guía debe incluir:

- Como instalar y configurar el sistema desde cero
- Comandos disponibles y cuándo usar cada uno
- Ejemplos prácticos de flujos de trabajo comunes
- Solución de problemas frecuentes
- Procedimiento para agregar nuevas reglas o skills

#### 3. Métricas de rendimiento

Documenta las métricas del sistema:

- Tiempo promedio de ejecución de cada skill
- Costo promedio por ejecución (tokens consumidos)
- Tasa de falsos positivos en el análisis de seguridad
- Porcentaje de defectos detectados antes del merge
- Satisfacción del equipo con el sistema

#### 4. Lecciones aprendidas

Reflexión sobre el proceso de desarrollo:

- Qué funcionó bien y qué no
- Qué harías diferente si empezaras de nuevo
- Recomendaciones para equipos que quieran adoptar un sistema similar
- Limitaciones encontradas y cómo se mitigaron

---

### Rúbrica de evaluación

El proyecto se evalúa en cuatro dimensiones, cada una con una tabla detallada.

#### Distribución de puntaje

| Criterio | Peso |
|----------|------|
| Diseño arquitectónico | 20% |
| Implementación técnica | 40% |
| Calidad de código y documentación | 20% |
| Presentación y defensa | 20% |

#### Criterio 1: Diseño arquitectónico (20%)

| Nivel | Puntaje | Descripción |
|-------|---------|-------------|
| **Excelente** | 90-100% | La arquitectura está completa con todos los componentes del curso integrados. El diagrama es claro y muestra el flujo de datos entre todos los subsistemas. Las decisiones están justificadas con ADRs bien redactados. La separación de responsabilidades es correcta. |
| **Bueno** | 70-89% | La mayoría de los componentes están integrados. El diagrama existe pero podría ser más detallado. Las decisiones principales están documentadas. Hay alguna superposición menor de responsabilidades. |
| **Suficiente** | 50-69% | Se incluyen los componentes básicos pero faltan algunos (por ejemplo, no hay subagentes o no hay hooks). El diagrama es incompleto. Las decisiones no están documentadas formalmente. |
| **Insuficiente** | <50% | La arquitectura es incompleta o incoherente. Faltan componentes fundamentales. No hay diagrama o es ilegible. No se justifican las decisiones. |

#### Criterio 2: Implementación técnica (40%)

| Nivel | Puntaje | Descripción |
|-------|---------|-------------|
| **Excelente** | 90-100% | Todos los componentes están implementados y funcionan correctamente. CLAUDE.md es completo, las reglas son específicas por ruta, los skills ejecutan flujos completos, los hooks interceptan correctamente, los subagentes están configurados con permisos mínimos y el CI/CD ejecuta el pipeline completo. |
| **Bueno** | 70-89% | La mayoría de los componentes funcionan. Puede haber un skill o hook con funcionalidad parcial. El CI/CD existe pero no cubre todos los pasos. Los subagentes funcionan pero los permisos podrían ser más restrictivos. |
| **Suficiente** | 50-69% | Los componentes básicos están implementados (CLAUDE.md, al menos un skill, configuración básica). Faltan hooks o subagentes. El CI/CD es rudimentario o no funciona completamente. |
| **Insuficiente** | <50% | Solo se implementaron uno o dos componentes. No hay integración entre ellos. Los archivos de configuración tienen errores. El sistema no funciona como un todo. |

#### Criterio 3: Calidad de código y documentación (20%)

| Nivel | Puntaje | Descripción |
|-------|---------|-------------|
| **Excelente** | 90-100% | El código es limpio y sigue todas las convenciones definidas. La documentación es completa con guía de usuario, ADRs, métricas y lecciones aprendidas. Cada componente tiene comentarios explicativos. Los archivos de configuración están bien organizados. |
| **Bueno** | 70-89% | El código es legible y mayormente consistente. La documentación cubre los aspectos principales. Algunos componentes carecen de comentarios. La organización es correcta con detalles menores. |
| **Suficiente** | 50-69% | El código funciona pero no sigue consistentemente las convenciones. La documentación es básica, cubre solo la instalación. Faltan ADRs o lecciones aprendidas. |
| **Insuficiente** | <50% | El código es desordenado o inconsistente. No hay documentación o es mínima. No se pueden entender las decisiones tomadas. |

#### Criterio 4: Presentación y defensa (20%)

| Nivel | Puntaje | Descripción |
|-------|---------|-------------|
| **Excelente** | 90-100% | La presentación es clara y bien estructurada. Demuestra el sistema funcionando en vivo. Responde preguntas técnicas con profundidad. Explica las decisiones de diseño y sus alternativas. Identifica limitaciones y propone mejoras futuras. |
| **Bueno** | 70-89% | La presentación cubre todos los puntos principales. La demostración funciona con detalles menores. Responde la mayoría de las preguntas correctamente. Conoce las limitaciones principales. |
| **Suficiente** | 50-69% | La presentación es básica pero cubre el sistema. La demostración tiene problemas parciales. Responde preguntas superficialmente. No identifica todas las limitaciones. |
| **Insuficiente** | <50% | La presentación es desorganizada o incompleta. No hay demostración o no funciona. No puede responder preguntas técnicas sobre su propia implementación. |

---

:::tip Felicidades, has completado el curso
Si has llegado hasta aquí y completado el proyecto integrador, has demostrado dominio sobre todo el ecosistema de Claude Code: desde la configuración básica hasta la orquestación de sistemas complejos.

**Siguientes pasos recomendados**:

- **Aplica lo aprendido** en tu trabajo diario. Empieza con CLAUDE.md y reglas modulares, luego añade componentes progresivamente.
- **Comparte con tu equipo**. Las configuraciones y skills que crees pueden beneficiar a todo tu equipo de desarrollo.
- **Mantente actualizado**. Claude Code evoluciona constantemente con nuevas capacidades, modelos y herramientas.
- **Contribuye a la comunidad**. Comparte tus skills, hooks y configuraciones con otros desarrolladores.
- **Experimenta con nuevos patrones**. Los conceptos que aprendiste son la base; las posibilidades de automatización son enormes.

El verdadero valor de este curso no está en memorizar comandos, sino en desarrollar el criterio para saber cuándo y cómo automatizar, cuándo delegar en un agente y cuándo mantener el control humano. Esa habilidad te acompañará sin importar cómo evolucionen las herramientas.
:::
