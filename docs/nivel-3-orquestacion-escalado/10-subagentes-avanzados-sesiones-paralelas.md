---
sidebar_position: 2
title: "Capítulo 10: Subagentes Avanzados y Sesiones Paralelas"
description: Agent Teams, sesiones background, fan-out no interactivo, worktrees, batch y patrón Writer/Reviewer.
tags: [claude-code, sesiones-paralelas, background, batch, worktree, agent-teams]
---

# Capitulo 10: Subagentes Avanzados y Sesiones Paralelas

El capitulo anterior introdujo los subagentes como instancias aisladas que ejecutan tareas individuales. Este capitulo lleva el concepto al siguiente nivel: multiples agentes trabajando en paralelo, sesiones en segundo plano, procesamiento por lotes y patrones de coordinacion que multiplican tu productividad. Estas tecnicas son las que distinguen a un usuario avanzado de uno que simplemente conversa con Claude.

---

## 10.1 Agent Teams

### Concepto

**Agent Teams** es una capacidad en preview que permite que multiples agentes trabajen de forma coordinada, comunicandose entre si y dividiendo el trabajo de forma inteligente. A diferencia de los subagentes simples (donde el padre delega y espera), en un Agent Team cada agente (llamado **teammate**) opera de forma autonoma con su propio contexto y conjunto de herramientas.

### Arquitectura conceptual

```
┌──────────────────────────────────────────────────────┐
│                   AGENT TEAM                         │
│                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │  Teammate A  │  │  Teammate B  │  │ Teammate C │ │
│  │  (Frontend)  │  │  (Backend)   │  │  (Tests)   │ │
│  │              │  │              │  │            │ │
│  │  Contexto    │  │  Contexto    │  │  Contexto  │ │
│  │  propio      │  │  propio      │  │  propio    │ │
│  │              │  │              │  │            │ │
│  │  Tools:      │  │  Tools:      │  │  Tools:    │ │
│  │  Read, Edit, │  │  Read, Edit, │  │  Read,     │ │
│  │  Bash        │  │  Bash, DB    │  │  Bash      │ │
│  └──────┬───────┘  └──────┬───────┘  └─────┬──────┘ │
│         │                 │                │         │
│         └────────┬────────┘                │         │
│                  │    Coordinacion          │         │
│                  └─────────────────────────┘         │
└──────────────────────────────────────────────────────┘
```

### Caracteristicas clave

- **Contexto independiente**: cada teammate tiene su propia ventana de contexto, sin compartir historial con los demas.
- **Herramientas propias**: cada teammate puede tener un conjunto diferente de herramientas habilitadas.
- **Comunicacion**: los teammates pueden intercambiar mensajes para coordinar su trabajo.
- **Evento TeammateIdle**: cuando un teammate termina su tarea y queda inactivo, se dispara un evento que permite a los hooks reaccionar (por ejemplo, asignar nueva tarea o notificar al equipo).

### Caso de uso

```
> Implementa la nueva funcionalidad de notificaciones push.
  Necesito un teammate para el frontend (componente React + service worker),
  otro para el backend (API endpoints + WebSocket) y un tercero
  para escribir los tests de integracion.
```

En este escenario, cada teammate trabaja en su area sin interferir con los otros, pero pueden coordinarse: el teammate de tests espera a que frontend y backend terminen antes de escribir tests de integracion.

:::info Preview de investigacion
Agent Teams esta actualmente en preview de investigacion. La API y comportamiento pueden cambiar. Consulta la documentacion oficial de Anthropic para el estado actual de esta funcionalidad.
:::

---

## 10.2 Sesiones background

### Ejecutar tareas en segundo plano

Las sesiones **background** te permiten lanzar tareas que se ejecutan independientemente mientras tu continuas trabajando en la terminal o en otra sesion de Claude Code.

```bash
# Lanzar una tarea en segundo plano
claude --bg "Revisa todos los archivos en src/ y genera un reporte
             de deuda tecnica con prioridades"

# Claude responde inmediatamente con un ID de sesion:
# Background session started: sess_a7b3c9d2
# Use 'claude agents' to monitor progress
```

### Monitorear sesiones activas

El comando `claude agents` muestra el estado de todas las sesiones background:

```bash
claude agents

# Salida:
# ┌──────────────────────────────────────────────────────────┐
# │  Agent Sessions                                          │
# ├──────────────┬───────────┬──────────────────────────────┤
# │  ID          │  Status   │  Task                        │
# ├──────────────┼───────────┼──────────────────────────────┤
# │  sess_a7b3c  │  Active   │  Reporte deuda tecnica       │
# │  sess_f1e2d  │  Blocked  │  Migracion TypeScript        │
# │  sess_x9y8z  │  Done     │  Revision seguridad          │
# └──────────────┴───────────┴──────────────────────────────┘
```

Los estados posibles son:

| Estado | Significado |
|--------|-------------|
| **Active** | El agente esta ejecutando tareas |
| **Blocked** | El agente necesita una decision o permiso |
| **Done** | La tarea se completo |

### Reconectarse a una sesion

Para ver el resultado de una sesion completada o intervenir en una bloqueada:

```bash
# Reconectarse a una sesion especifica
claude --resume sess_a7b3c

# Claude muestra el estado actual y el resultado (si esta completada)
```

### Modelos diferentes por sesion

Cada sesion background puede usar un modelo diferente, optimizando costo y capacidad:

```bash
# Sesion background con Opus para tarea compleja
claude --bg --model claude-opus-4-8 "Disena la arquitectura
  del nuevo sistema de permisos con RBAC"

# Sesion background con Haiku para tarea simple
claude --bg --model claude-haiku-4-5 "Lista todos los TODOs
  y FIXMEs del proyecto con su ubicacion"
```

### Flujo de trabajo tipico

```bash
# 1. Lanzar varias tareas en paralelo
claude --bg "Revisa la seguridad del modulo auth"
claude --bg "Genera tests para el modulo payments"
claude --bg "Documenta la API de users"

# 2. Continuar trabajando en tu terminal normalmente
npm run dev

# 3. Verificar progreso periodicamente
claude agents

# 4. Revisar resultados cuando esten listos
claude --resume sess_xxx
```

:::tip Productividad con sesiones background
Las sesiones background son ideales para tareas que no necesitan tu atencion inmediata: revisiones de codigo, generacion de documentacion, analisis de rendimiento. Lanzalas y continua con tu trabajo principal.
:::

---

## 10.3 Fan-out con `claude -p`

### Procesamiento por lotes con pipes

El flag `-p` (pipe) permite enviar un prompt a Claude Code de forma no interactiva, lo que abre la puerta a procesamiento masivo mediante scripts de shell.

### Iterar sobre archivos modificados

```bash
# Revisar cada archivo modificado en el ultimo commit
git diff --name-only HEAD~1 | while read file; do
  claude -p "Revisa este archivo buscando bugs: $file" \
    --allowedTools Read,Grep
done
```

### Restriccion de herramientas

El flag `--allowedTools` limita que herramientas puede usar Claude en modo no interactivo, proporcionando una capa de seguridad:

```bash
# Solo lectura: Claude puede leer y buscar, pero no modificar
claude -p "Analiza src/auth/login.ts" --allowedTools Read,Grep,Glob

# Lectura y ejecucion: puede correr tests pero no editar
claude -p "Ejecuta los tests y reporta fallos" --allowedTools Read,Bash
```

### Salida estructurada con JSON

Para integrar resultados en pipelines automatizados, usa `--output-format json`:

```bash
# Obtener resultado en formato JSON
claude -p "Lista las dependencias desactualizadas" \
  --output-format json

# Salida:
# {
#   "result": "...",
#   "cost_usd": 0.023,
#   "duration_ms": 4521,
#   "model": "claude-sonnet-4-6"
# }
```

### Paralelizacion con shell

Para acelerar el procesamiento, ejecuta multiples instancias en paralelo:

```bash
# Paralelizar con & (background de shell)
for file in src/controllers/*.ts; do
  claude -p "Revisa $file buscando queries SQL sin parametrizar" \
    --allowedTools Read,Grep &
done
wait  # Esperar a que todas terminen
echo "Revision completada"
```

```bash
# Paralelizar con xargs para control de concurrencia
git diff --name-only HEAD~1 | xargs -P 4 -I {} \
  claude -p "Analiza {} buscando problemas de rendimiento" \
    --allowedTools Read,Grep,Glob
```

### Script completo de revision de PR

```bash
#!/bin/bash
# review-pr.sh - Revisa cada archivo cambiado en un PR

BRANCH="${1:-HEAD}"
OUTPUT_DIR="./reviews"
mkdir -p "$OUTPUT_DIR"

echo "Revisando cambios en $BRANCH..."

git diff --name-only main..."$BRANCH" | while read file; do
  echo "Revisando: $file"
  claude -p "Revisa el archivo $file buscando:
    1. Bugs potenciales
    2. Problemas de seguridad
    3. Violaciones de estilo
    Formato: lista con severidad (ALTA/MEDIA/BAJA)" \
    --allowedTools Read,Grep,Glob \
    --output-format json > "$OUTPUT_DIR/$(basename $file).json"
done

echo "Revisiones guardadas en $OUTPUT_DIR/"
```

:::warning Costos en fan-out
Cada invocacion de `claude -p` es una sesion independiente con su propio costo. Si iteras sobre 100 archivos, son 100 sesiones. Monitorea tu consumo de tokens, especialmente con modelos costosos.
:::

---

## 10.4 Worktrees con `--worktree`

### Concepto

El flag `--worktree` lanza una sesion de Claude Code en un **git worktree dedicado**: una copia de trabajo separada del repositorio con su propia rama. Los cambios que realice Claude quedan aislados de tu directorio principal.

### Diferencia con subagentes fork

Mientras que `isolation: worktree` en `Agent()` es para subagentes dentro de una sesion, `--worktree` se usa desde la linea de comandos para crear una **sesion completa** en un worktree aislado.

### Uso basico

```bash
# Crear una sesion en worktree para refactorizar
claude --worktree "Refactoriza el modulo de autenticacion
  para usar el patron Repository en lugar de acceso directo a DB"

# Claude crea automaticamente:
# - Un worktree en un directorio temporal
# - Una rama nueva (ej: worktree/refactor-auth-repo)
# - Trabaja alli sin afectar tu rama actual
```

### Combinacion con background

La combinacion `--worktree` + `--bg` es especialmente potente para lanzar multiples refactorizaciones en paralelo:

```bash
# Lanzar tres refactorizaciones en paralelo, cada una en su worktree
claude --worktree --bg "Migra src/auth/ de callbacks a async/await"
claude --worktree --bg "Extrae constantes magicas en src/payments/"
claude --worktree --bg "Convierte src/utils/ de CommonJS a ESM"

# Cada sesion trabaja en su propia rama sin conflictos
claude agents

# Cuando terminen, revisar cada rama:
# git diff main..worktree/migrate-auth-async
# git diff main..worktree/extract-payment-constants
# git diff main..worktree/convert-utils-esm
```

### Flujo de trabajo completo

```bash
# 1. Lanzar refactorizacion en worktree
claude --worktree "Actualiza todos los componentes React de clase
  a componentes funcionales con hooks"

# 2. Claude trabaja en su worktree aislado...
#    Edita archivos, ejecuta tests, itera

# 3. Al terminar, Claude reporta:
#    Worktree: /tmp/claude-wt-r4nd0m
#    Rama: worktree/react-class-to-hooks
#    Archivos modificados: 23
#    Tests: todos pasando

# 4. Revisar cambios
git log main..worktree/react-class-to-hooks
git diff main..worktree/react-class-to-hooks

# 5. Si estas satisfecho, integrar
git merge worktree/react-class-to-hooks
```

:::tip Worktrees para experimentacion
Usa `--worktree` cuando quieras explorar una solucion sin comprometer tu rama actual. Si el resultado no te convence, simplemente no integras la rama y el worktree se puede eliminar sin consecuencias.
:::

---

## 10.5 Batch: cambios a gran escala

### Que es /batch

El skill **`/batch`** esta disenado para cambios que afectan a muchos archivos simultaneamente: migraciones, renombramientos masivos, actualizaciones de API, cambios de patron. En lugar de editar archivo por archivo, `/batch` automatiza todo el proceso.

### Flujo de trabajo

El proceso de `/batch` tiene cuatro fases:

```
┌──────────────────────────────────────────────────────┐
│  Fase 1: INVESTIGACION                               │
│  Claude analiza el codebase para entender el alcance │
│  del cambio. Identifica todos los archivos afectados.│
├──────────────────────────────────────────────────────┤
│  Fase 2: PLANIFICACION                               │
│  Divide el trabajo en unidades independientes.       │
│  Presenta el plan para tu aprobacion.                │
├──────────────────────────────────────────────────────┤
│  Fase 3: EJECUCION PARALELA                          │
│  Crea un worktree por unidad de trabajo.             │
│  Implementa cambios y ejecuta tests en paralelo.     │
├──────────────────────────────────────────────────────┤
│  Fase 4: INTEGRACION                                 │
│  Abre un PR por unidad (o uno consolidado).          │
│  Reporta resultados de tests por unidad.             │
└──────────────────────────────────────────────────────┘
```

### Casos de uso ideales

| Escenario | Ejemplo |
|-----------|---------|
| **Migracion de API** | Actualizar todas las llamadas de `fetch` a un nuevo wrapper `apiClient` |
| **Renombramiento masivo** | Cambiar el namespace de `@old-company` a `@new-company` |
| **Actualizacion de patron** | Migrar de `class components` a `hooks` en todo el proyecto |
| **Cambio de dependencia** | Reemplazar `moment.js` por `date-fns` en todo el codebase |
| **Actualizacion de esquema** | Propagar un cambio de modelo a todos los controladores y tests |

### Ejemplo de uso

```
> /batch Migra todas las llamadas a la API legacy (v1) al nuevo
  cliente (v2). Los endpoints cambiaron de /api/v1/* a /api/v2/*
  y el formato de respuesta ahora usa camelCase en lugar de
  snake_case.

# Claude responde:
#
# Investigacion completada. He identificado:
# - 47 archivos con llamadas a /api/v1/
# - 12 modulos de servicios
# - 8 archivos de tests
#
# Plan propuesto (5 unidades de trabajo):
#
# Unidad 1: Servicios de usuario (8 archivos)
#   - src/services/user*.ts
#   - tests/services/user*.test.ts
#
# Unidad 2: Servicios de productos (11 archivos)
#   - src/services/product*.ts
#   - tests/services/product*.test.ts
#
# Unidad 3: Servicios de ordenes (9 archivos)
#   - src/services/order*.ts
#   - tests/services/order*.test.ts
#
# Unidad 4: Componentes frontend (12 archivos)
#   - src/components/**/*Api*.tsx
#
# Unidad 5: Utilidades compartidas (7 archivos)
#   - src/utils/api*.ts
#   - src/lib/client.ts
#
# ¿Apruebas este plan? (si/no/modificar)
```

Despues de tu aprobacion, Claude crea un worktree por unidad, implementa los cambios en paralelo, ejecuta tests en cada uno y abre PRs cuando todo pasa.

:::warning Revision obligatoria
Aunque `/batch` automatiza el proceso, siempre revisa los PRs generados antes de hacer merge. Los cambios masivos automatizados requieren supervision humana, especialmente en transformaciones de formato o actualizaciones de API.
:::

---

## 10.6 Patron Writer/Reviewer

### El problema de la contaminacion contextual

Cuando una sola sesion de Claude escribe codigo y luego lo revisa, existe un sesgo: el reviewer "recuerda" las decisiones del writer y tiende a validarlas en lugar de cuestionarlas. Esto se llama **contaminacion contextual**.

### La solucion: dos sesiones separadas

El patron Writer/Reviewer usa dos sesiones completamente independientes:

1. **Writer**: implementa la solucion en una sesion fresca.
2. **Reviewer**: revisa la implementacion en otra sesion fresca, sin conocer el razonamiento del Writer.

### Flujo paso a paso

```
Paso 1: WRITER
─────────────────────────────────
Sesion nueva. Contexto limpio.

claude --worktree "Implementa un sistema de rate limiting
  para la API usando Redis. Debe soportar limites por
  usuario, por IP y por endpoint."

→ Writer implementa la solucion en su worktree
→ Commits en rama: worktree/rate-limiting


Paso 2: REVIEWER
─────────────────────────────────
Sesion nueva. Contexto limpio.
El Reviewer NO sabe como ni por que el Writer
tomo sus decisiones.

claude -p "Revisa los cambios en la rama worktree/rate-limiting
  comparados con main. Busca:
  1. Bugs logicos
  2. Problemas de seguridad
  3. Race conditions con Redis
  4. Casos limite no cubiertos
  5. Tests faltantes
  Reporta cada hallazgo con severidad y sugerencia." \
  --allowedTools Read,Grep,Glob,Bash


Paso 3: EVALUACION
─────────────────────────────────
Tu revisas los hallazgos del Reviewer.
Si hay problemas criticos, puedes:
  a) Corregir manualmente
  b) Lanzar un nuevo Writer con los hallazgos
  c) Iterar el ciclo
```

### Implementacion con script

```bash
#!/bin/bash
# writer-reviewer.sh
# Patron Writer/Reviewer automatizado

TASK="$1"
BRANCH_NAME="$2"

echo "=== FASE WRITER ==="
claude --worktree "$TASK"
# Obtener la rama creada
WRITER_BRANCH=$(git branch --list "worktree/$BRANCH_NAME*" | head -1 | tr -d ' ')

echo ""
echo "=== FASE REVIEWER ==="
echo "Revisando rama: $WRITER_BRANCH"
claude -p "Revisa exhaustivamente los cambios en la rama $WRITER_BRANCH
  comparados con main. Busca bugs, problemas de seguridad, casos limite,
  y violaciones de las convenciones del proyecto.
  Para cada hallazgo indica: severidad, archivo, linea y sugerencia." \
  --allowedTools Read,Grep,Glob,Bash \
  --output-format json > review-results.json

echo ""
echo "=== RESULTADOS ==="
echo "Revision guardada en review-results.json"
```

### Por que funciona

| Aspecto | Sesion unica | Writer/Reviewer |
|---------|-------------|-----------------|
| **Contexto** | Compartido: writer y reviewer ven lo mismo | Separado: reviewer no conoce el razonamiento |
| **Sesgo** | Alto: tendencia a validar propias decisiones | Bajo: revision genuinamente independiente |
| **Cobertura** | Limitada por fatiga contextual | Mayor: cada sesion empieza fresca |
| **Costo** | Una sesion | Dos sesiones (mayor costo de tokens) |
| **Calidad** | Buena | Superior para cambios criticos |

:::tip Cuando usar Writer/Reviewer
Reserva este patron para cambios criticos: sistemas de seguridad, logica de pagos, migraciones de datos, cambios en autenticacion. Para cambios menores o de bajo riesgo, una sola sesion es suficiente.
:::

---

## Resumen del capitulo

:::tip Conceptos clave
- **Agent Teams** (preview) permite que multiples agentes cooperen con contextos independientes y comunicacion directa.
- **Sesiones background** (`claude --bg`) ejecutan tareas en segundo plano mientras continuas trabajando. Monitorea con `claude agents` y reconecta con `--resume`.
- **Fan-out con `claude -p`** permite procesamiento masivo no interactivo, paralelizable con herramientas de shell y con salida JSON estructurada.
- **Worktrees** (`claude --worktree`) crean copias de trabajo aisladas con ramas propias, combinables con `--bg` para refactorizacion paralela.
- **`/batch`** investiga, planifica, ejecuta en paralelo y abre PRs para cambios a gran escala. Siempre requiere aprobacion del plan.
- **Patron Writer/Reviewer** elimina la contaminacion contextual usando dos sesiones independientes para implementar y revisar.
:::

---

## Preguntas de autoevaluacion

1. **Explica la diferencia entre un subagente background (`run_in_background: true`) y una sesion background (`claude --bg`).** Cuando usarias cada uno?

2. **Tienes un monorepo con 200 archivos TypeScript y necesitas migrar todos de una version de API a otra.** Describe paso a paso como usarias `/batch` para esta tarea. Que haces si una unidad de trabajo falla los tests?

3. **Disena un script de fan-out que revise la seguridad de todos los archivos modificados en un PR.** Incluye restriccion de herramientas, salida JSON y paralelizacion controlada.

4. **Compara `--worktree` con `isolation: worktree` en Agent().** En que nivel opera cada uno y cuando elegirías uno sobre otro?

5. **Un colega argumenta que el patron Writer/Reviewer es un desperdicio de tokens porque Claude puede revisar su propio codigo.** Redacta una respuesta explicando el problema de contaminacion contextual con un ejemplo concreto.

---

## Laboratorio asociado

Los conceptos de este capitulo se practican en el **Laboratorio L10.1: Sesiones paralelas y procesamiento por lotes**, donde lanzaras sesiones background, construiras scripts de fan-out y aplicaras el patron Writer/Reviewer en un proyecto real.

Dirigete a la seccion de [Laboratorios](/laboratorios) para acceder al ejercicio.
