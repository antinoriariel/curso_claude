---
sidebar_position: 2
title: "Capítulo 12: Optimización, Costos y Seguridad"
description: Gestión del context window, selección de modelos, control de costos, seguridad empresarial y buenas prácticas.
tags: [claude-code, optimización, costos, seguridad, context-window]
---

# Capitulo 12: Optimizacion, Costos y Seguridad

Claude Code es una herramienta poderosa, pero no gratuita ni ilimitada. Una sesion mal gestionada puede consumir tokens innecesarios, exponer datos sensibles o producir resultados degradados por saturacion de contexto. Este capitulo te da las estrategias para **optimizar rendimiento, controlar costos y asegurar tu entorno** de forma profesional.

---

## 12.1 Gestion del context window

### El recurso finito: 200K tokens

Cada sesion de Claude Code tiene una **ventana de contexto de 200K tokens**. Todo lo que ocurre en la conversacion (tus prompts, las respuestas de Claude, el contenido de archivos leidos, resultados de herramientas) consume tokens de esa ventana. Cuando se llena, Claude pierde la capacidad de recordar el inicio de la conversacion.

### /compact: tu herramienta de supervivencia

El comando `/compact` comprime la conversacion actual, resumiendo el historial para liberar espacio:

```
> /compact

Claude: Conversacion compactada.
  Antes: 87,342 tokens
  Despues: 12,108 tokens
  Liberados: 75,234 tokens (86%)
```

Puedes agregar instrucciones especificas sobre que priorizar en el resumen:

```
> /compact enfocate en las decisiones de arquitectura y los archivos modificados
```

### Estrategias de gestion

**1. Compactacion periodica manual**

Cada 30-45 minutos de trabajo intenso, ejecuta `/compact`. Es el equivalente a guardar tu progreso en un videojuego.

**2. Auto-compact con variable de entorno**

Configura Claude Code para compactar automaticamente cuando el uso de contexto alcance un umbral:

```bash
# Compacta automaticamente al 80% de uso
export CLAUDE_AUTOCOMPACT_PCT_THRESHOLD=80
```

Valores recomendados:
- **70-80%**: para sesiones largas con mucho codigo.
- **85-90%**: si prefieres maximizar contexto antes de compactar.
- **No configurar**: si prefieres control manual total.

**3. Priorizacion de contenido**

Claude Code prioriza cierto contenido automaticamente:

| Contenido | Prioridad | Notas |
|-----------|-----------|-------|
| CLAUDE.md y archivos de reglas | Alta | Siempre en contexto |
| Instrucciones del sistema | Alta | Incluye configuracion |
| Archivos leidos recientemente | Media | Pueden perderse al compactar |
| Historial de conversacion antiguo | Baja | Primero en resumirse |
| Resultados largos de herramientas | Baja | Se truncan si es necesario |

**4. Monitoreo con /status**

Verifica cuanto contexto estas usando en cualquier momento:

```
> /status

  Modelo: claude-sonnet-4-20250514
  Contexto: 45,230 / 200,000 tokens (22.6%)
  Costo sesion: $0.42
  Turnos: 15
```

:::tip Senal de alerta
Si `/status` muestra mas del 70% de uso y aun tienes trabajo pendiente, ejecuta `/compact` inmediatamente. Trabajar con contexto saturado degrada la calidad de las respuestas.
:::

### Tips practicos

- **Divide tareas grandes** en sesiones separadas. Una sesion para refactorizar, otra para tests.
- **Evita leer archivos enormes** completos. Usa rangos: "lee las lineas 50-120 de config.py".
- **No repitas instrucciones** que ya estan en CLAUDE.md.
- **Cierra y abre nueva sesion** cuando cambies de tarea completamente.

---

## 12.2 Seleccion de modelos por tarea

### No todo requiere el modelo mas potente

Usar Opus para cada tarea es como usar un camion de mudanzas para ir a comprar pan. La seleccion inteligente de modelos puede reducir costos drasticamente sin sacrificar calidad donde importa.

### Matriz de decision

| Modelo | Fortaleza | Costo relativo | Velocidad | Caso de uso ideal |
|--------|-----------|---------------|-----------|-------------------|
| **Opus 4.8** | Razonamiento complejo | $$$$$ | Lento | Arquitectura de sistemas, debugging complejo, decisiones criticas |
| **Sonnet 4.6** | Equilibrio general | $$$ | Medio | Desarrollo diario, refactorizacion, code review, la mayoria de tareas |
| **Haiku 4.5** | Velocidad y eficiencia | $ | Rapido | Tareas simples, clasificacion, exploracion rapida, subtareas |
| **Fable 5** | Escritura y narrativa | $$$ | Medio | Documentacion extensa, analisis de investigacion largo |

### Tabla de costos comparativa

| Modelo | Entrada (por 1M tokens) | Salida (por 1M tokens) | Cache entrada |
|--------|------------------------|----------------------|---------------|
| **Opus 4.8** | $15.00 | $75.00 | $1.88 |
| **Sonnet 4.6** | $3.00 | $15.00 | $0.30 |
| **Haiku 4.5** | $0.80 | $4.00 | $0.08 |
| **Fable 5** | $3.00 | $15.00 | $0.30 |

:::warning Impacto real del modelo
Una sesion tipica de desarrollo de 2 horas puede consumir entre 100K-500K tokens. Con Opus, eso puede costar $15-75. Con Sonnet, $1.50-7.50. Con Haiku para tareas simples, centavos. La eleccion de modelo **importa financieramente**.
:::

### Cambio de modelo en sesion

Usa `/model` para cambiar el modelo sin perder contexto:

```
> /model claude-haiku-4-20250506

Claude: Modelo cambiado a claude-haiku-4-20250506.

> Busca todos los archivos .env en el proyecto
  (tarea simple, Haiku es suficiente)

> /model claude-sonnet-4-20250514

Claude: Modelo cambiado a claude-sonnet-4-20250514.

> Ahora refactoriza el sistema de autenticacion
  (tarea compleja, necesita Sonnet)
```

### Estrategia recomendada

1. **Inicia con Haiku** para exploracion y preguntas rapidas.
2. **Sube a Sonnet** para desarrollo activo y refactorizacion.
3. **Usa Opus** solo para decisiones arquitecturales criticas o debugging complejo.
4. **Elige Fable** para sesiones largas de documentacion o investigacion.

---

## 12.3 Monitoreo y control de costos

### /cost: tu medidor en tiempo real

Dentro de cualquier sesion, `/cost` muestra el consumo acumulado:

```
> /cost

  Tokens de entrada: 34,521
  Tokens de salida: 12,893
  Costo estimado: $0.31
  Modelo actual: claude-sonnet-4-20250514
```

### Estrategias de optimizacion de costos

**1. Haiku para exploracion**

Antes de pedir a Sonnet o Opus que refactorice, usa Haiku para explorar y entender el codigo:

```
> /model claude-haiku-4-20250506
> Que hace la funcion processPayment en src/billing.py?
> Cuantos archivos importan el modulo auth?
> /model claude-sonnet-4-20250514
> Ahora refactoriza processPayment segun lo que encontramos
```

**2. Compactacion frecuente**

Cada compactacion reduce los tokens en contexto, lo que reduce el costo de las llamadas subsiguientes. Una sesion con compactacion estrategica puede costar la mitad que una sin ella.

**3. `--max-turns` en scripts**

Limita los turnos para evitar que Claude entre en bucles costosos:

```bash
# Maximo 5 turnos - suficiente para analisis simples
claude -p "Busca vulnerabilidades en src/" --max-turns 5

# Maximo 15 turnos - para tareas mas complejas
claude -p "Refactoriza el modulo auth" --max-turns 15
```

**4. Skills bien disenadas**

Las skills incluyen instrucciones predefinidas que evitan que el agente "explore de mas". Un skill que dice exactamente que hacer es mas barato que un prompt vago.

### Checklist de optimizacion de costos

- [ ] Usar el modelo adecuado para cada tipo de tarea.
- [ ] Ejecutar `/compact` cuando el contexto supere el 70%.
- [ ] Limitar turnos con `--max-turns` en scripts automatizados.
- [ ] Definir skills para tareas repetitivas.
- [ ] Dar contexto especifico en los prompts (evitar "analiza todo").
- [ ] Monitorear costos con `/cost` periodicamente.
- [ ] Usar `--allowedTools` para restringir herramientas innecesarias.
- [ ] Separar tareas grandes en sesiones individuales.

---

## 12.4 Seguridad empresarial

### Capas de proteccion

Claude Code ofrece multiples mecanismos de seguridad que se complementan entre si. En un entorno empresarial, debes activar todas las capas relevantes.

### Managed settings: politicas organizacionales

Las organizaciones pueden definir politicas que aplican a todos los miembros, con **maxima precedencia** (ningun usuario puede sobreescribirlas):

```json
{
  "managed": {
    "model": "claude-sonnet-4-20250514",
    "blockedTools": ["Bash"],
    "allowedTools": ["Read", "Grep", "Glob", "Edit"],
    "maxTurns": 20,
    "disableAutoMemory": true
  }
}
```

Estas configuraciones se distribuyen centralmente cuando el usuario se autentica con su cuenta corporativa.

### PreToolUse: bloqueo de comandos destructivos

Implementa hooks que bloqueen operaciones peligrosas antes de que se ejecuten:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'BLOCKED=\"rm -rf|mkfs|dd if=|:(){ :|:& };:|shutdown|reboot\"; echo \"$TOOL_INPUT\" | grep -qiE \"$BLOCKED\" && echo \"{\\\"decision\\\": \\\"block\\\", \\\"reason\\\": \\\"Comando destructivo bloqueado por politica\\\"}\" && exit 2 || exit 0'"
          }
        ]
      }
    ]
  }
}
```

### Auto mode: clasificacion automatica

Cuando el modo automatico esta habilitado, Claude clasifica automaticamente cada accion en las categorias de riesgo del sistema de permisos. Las acciones de bajo riesgo se ejecutan sin confirmacion; las de alto riesgo solicitan aprobacion.

### Sandbox: aislamiento a nivel de sistema operativo

El sandbox ejecuta las herramientas de Claude Code en un entorno aislado:

- **macOS**: usa el sandbox nativo del sistema (`sandbox-exec`).
- **Linux**: usa contenedores Docker.
- **Efecto**: Claude puede leer el proyecto pero no puede acceder a archivos fuera de el ni ejecutar operaciones de red no autorizadas.

```bash
# Iniciar Claude Code con sandbox
claude --sandbox
```

### Audit: logging con PostToolUse

Registra todas las acciones para cumplimiento regulatorio:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'jq -n --arg ts \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\" --arg tool \"$TOOL_NAME\" --arg user \"$USER\" --arg session \"$CLAUDE_SESSION_ID\" --arg exit_code \"$TOOL_EXIT_CODE\" \"{timestamp: \\$ts, tool: \\$tool, user: \\$user, session: \\$session, exit_code: \\$exit_code}\" >> /var/log/claude-audit.jsonl'"
          }
        ]
      }
    ]
  }
}
```

### Checklist de seguridad empresarial

- [ ] Configurar managed settings con politicas organizacionales.
- [ ] Implementar hooks `PreToolUse` para bloquear comandos destructivos.
- [ ] Activar sandbox en entornos de produccion.
- [ ] Habilitar audit logging con hooks `PostToolUse`.
- [ ] Restringir herramientas disponibles segun el rol del usuario.
- [ ] Deshabilitar auto-memory en entornos sensibles.
- [ ] Revisar y versionar `.claude/settings.json` con el equipo.
- [ ] Usar cuentas gestionadas para autenticacion centralizada.

---

## 12.5 Modo seguro

### --safe-mode: diagnostico limpio

El flag `--safe-mode` inicia Claude Code **sin ninguna personalizacion**, proporcionando un entorno limpio para diagnostico:

```bash
claude --safe-mode
```

### Que se deshabilita

| Componente | Estado en safe mode |
|-----------|-------------------|
| CLAUDE.md | No se carga |
| Skills | Deshabilitadas |
| Plugins | Deshabilitados |
| Hooks | No se ejecutan |
| MCP Servers | No se conectan |
| Comandos custom | No disponibles |
| Auto memory | Deshabilitada |

### Que sigue funcionando

| Componente | Estado en safe mode |
|-----------|-------------------|
| Autenticacion | Normal |
| Seleccion de modelo | Normal |
| Herramientas built-in | Todas disponibles |
| Sistema de permisos | Activo |

### Flujo de diagnostico

Cuando algo no funciona como esperas, el modo seguro te ayuda a aislar el problema:

```
Paso 1: Reproducir el problema en modo normal
  → claude
  → [ejecutar la tarea que falla]

Paso 2: Probar en modo seguro
  → claude --safe-mode
  → [ejecutar la misma tarea]

Paso 3: Interpretar resultados
  → Si funciona en safe mode: el problema esta en tu configuracion
    (CLAUDE.md, hooks, skills, plugins, MCP servers)
  → Si falla en safe mode: el problema es de Claude Code
    o del modelo (reportar a Anthropic)

Paso 4: Aislar el componente
  → Deshabilitar componentes uno a uno hasta encontrar
    el que causa el problema
```

:::tip Cuando usar safe mode
- Claude se comporta de forma inesperada despues de cambiar configuracion.
- Un hook parece estar interfiriendo con las herramientas.
- Quieres verificar que un problema no es causado por tus personalizaciones.
- Necesitas un entorno base limpio para comparar comportamiento.
:::

---

## 12.6 Buenas practicas integrales

Esta seccion sintetiza las practicas mas importantes para trabajar de forma efectiva, eficiente y segura con Claude Code. Usalas como **referencia rapida**.

### Las 10 mejores practicas

**1. Da a Claude metodos de verificacion**

No le pidas que "haga" algo y lo des por hecho. Pidele que verifique su propio trabajo:

```
Refactoriza la funcion processOrder y luego ejecuta
los tests para confirmar que todo sigue pasando.
```

**2. Explora antes de planificar, planifica antes de codificar**

La secuencia optima siempre es: entender el codigo existente, disenar la solucion, implementar. No dejes que Claude escriba codigo sin entender el contexto.

```
Primero lee src/auth/ y explicame como funciona la autenticacion.
Luego propone un plan para agregar OAuth. No escribas codigo todavia.
```

**3. Da contexto especifico en los prompts**

Un prompt vago produce resultados vagos. Incluye archivos, funciones, y restricciones concretas:

```
❌ "Arregla el bug de login"
✅ "En src/auth/login.ts, la funcion validateToken()
    retorna true para tokens expirados. Corrige la
    comparacion de fechas en la linea 45."
```

**4. Prefiere herramientas CLI sobre MCP cuando sea posible**

Las herramientas integradas de Claude Code (Read, Edit, Grep, Bash) son mas rapidas y confiables que servidores MCP externos. Usa MCP solo cuando necesites acceder a sistemas que las herramientas built-in no cubren.

**5. Gestiona permisos con /permissions**

Configura permisos para evitar interrupciones constantes por confirmaciones:

```
> /permissions

Permite los siguientes comandos sin confirmacion:
- npm test
- npm run build
- git status
- git diff
```

**6. Crea skills para flujos repetitivos**

Si haces la misma tarea mas de tres veces, convierte esos pasos en una skill documentada que Claude pueda seguir automaticamente.

**7. Usa subagentes para investigacion**

Para tareas de busqueda amplias, deja que Claude lance subagentes en paralelo en lugar de hacer todo secuencialmente. Esto es mas rapido y mantiene el contexto principal limpio.

**8. Compacta proactivamente**

No esperes a que Claude empiece a "olvidar" cosas. Ejecuta `/compact` antes de llegar al limite. Establece `CLAUDE_AUTOCOMPACT_PCT_THRESHOLD` como red de seguridad.

**9. Selecciona el modelo correcto para cada fase**

Haiku para explorar, Sonnet para desarrollar, Opus para decidir. No uses un modelo premium para tareas simples.

**10. Versiona tu configuracion de Claude Code**

Incluye `.claude/settings.json` y `CLAUDE.md` en el control de versiones. Agrega `.claude/settings.local.json` al `.gitignore`. Esto asegura que todo el equipo trabaje con las mismas reglas.

### Guia rapida de referencia

| Situacion | Accion recomendada |
|-----------|-------------------|
| Sesion larga, contexto alto | `/compact` |
| Tarea simple, exploracion | Cambiar a Haiku |
| Tarea compleja, arquitectura | Cambiar a Opus |
| Comando repetitivo pide permiso | `/permissions` para permitir |
| Flujo que repites siempre | Crear una skill |
| Algo no funciona como esperas | `claude --safe-mode` |
| Quieres saber cuanto llevas gastado | `/cost` |
| Necesitas automatizar en CI | `claude -p` con `--max-turns` |
| El equipo necesita reglas comunes | `.claude/settings.json` versionado |
| Debugging de configuracion | Deshabilitar componentes uno a uno |

---

## Conceptos clave del capitulo

:::tip Resumen
1. **Context window**: 200K tokens son finitos. Usa `/compact`, auto-compact y sesiones enfocadas para maximizar su aprovechamiento.
2. **Seleccion de modelo**: cada modelo tiene su caso de uso optimo. Haiku para exploracion, Sonnet para desarrollo, Opus para decisiones criticas, Fable para investigacion.
3. **Control de costos**: monitorea con `/cost`, limita con `--max-turns`, optimiza con el modelo adecuado y compactacion frecuente.
4. **Seguridad empresarial**: managed settings, hooks de bloqueo, sandbox y audit logging forman las capas de proteccion.
5. **Safe mode**: `--safe-mode` es tu herramienta de diagnostico para aislar problemas de configuracion.
6. **Buenas practicas**: verificacion, contexto especifico, modelo correcto y configuracion versionada son los pilares del uso profesional.
:::

---

## Preguntas de autoevaluacion

1. **Tu sesion lleva 2 horas y `/status` muestra 78% de uso de contexto. Que haces y por que?**

2. **Tienes que explorar un proyecto desconocido y luego refactorizar un modulo critico. Que modelos usarias para cada fase y por que?**

3. **Tu organizacion necesita evitar que cualquier desarrollador ejecute `rm -rf` con Claude Code. Que mecanismo usarias y donde lo configurarias?**

4. **Claude se comporta de forma erratica despues de que modificaste CLAUDE.md y agregaste un hook nuevo. Como diagnosticarias el problema?**

5. **Nombra al menos cinco buenas practicas para reducir costos en sesiones de Claude Code.**

---

## Laboratorio

Practica los conceptos de este capitulo en el **Laboratorio L12.1**, donde configuraras auto-compact, implementaras hooks de seguridad empresarial y optimizaras una sesion usando seleccion estrategica de modelos.
