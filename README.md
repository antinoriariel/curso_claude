---
slug: /
sidebar_position: 1
title: Visión General del Curso
description: Especificación completa del curso «Claude Code: De Cero a Experto» — plan de estudios, objetivos, metodología, sistema de evaluación y guía de implementación con Docusaurus.
---

# Claude Code: De Cero a Experto

**Especificación Académica del Curso**

> **Versión:** 2.1.x (Junio 2026)
> **Formato:** Docusaurus + Markdown (MDX compatible)
> **Duración estimada:** 40 horas teórico-prácticas
> **Audiencia:** Desarrolladores de software, ingenieros de plataforma, arquitectos de IA, equipos de ingeniería

---

## 1. Fundamentación Académica

Claude Code (Anthropic, 2025–2026) representa un punto de inflexión en la ingeniería de software asistida por inteligencia artificial. Como herramienta agente de terminal, combina cuatro capacidades que ningún antecesor integraba con este nivel de madurez: (a) comprensión holística del código fuente mediante análisis contextual profundo, (b) ejecución autónoma de comandos y edición de archivos en ciclos iterativos, (c) extensibilidad mediante un sistema de plugins, skills y protocolos abiertos, y (d) orquestación de subagentes paralelos para tareas distribuidas.

La literatura reciente (Anthropic, 2026; Builder.io, 2026; ClaudeGuide, 2026) coincide en que el dominio efectivo de Claude Code trasciende el uso conversacional: exige comprensión arquitectónica de su ciclo agente, dominio de su sistema de memoria jerárquica, diseño de skills reutilizables, integración con servicios externos mediante MCP (Model Context Protocol), y estrategias de escalado horizontal mediante subagentes y sesiones paralelas.

Este curso se estructura bajo el modelo de **aprendizaje espiralado** (Bruner, 1960): los conceptos fundamentales se reintroducen en niveles crecientes de complejidad, permitiendo al participante consolidar conocimientos previos mientras aborda nuevas abstracciones. El diseño instruccional sigue los principios del **Marco de Trabajo de Conocimientos de Ingeniería de Software (SWEBOK)** v4 (IEEE, 2024) y las **recomendaciones de DeepLearning.AI para cursos de agentes de IA** (Schoppik, 2026).

### 1.1. Objetivo General

Formar al participante en el dominio integral de Claude Code como herramienta agente de desarrollo, capacitándolo para diseñar, implementar y optimizar flujos de trabajo automatizados de ingeniería de software en entornos individuales y colaborativos.

### 1.2. Objetivos Específicos

| Código | Objetivo Específico | Taxonomía de Bloom (Revisada) |
|--------|---------------------|-------------------------------|
| OE1 | Comprender la arquitectura del ciclo agente y el modelo de herramientas de Claude Code | Comprender |
| OE2 | Configurar entornos de desarrollo locales, globales y organizacionales mediante el sistema jerárquico de settings | Aplicar |
| OE3 | Implementar instrucciones persistentes con CLAUDE.md, reglas modulares y auto memory | Crear |
| OE4 | Diseñar hooks para automatización determinista del ciclo de vida de sesiones | Crear |
| OE5 | Integrar servicios externos mediante MCP con autenticación OAuth2 y transporte seguro | Evaluar |
| OE6 | Desarrollar skills reutilizables y comandos slash personalizados siguiendo el open standard de Anthropic | Crear |
| OE7 | Orquestar subagentes paralelos con configuraciones de herramientas, modelos y permisos específicos | Evaluar |
| OE8 | Automatizar pipelines CI/CD integrando Claude Code en GitHub Actions y sistemas de tareas programadas | Crear |
| OE9 | Optimizar el uso del context window y seleccionar modelos según criterios de costo-beneficio | Evaluar |
| OE10 | Implementar políticas de seguridad y gobernanza empresarial mediante managed settings y hooks de bloqueo | Crear |

### 1.3. Metodología

El curso emplea cuatro estrategias pedagógicas complementarias:

1. **Exposición teórica con referencias a fuentes primarias**: Cada módulo se fundamenta en la documentación oficial (code.claude.com/docs), publicaciones del equipo Anthropic, y literatura técnica contemporánea.

2. **Demostraciones interactivas**: Sesiones guiadas donde el instructor ejecuta flujos en vivo, inspectando el comportamiento de Claude Code en cada etapa.

3. **Laboratorios prácticos incrementalmente complejos**: Ejercicios estructurados que el participante realiza en su entorno local, comenzando con tareas guiadas y avanzando hacia problemas abiertos.

4. **Proyecto integrador**: Desarrollo completo de un flujo de trabajo automatizado que combine skills, MCP, subagentes y hooks para resolver un problema real de ingeniería de software.

### 1.4. Evaluación

| Tipo | Peso | Instrumento | Criterios |
|------|------|-------------|-----------|
| Diagnóstica | 0% | Cuestionario inicial | Identificación de brechas |
| Formativa (3) | 30% | Laboratorios calificados | Corrección técnica, completitud |
| Sumativa (2) | 40% | Exámenes prácticos | Eficiencia, arquitectura, buenas prácticas |
| Proyecto final | 30% | Rúbrica multidimensional | Diseño, implementación, documentación, presentación |

---

## 2. Prerrequisitos

| Área | Requisito | Justificación |
|------|-----------|---------------|
| Programación | Experiencia con al menos un lenguaje (JavaScript, Python, TypeScript, Go, Rust, Java) | Claude Code opera sobre código existente; se requiere comprender estructuras de proyectos |
| Terminal | Uso competente de línea de comandos (bash, zsh, PowerShell): navegación, grep, git, npm/pip | La totalidad de la interacción con Claude Code ocurre en terminal |
| Git | Control de versiones: commit, branch, merge, rebase, worktree | Múltiples flujos avanzados requieren manipulación de git |
| Inglés técnico | Lectura comprensiva de documentación técnica en inglés | La documentación oficial, RFCs y comunidad publican en inglés |
| Hardware | 8 GB+ RAM, 4 cores+, conexión a internet, SO: macOS 13+, Windows 11 (WSL2), Ubuntu 22.04+ | Claude Code requiere ejecución local + comunicación vía API |

---

## 3. Estructura del Curso

El plan de estudios se organiza en **12 capítulos** distribuidos en **4 niveles progresivos**, totalizando **48 submódulos**. Cada capítulo incluye: objetivos específicos, fundamentación teórica, ejercicios prácticos, referencias a documentación oficial, y preguntas de verificación.

---

### Nivel I: Fundamentos (Capítulos 1–3)

Capítulos de base conceptual y operativa. El participante aprenderá la arquitectura fundamental, instalará el entorno y ejecutará sus primeras sesiones interactivas. Este nivel corresponde al eje de **Comprensión** en la taxonomía de Bloom.

---

#### Capítulo 1: Arquitectura de Claude Code

| Subcapítulo | Título | Duración | Tipo |
|-------------|--------|----------|------|
| 1.1 | El ecosistema Claude: modelos, superficies y contextos | 1h | Teórico |
| 1.2 | Ciclo agente: percepción, razonamiento, acción, observación | 1.5h | Teórico-Práctico |
| 1.3 | Modelo de herramientas: operaciones sobre archivos, búsqueda, ejecución, web, inteligencia de código | 1h | Teórico |
| 1.4 | Ventana de contexto (200K tokens): implicaciones arquitectónicas | 0.5h | Teórico |
| 1.5 | Modelos disponibles: Sonnet 4.5, Opus 4.5, Haiku 4.5, Fable 5 — perfiles de uso | 1h | Teórico-Práctico |

**Contenido detallado:**

1.1. El ecosistema Claude Abarca los modelos de Anthropic (Claude Sonnet 4.5, Opus 4.5, Haiku 4.5, Claude Fable 5), las superficies de interacción (terminal CLI, VS Code Extension, JetBrains Plugin, Desktop App, Web, Slack), y el contexto de uso de Claude Code como herramienta agente de desarrollo. Se discute la diferencia entre Claude.ai (asistente conversacional), Claude Code (agente de código) y Claude API (interfaz programática).

1.2. Ciclo agente Constituye el núcleo conceptual del curso. Se analiza el bucle fundamental: (1) el usuario emite un prompt, (2) Claude razona y selecciona herramientas, (3) ejecuta la herramienta y recibe retroalimentación, (4) itera hasta completar la tarea. Se examina cómo las herramientas (file operations, search, execution, web, code intelligence) retroalimentan el ciclo. Referencia: Anthropic, "How Claude Code Works" (code.claude.com/docs/en/how-claude-code-works, 2026).

1.3. Modelo de herramientas Taxonomía completa de herramientas integradas: Read, Write, Edit, Rename (file operations); Glob, Grep, Code Search (search); Bash, Git (execution); WebSearch, WebFetch (web); y herramientas de inteligencia de código (type errors, go-to-definition, find references) disponibles mediante plugins.

1.4. Ventana de contexto Claude Sonnet 4.5 y Opus 4.5 soportan 200K tokens de contexto. Se discuten las implicaciones para análisis de codebases grandes, monorepos, y la necesidad del comando `/compact`. Referencia: ClaudeGuide, "Claude Code Complete Guide" (claudeguide.io, 2026).

1.5. Modelos disponibles Guía de selección: Opus 4.5 para arquitectura compleja y razonamiento profundo, Sonnet 4.5 para el equilibrio óptimo costo-calidad, Haiku 4.5 para tareas rápidas y económicas, Fable 5 para investigaciones extensas con agentes de fondo. Referencia: Anthropic, "CLI reference" (code.claude.com/docs/en/cli-reference, 2026).

**Referencias:**
- Anthropic. "Overview — Claude Code Docs." code.claude.com/docs/en/. 2026.
- Anthropic. "How Claude Code Works." code.claude.com/docs/en/how-claude-code-works. 2026.
- ClaudeGuide. "Claude Code Complete Guide." claudeguide.io/claude-code-complete-guide. Abril 2026.

**Laboratorio L1.1:** Exploración del ciclo agente — ejecutar `claude -p "explora este proyecto"` en un repositorio conocido, observar las herramientas invocadas, documentar cada paso del ciclo.

---

#### Capítulo 2: Instalación y Configuración Inicial

| Subcapítulo | Título | Duración | Tipo |
|-------------|--------|----------|------|
| 2.1 | Requisitos del sistema y verificación de entorno | 0.5h | Teórico |
| 2.2 | Instalación: scripts oficiales, gestores de paquetes, Windows/WSL2 | 1h | Práctico |
| 2.3 | Autenticación: OAuth, API keys, proveedores externos | 0.5h | Práctico |
| 2.4 | Primer arranque: `claude`, onboarding guiado | 0.5h | Práctico |
| 2.5 | Verificación de instalación: `--version`, `--help`, diagnóstico | 0.5h | Práctico |

**Contenido detallado:**

2.1. Requisitos del sistema macOS 13+ (Apple Silicon o Intel), Windows 11 con WSL2 y Ubuntu 22.04+, o Linux con glibc 2.28+. Node.js 18+ requerido para el instalador npm. Conexión a internet con acceso a api.anthropic.com.

2.2. Instalación Tres métodos oficiales: (a) script curl `curl -fsSL https://claude.ai/install.sh | bash`, (b) npm global `npm install -g @anthropic-ai/claude-code`, (c) gestores de paquetes (Homebrew en macOS, apt en Ubuntu). Configuración de WSL2 para Windows. Referencia: Anthropic, "Get Claude Code" (claude.com/product/claude-code, 2026).

2.3. Autenticación Inicio de sesión mediante OAuth con cuenta de Anthropic. Configuración de API keys para Anthropic Console. Proveedores externos (Google, GitHub) en superficies específicas.

2.4. Primer arranque Ejecución interactiva sin argumentos. El onboarding guiado detecta el proyecto, sugiere crear CLAUDE.md mediante `/init`, y presenta el menú de ayuda. Se familiariza al participante con la interfaz REPL.

2.5. Verificación Comandos de diagnóstico: `claude --version` para versión instalada, `claude --help` para flags disponibles, `/doctor` dentro de sesión para diagnóstico de integridad. Referencia: Anthropic, "CLI reference" (code.claude.com/docs/en/cli-reference, 2026).

**Referencias:**
- Anthropic. "Get Claude Code." claude.com/product/claude-code. 2026.
- Anthropic. "CLI reference." code.claude.com/docs/en/cli-reference. 2026.

**Laboratorio L2.1:** Instalación completa en el sistema del participante, autenticación OAuth, ejecución de `/doctor` y resolución de advertencias.

---

#### Capítulo 3: Primeros Pasos — Sesiones y Comandos Esenciales

| Subcapítulo | Título | Duración | Tipo |
|-------------|--------|----------|------|
| 3.1 | Navegación en modo interactivo: REPL, multilínea, autocompletado | 1h | Práctico |
| 3.2 | Comandos slash fundamentales: `/help`, `/clear`, `/compact`, `/status`, `/cost`, `/model` | 1.5h | Práctico |
| 3.3 | Comandos ejecutivos: `!git`, `!npm`, bypass directo a la terminal | 0.5h | Práctico |
| 3.4 | Atajos de teclado: Esc para interrupción, flechas, Ctrl+D | 0.5h | Práctico |
| 3.5 | Flujo de trabajo básico: exploración → edición → verificación | 1.5h | Práctico |

**Contenido detallado:**

3.1. Modo interactivo La sesión REPL como interfaz primaria. Entrada multilínea (Shift+Enter), autocompletado con Tab, historial de comandos (↑/↓). Comprensión del ciclo prompt-respuesta.

3.2. Comandos slash `/help`: lista de comandos disponibles. `/clear`: reinicio de contexto. `/compact`: compresión del historial para liberar tokens. `/status`: estado de sesión (modelo, tokens, settings activos). `/cost`: costo estimado de la sesión. `/model [modelo]`: cambio de modelo en caliente. `/effort`: ajuste del nivel de esfuerzo (low/medium/high/xhigh/max/ultra). Referencia: Anthropic, "Commands" (code.claude.com/docs/en/commands, 2026).

3.3. Comandos ejecutivos Notación `!<comando>` para ejecución directa en shell. El output se inyecta en el contexto de Claude. Patrón `!git status`, `!npm test`.

3.4. Atajos de teclado Esc: interrupción de la respuesta en curso (el contexto acumulado se preserva). Ctrl+D o exit: salida de sesión. Ctrl+C: interrupción forzosa.

3.5. Flujo de trabajo básico Patrón fundamental: (1) explorar el codebase con preguntas abiertas, (2) solicitar implementación con especificaciones, (3) verificar con `!npm test` o solicitar revisión. Este patrón se refuerza a lo largo de todo el curso.

**Referencias:**
- Anthropic. "Commands — Claude Code Docs." code.claude.com/docs/en/commands. 2026.
- Anthropic. "Interactive mode." code.claude.com/docs/en/interactive-mode. 2026.

**Laboratorio L3.1:** En un proyecto de prueba, ejecutar ciclo completo: `/init` para crear CLAUDE.md, `/status` para verificar, `/model haiku` para cambiar a modo rápido, ejecutar una tarea de refactorización, `/compact`, y `/cost`.

---

### Nivel II: Configuración y Extensibilidad (Capítulos 4–6)

Capítulos de aplicación práctica donde el participante aprenderá a personalizar Claude Code mediante su sistema de configuración jerárquica, hooks deterministas, integración MCP, y el sistema de skills.

---

#### Capítulo 4: Sistema de Configuración Jerárquica

| Subcapítulo | Título | Duración | Tipo |
|-------------|--------|----------|------|
| 4.1 | Archivos de configuración: scope global, proyecto, local, managed | 1h | Teórico |
| 4.2 | settings.json: schema completo y campos disponibles | 1.5h | Teórico-Práctico |
| 4.3 | Variables de entorno: `CLAUDE_CODE_*` y sobreescrituras | 1h | Teórico-Práctico |
| 4.4 | Permisos: default mode, acceptEdits, plan, auto, bypassPermissions | 1.5h | Teórico-Práctico |
| 4.5 | Configuración de modelos por defecto y cadenas de respaldo | 0.5h | Práctico |

**Contenido detallado:**

4.1. Jerarquía de configuraciones Cinco niveles con precedencia ascendente: (1) managed settings (organización), (2) CLI flags (`--permission-mode`, `--settings`), (3) `.claude/settings.local.json` (gitignored), (4) `.claude/settings.json` (proyecto, compartido), (5) `~/.claude/settings.json` (global). Cada nivel sobreescribe al anterior en campos específicos. Referencia: Anthropic, "Settings" (code.claude.com/docs/en/settings, 2026).

4.2. Schema de settings.json Campos principales: `permissions` (allow/block lists), `hooks` (definición de hooks), `env` (variables de entorno para la sesión), `model` (modelo por defecto), `autoMemoryEnabled`, `autoMemoryDirectory`. Se examina el archivo de schema JSON para autocompletado en editores.

4.3. Variables de entorno Catálogo completo: `CLAUDE_CODE_*` para control de comportamiento (auto-compact, permisos, modo seguro, directorio de memoria). `ANTHROPIC_API_KEY` para autenticación programática. `CLAUDE_CODE_SIMPLE` activado por `--bare`.

4.4. Modos de permisos Default: Claude solicita confirmación para ediciones y comandos. AcceptEdits: auto-aprueba ediciones de archivos y comandos filesystem comunes. Plan: solo lectura, explora y propone sin modificar. Auto: clasificador automatizado de seguridad (research preview). BypassPermissions: omite todas las confirmaciones. Referencia: Anthropic, "How Claude Code Works" (code.claude.com/docs/en/how-claude-code-works, 2026).

4.5. Modelo por defecto Configuración de `model` en settings.json. Uso de `--model` para sobrescritura por sesión. Cadenas de respaldo para alta disponibilidad (fallback model chain).

**Referencias:**
- Anthropic. "Settings — Claude Code Docs." code.claude.com/docs/en/settings. 2026.
- ClaudeGuide. "Claude Code settings.json: Complete Configuration Reference." claudeguide.io/claude-code-settings-json-reference. Abril 2026.

**Laboratorio L4.1:** Configurar settings.json global con permisos allow para `npm test`, `npm run build`. Configurar settings.json de proyecto con hooks básicos y variables de entorno. Verificar con `/config` dentro de sesión.

---

#### Capítulo 5: Sistema de Memoria e Instrucciones Persistentes

| Subcapítulo | Título | Duración | Tipo |
|-------------|--------|----------|------|
| 5.1 | CLAUDE.md formato, ubicación y jerarquía de búsqueda | 1.5h | Teórico-Práctico |
| 5.2 | Reglas modulares: `.claude/rules/` con path-scoping | 1.5h | Teórico-Práctico |
| 5.3 | Auto memory: almacenamiento automático entre sesiones | 1h | Teórico-Práctico |
| 5.4 | CLAUDE.local.md, CLAUDE.md en subdirectorios y monorepos | 1h | Teórico-Práctico |
| 5.5 | Gestión de memoria: `/memory`, depuración de instrucciones | 0.5h | Práctico |

**Contenido detallado:**

5.1. CLAUDE.md Archivo de instrucciones persistentes en la raíz del proyecto. Claude lo lee al inicio de cada sesión y lo integra en el system prompt. Contenido típico: comandos de build/test/lint, estándares de codificación, librerías preferidas, convenciones de arquitectura, zonas de no-edición. Generación inicial con `/init`. Referencia: Anthropic, "Memory" (code.claude.com/docs/en/memory, 2026).

5.2. Reglas modulares El directorio `.claude/rules/` como alternativa modular al CLAUDE.md monolítico. Cada archivo `.md` se descubre recursivamente. Path-scoping mediante frontmatter `paths`: las reglas solo cargan cuando Claude trabaja con archivos que coinciden. Ejemplo: `paths: src/api/**/*.ts` para reglas de API. Referencia: Anthropic, "Memory — Rules" (code.claude.com/docs/en/memory, 2026); ClaudeFast, "Rules Directory" (claudefa.st, 2026).

5.3. Auto memory Mecanismo automático donde Claude toma notas entre sesiones. Almacenadas en `~/.claude/projects/<id>/memory/MEMORY.md`. Claude indexa en MEMORY.md y crea archivos temáticos separados para información detallada. Los primeros 200 líneas o 25KB se cargan al inicio. Configurable mediante `autoMemoryEnabled` y `autoMemoryDirectory`.

5.4. Instrucciones en monorepos Claude Code camina hacia arriba desde el directorio actual hasta la raíz del sistema de archivos, cargando cada CLAUDE.md encontrado. CLAUDE.local.md contiene instrucciones personales no compartidas. En monorepos, CLAUDE.md en subpaquetes aplican automáticamente. Referencia: Vincent's Blog, "Claude Code /memory" (blog.vincentqiao.com, 2026).

5.5. Gestión `/memory` dentro de sesión lista todos los archivos de memoria cargados y permite toggle de auto memory. Depuración: si Claude no sigue instrucciones, verificar con `/memory` qué archivos están cargados y en qué orden.

**Referencias:**
- Anthropic. "Memory — Claude Code Docs." code.claude.com/docs/en/memory. 2026.
- Anthropic. "Explore the .claude directory." code.claude.com/docs/en/claude-directory. 2026.
- ClaudeFast. "Claude Code Rules Directory." claudefa.st/blog/guide/mechanics/rules-directory. Mayo 2026.

**Laboratorio L5.1:** Crear CLAUDE.md para un proyecto real con reglas de estilo, comandos de build y convenciones. Crear regla modular para testing con path-scoping. Activar auto memory, ejecutar tareas, inspeccionar MEMORY.md.

---

#### Capítulo 6: Hooks — Automatización del Ciclo de Vida

| Subcapítulo | Título | Duración | Tipo |
|-------------|--------|----------|------|
| 6.1 | Arquitectura de hooks: 32+ eventos, 5 tipos de handler | 1h | Teórico |
| 6.2 | Eventos del ciclo: SessionStart, PreToolUse, PostToolUse, UserPromptSubmit, Stop | 2h | Teórico-Práctico |
| 6.3 | Handlers: shell commands, HTTP endpoints, LLM prompts, MCP tool hooks | 1.5h | Teórico-Práctico |
| 6.4 | Matchers, filtros y control de flujo (exit codes: 0, 2) | 1h | Práctico |
| 6.5 | Patrones de producción: formateo post-edit, bloqueo de comandos, logging | 1.5h | Práctico |

**Contenido detallado:**

6.1. Hooks como mecanismo determinista de control del ciclo de vida. Diferencia con skills (guiadas por LLM): los hooks son imperativos y siempre se ejecutan. Cinco tipos de handler: shell command, HTTP, LLM prompt, MCP tool, agent. 27+ eventos distintos categorizados en 6 grupos: sesión, prompt/turno, herramientas, subagentes/tareas, compactación/worktrees, MCP elicitation. Referencia: Anthropic, "Hooks reference" (code.claude.com/docs/en/hooks, 2026); The Prompt Shelf, "Hooks: Complete Reference" (thepromptshelf.dev, 2026).

6.2. Eventos fundamentales SessionStart (inicio/reanudación), Setup (preparación CI), UserPromptSubmit (antes de procesar, puede bloquear), PreToolUse (antes de cada herramienta, puede bloquear con exit code 2), PostToolUse (después de éxito, observable), PostToolBatch (después de lote), PermissionRequest (cuando aparece un diálogo), Stop (Claude termina de responder), SessionEnd (terminación). Referencia: MorphLLM, "Claude Code Hooks" (morphllm.com, Junio 2026).

6.3. Tipos de handler Shell command: script ejecutado con JSON en stdin, output esperado en stdout. HTTP endpoint: POST a URL con payload JSON. LLM prompt: prompt enviado a Claude para decisión. MCP tool: herramienta MCP invocada como hook. Agent: subagente especializado. Referencia: Anthropic, "Hooks reference — Handler types" (code.claude.com/docs/en/hooks, 2026).

6.4. Matchers y control de flujo Cada hook define un `matcher` (por nombre de herramienta, evento, patrón de archivo). Hook sin matcher se ejecuta en todos los casos del evento. Exit code 0: permite. Exit code 2: bloquea. Timeout configurable (default 10s para command hooks). `"if"` filter: condición adicional basada en variable de entorno o flag.

6.5. Patrones de producción Formateo automático post-edit con PostToolUse + `npx prettier --write`. Bloqueo de `rm -rf` en PreToolUse. Registro de auditoría de todas las herramientas invocadas. Notificaciones Slack en Stop. Inyección de contexto en SessionStart. Referencia: ComputingForGeeks, "Claude Code Hooks Guide" (computingforgeeks.com, Junio 2026).

**Referencias:**
- Anthropic. "Hooks reference — Claude Code Docs." code.claude.com/docs/en/hooks. 2026.
- Anthropic. "Automate actions with hooks." code.claude.com/docs/en/hooks-guide. 2026.
- The Prompt Shelf. "Claude Code Hooks: Complete Production Reference." thepromptshelf.dev. Mayo 2026.

**Laboratorio L6.1:** Implementar hook PreToolUse que bloquea `rm -rf` y `dd`. Hook PostToolUse que ejecuta `npm run format` tras cada edición. Hook UserPromptSubmit que inyecta contexto del ticket de Jira. Verificar comportamiento con `/config`.

---

#### Capítulo 7: Model Context Protocol (MCP)

| Subcapítulo | Título | Duración | Tipo |
|-------------|--------|----------|------|
| 7.1 | Fundamentos de MCP: protocolo, transporte y herramientas | 1.5h | Teórico |
| 7.2 | Transportes: stdio (local), HTTP (remoto), SSE, WebSocket | 1.5h | Teórico-Práctico |
| 7.3 | Instalación y configuración: `claude mcp add`, scopes `.mcp.json` | 1.5h | Práctico |
| 7.4 | Autenticación: OAuth 2.0, tokens, environment variables | 1h | Teórico-Práctico |
| 7.5 | MCP Tool Search: optimización para servidores con muchas herramientas | 1h | Teórico |
| 7.6 | Casos de uso: GitHub, Sentry, base de datos, Slack, navegador | 2h | Práctico |
| 7.7 | Creación de servidores MCP personalizados con Claude Agent SDK | 2h | Práctico |

**Contenido detallado:**

7.1. MCP como estándar abierto (protocolo JSON-RPC) para conectar agentes de IA con herramientas externas. Diferencia conceptual con APIs REST: el servidor MCP expone herramientas (con schemas JSON-Schema), recursos (datos) y prompts (plantillas). Claude Code como host MCP. Referencia: Anthropic, "Connect to MCP servers" (code.claude.com/docs/en/mcp-quickstart, 2026).

7.2. Transportes stdio: proceso local, comunicación por stdin/stdout. Ideal para herramientas locales y servidores personalizados. HTTP/SSE: conexión remota con soporte OAuth. WebSocket: comunicación bidireccional en tiempo real. Elección según caso de uso. Referencia: Anthropic, "Connect Claude Code to tools via MCP" (code.claude.com/docs/en/mcp.md, 2026).

7.3. Instalación `claude mcp add --transport <tipo> <config>`. Scopes: `--scope local` (por proyecto, privado), `--scope user` (global personal), `--scope project` (compartido en repo). Archivos de configuración: `.mcp.json` en raíz del proyecto, `~/.claude.json` para user/local. Verificación con `claude mcp list` y `/mcp` en sesión. Referencia: Anthropic, "MCP installation scopes" (code.claude.com/docs/en/mcp.md, 2026).

7.4. Autenticación OAuth 2.0 para servidores remotos (Sentry, Linear, Notion). Flujo: `claude mcp add` → redirección a navegador → autorización → token almacenado. Tokens estáticos para servidores propios. Variables de entorno para servidores stdio. Dynamic headers para autenticación personalizada. Override de metadata discovery OAuth.

7.5. MCP Tool Search Cuando un servidor expone muchas herramientas (>50), el peso del contexto puede ser significativo. Tool Search permite que Claude busque herramientas por relevancia semántica en lugar de cargar todas. Configurable mediante `toolSearch` en settings. Servidores exentos con `exemptFromDeferral`. Referencia: Anthropic, "MCP — Scale with MCP Tool Search" (code.claude.com/docs/en/mcp.md, 2026).

7.6. Casos de uso prácticos GitHub: `mcp__github__create_pull_request`, `mcp__github__search_issues`. Sentry: `mcp__sentry__list_issues`. Base de datos: query parametrizada. Slack: envío de mensajes. Puppeteer/Playwright: control de navegador. Cada caso incluye instalación, configuración de autenticación y patrones de uso.

7.7. Creación de servidores MCP Propios Uso de Claude Agent SDK para definir herramientas con schema JSON. Scaffolding con el plugin `mcp-server-dev` + `/build` skill. Implementación de handlers, registro de errores, testing. Despliegue como servidor stdio o HTTP.

**Referencias:**
- Anthropic. "Connect Claude Code to tools via MCP." code.claude.com/docs/en/mcp.md. 2026.
- Anthropic. "MCP quickstart." code.claude.com/docs/en/mcp-quickstart. 2026.
- Anthropic. "Connect to external tools with MCP (Agent SDK)." code.claude.com/docs/en/agent-sdk/mcp. 2026.
- ClaudeFolio. "Claude Code skills, custom slash commands, and MCP servers explained." claudefolio.com. Mayo 2026.

**Laboratorio L7.1:** Conectar servidor MCP de GitHub. Ejecutar herramientas MCP dentro de sesión. Crear servidor MCP personalizado stdio con 3 herramientas. Verificar con `/mcp` y `claude mcp list`.

---

#### Capítulo 8: Skills — Flujos de Trabajo Reutilizables

| Subcapítulo | Título | Duración | Tipo |
|-------------|--------|----------|------|
| 8.1 | Concepto de skill: instrucciones especializadas con carga bajo demanda | 1h | Teórico |
| 8.2 | Estructura de una skill: SKILL.md, frontmatter, directorio | 1.5h | Teórico-Práctico |
| 8.3 | Skills como comandos slash: `.claude/commands/` | 1h | Práctico |
| 8.4 | Skills + MCP: capa de conocimiento sobre herramientas externas | 1.5h | Teórico-Práctico |
| 8.5 | Instalación de skills desde marketplace: plugin system | 1h | Práctico |
| 8.6 | Distribución: GitHub, marketplaces privados, formatos | 0.5h | Teórico |

**Contenido detallado:**

8.1. Las skills como archivos Markdown con frontmatter YAML que contienen instrucciones especializadas. A diferencia de CLAUDE.md (carga siempre), las skills cargan bajo demanda: Claude ve la descripción al inicio, pero el contenido completo solo se carga cuando es relevante. Skills con `disable-model-invocation: true` para invocación manual exclusiva.

8.2. Estructura de skill SKILL.md con frontmatter: `name`, `description`, `version`, `model`, `context` (fork para aislamiento), `allowed-tools`. Cuerpo en Markdown con instrucciones. Directorio SKILL.md con recursos adicionales (ejemplos, imágenes, subdirectorios). Live-reload: cambios surten efecto sin reiniciar sesión. Referencia: Anthropic, "The Complete Guide to Building Skills for Claude" (resources.anthropic.com, 2026).

8.3. Skills como comandos Colocación en `.claude/commands/` para crear comandos slash personalizados (`/review`, `/deploy`). Frontmatter adicional para comandos: `triggers` (palabras clave que activan el comando automáticamente). Ejemplo: `/review` como skill que analiza el diff actual, ejecuta lint, y sugiere mejoras.

8.4. Patrón Skills + MCP Combinación más potente: un skill proporciona el conocimiento del workflow (cómo hacerlo), MCP proporciona el acceso a herramientas externas (con qué hacerlo). Ejemplo: skill de "revisión de seguridad" que usa MCP-Sentry y MCP-GitHub. Referencia: Anthropic, "Skills + MCP integration" (resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf, 2026).

8.5. Marketplace Instalación con `/plugin install` desde el marketplace de Anthropic. Plugins disponibles: `document-skills` (Excel, Word, PowerPoint, PDF), `example-skills` (skill-creator, mcp-builder, frontend-design, webapp-testing). Instalación directa: `/plugin install document-skills@anthropic-agent-skills`.

8.6. Distribución Skills como directorios públicos en GitHub. README para humanos (separado del SKILL.md). Versionado semántico. Compatibilidad cross-surface: una skill funciona en Claude Code, Claude.ai, Claude API y Claude Agent SDK sin modificación.

**Referencias:**
- Anthropic. "The Complete Guide to Building Skills for Claude." resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf. 2026.
- Anthropic. "Using skills in Claude Code." mintlify.com/anthropics/skills/using-skills/claude-code. 2026.
- DeepLearning.AI. "Agent Skills with Anthropic." deeplearning.ai/courses/agent-skills-with-anthropic. Schoppik, E. 2026.

**Laboratorio L8.1:** Crear skill "code-review" que analiza diff, ejecuta lint, verifica cobertura de tests, y sugiere mejoras. Instalar skill desde marketplace. Combinar skill con MCP GitHub para crear PR review automático.

---

### Nivel III: Orquestación y Escalado (Capítulos 9–10)

Capítulos de dominio técnico avanzado. El participante aprenderá a delegar tareas a subagentes especializados, paralelizar flujos de trabajo, y gestionar sesiones distribuidas.

---

#### Capítulo 9: Subagentes — Delegación y Contexto Aislado

| Subcapítulo | Título | Duración | Tipo |
|-------------|--------|----------|------|
| 9.1 | Arquitectura de subagentes: contexto aislado, delegación automática | 1.5h | Teórico |
| 9.2 | Subagentes incorporados: Explore, Plan, general-purpose, Bash | 1.5h | Teórico-Práctico |
| 9.3 | Creación de subagentes personalizados: Markdown + YAML frontmatter | 2h | Práctico |
| 9.4 | AGENTS.md: registro de subagentes, scopes y herencia | 1.5h | Teórico-Práctico |
| 9.5 | Subagentes Fork: `isolation: worktree` para refactorización experimental | 1h | Práctico |
| 9.6 | Patrones de producción: specialist pool, gatekeeper, scoped specialist | 2h | Práctico |

**Contenido detallado:**

9.1. Subagentes como instancias autónomas de Claude con contexto propio. El subagente recibe solo su system prompt + información básica del entorno (no hereda el historial de la sesión padre). Devuelve solo su output final. Beneficio principal: mantener el contexto del agente principal limpio y enfocado. Herramienta `Agent()` para que el agente principal pueda spawnear subagentes. Referencia: Anthropic, "Create custom subagents" (code.claude.com/docs/en/subagents, 2026).

9.2. Subagentes incorporados Explore: rápido, solo lectura, modelo Haiku, ignora CLAUDE.md para velocidad. Plan: solo lectura, usado en Plan Mode. general-purpose: todas las herramientas, hereda el modelo del padre. Bash: solo ejecución de comandos (git, npm, docker). Cada uno tiene restricciones de herramientas específicas.

9.3. Subagentes personalizados Archivos Markdown con frontmatter YAML. Campos obligatorios: `name` (lowercase-hyphens), `description`. Campos opcionales: `tools` (allowlist), `disallowedTools`, `model`, `permissionMode`, `mcpServers`, `hooks`, `maxTurns`, `skills`, `memory` (user/project/local), `effort`, `background`, `isolation`, `color`. El cuerpo del archivo es el system prompt. Referencia: The Prompt Shelf, "Claude Code Subagents: Complete 2026 Reference" (thepromptshelf.dev, Mayo 2026).

9.4. AGENTS.md Archivo en la raíz del proyecto para definir subagentes de equipo. Scopes jerárquicos: multiples AGENTS.md pueden coexistir (raíz, subdirectorios). Claude mergea según ubicación. Patrón: `## Agents` con `### nombre-agente` entries. La sección `## Agents` también puede contener configuración compartida.

9.5. Subagentes Fork `isolation: worktree` crea un git worktree aislado para cada subagente. El subagente opera en su propia copia del repositorio. Al finalizar, los cambios pueden commitearse a una branch o descartarse automáticamente. Ideal para refactorización riesgosa y experimentación paralela.

9.6. Patrones de producción Specialist pool: conjunto de subagentes (testing, security, docs, performance) para delegación especializada. Gatekeeper: un subagente verifica precondiciones (`pre-deploy-checker`) antes de permitir una acción. Scoped specialist: subagentes para paquetes específicos en monorepos. Resolución del modelo: env var → invocación → frontmatter → sesión padre. Referencia: Anthropic, "Claude Code Advanced Patterns" (resources.anthropic.com, Marzo 2026).

**Referencias:**
- Anthropic. "Create custom subagents — Claude Code Docs." code.claude.com/docs/en/subagents. 2026.
- Anthropic. "Claude Code Advanced Patterns." resources.anthropic.com/hubfs/Claude%20Code%20Advanced%20Patterns_.pdf. Marzo 2026.
- The Prompt Shelf. "Claude Code Subagents: Complete 2026 Reference." thepromptshelf.dev. Mayo 2026.

**Laboratorio L9.1:** Crear subagente "codebase-explorer" (solo lectura, Haiku). Crear subagente "test-executor" (solo Bash, permisos para pytest). Usar AGENTS.md para registrarlos. Ejecutar tarea de exploración delegada.

---

#### Capítulo 10: Subagentes Avanzados y Sesiones Paralelas

| Subcapítulo | Título | Duración | Tipo |
|-------------|--------|----------|------|
| 10.1 | Agent Teams: coordinación multi-agente (research preview) | 1.5h | Teórico |
| 10.2 | Sesiones background: `claude --bg`, Agent View, re-attach | 1.5h | Práctico |
| 10.3 | Sesiones paralelas no-interactivas: `claude -p` fan-out | 1.5h | Práctico |
| 10.4 | `/worktree`: sesiones aisladas con git worktrees | 1h | Práctico |
| 10.5 | `/batch`: cambios a gran escala con subagentes paralelos | 1.5h | Práctico |
| 10.6 | Patrón Writer/Reviewer: dos sesiones, contexto fresco | 1h | Teórico-Práctico |

**Contenido detallado:**

10.1. Agent Teams Múltiples agentes que se comunican, coordinan y dividen trabajo. Research preview. Cada agente (teammate) tiene su contexto y herramientas. Útil cuando una tarea puede dividirse en flujos de trabajo independientes. Evento `TeammateIdle` para hooks. Referencia: Anthropic, "Advanced Patterns — Agent Teams" (resources.anthropic.com, 2026).

10.2. Sesiones background `claude --bg "task"` lanza una sesión en segundo plano. Agent View (`claude agents`) lista sesiones activas, bloqueadas y completadas. Re-attach con `claude --resume <id>`. Diferentes modelos por sesión background. Dispatch default configurable.

10.3. Fan-out con `claude -p` Iteración sobre lista de archivos: `git diff --name-only | claude -p "revisa estos archivos"`. `--allowedTools` para restringir herramientas en operaciones batch. Output JSON (`--output-format json`) para procesamiento programático. Paralelización con `&` o `xargs -P`.

10.4. Worktrees `claude --worktree <task>` crea un git worktree con su propia branch. Ideal para refactorizaciones aisladas. Cuando la sesión termina, los cambios están en una branch separada. Combinable con `--bg` para refactorización paralela.

10.5. `/batch` Skill integrada que orquesta cambios a gran escala. Investiga el codebase, divide el trabajo en unidades, presenta un plan. Una vez aprobado, crea un worktree por unidad, implementa, ejecuta tests, y abre PRs. Requiere repositorio git. Ideal para migraciones, renombramientos masivos, cambios de API. Referencia: Anthropic, "Commands — /batch" (code.claude.com/docs/en/commands, 2026).

10.6. Writer/Reviewer Patrón de producción: dos sesiones. Writer implementa en un contexto fresco. Reviewer revisa desde otro contexto igualmente fresco. El reviewer detecta problemas que el writer no vio por contaminación contextual. Referencia: Effloow, "Claude Code Advanced Workflow" (effloow.com, Abril 2026).

**Referencias:**
- Anthropic. "Commands — Claude Code Docs." code.claude.com/docs/en/commands. 2026.
- Anthropic. "Advanced Patterns." resources.anthropic.com. Marzo 2026.
- Effloow. "Claude Code Advanced Workflow." effloow.com/articles/claude-code-advanced-workflow-subagents-commands-multi-session. Abril 2026.

**Laboratorio L10.1:** Usar `/batch` para migrar importaciones de CommonJS a ESM en un proyecto. Lanzar 3 sesiones background con diferentes tareas. Monitorear con Agent View. Re-attach a una sesión completada.

---

### Nivel IV: Producción y Gobernanza (Capítulos 11–13)

Capítulos de madurez profesional. El participante aprenderá a integrar Claude Code en pipelines CI/CD, optimizar costos, implementar políticas de seguridad empresarial, y completar un proyecto integrador.

---

#### Capítulo 11: Automatización y CI/CD

| Subcapítulo | Título | Duración | Tipo |
|-------------|--------|----------|------|
| 11.1 | Claude Code en GitHub Actions: integración nativa `@claude` | 2h | Práctico |
| 11.2 | Modo no interactivo: flags, output formats, piping | 1.5h | Teórico-Práctico |
| 11.3 | Routines: tareas programadas en infraestructura Anthropic | 1.5h | Teórico-Práctico |
| 11.4 | Claude Agent SDK: Claude Code como librería programática | 2h | Teórico-Práctico |
| 11.5 | Hooks en CI: validaciones pre-commit y pre-push | 1h | Práctico |

**Contenido detallado:**

11.1. GitHub Actions Integración nativa con `@claude` en comentarios de PR. Claude Code puede: analizar diffs, ejecutar tests, dejar inline comments. Configuración en `.github/workflows/`. Uso de `claude -p` con GitHub token para operaciones automatizadas: code review automático, análisis de seguridad, actualización de dependencias. Referencia: Anthropic, "Advanced Patterns — Claude Code in GitHub Actions" (resources.anthropic.com, 2026).

11.2. Modo no interactivo `claude -p "prompt"` para scripts y CI. Flags: `--output-format plain|json|stream-json`, `--verbose` para ver tool calls, `--max-turns N` para límite, `--allowedTools` para restricción, `--bare` para modo mínimo (sin auto-descubrimiento). Piping: `cat errors.log | claude -p "analiza estos errores"`. Referencia: Anthropic, "CLI reference" (code.claude.com/docs/en/cli-reference, 2026).

11.3. Routines Sistema de tareas programadas. Dos tipos: (a) Routines en infraestructura Anthropic (no requieren máquina local, trigger por API o GitHub events, creación desde web/desktop/CLI con `/schedule`). (b) Desktop scheduled tasks (ejecución local). `/loop` para polling rápido dentro de sesión.

11.4. Claude Agent SDK Claude Code como librería (Python/TypeScript). Primitivas: Query loop, Agents, Tools, MCP Servers, Skills, Permissions. Permite construir agentes programáticos con control total del ciclo. Ideal para automatización compleja. Integración con Replit Integrations para OAuth simplificado. Referencia: Replit, "Claude Agent SDK" (docs.replit.com/tutorials/claude-agent-sdk, 2026).

11.5. Hooks en CI Hook `PreToolUse` bloqueando comandos peligrosos. Hook `UserPromptSubmit` para inyectar contexto de CI (branch, commit SHA). Hook `PostToolUse` para logging de auditoría. Validaciones pre-commit con `!` commands.

**Referencias:**
- Anthropic. "CLI reference — Claude Code Docs." code.claude.com/docs/en/cli-reference. 2026.
- Replit. "Claude Agent SDK." docs.replit.com/tutorials/claude-agent-sdk. 2026.
- Anthropic. "Routines." claude.com/product/claude-code. 2026.

**Laboratorio L11.1:** Crear GitHub Action que ejecuta Claude Code para code review automático en PRs. Configurar Routine semanal para auditoría de dependencias. Pipeline CI/CD completo con hooks.

---

#### Capítulo 12: Optimización, Costos y Seguridad

| Subcapítulo | Título | Duración | Tipo |
|-------------|--------|----------|------|
| 12.1 | Gestión del context window: compactación, estrategias de evicción | 1.5h | Teórico-Práctico |
| 12.2 | Selección de modelos por tarea: costo vs. calidad vs. velocidad | 1.5h | Teórico-Práctico |
| 12.3 | Monitoreo y control de costos: `/cost`, presupuestos, límites | 1h | Práctico |
| 12.4 | Seguridad: managed settings, políticas organizacionales, auditoría | 1.5h | Teórico |
| 12.5 | Modo seguro: `--safe-mode` para diagnóstico de configuraciones | 0.5h | Práctico |
| 12.6 | Buenas prácticas integrales: guía de referencia rápida | 1h | Teórico |

**Contenido detallado:**

12.1. Compaction y context window El context window de 200K tokens es finito. `/compact` resume la conversación para liberar espacio. Estrategias: compactación manual periódica, auto-compact configurable (`CLAUDE_AUTOCOMPACT_PCT_THRESHOLD`), priorización de contenido (CLAUDE.md y rules tienen alta prioridad). Monitoreo con `/status`. Referencia: Builder.io, "50 Claude Code Tips" (builder.io/blog/claude-code-tips-best-practices, Marzo 2026).

12.2. Selección de modelos Matriz de decisión: Opus 4.5 para arquitectura y razonamiento (costo alto), Sonnet 4.5 para coding diario (mejor equilibrio), Haiku 4.5 para tareas simples (rápido, barato), Fable 5 para investigaciones largas. Uso de `/model` para cambiar en caliente. Modelo por defecto en settings.json.

12.3. Costos `/cost` dentro de sesión muestra tokens y costo estimado. Estrategias de optimización: usar Haiku para exploración, compactación frecuente, `--max-turns` para limitar iteraciones, skills bien diseñadas para reducir vueltas. Monitoreo agregado con herramientas externas como Claude Recall.

12.4. Seguridad empresarial Managed settings: políticas organizacionales desplegadas por administradores. Precedencia máxima sobre configuraciones locales. Hooks PreToolUse para bloqueo de comandos destructivos. Modos de permisos (auto mode para clasificación automática). Sandbox para aislamiento a nivel OS. Auditoría mediante hooks PostToolUse con logging.

12.5. Modo seguro `--safe-mode` (o `CLAUDE_CODE_SAFE_MODE`) inicia sin personalizaciones: sin CLAUDE.md, skills, plugins, hooks, MCP servers, custom commands, ni auto memory. Autenticación, selección de modelo, herramientas integradas y permisos funcionan normalmente. Si un problema desaparece en safe mode, la causa está en una personalización.

12.6. Buenas prácticas Síntesis de recomendaciones: (a) dar a Claude una forma de verificar su trabajo, (b) explorar antes de planificar antes de codificar, (c) contexto específico en prompts, (d) usar CLI tools (gh, jq, curl) en lugar de MCP cuando sea posible, (e) permitir comandos seguros con `/permissions`, (f) skills para workflows repetitivos, (g) subagentes para investigación sin contaminar contexto principal. Referencia: Anthropic, "Best practices for Claude Code" (code.claude.com/docs/en/best-practices, 2026); Claude Recall, "Claude Code best practices" (clauderecall.com, Abril 2026).

**Referencias:**
- Anthropic. "Best practices for Claude Code." code.claude.com/docs/en/best-practices. 2026.
- Builder.io. "50 Claude Code Tips and Best Practices." builder.io/blog/claude-code-tips-best-practices. Marzo 2026.
- Claude Recall. "Claude Code best practices: the complete guide for 2026." clauderecall.com/blog/claude-code-best-practices. Abril 2026.

**Laboratorio L12.1:** Auditoría de costos de una sesión compleja. Implementar política de managed settings para un equipo. Configurar auto mode con reglas ask/deny. Ejecutar `--safe-mode` para diagnosticar un problema de configuración.

---

#### Capítulo 13: Proyecto Integrador

| Subcapítulo | Título | Duración | Tipo |
|-------------|--------|----------|------|
| 13.1 | Especificación y alcance del proyecto | 1h | Teórico |
| 13.2 | Arquitectura de la solución: diseño del flujo automatizado | 2h | Práctico |
| 13.3 | Implementación fase 1: sistema de memoria y configuración | 2h | Práctico |
| 13.4 | Implementación fase 2: skills y comandos personalizados | 2h | Práctico |
| 13.5 | Implementación fase 3: MCP y automatización externa | 2h | Práctico |
| 13.6 | Implementación fase 4: subagentes y orquestación | 2h | Práctico |
| 13.7 | Documentación y presentación final | 1h | Evaluación |

**Descripción del proyecto integrador:**

El participante diseñará e implementará un **sistema automatizado de gestión de calidad de código** que integre la totalidad de los conceptos del curso:

1. **CLAUDE.md + Reglas modulares**: Configuración de memoria persistente con scoping por ruta.
2. **Skills**: Skill `/review` para análisis de código, skill `/deploy` para despliegue controlado.
3. **MCP**: Integración con GitHub (PRs, issues) y sistema de tracking externo.
4. **Hooks**: PreToolUse para bloqueo de malas prácticas, PostToolUse para formateo automático, SessionStart para inyección de contexto.
5. **Subagentes**: Subagente "security-scanner" (solo lectura, Haiku), subagente "test-runner" (Bash, permisos para test suite).
6. **CI/CD**: GitHub Action que ejecuta el pipeline de calidad en cada PR.
7. **Configuración**: settings.json con permisos, modelos, y políticas.

**Criterios de evaluación:**
- Diseño arquitectónico (20%)
- Implementación técnica (40%)
- Calidad del código y documentación (20%)
- Presentación y defensa (20%)

**Referencias:**
- Todos los capítulos previos.
- Anthropic. "Agent Skills with Anthropic — DeepLearning.AI." deeplearning.ai. Schoppik, E. 2026.

---

## 4. Guía de Implementación Docusaurus

### 4.1. Estructura de directorios

```
curso-claude-code/
├── docs/
│   ├── intro.md                          # Página de inicio (slug: /)
│   ├── nivel-1-fundamentos/
│   │   ├── _category_.json
│   │   ├── 01-arquitectura-claude-code.md
│   │   ├── 02-instalacion-configuracion.md
│   │   └── 03-primeros-pasos-comandos-esenciales.md
│   ├── nivel-2-configuracion-extensibilidad/
│   │   ├── _category_.json
│   │   ├── 04-configuracion-jerarquica.md
│   │   ├── 05-memoria-instrucciones-persistentes.md
│   │   ├── 06-hooks-automatizacion.md
│   │   ├── 07-model-context-protocol.md
│   │   └── 08-skills.md
│   ├── nivel-3-orquestacion-escalado/
│   │   ├── _category_.json
│   │   ├── 09-subagentes-delegacion.md
│   │   └── 10-subagentes-avanzados-sesiones-paralelas.md
│   ├── nivel-4-produccion-gobernanza/
│   │   ├── _category_.json
│   │   ├── 11-automatizacion-ci-cd.md
│   │   ├── 12-optimizacion-costos-seguridad.md
│   │   └── 13-proyecto-integrador.md
│   ├── laboratorios/
│   │   ├── _category_.json
│   │   ├── L1-1-exploracion-ciclo-agente.md
│   │   ├── L2-1-instalacion-completa.md
│   │   ├── L3-1-flujo-basico.md
│   │   ├── L4-1-configuracion-settings.md
│   │   ├── L5-1-creacion-claude-md.md
│   │   ├── L6-1-implementacion-hooks.md
│   │   ├── L7-1-conexion-mcp.md
│   │   ├── L8-1-creacion-skill.md
│   │   ├── L9-1-creacion-subagentes.md
│   │   ├── L10-1-batch-y-background.md
│   │   ├── L11-1-github-actions.md
│   │   └── L12-1-auditoria-costos.md
│   ├── referencias/
│   │   ├── _category_.json
│   │   ├── glosario.md
│   │   └── bibliografia.md
├── static/
│   └── img/
├── sidebars.js
├── docusaurus.config.js
├── package.json
└── README.md
```

### 4.2. Configuración de sidebar (autogenerada)

```javascript
// sidebars.js
const sidebars = {
  cursoSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Nivel I: Fundamentos',
      collapsed: false,
      items: [
        {
          type: 'autogenerated',
          dirName: 'nivel-1-fundamentos',
        },
      ],
    },
    {
      type: 'category',
      label: 'Nivel II: Configuración y Extensibilidad',
      collapsed: false,
      items: [
        {
          type: 'autogenerated',
          dirName: 'nivel-2-configuracion-extensibilidad',
        },
      ],
    },
    {
      type: 'category',
      label: 'Nivel III: Orquestación y Escalado',
      collapsed: false,
      items: [
        {
          type: 'autogenerated',
          dirName: 'nivel-3-orquestacion-escalado',
        },
      ],
    },
    {
      type: 'category',
      label: 'Nivel IV: Producción y Gobernanza',
      collapsed: false,
      items: [
        {
          type: 'autogenerated',
          dirName: 'nivel-4-produccion-gobernanza',
        },
      ],
    },
    {
      type: 'category',
      label: 'Laboratorios',
      collapsed: true,
      items: [
        {
          type: 'autogenerated',
          dirName: 'laboratorios',
        },
      ],
    },
    {
      type: 'category',
      label: 'Referencias',
      collapsed: true,
      items: [
        {
          type: 'autogenerated',
          dirName: 'referencias',
        },
      ],
    },
  ],
};

module.exports = sidebars;
```

### 4.3. Metadatos de categoría

```json
// docs/nivel-1-fundamentos/_category_.json
{
  "label": "Nivel I: Fundamentos",
  "position": 1,
  "collapsed": false,
  "link": {
    "type": "generated-index",
    "description": "Capítulos de base conceptual y operativa. Cubre la arquitectura fundamental de Claude Code, instalación del entorno y primeras sesiones interactivas."
  }
}
```

### 4.4. Frontmatter para capítulos

```markdown
---
sidebar_position: 1
title: Arquitectura de Claude Code
description: Fundamentos del ciclo agente, modelo de herramientas y ecosistema de modelos Anthropic.
tags: [claude-code, arquitectura, fundamentos]
---

# Arquitectura de Claude Code
```

### 4.5. Plugin de búsqueda y versionado

```javascript
// docusaurus.config.js (fragmento relevante)
presets: [
  [
    '@docusaurus/preset-classic',
    {
      docs: {
        sidebarPath: require.resolve('./sidebars.js'),
        routeBasePath: '/',
        showLastUpdateTime: true,
        editUrl: 'https://github.com/tu-org/curso-claude-code/edit/main/',
      },
      blog: false,
      theme: {
        customCss: require.resolve('./src/css/custom.css'),
      },
    },
  ],
],
```

---

## 5. Bibliografía

### 5.1. Fuentes primarias (documentación oficial)

1. Anthropic. "Overview — Claude Code Docs." code.claude.com/docs/en/. Accedido Junio 2026.
2. Anthropic. "How Claude Code Works." code.claude.com/docs/en/how-claude-code-works. 2026.
3. Anthropic. "CLI reference." code.claude.com/docs/en/cli-reference. 2026.
4. Anthropic. "Commands — Claude Code Docs." code.claude.com/docs/en/commands. 2026.
5. Anthropic. "Interactive mode." code.claude.com/docs/en/interactive-mode. 2026.
6. Anthropic. "Settings — Claude Code Docs." code.claude.com/docs/en/settings. 2026.
7. Anthropic. "Memory — Claude Code Docs." code.claude.com/docs/en/memory. 2026.
8. Anthropic. "Hooks reference." code.claude.com/docs/en/hooks. 2026.
9. Anthropic. "Automate actions with hooks." code.claude.com/docs/en/hooks-guide. 2026.
10. Anthropic. "Connect to MCP servers." code.claude.com/docs/en/mcp-quickstart. 2026.
11. Anthropic. "Connect Claude Code to tools via MCP." code.claude.com/docs/en/mcp.md. 2026.
12. Anthropic. "Connect to external tools with MCP (Agent SDK)." code.claude.com/docs/en/agent-sdk/mcp. 2026.
13. Anthropic. "Create custom subagents." code.claude.com/docs/en/subagents. 2026.
14. Anthropic. "Explore the .claude directory." code.claude.com/docs/en/claude-directory. 2026.
15. Anthropic. "Best practices for Claude Code." code.claude.com/docs/en/best-practices. 2026.
16. Anthropic. "Changelog." code.claude.com/docs/en/changelog.md. 2026.

### 5.2. Fuentes secundarias (artículos técnicos y guías)

17. Anthropic. "The Complete Guide to Building Skills for Claude." resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf. 2026.
18. Anthropic. "Claude Code Advanced Patterns: Subagents, MCP, and Scaling to Real Codebases." resources.anthropic.com. Marzo 2026.
19. Builder.io. "50 Claude Code Tips and Best Practices For Daily Use." builder.io/blog/claude-code-tips-best-practices. Marzo 2026.
20. ClaudeGuide. "Claude Code Complete Guide: Install, Commands, Workflows." claudeguide.io/claude-code-complete-guide. Abril 2026.
21. ClaudeGuide. "Claude Code CLI Commands: Full Reference (2026)." claudeguide.io/claude-code-cli-commands. Abril 2026.
22. ClaudeGuide. "Claude Code settings.json: Complete Configuration Reference." claudeguide.io/claude-code-settings-json-reference. Abril 2026.
23. Claude Recall. "Claude Code best practices: the complete guide for 2026." clauderecall.com/blog/claude-code-best-practices. Abril 2026.
24. ClaudeFolio. "Claude Code skills, custom slash commands, and MCP servers explained." claudefolio.com. Mayo 2026.
25. ClaudeFast. "Claude Code Rules Directory: Modular Instructions That Scale." claudefa.st. Mayo 2026.
26. ComputingForGeeks. "Claude Code Hooks: The Complete Guide." computingforgeeks.com. Junio 2026.
27. DeepLearning.AI. "Agent Skills with Anthropic." deeplearning.ai/courses/agent-skills-with-anthropic. Schoppik, E. 2026.
28. eesel AI. "A developer's Claude Code CLI reference (2026 guide)." eesel.ai/blog/claude-code-cli-reference. Junio 2026.
29. Effloow. "Claude Code Advanced Workflow: Subagents, Commands & Multi-Session." effloow.com. Abril 2026.
30. MorphLLM. "Claude Code & Agent SDK Hooks (2026): PreToolUse, PostToolUse, UserPromptSubmit, Stop, SubagentStop Reference." morphllm.com/claude-code-hooks. Junio 2026.
31. Replit. "Claude Agent SDK." docs.replit.com/tutorials/claude-agent-sdk. 2026.
32. The Prompt Shelf. "Claude Code Subagents: The Complete 2026 Reference." thepromptshelf.dev. Mayo 2026.
33. The Prompt Shelf. "Claude Code Hooks: The Complete 2026 Production Reference." thepromptshelf.dev. Mayo 2026.
34. The Prompt Shelf. "AGENTS.md Best Practices: Structure, Scope, and Real Examples." thepromptshelf.dev. Abril 2026.
35. Vincent's Blog. "Claude Code /memory: Make AI Remember Across Sessions." blog.vincentqiao.com. Marzo 2026.

### 5.3. Marcos de referencia

36. IEEE Computer Society. "SWEBOK v4: Guide to the Software Engineering Body of Knowledge." IEEE, 2024.
37. Bruner, J. S. "The Process of Education." Harvard University Press, 1960.
38. Anderson, L. W. & Krathwohl, D. R. "A Taxonomy for Learning, Teaching, and Assessing: A Revision of Bloom's Taxonomy of Educational Objectives." Longman, 2001.

---

## 6. Licencia y Atribución

Este plan de estudios se publica bajo licencia Creative Commons Attribution 4.0 International (CC BY 4.0). Se permite su uso, adaptación y distribución siempre que se atribuya adecuadamente a los autores y se referencie la documentación oficial de Anthropic como fuente primaria.

Las referencias a Claude Code, Anthropic, y los nombres de modelos son marcas registradas de Anthropic, Inc. El contenido de este curso no está afiliado ni respaldado oficialmente por Anthropic, Inc.
