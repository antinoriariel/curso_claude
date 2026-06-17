---
sidebar_position: 5
title: "Capítulo 8: Skills — Flujos de Trabajo Reutilizables"
description: Concepto de skill, estructura SKILL.md, comandos slash personalizados, integración con MCP y marketplace.
tags: [claude-code, skills, comandos-slash, SKILL.md, marketplace]
---

# Capitulo 8: Skills --- Flujos de Trabajo Reutilizables

En el capitulo anterior aprendimos a conectar Claude Code con herramientas externas mediante MCP. Ahora necesitamos resolver otra pregunta: como ensenarle a Claude Code **flujos de trabajo especificos** --- secuencias de pasos, criterios de calidad, convenciones de equipo --- que queremos que repita de forma consistente. La respuesta son las **skills**: archivos Markdown que encapsulan instrucciones especializadas y se cargan bajo demanda.

---

## 8.1 Concepto de skill

### Skills vs CLAUDE.md

Ya conoces CLAUDE.md: un archivo que se carga **siempre** al inicio de cada sesion, proporcionando contexto global sobre el proyecto. Las skills operan de forma diferente:

| Aspecto | CLAUDE.md | Skill |
|---|---|---|
| **Carga** | Automatica en cada sesion | Bajo demanda |
| **Visibilidad** | Contenido completo siempre en contexto | Solo nombre y descripcion al inicio |
| **Proposito** | Contexto general del proyecto | Instrucciones especializadas para tareas concretas |
| **Peso en contexto** | Permanente | Solo cuando se activa |

### Como funciona la carga bajo demanda

Al inicio de una sesion, Claude Code lee las skills disponibles pero solo incorpora al contexto su **nombre** y **descripcion** (del frontmatter). El contenido completo de la skill --- las instrucciones detalladas --- se carga unicamente cuando Claude determina que es relevante para la tarea actual.

Este mecanismo es analogo al Tool Search de MCP: reduce el peso en contexto sin sacrificar capacidad.

### Invocacion manual exclusiva

Algunas skills no deben activarse automaticamente. Para estos casos, el frontmatter incluye la directiva `disable-model-invocation`:

```yaml
---
name: deploy-produccion
description: Procedimiento de despliegue a produccion con verificaciones de seguridad
disable-model-invocation: true
---
```

Con `disable-model-invocation: true`, la skill **solo se ejecuta** cuando el usuario la invoca explicitamente como comando slash. Claude no la activara por iniciativa propia, sin importar la relevancia contextual. Esto es critico para operaciones destructivas o sensibles.

---

## 8.2 Estructura de una skill

### Archivo SKILL.md

Una skill es un archivo Markdown con frontmatter YAML que define sus metadatos. Se puede ubicar en cualquier directorio del proyecto:

```markdown
---
name: revisar-accesibilidad
description: Revisa componentes React para cumplimiento de WCAG 2.1 AA
version: 1.0.0
model: sonnet
context: fork
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash(npx axe-core *)
---

# Revision de Accesibilidad WCAG 2.1 AA

Eres un experto en accesibilidad web. Revisa los componentes React
proporcionados siguiendo estas reglas:

## Checklist obligatorio

1. **Atributos ARIA**: Verifica que los elementos interactivos
   tengan roles y labels apropiados.
2. **Contraste de color**: Usa axe-core para verificar ratios
   de contraste minimos (4.5:1 para texto normal).
3. **Navegacion por teclado**: Confirma que todos los elementos
   focusables sean accesibles via Tab.
4. **Textos alternativos**: Todas las imagenes deben tener alt
   descriptivo (no generico como "imagen").

## Formato de reporte

Presenta los hallazgos en una tabla:

| Componente | Problema | Severidad | Solucion sugerida |
|---|---|---|---|

## Al finalizar

Resume el conteo de problemas por severidad (critico, mayor, menor)
y proporciona una puntuacion de cumplimiento estimada.
```

### Campos del frontmatter

| Campo | Obligatorio | Descripcion |
|---|---|---|
| `name` | Si | Identificador unico de la skill |
| `description` | Si | Texto que Claude ve al inicio para decidir relevancia |
| `version` | No | Version semantica para control de cambios |
| `model` | No | Modelo especifico a usar (sonnet, opus, haiku) |
| `context` | No | `fork` para ejecutar en un subagente aislado |
| `allowed-tools` | No | Lista de herramientas permitidas durante la ejecucion |
| `disable-model-invocation` | No | `true` para deshabilitar activacion automatica |

### Context: fork para aislamiento

Cuando una skill define `context: fork`, Claude Code ejecuta las instrucciones en un **subagente aislado**. Esto significa:

- El subagente tiene su propio contexto, sin contaminar la conversacion principal.
- Al terminar, devuelve un resultado resumido al agente principal.
- Es ideal para tareas pesadas que generarian mucho ruido en la conversacion.

### Directorio SKILL.md con recursos adicionales

Una skill puede ser un directorio en lugar de un solo archivo. El directorio contiene `SKILL.md` como punto de entrada mas archivos de soporte:

```
.claude/skills/revision-seguridad/
├── SKILL.md              # Instrucciones principales
├── checklist-owasp.md    # Referencia OWASP
├── patrones-peligrosos.md # Patrones de codigo inseguro
└── plantilla-reporte.md  # Template para el reporte final
```

Claude Code carga `SKILL.md` y puede referenciar los archivos adicionales durante la ejecucion.

### Live-reload

Las skills se recargan automaticamente cuando se modifican. No necesitas reiniciar Claude Code ni la sesion para que los cambios surtan efecto. Esto permite iterar rapidamente sobre el contenido de una skill durante el desarrollo.

---

## 8.3 Skills como comandos slash

### Ubicacion

Para que una skill funcione como comando slash personalizado, debe ubicarse en el directorio `.claude/commands/` del proyecto:

```
proyecto/
├── .claude/
│   └── commands/
│       ├── review.md        →  /review
│       ├── deploy.md        →  /deploy
│       └── test-e2e.md      →  /test-e2e
└── src/
```

El nombre del archivo (sin extension) se convierte en el nombre del comando slash. Subdirectorios crean namespaces: `.claude/commands/db/migrate.md` se invoca como `/db:migrate`.

### Frontmatter adicional: triggers

Los comandos slash pueden definir `triggers` para activarse automaticamente ante ciertos patrones de input del usuario:

```markdown
---
name: review
description: Analiza el diff actual, ejecuta linters y sugiere mejoras
triggers:
  - "revisa el codigo"
  - "code review"
  - "revisar cambios"
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash(git diff *)
  - Bash(npx eslint *)
---
```

### Ejemplo completo: comando /review

Crea el archivo `.claude/commands/review.md`:

```markdown
---
name: review
description: Revision de codigo completa con lint, tipos y mejores practicas
version: 1.0.0
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash(git diff *)
  - Bash(npx eslint *)
  - Bash(npx tsc --noEmit *)
---

# Revision de Codigo

Realiza una revision exhaustiva de los cambios actuales.

## Paso 1: Obtener el diff

Ejecuta `git diff` para ver los cambios staged y unstaged.
Si no hay cambios, ejecuta `git diff HEAD~1` para el ultimo commit.

## Paso 2: Analisis estatico

1. Ejecuta ESLint sobre los archivos modificados:
   ```
   npx eslint --no-error-on-unmatched-pattern {archivos}
   ```
2. Verifica tipos con TypeScript:
   ```
   npx tsc --noEmit
   ```

## Paso 3: Revision manual

Para cada archivo modificado, revisa:

- [ ] Manejo de errores: try/catch donde sea necesario
- [ ] Nombres descriptivos de variables y funciones
- [ ] Funciones menores a 50 lineas
- [ ] Sin secretos o credenciales hardcodeadas
- [ ] Tests actualizados para cambios en logica

## Paso 4: Reporte

Presenta los hallazgos organizados por severidad:

### Criticos (bloquean merge)
### Sugerencias (mejoran calidad)
### Positivos (buenas practicas detectadas)
```

### Uso

```bash
# Invocacion directa
> /review

# Con argumento
> /review solo los archivos de src/api/
```

### Comandos slash del usuario vs del proyecto

Los comandos tambien pueden ubicarse en `~/.claude/commands/` para estar disponibles globalmente en todos los proyectos. La jerarquia de resolucion es:

1. `.claude/commands/` del proyecto (prioridad alta)
2. `~/.claude/commands/` del usuario (prioridad baja)

Si existe un comando con el mismo nombre en ambos niveles, el del proyecto tiene precedencia.

---

## 8.4 Skills + MCP

### La combinacion mas potente

Las skills definen el **como** (flujo de trabajo, criterios, formato). MCP proporciona el **con que** (herramientas externas). Juntos, permiten automatizar flujos complejos que involucran multiples sistemas.

### Ejemplo: revision de seguridad con Sentry y GitHub

Primero, asegurate de tener los servidores MCP configurados:

```bash
# Servidores MCP necesarios
claude mcp add --transport http sentry https://mcp.sentry.io
claude mcp add --scope user github -- \
  npx -y @modelcontextprotocol/server-github
```

Luego, crea la skill en `.claude/commands/security-audit.md`:

```markdown
---
name: security-audit
description: Auditoria de seguridad cruzando errores de Sentry con codigo fuente y creando issues en GitHub
version: 1.0.0
disable-model-invocation: true
context: fork
allowed-tools:
  - Read
  - Grep
  - Glob
  - mcp__sentry__list_issues
  - mcp__sentry__get_issue
  - mcp__github__create_issue
  - mcp__github__search_code
---

# Auditoria de Seguridad

## Fase 1: Recoleccion de errores

1. Usa `mcp__sentry__list_issues` para obtener errores de las
   ultimas 48 horas con nivel "error" o "fatal".
2. Para cada error, usa `mcp__sentry__get_issue` para obtener
   el stack trace completo.

## Fase 2: Analisis de codigo

Para cada error de Sentry:

1. Localiza el archivo fuente mencionado en el stack trace.
2. Analiza si el error es por:
   - Input no validado
   - Excepcion no capturada
   - Race condition
   - Fuga de memoria
   - Vulnerabilidad de seguridad (inyeccion, XSS, etc.)

## Fase 3: Creacion de issues

Para cada hallazgo de seguridad, crea un issue en GitHub con:
- Titulo: `[Security] {descripcion breve}`
- Labels: `security`, `bug`
- Body: stack trace, archivo afectado, analisis, solucion sugerida

## Fase 4: Reporte

Genera un resumen con:
- Total de errores analizados
- Hallazgos de seguridad encontrados
- Issues creados en GitHub
- Recomendaciones prioritarias
```

### Uso

```bash
> /security-audit
# Claude ejecuta el flujo completo:
# 1. Consulta Sentry via MCP
# 2. Analiza codigo fuente con herramientas locales
# 3. Crea issues en GitHub via MCP
# 4. Presenta el reporte
```

### Patron de diseno: skill como orquestador

El patron mas efectivo es usar la skill como **orquestador** que coordina herramientas MCP:

```
Skill (instrucciones de flujo)
  ├── MCP Server A (obtener datos)
  ├── Herramientas locales (analizar)
  ├── MCP Server B (ejecutar acciones)
  └── Resultado (reportar)
```

---

## 8.5 Instalacion de skills desde marketplace

### Plugins oficiales

Anthropic mantiene un marketplace de skills verificadas que se instalan como plugins. La instalacion se realiza desde una sesion interactiva:

```bash
# Instalar un plugin
> /install-plugin document-skills

# O directamente por nombre de paquete
> /install-plugin @anthropic-ai/claude-code-example-skills
```

### Plugins disponibles

| Plugin | Skills incluidas | Proposito |
|---|---|---|
| **document-skills** | Documentacion de codigo, generacion de READMEs | Automatizar documentacion |
| **example-skills** | skill-creator, mcp-builder, frontend-design, webapp-testing | Plantillas y generadores |

### Ejemplo: instalacion de example-skills

```bash
> /install-plugin @anthropic-ai/claude-code-example-skills
```

Despues de la instalacion, los comandos quedan disponibles:

```bash
# Crear una nueva skill usando el skill-creator
> /skill-creator

# Generar configuracion de servidor MCP
> /mcp-builder

# Disenar interfaz frontend
> /frontend-design

# Generar tests end-to-end
> /webapp-testing
```

### Actualizacion y desinstalacion

```bash
# Listar plugins instalados
> /plugins

# Actualizar un plugin
> /update-plugin document-skills

# Desinstalar
> /uninstall-plugin document-skills
```

---

## 8.6 Distribucion

### Skills como repositorios publicos

Para compartir skills con la comunidad, publicalas como directorios en un repositorio de GitHub. La estructura recomendada es:

```
mi-skill-publica/
├── README.md             # Documentacion para humanos
├── SKILL.md              # Instrucciones para Claude
├── CHANGELOG.md          # Historial de cambios
├── examples/             # Ejemplos de uso
│   └── ejemplo-basico.md
└── resources/            # Archivos auxiliares
    └── plantilla.md
```

### Separacion de README y SKILL.md

Es fundamental mantener estos dos archivos con propositos distintos:

| Archivo | Audiencia | Contenido |
|---|---|---|
| **README.md** | Desarrolladores humanos | Instalacion, requisitos, capturas, FAQ |
| **SKILL.md** | Claude Code | Instrucciones de ejecucion, checklist, formato de salida |

El README explica **que hace** la skill y como instalarla. El SKILL.md contiene las **instrucciones que Claude seguira**. Mezclar ambos propositos degrada la calidad de ambos.

### Versionado semantico

Usa versionado semantico en el campo `version` del frontmatter:

```yaml
version: 1.2.0
# MAJOR.MINOR.PATCH
# MAJOR: cambios incompatibles (reorganizacion de flujo)
# MINOR: nuevas funcionalidades (pasos adicionales)
# PATCH: correcciones (mejoras de redaccion)
```

### Compatibilidad cross-surface

Las skills bien disenadas funcionan en multiples superficies donde Claude Code opera:

- **Terminal**: La skill se invoca como comando slash.
- **IDE** (VS Code, JetBrains): La skill se invoca desde la extension de Claude Code.
- **Claude Agent SDK**: La skill puede cargarse programaticamente en agentes personalizados.

Para maximizar compatibilidad:

- Usa herramientas estandar (`Read`, `Grep`, `Glob`, `Bash`) en `allowed-tools`.
- Evita dependencias de rutas absolutas.
- Documenta las herramientas MCP requeridas en el README.
- Prueba la skill en al menos dos superficies antes de publicar.

### Instalacion desde GitHub

Los usuarios pueden instalar skills publicas clonando el repositorio y copiando los archivos:

```bash
# Clonar la skill
git clone https://github.com/usuario/mi-skill-publica.git /tmp/mi-skill

# Copiar al proyecto
cp -r /tmp/mi-skill/SKILL.md .claude/commands/mi-skill.md
# O como directorio con recursos
cp -r /tmp/mi-skill .claude/skills/mi-skill/
```

---

## Conceptos clave del capitulo

- **Skills son instrucciones especializadas** en archivos Markdown con frontmatter YAML que se cargan bajo demanda, a diferencia de CLAUDE.md que se carga siempre.
- **Estructura SKILL.md**: frontmatter con name, description, version, model, context, allowed-tools, y cuerpo con instrucciones en Markdown.
- **Comandos slash personalizados**: archivos en `.claude/commands/` que se invocan con `/nombre`. Soportan triggers para activacion contextual.
- **Skills + MCP**: la combinacion mas potente. La skill define el flujo de trabajo (como), MCP proporciona las herramientas externas (con que).
- **Marketplace de plugins**: skills verificadas por Anthropic instalables con `/install-plugin`.
- **Distribucion**: skills publicas en GitHub con README para humanos y SKILL.md para Claude, versionado semantico y compatibilidad cross-surface.

---

## Preguntas de autoevaluacion

1. **Que diferencia fundamental existe entre CLAUDE.md y una skill?** Explica como el mecanismo de carga bajo demanda beneficia al rendimiento y al uso de contexto.

2. **Que efecto tiene `context: fork` en la ejecucion de una skill?** Describe un escenario donde usar fork es critico y otro donde no seria necesario.

3. **Como se crea un comando slash personalizado?** Describe la estructura de archivos necesaria y como afecta la jerarquia de resolucion cuando existe el mismo comando a nivel de proyecto y de usuario.

4. **Que patron de diseno permite combinar skills con MCP de forma efectiva?** Construye un ejemplo hipotetico de una skill que orqueste dos servidores MCP para resolver un problema real.

5. **Que consideraciones debes tener al distribuir una skill publica?** Explica la separacion entre README.md y SKILL.md, y por que el versionado semantico es importante para los consumidores.

---

## Laboratorio asociado

**[L8.1]** Crea una skill personalizada como comando slash en `.claude/commands/` que automatice un flujo de trabajo relevante para tu proyecto (revision de codigo, generacion de tests, auditoria de dependencias u otro). La skill debe incluir al menos tres pasos definidos, usar herramientas especificas en `allowed-tools` y generar un reporte estructurado. Prueba el comando slash en una sesion interactiva y documenta los resultados.
