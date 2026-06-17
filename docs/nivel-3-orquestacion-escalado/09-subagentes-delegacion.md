---
sidebar_position: 1
title: "Capítulo 9: Subagentes — Delegación y Contexto Aislado"
description: Arquitectura de subagentes, tipos incorporados, creación personalizada, AGENTS.md y patrones de producción.
tags: [claude-code, subagentes, delegación, AGENTS.md, worktree]
---

# Capitulo 9: Subagentes — Delegacion y Contexto Aislado

Hasta ahora has trabajado con una unica sesion de Claude Code que mantiene todo el contexto de la conversacion. Pero cuando las tareas se vuelven complejas o necesitas especializar el comportamiento, una sola sesion no escala. Los **subagentes** resuelven este problema: son instancias autonomas de Claude que reciben una tarea especifica, la ejecutan con su propio contexto aislado y devuelven solo el resultado final. Este capitulo te ensena a dominar esta arquitectura de delegacion.

---

## 9.1 Arquitectura de subagentes

### Que es un subagente

Un subagente es una **instancia independiente de Claude** que se lanza desde una sesion principal (el agente padre) para realizar una tarea concreta. La caracteristica fundamental es el **aislamiento de contexto**: el subagente no hereda el historial de conversacion del padre. Recibe unicamente:

- Su **prompt de sistema** (instrucciones especificas para la tarea).
- Informacion basica del **entorno** (directorio de trabajo, proyecto).
- La **tarea concreta** que debe realizar.

Cuando termina, el subagente devuelve solo su **resultado final** al agente padre. Todo el trabajo intermedio (archivos leidos, comandos ejecutados, razonamiento interno) queda fuera del contexto del padre.

### Por que esto importa

El beneficio principal es mantener **limpio el contexto del agente padre**. Imagina que necesitas revisar la seguridad de 15 archivos, ejecutar tests y generar documentacion. Si haces todo en una sola sesion, la ventana de contexto se satura rapidamente con resultados intermedios. Con subagentes, cada tarea especializada se ejecuta en su propio espacio y el padre solo recibe los resumenes.

### Flujo de datos

```
┌─────────────────────────────────────────────────────────┐
│                    AGENTE PADRE                         │
│                                                         │
│  Contexto: historial de conversacion, CLAUDE.md,        │
│  archivos leidos, resultados previos                    │
│                                                         │
│         │ Agent("Revisa seguridad de auth/")             │
│         │ (solo envia el prompt de tarea)                │
│         ▼                                               │
│  ┌─────────────────────────────────────┐                │
│  │         SUBAGENTE                   │                │
│  │                                     │                │
│  │  Contexto propio:                   │                │
│  │  - System prompt del subagente      │                │
│  │  - Info basica del entorno          │                │
│  │  - NO recibe historial del padre    │                │
│  │                                     │                │
│  │  Ejecuta: Lee archivos, analiza,    │                │
│  │  busca vulnerabilidades...          │                │
│  │                                     │                │
│  │  Devuelve: "Encontre 3 problemas:   │                │
│  │  1) SQL injection en login.ts       │                │
│  │  2) XSS en comments.tsx             │                │
│  │  3) CSRF sin token en forms/"       │                │
│  └──────────────┬──────────────────────┘                │
│                 │                                        │
│                 ▼                                        │
│  El padre recibe SOLO el resultado final.               │
│  Todo el trabajo intermedio del subagente                │
│  NO contamina el contexto del padre.                    │
└─────────────────────────────────────────────────────────┘
```

### La herramienta Agent()

Para lanzar un subagente, Claude Code utiliza internamente la herramienta `Agent()`. Cuando le pides a Claude que delegue una tarea, este invoca `Agent()` con:

- **`description`**: descripcion breve de la tarea (3-5 palabras).
- **`prompt`**: instrucciones detalladas para el subagente. Debe ser autocontenido, ya que el subagente no tiene acceso al historial del padre.
- **`subagent_type`** (opcional): tipo de subagente a utilizar.
- **`isolation`** (opcional): modo de aislamiento (`worktree` para git worktree aislado).
- **`run_in_background`** (opcional): ejecutar en segundo plano.

```
> Necesito que revises la seguridad del modulo de autenticacion.
  Delega esta tarea a un subagente especializado.

# Claude internamente invoca:
# Agent({
#   description: "Revision seguridad auth",
#   prompt: "Revisa todos los archivos en src/auth/ buscando
#            vulnerabilidades comunes: inyeccion SQL, XSS, CSRF,
#            hardcoded secrets. Reporta hallazgos con severidad.",
#   subagent_type: "general-purpose"
# })
```

:::info Prompt autocontenido
El prompt del subagente debe incluir todo el contexto necesario. No escribas "basandote en lo que vimos antes" ni "revisa el archivo que mencionamos". El subagente no tiene acceso a nada de la conversacion previa.
:::

---

## 9.2 Subagentes incorporados

Claude Code incluye varios tipos de subagentes predefinidos, cada uno optimizado para un caso de uso especifico.

### Explore

El subagente **Explore** esta disenado para busquedas rapidas y de solo lectura. Utiliza el modelo **Haiku** (el mas rapido y economico) e **ignora CLAUDE.md** para maximizar la velocidad. No puede editar archivos ni ejecutar comandos destructivos.

```
> Busca donde esta definida la funcion calculateShipping
  en todo el proyecto. Usa un subagente Explore.

# Claude usa Agent() con subagent_type: "Explore"
# El subagente Explore busca rapidamente sin cargar CLAUDE.md
```

### Plan

El subagente **Plan** es de solo lectura y se utiliza cuando activas el **Plan Mode**. Analiza el codigo, identifica archivos criticos y propone estrategias de implementacion sin realizar ningun cambio.

### General-purpose

El subagente de **proposito general** tiene acceso a todas las herramientas (lectura, escritura, ejecucion, busqueda web) y hereda el modelo del agente padre. Es el tipo por defecto cuando no se especifica otro.

### Bash

El subagente **Bash** esta restringido exclusivamente a la ejecucion de comandos. No puede leer ni editar archivos directamente a traves de herramientas de archivo; su unica herramienta es la terminal.

### Tabla comparativa

| Subagente | Modelo | Herramientas | Caso de uso |
|-----------|--------|-------------|-------------|
| **Explore** | Haiku (rapido) | Solo lectura: Glob, Grep, Read, WebFetch, WebSearch | Buscar archivos, localizar simbolos, explorar estructura |
| **Plan** | Hereda del padre | Solo lectura: todas excepto Edit, Write, Agent | Disenar planes de implementacion, analizar arquitectura |
| **General-purpose** | Hereda del padre | Todas las herramientas | Tareas complejas que requieren leer, escribir y ejecutar |
| **Bash** | Hereda del padre | Solo Bash | Ejecutar scripts, correr tests, comandos del sistema |

:::tip Seleccion de subagente
Usa **Explore** cuando solo necesitas encontrar algo rapido. Usa **Plan** cuando necesitas pensar antes de actuar. Usa **General-purpose** cuando la tarea requiere cambios. Usa **Bash** cuando solo necesitas ejecutar comandos.
:::

---

## 9.3 Creacion de subagentes personalizados

Ademas de los tipos incorporados, puedes crear tus propios subagentes como **archivos Markdown** con frontmatter YAML. Esto te permite definir agentes especializados para las necesidades especificas de tu proyecto.

### Estructura del archivo

Un subagente personalizado es un archivo `.md` que se coloca en el directorio `.claude/agents/` del proyecto. La estructura tiene dos partes:

1. **Frontmatter YAML**: configuracion del subagente (entre `---`).
2. **Cuerpo del archivo**: el system prompt que define el comportamiento.

### Campos del frontmatter

**Campos requeridos:**

| Campo | Descripcion | Ejemplo |
|-------|-------------|---------|
| `name` | Identificador unico en minusculas con guiones | `security-scanner` |
| `description` | Descripcion breve del proposito | `"Escanea codigo en busca de vulnerabilidades"` |

**Campos opcionales:**

| Campo | Descripcion | Ejemplo |
|-------|-------------|---------|
| `tools` | Lista de herramientas permitidas (allowlist) | `[Read, Grep, Glob]` |
| `disallowedTools` | Herramientas bloqueadas | `[Edit, Write, Bash]` |
| `model` | Modelo especifico a utilizar | `claude-sonnet-4-6` |
| `permissionMode` | Nivel de permisos | `plan` |
| `mcpServers` | Servidores MCP disponibles | `[github, jira]` |
| `hooks` | Hooks personalizados del subagente | Ver capitulo de hooks |
| `maxTurns` | Numero maximo de turnos del agente | `25` |
| `skills` | Skills disponibles para el subagente | `[code-review]` |
| `memory` | Archivo de memoria adicional | `security-guidelines.md` |
| `effort` | Nivel de esfuerzo de razonamiento | `high` |
| `background` | Si se ejecuta en segundo plano | `true` |
| `isolation` | Modo de aislamiento | `worktree` |
| `color` | Color del indicador visual | `red` |

### Ejemplo 1: Subagente de escaneo de seguridad

```markdown
<!-- .claude/agents/security-scanner.md -->
---
name: security-scanner
description: "Escanea codigo fuente en busca de vulnerabilidades de seguridad"
tools:
  - Read
  - Grep
  - Glob
  - Bash
disallowedTools:
  - Edit
  - Write
model: claude-sonnet-4-6
maxTurns: 30
color: red
---

Eres un experto en seguridad de aplicaciones web. Tu trabajo es analizar
codigo fuente y reportar vulnerabilidades.

## Proceso de analisis

1. Identifica todos los archivos relevantes (controladores, middleware,
   modelos, rutas).
2. Busca patrones de vulnerabilidad comunes:
   - Inyeccion SQL (queries sin parametrizar)
   - XSS (salida sin sanitizar)
   - CSRF (formularios sin token)
   - Secrets hardcodeados (claves API, passwords en codigo)
   - Dependencias vulnerables (versiones antiguas)
3. Clasifica cada hallazgo por severidad: CRITICA, ALTA, MEDIA, BAJA.

## Formato de reporte

Para cada vulnerabilidad encontrada:
- **Archivo**: ruta completa
- **Linea**: numero de linea
- **Tipo**: categoria de vulnerabilidad
- **Severidad**: nivel de riesgo
- **Descripcion**: explicacion del problema
- **Remediacion**: como corregirlo

Si no encuentras vulnerabilidades, indicalo explicitamente.
```

### Ejemplo 2: Subagente de testing

```markdown
<!-- .claude/agents/test-runner.md -->
---
name: test-runner
description: "Ejecuta tests y genera cobertura de codigo"
tools:
  - Read
  - Bash
  - Grep
  - Glob
disallowedTools:
  - Edit
  - Write
model: claude-sonnet-4-6
maxTurns: 20
color: green
---

Eres un especialista en testing y calidad de codigo. Tu trabajo es
ejecutar los tests del proyecto y analizar los resultados.

## Proceso

1. Identifica el framework de testing del proyecto (Jest, Vitest,
   pytest, Go test, etc.).
2. Ejecuta la suite completa de tests.
3. Si hay fallos, analiza cada test fallido:
   - Lee el test para entender que verifica.
   - Lee el codigo bajo prueba.
   - Identifica la causa raiz del fallo.
4. Genera un reporte de cobertura si es posible.

## Formato de reporte

- Total de tests: X pasaron, Y fallaron, Z omitidos
- Cobertura: X% (si disponible)
- Para cada fallo:
  - Test: nombre del test
  - Archivo: ruta del archivo de test
  - Error: mensaje de error
  - Causa probable: analisis de por que falla
```

:::warning Seguridad en subagentes personalizados
Restringe siempre las herramientas al minimo necesario. Un subagente de analisis no deberia poder editar archivos. Un subagente de documentacion no necesita ejecutar bash. El principio de minimo privilegio aplica tambien a los agentes.
:::

---

## 9.4 AGENTS.md

### Proposito

El archivo **AGENTS.md** es el equivalente de CLAUDE.md pero para definir subagentes a nivel de equipo. Se coloca en la raiz del proyecto (o en subdirectorios) y permite que todo el equipo comparta las mismas definiciones de subagentes sin necesidad de configurar archivos individuales en `.claude/agents/`.

### Alcance jerarquico

Puedes tener multiples archivos `AGENTS.md` en diferentes niveles del proyecto. Claude los fusiona segun la ubicacion:

```
mi-proyecto/
├── AGENTS.md                    # Subagentes globales del proyecto
├── src/
│   ├── AGENTS.md                # Subagentes para el codigo fuente
│   ├── frontend/
│   │   └── AGENTS.md            # Subagentes solo para frontend
│   └── backend/
│       └── AGENTS.md            # Subagentes solo para backend
└── tests/
    └── AGENTS.md                # Subagentes para testing
```

Cuando Claude trabaja en `src/frontend/`, fusiona las definiciones de los tres niveles: raiz, `src/` y `src/frontend/`. Los agentes mas especificos tienen prioridad sobre los generales.

### Ejemplo completo de AGENTS.md

```markdown
<!-- AGENTS.md en la raiz del proyecto -->

# Subagentes del proyecto

## security-reviewer

Analiza cambios de codigo buscando vulnerabilidades de seguridad.
Enfocate en:
- Validacion de inputs en endpoints de API
- Manejo seguro de autenticacion y sesiones
- Prevencion de inyecciones (SQL, NoSQL, comandos)
- Gestion de secretos y variables de entorno

Reporta con formato: SEVERIDAD | ARCHIVO:LINEA | DESCRIPCION

## api-documenter

Genera documentacion OpenAPI para endpoints de la API REST.
- Lee los controladores y rutas
- Identifica parametros, body, respuestas
- Genera especificacion en formato YAML
- Sigue el estandar OpenAPI 3.1

## migration-checker

Valida migraciones de base de datos antes de aplicarlas.
- Verifica que cada migracion tiene su rollback
- Comprueba que no hay operaciones destructivas sin respaldo
- Valida consistencia de esquemas entre migraciones
- Alerta sobre migraciones que bloquean tablas grandes

## performance-analyzer

Analiza codigo buscando problemas de rendimiento.
- Queries N+1 en ORM
- Operaciones bloqueantes en rutas async
- Falta de indices en consultas frecuentes
- Carga innecesaria de datos (overfetching)
```

:::note Formato de AGENTS.md
Cada subagente se define con un encabezado `##` seguido del nombre. El cuerpo debajo del encabezado es el system prompt. Claude identifica automaticamente cada seccion como un subagente independiente.
:::

---

## 9.5 Subagentes Fork

### Que es un subagente fork

Un subagente **fork** utiliza `isolation: worktree` para crear un **git worktree aislado**. Esto significa que el subagente trabaja sobre una copia completa del repositorio en una rama separada, sin afectar el directorio de trabajo principal.

### Como funciona

```
Directorio principal: ~/mi-proyecto (rama: main)
                │
                │  Agent({ isolation: "worktree", ... })
                │
                ▼
Worktree aislado: /tmp/worktree-abc123 (rama: agent/tarea-xyz)
                │
                │  El subagente trabaja aqui libremente:
                │  edita, ejecuta, prueba, sin riesgo
                │
                ▼
Resultado:
  - Si hay cambios: devuelve ruta y rama del worktree
  - Si no hay cambios: el worktree se limpia automaticamente
```

### Cuando usarlo

- **Refactorizacion riesgosa**: cuando los cambios podrian romper el proyecto.
- **Experimentacion paralela**: probar varias implementaciones simultaneamente.
- **Cambios grandes**: migraciones o reestructuraciones que necesitas revisar antes de integrar.
- **Aislamiento seguro**: cuando no quieres que un agente modifique tu copia de trabajo.

### Ejemplo practico

```
> Refactoriza el modulo de pagos para usar el nuevo SDK de Stripe.
  Trabaja en un worktree aislado para no afectar mi rama actual.

# Claude invoca:
# Agent({
#   description: "Refactorizar pagos a Stripe SDK",
#   prompt: "Refactoriza todos los archivos en src/payments/
#            para migrar del SDK legacy de Stripe (stripe@8.x)
#            al nuevo SDK (stripe@14.x). Actualiza imports,
#            metodos de API y manejo de errores. Ejecuta los
#            tests de pagos para verificar que pasan.",
#   isolation: "worktree"
# })
```

Cuando el subagente termina:

```
Subagente completado. Cambios disponibles en:
  Ruta: /tmp/claude-worktree-a7b3c
  Rama: agent/refactor-stripe-sdk

Para revisar los cambios:
  git diff main..agent/refactor-stripe-sdk

Para integrar:
  git merge agent/refactor-stripe-sdk
```

:::tip Worktrees y limpieza
Si el subagente no realiza cambios (por ejemplo, si determina que no hay nada que modificar), el worktree se limpia automaticamente. Solo persisten los worktrees donde hubo commits.
:::

---

## 9.6 Patrones de produccion

### Patron 1: Pool de especialistas

Define un conjunto de subagentes especializados que cubran diferentes aspectos de la calidad del codigo.

```markdown
<!-- .claude/agents/test-specialist.md -->
---
name: test-specialist
description: "Genera y ejecuta tests unitarios e integracion"
tools: [Read, Write, Edit, Bash, Grep, Glob]
model: claude-sonnet-4-6
---

Eres un especialista en testing. Generas tests exhaustivos que cubren
casos limite, errores esperados y flujos principales.
Frameworks: Jest, Vitest, pytest segun el proyecto.
```

```markdown
<!-- .claude/agents/docs-specialist.md -->
---
name: docs-specialist
description: "Genera documentacion tecnica y de API"
tools: [Read, Grep, Glob, Write]
disallowedTools: [Bash, Edit]
model: claude-sonnet-4-6
---

Eres un especialista en documentacion tecnica. Generas JSDoc, docstrings,
README y guias de uso siguiendo las convenciones del proyecto.
```

```markdown
<!-- .claude/agents/perf-specialist.md -->
---
name: perf-specialist
description: "Analiza rendimiento y sugiere optimizaciones"
tools: [Read, Grep, Glob, Bash]
disallowedTools: [Edit, Write]
model: claude-sonnet-4-6
---

Eres un especialista en rendimiento. Identificas cuellos de botella,
queries lentas, renders innecesarios y propones optimizaciones concretas.
```

### Patron 2: Gatekeeper (pre-deploy checker)

Un subagente que actua como ultima linea de defensa antes de desplegar.

```markdown
<!-- .claude/agents/pre-deploy-checker.md -->
---
name: pre-deploy-checker
description: "Verificacion final antes de despliegue a produccion"
tools: [Read, Bash, Grep, Glob]
disallowedTools: [Edit, Write]
model: claude-opus-4-8
maxTurns: 40
color: red
---

Eres el guardian de calidad antes de cada despliegue. Ejecuta todas
las verificaciones en orden:

1. Tests unitarios: `npm test`
2. Tests de integracion: `npm run test:integration`
3. Linting: `npm run lint`
4. Type checking: `npx tsc --noEmit`
5. Auditar dependencias: `npm audit`
6. Verificar variables de entorno requeridas
7. Validar migraciones de base de datos pendientes

RESULTADO: DEPLOY_APROBADO o DEPLOY_BLOQUEADO con lista de problemas.
Si hay CUALQUIER fallo, el resultado es DEPLOY_BLOQUEADO.
```

### Patron 3: Especialista por paquete (monorepo)

En monorepos, define subagentes que conocen la estructura interna de cada paquete.

```markdown
<!-- packages/api/AGENTS.md -->

## api-developer

Especialista en el paquete @myapp/api.
- Framework: Express con TypeScript
- ORM: Prisma con PostgreSQL
- Auth: JWT con refresh tokens
- Validacion: Zod schemas
- Tests: Vitest + supertest
- Build: `pnpm --filter @myapp/api build`
- Test: `pnpm --filter @myapp/api test`
```

```markdown
<!-- packages/web/AGENTS.md -->

## web-developer

Especialista en el paquete @myapp/web.
- Framework: Next.js 15 con App Router
- Estilos: Tailwind CSS + shadcn/ui
- Estado: Zustand
- Fetching: TanStack Query
- Tests: Vitest + Testing Library
- Build: `pnpm --filter @myapp/web build`
- Test: `pnpm --filter @myapp/web test`
```

### Orden de resolucion de modelo

Cuando un subagente se ejecuta, Claude determina que modelo usar siguiendo este orden de prioridad (de mayor a menor):

```
1. Variable de entorno    →  CLAUDE_MODEL="claude-opus-4-8"
2. Flag de invocacion     →  claude --model claude-opus-4-8
3. Frontmatter del agente →  model: claude-sonnet-4-6
4. Modelo de la sesion    →  El modelo activo del agente padre
```

Si ningun nivel especifica un modelo, el subagente hereda el modelo de la sesion padre.

:::note Implicacion de costos
Un subagente con `model: claude-opus-4-8` consumira tokens a la tarifa de Opus aunque el padre use Sonnet. Monitorea tus costos cuando uses modelos premium en subagentes frecuentes.
:::

---

## Resumen del capitulo

:::tip Conceptos clave
- **Subagentes** son instancias independientes de Claude con contexto aislado. No heredan el historial del padre y devuelven solo el resultado final.
- **Cuatro tipos incorporados**: Explore (rapido, solo lectura), Plan (analisis sin cambios), General-purpose (todas las herramientas), Bash (solo comandos).
- **Subagentes personalizados** se definen como archivos Markdown con frontmatter YAML en `.claude/agents/`. El cuerpo del archivo es el system prompt.
- **AGENTS.md** permite definir subagentes a nivel de proyecto con alcance jerarquico por directorio.
- **Subagentes fork** (`isolation: worktree`) trabajan en copias aisladas del repositorio, ideales para cambios riesgosos.
- **Patrones de produccion**: pool de especialistas, gatekeeper pre-deploy y especialistas por paquete en monorepos.
:::

---

## Preguntas de autoevaluacion

1. **Explica por que el aislamiento de contexto de los subagentes beneficia al agente padre.** Da un ejemplo concreto donde una tarea delegada a un subagente evita saturar la ventana de contexto.

2. **Tienes que buscar rapidamente donde se define una funcion en un proyecto de 500 archivos.** Cual subagente incorporado usarias y por que es mejor que usar el general-purpose para esta tarea?

3. **Disena un subagente personalizado para un linter de convenciones de codigo.** Define los campos del frontmatter y el system prompt. Justifica cada herramienta que incluyes y excluyes.

4. **Tu monorepo tiene tres paquetes: `api`, `web` y `shared`.** Como estructurarias los archivos AGENTS.md para que cada paquete tenga su especialista sin duplicar definiciones comunes?

5. **Describe un escenario donde un subagente fork es claramente superior a un subagente normal.** Que sucede si el subagente fork no realiza ningun cambio?

---

## Laboratorio asociado

Los conceptos de este capitulo se practican en el **Laboratorio L9.1: Delegacion con subagentes**, donde crearas subagentes personalizados, definiras un AGENTS.md y experimentaras con subagentes fork en un proyecto real.

Dirigete a la seccion de [Laboratorios](/laboratorios) para acceder al ejercicio.
