---
sidebar_position: 1
title: Glosario
description: Definiciones de términos técnicos utilizados a lo largo del curso Claude Code De Cero a Experto.
tags: [glosario, definiciones, referencia]
---

# Glosario

Referencia rápida de los términos técnicos clave del curso, organizados alfabéticamente.

---

### A

**Agent Loop (Ciclo Agente)**
Bucle fundamental de Claude Code: percepción → razonamiento → acción → observación. Se repite hasta completar la tarea solicitada.

**Agent SDK**
Librería oficial de Anthropic (Python/TypeScript) que expone Claude Code como componente programático para construir agentes personalizados.

**Agent Teams**
Funcionalidad (research preview) que permite coordinar múltiples agentes que se comunican, dividen trabajo y sincronizan resultados.

**AGENTS.md**
Archivo en la raíz del proyecto que registra subagentes de equipo con sus configuraciones, herramientas permitidas y system prompts.

**Auto Memory**
Sistema automático donde Claude toma notas entre sesiones, almacenándolas en `~/.claude/projects/<id>/memory/MEMORY.md`.

**Auto Mode**
Modo de permisos donde un clasificador automatizado decide si cada acción requiere confirmación del usuario o puede ejecutarse directamente.

### B

**Background Session**
Sesión de Claude Code lanzada en segundo plano con `claude --bg "tarea"`, que se ejecuta sin bloquear la terminal principal.

**Bash Tool**
Herramienta integrada que permite a Claude ejecutar comandos de shell (bash, zsh, PowerShell) en el sistema del usuario.

**BypassPermissions**
Modo de permisos que omite todas las confirmaciones. Solo recomendado para entornos controlados de CI/CD.

### C

**CLAUDE.md**
Archivo de instrucciones persistentes en la raíz del proyecto. Claude lo lee al inicio de cada sesión e integra su contenido en el system prompt.

**CLAUDE.local.md**
Variante personal de CLAUDE.md que no se comparte en el repositorio (gitignored). Contiene preferencias individuales del desarrollador.

**Compaction (`/compact`)**
Proceso de resumen del historial de conversación para liberar espacio en la ventana de contexto, preservando la información esencial.

**Context Window (Ventana de Contexto)**
Cantidad máxima de tokens que Claude puede procesar en una sesión. Actualmente 200K tokens para Sonnet 4.6 y Opus 4.8.

### D

**Deferral (Diferimiento)**
Mecanismo de MCP Tool Search donde las herramientas de servidores con muchas tools se cargan bajo demanda en lugar de todas al inicio.

### E

**Edit Tool**
Herramienta integrada para modificar archivos existentes mediante reemplazo exacto de cadenas de texto, sin reescribir el archivo completo.

**Extended Thinking**
Capacidad de Claude para razonar internamente antes de responder, visible como bloques de pensamiento en modos verbose.

### F

**Fan-out**
Patrón de paralelización donde se lanzan múltiples sesiones `claude -p` simultáneas, cada una procesando un subconjunto del trabajo.

**Fork (Subagente)**
Modo de aislamiento donde un subagente opera en un git worktree separado, con su propia copia del repositorio.

### G

**Glob Tool**
Herramienta de búsqueda de archivos por patrones (e.g., `**/*.ts`). Más eficiente que `find` para localizar archivos por nombre.

**Grep Tool**
Herramienta de búsqueda de contenido en archivos mediante expresiones regulares, construida sobre ripgrep.

### H

**Handler (Hook)**
Acción que se ejecuta cuando se dispara un evento de hook. Tipos: shell command, HTTP endpoint, LLM prompt, MCP tool, agent.

**Hook**
Mecanismo determinista de control del ciclo de vida. A diferencia de las skills (guiadas por LLM), los hooks son imperativos y siempre se ejecutan cuando ocurre su evento asociado.

### I

**Isolation (Worktree)**
Estrategia de aislamiento para subagentes que crea un git worktree independiente, permitiendo cambios experimentales sin afectar la rama principal.

### J

**JSON-RPC**
Protocolo de comunicación utilizado por MCP para la interacción entre hosts (Claude Code) y servidores MCP.

### M

**Managed Settings**
Configuraciones organizacionales desplegadas por administradores con la máxima precedencia sobre cualquier configuración local o de proyecto.

**Matcher (Hook)**
Patrón que determina cuándo se ejecuta un hook. Puede filtrar por nombre de herramienta, tipo de evento o patrón de archivo.

**MCP (Model Context Protocol)**
Estándar abierto (protocolo JSON-RPC) para conectar agentes de IA con herramientas externas. Los servidores MCP exponen herramientas, recursos y prompts.

**MCP Host**
Aplicación que aloja clientes MCP. Claude Code actúa como host MCP, conectándose a múltiples servidores simultáneamente.

**MCP Tool Search**
Optimización que permite buscar herramientas MCP por relevancia semántica en lugar de cargar todas al inicio, útil para servidores con más de 50 herramientas.

### O

**OAuth 2.0**
Protocolo de autorización utilizado para autenticar servidores MCP remotos (Sentry, Linear, Notion) mediante flujo de navegador.

### P

**Path-scoping**
Mecanismo de las reglas modulares (`.claude/rules/`) donde las instrucciones solo se cargan cuando Claude trabaja con archivos que coinciden con los patrones definidos en el frontmatter `paths:`.

**Permission Mode**
Nivel de autonomía de Claude Code. Modos: Default (confirmación explícita), AcceptEdits (auto-aprueba ediciones), Plan (solo lectura), Auto (clasificación automática), BypassPermissions (sin confirmaciones).

**Plugin**
Paquete instalable que extiende Claude Code con skills, herramientas o capacidades adicionales desde el marketplace de Anthropic.

**PostToolUse**
Evento de hook que se dispara después de que una herramienta se ejecuta exitosamente. Usado para observación, formateo y logging.

**PreToolUse**
Evento de hook que se dispara antes de ejecutar una herramienta. Puede bloquear la ejecución con exit code 2.

### R

**REPL (Read-Eval-Print Loop)**
Interfaz interactiva principal de Claude Code. El usuario escribe prompts y Claude responde, ejecutando herramientas según necesidad.

**Routine**
Tarea programada que se ejecuta automáticamente en intervalos definidos, ya sea en infraestructura de Anthropic o en el escritorio local.

**Rules Directory (`.claude/rules/`)**
Directorio para instrucciones modulares. Cada archivo `.md` se descubre recursivamente y puede aplicar solo a rutas específicas.

### S

**Safe Mode (`--safe-mode`)**
Modo de diagnóstico que inicia Claude Code sin personalizaciones (sin CLAUDE.md, skills, plugins, hooks, MCP servers ni auto memory).

**Scope (MCP)**
Nivel de visibilidad de un servidor MCP: `local` (proyecto, privado), `user` (global personal), `project` (compartido en repositorio).

**SessionStart**
Evento de hook que se dispara al iniciar o reanudar una sesión. Comúnmente usado para inyectar contexto inicial.

**settings.json**
Archivo de configuración principal de Claude Code. Existe en múltiples niveles: global (`~/.claude/`), proyecto (`.claude/`), y local (`.claude/settings.local.json`).

**SKILL.md**
Archivo Markdown con frontmatter YAML que define una skill: instrucciones especializadas que se cargan bajo demanda cuando son relevantes.

**Slash Command (Comando Slash)**
Comando invocable con `/` dentro de una sesión interactiva. Pueden ser built-in (`/help`, `/compact`) o personalizados (definidos en `.claude/commands/`).

**Stdio (Transport)**
Transporte MCP donde la comunicación ocurre a través de stdin/stdout de un proceso local. Ideal para herramientas locales.

**Stop**
Evento de hook que se dispara cuando Claude termina de generar su respuesta. Usado para notificaciones y post-procesamiento.

**Subagent (Subagente)**
Instancia autónoma de Claude con contexto propio, spawneada por el agente principal para tareas específicas. No hereda el historial de la sesión padre.

### T

**Token**
Unidad mínima de procesamiento de texto. Claude opera con una ventana de 200K tokens que incluye system prompt, historial, herramientas y respuestas.

**Tool (Herramienta)**
Capacidad que Claude puede invocar durante el ciclo agente: lectura/escritura de archivos, búsqueda, ejecución de comandos, búsqueda web, etc.

**Tool Search**
Mecanismo para buscar herramientas disponibles (tanto integradas como MCP) por relevancia semántica cuando hay muchas disponibles.

### U

**UserPromptSubmit**
Evento de hook que se dispara antes de que Claude procese el prompt del usuario. Puede bloquear el procesamiento o inyectar contexto adicional.

### W

**Worktree (Git)**
Copia de trabajo asociada a un repositorio Git. Claude Code usa worktrees para aislar el trabajo de subagentes y sesiones paralelas.

**Writer/Reviewer Pattern**
Patrón de producción donde dos sesiones independientes trabajan en secuencia: una implementa (Writer) y otra revisa (Reviewer) desde un contexto fresco.

---

:::tip[Convención de este glosario]
Los términos se presentan con su nombre en inglés (usado en la documentación oficial y la interfaz de Claude Code) seguido de su explicación en español. Cuando existe una traducción estándar, se incluye entre paréntesis en el título.
:::
