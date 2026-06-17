---
sidebar_position: 2
title: "Capitulo 5: Sistema de Memoria e Instrucciones Persistentes"
description: CLAUDE.md, reglas modulares con path-scoping, auto memory y gestion de instrucciones en monorepos.
tags: [claude-code, memoria, CLAUDE.md, reglas, auto-memory]
---

# Capitulo 5: Sistema de Memoria e Instrucciones Persistentes

Cada vez que inicias una sesion de Claude Code, el agente parte de cero: no recuerda conversaciones anteriores ni conoce las convenciones de tu proyecto. El **sistema de memoria** resuelve este problema proporcionando instrucciones persistentes que Claude carga automaticamente al inicio de cada sesion. Dominar este sistema es la diferencia entre repetir las mismas indicaciones cada vez y tener un agente que ya "conoce" tu proyecto.

## 5.1 CLAUDE.md: formato, ubicacion y jerarquia de busqueda

El archivo `CLAUDE.md` es el mecanismo principal de instrucciones persistentes. Es un archivo Markdown que Claude Code busca y carga automaticamente al iniciar una sesion.

### Que incluir en CLAUDE.md

Un buen `CLAUDE.md` contiene informacion que el agente necesita para trabajar correctamente en tu proyecto:

- **Comandos de build y test** que debe usar.
- **Reglas de estilo** del codigo (convenciones de nombres, formateo).
- **Bibliotecas preferidas** y las que deben evitarse.
- **Convenciones arquitectonicas** (estructura de carpetas, patrones).
- **Contexto del dominio** (glosario, reglas de negocio clave).
- **Errores comunes** que debe evitar.

### Ejemplo real de CLAUDE.md

```markdown
# Instrucciones para Claude Code

## Comandos del proyecto

- Build: `npm run build`
- Tests: `npm run test`
- Lint: `npm run lint`
- Test individual: `npm run test -- --grep "nombre del test"`

## Reglas de estilo

- Usar TypeScript estricto (`strict: true` en tsconfig).
- Preferir `interface` sobre `type` para objetos.
- Nombres de archivos en kebab-case: `user-service.ts`, no `UserService.ts`.
- Funciones exportadas con JSDoc obligatorio.
- No usar `any`. Usar `unknown` cuando el tipo es indeterminado.
- Imports absolutos con alias `@/`: `import { User } from '@/models/user'`.

## Arquitectura

- Patron: Clean Architecture con capas domain, application, infrastructure.
- La capa `domain` no importa de `infrastructure` nunca.
- Cada caso de uso es una clase en `src/application/use-cases/`.
- Los repositorios se definen como interfaces en `domain` y se implementan en `infrastructure`.

## Base de datos

- ORM: Prisma.
- Migraciones: `npx prisma migrate dev --name descripcion`.
- No modificar el schema sin crear una migracion.

## Convenciones de Git

- Commits en ingles, formato conventional commits.
- Ramas: `feature/`, `fix/`, `chore/`.
- No hacer push a main directamente.

## Errores comunes a evitar

- No usar `console.log` en produccion. Usar el logger del proyecto (`src/shared/logger.ts`).
- No crear archivos de test en la misma carpeta que el codigo fuente. Usar `__tests__/`.
```

### El comando /init

Claude Code ofrece el comando `/init` que genera automaticamente un archivo `CLAUDE.md` basado en el analisis del proyecto actual:

```bash
# Dentro de una sesion interactiva de Claude Code
> /init
```

El comando analiza la estructura del proyecto, los archivos de configuracion existentes (`package.json`, `tsconfig.json`, `.eslintrc`, etc.) y genera un `CLAUDE.md` con las convenciones detectadas. Es un excelente punto de partida que luego puedes refinar manualmente.

:::tip Empieza con /init
Si tienes un proyecto existente y no sabes por donde empezar con `CLAUDE.md`, ejecuta `/init`. En 30 segundos tendras una base solida que puedes editar y ampliar.
:::

---

## 5.2 Reglas modulares: `.claude/rules/` con path-scoping

Para proyectos grandes, un unico `CLAUDE.md` puede volverse inmanejable. Las **reglas modulares** permiten dividir las instrucciones en archivos separados dentro del directorio `.claude/rules/`.

### Estructura basica

```
mi-proyecto/
  .claude/
    rules/
      general.md
      api.md
      testing.md
      frontend.md
      database.md
```

Cada archivo `.md` dentro de `.claude/rules/` (y subdirectorios) es descubierto automaticamente por Claude Code. Las reglas se aplican segun el contexto de la conversacion.

### Path-scoping con frontmatter

La caracteristica mas poderosa de las reglas modulares es el **path-scoping**: puedes indicar que una regla solo se aplique cuando Claude trabaja con archivos que coincidan con ciertos patrones de ruta.

**Ejemplo: reglas para archivos de API**

```markdown
---
paths:
  - "src/api/**"
  - "src/routes/**"
---

# Reglas para endpoints de API

- Cada endpoint debe validar el input con Zod antes de procesarlo.
- Respuestas exitosas usan el formato `{ data: ... }`.
- Errores usan el formato `{ error: { code: string, message: string } }`.
- Todos los endpoints requieren autenticacion excepto los marcados con `@public`.
- Documentar cada endpoint con comentarios OpenAPI/Swagger.
```

**Ejemplo: reglas para archivos de test**

```markdown
---
paths:
  - "**/*.test.ts"
  - "**/*.spec.ts"
  - "**/__tests__/**"
---

# Reglas para tests

- Usar `describe` / `it` (no `test`).
- Cada `describe` agrupa tests de un metodo o funcionalidad.
- Usar factories para crear datos de prueba, no objetos literales repetidos.
- Mocks solo para dependencias externas (HTTP, DB). No mockear logica interna.
- Nombre del test: "should [comportamiento esperado] when [condicion]".
```

**Ejemplo: reglas para componentes frontend**

```markdown
---
paths:
  - "src/components/**"
  - "src/pages/**"
---

# Reglas para componentes React

- Componentes funcionales unicamente. No usar clases.
- Props tipadas con interface, no inline.
- Archivos de estilo colocados junto al componente: `Button.tsx` + `Button.module.css`.
- Hooks custom en `src/hooks/`. Prefijo `use`.
- No usar `useEffect` para derivar estado. Usar `useMemo`.
```

:::info Descubrimiento recursivo
Claude Code busca archivos `.md` en `.claude/rules/` de forma recursiva. Puedes organizar subcarpetas como `.claude/rules/backend/`, `.claude/rules/frontend/`, etc.
:::

---

## 5.3 Auto memory

Ademas de las instrucciones manuales, Claude Code cuenta con un sistema de **memoria automatica** que toma notas entre sesiones sin intervencion del usuario.

### Como funciona

Cuando `autoMemoryEnabled` esta activo, Claude Code guarda automaticamente informacion relevante que descubre durante las sesiones:

- Preferencias del usuario detectadas a lo largo de la conversacion.
- Patrones del proyecto que identifica al trabajar.
- Correcciones que el usuario le indica y que deberia recordar.

### Ubicacion del almacenamiento

La memoria automatica se almacena en:

```
~/.claude/projects/<project-id>/memory/MEMORY.md
```

Donde `<project-id>` es un identificador derivado de la ruta del proyecto.

### Estructura de MEMORY.md

El archivo `MEMORY.md` generado automaticamente tiene una estructura tematica:

```markdown
# Memoria del Proyecto

## Preferencias del usuario
- Prefiere respuestas concisas, sin explicaciones largas.
- Quiere que los commits se escriban en ingles.
- No le gustan los comentarios obvios en el codigo.

## Patrones del proyecto
- El proyecto usa pnpm, no npm.
- Los tests estan en carpetas __tests__ junto al codigo fuente.
- El proyecto usa path aliases configurados en tsconfig.json.

## Correcciones aprendidas
- No usar `moment.js`, el proyecto usa `date-fns`.
- El logger es `src/lib/logger.ts`, no console.log.
- Las migraciones de DB requieren reiniciar el servidor de desarrollo.
```

### Configuracion

Puedes controlar la memoria automatica desde `settings.json`:

```json
{
  "autoMemoryEnabled": true,
  "autoMemoryDirectory": ".claude/memory"
}
```

| Campo                 | Descripcion                                                           |
|-----------------------|-----------------------------------------------------------------------|
| `autoMemoryEnabled`   | `true` para activar, `false` para desactivar. Por defecto: `true`    |
| `autoMemoryDirectory` | Directorio personalizado para almacenar la memoria del proyecto       |

:::tip Revisa la memoria periodicamente
La memoria automatica es util pero no infalible. Revisala cada cierto tiempo para eliminar entradas obsoletas o incorrectas. Un `MEMORY.md` con informacion desactualizada puede hacer que Claude tome decisiones equivocadas.
:::

---

## 5.4 CLAUDE.local.md, CLAUDE.md en subdirectorios y monorepos

El sistema de instrucciones de Claude Code es mas sofisticado que un unico archivo en la raiz. Soporta multiples archivos en diferentes ubicaciones, lo que lo hace ideal para monorepos y proyectos complejos.

### Busqueda ascendente de CLAUDE.md

Cuando inicias Claude Code, el agente **camina hacia arriba** desde el directorio actual, cargando cada `CLAUDE.md` que encuentra en el camino:

```
/home/dev/empresa/monorepo/packages/api/src/
  → busca CLAUDE.md en src/           (si existe, lo carga)
  → busca CLAUDE.md en api/           (si existe, lo carga)
  → busca CLAUDE.md en packages/      (si existe, lo carga)
  → busca CLAUDE.md en monorepo/      (si existe, lo carga)
  → se detiene en la raiz del repositorio Git
```

Los archivos se cargan de **mas general a mas especifico**. Las instrucciones del subdirectorio mas cercano al directorio de trabajo tienen prioridad contextual.

### CLAUDE.local.md: instrucciones personales

`CLAUDE.local.md` funciona exactamente igual que `CLAUDE.md`, pero esta pensado para instrucciones **personales** que no deben compartirse con el equipo:

```
mi-proyecto/
  CLAUDE.md            # Compartido (versionado en Git)
  CLAUDE.local.md      # Personal (en .gitignore)
```

**Casos de uso tipicos para CLAUDE.local.md:**

- Preferencias personales de estilo de respuesta.
- Rutas de herramientas locales especificas de tu maquina.
- Contexto sobre la tarea actual en la que estas trabajando.
- Notas temporales que no tienen sentido para el equipo.

```markdown
# CLAUDE.local.md

## Mi contexto actual
Estoy trabajando en el sistema de notificaciones (feature/notifications).
El branch base es `develop`.

## Preferencias personales
- Responde en espanol.
- Cuando generes tests, incluye siempre casos edge.
- Prefiero async/await sobre .then().
```

### Patron para monorepos

En un monorepo, la combinacion de `CLAUDE.md` a diferentes niveles permite instrucciones especificas por paquete:

```
monorepo/
  CLAUDE.md                          # Reglas globales del monorepo
  packages/
    CLAUDE.md                        # Reglas comunes a todos los paquetes
    api/
      CLAUDE.md                      # Reglas especificas del API
      src/
    web/
      CLAUDE.md                      # Reglas especificas del frontend
      src/
    shared/
      CLAUDE.md                      # Reglas de la libreria compartida
      src/
```

**Ejemplo de CLAUDE.md raiz del monorepo:**

```markdown
# Monorepo - Instrucciones globales

- Gestor de paquetes: pnpm. No usar npm ni yarn.
- Workspace protocol: `workspace:*` para dependencias internas.
- CI: GitHub Actions. Los workflows estan en `.github/workflows/`.
- Cada paquete tiene su propio `tsconfig.json` que extiende del raiz.
```

**Ejemplo de CLAUDE.md en `packages/api/`:**

```markdown
# API - Instrucciones especificas

- Framework: Fastify.
- Puerto por defecto: 3001.
- Validacion: Zod + fastify-type-provider-zod.
- Tests: Vitest con supertest para tests de integracion.
- Build: `pnpm --filter api build`.
```

---

## 5.5 Gestion de memoria

Claude Code proporciona herramientas para gestionar las instrucciones persistentes durante una sesion activa.

### El comando /memory

Dentro de una sesion interactiva, puedes usar el comando `/memory` para ver y editar las instrucciones en memoria:

```bash
# Ver las instrucciones actualmente cargadas
> /memory

# Agregar una instruccion a la memoria del proyecto
> /memory "Siempre usar arrow functions en lugar de function declarations"
```

### Debugging: cuando Claude no sigue las instrucciones

Si Claude Code no respeta las reglas que has definido, sigue este proceso de diagnostico:

**1. Verifica que archivos se estan cargando:**

Pregunta directamente en la sesion:

```
> Que archivos CLAUDE.md tienes cargados actualmente?
```

**2. Revisa el orden de carga:**

El orden importa. Si tienes instrucciones contradictorias en diferentes niveles, las mas especificas (mas cercanas al directorio de trabajo) pueden dominar.

**3. Verifica la sintaxis del frontmatter:**

En reglas modulares con path-scoping, un error de sintaxis YAML en el frontmatter puede hacer que la regla no se aplique:

```markdown
---
paths:
  - "src/api/**"    # Correcto: YAML list
---
```

```markdown
---
paths: src/api/**   # Incorrecto: no es una lista YAML valida
---
```

**4. Comprueba que el archivo esta en la ubicacion correcta:**

| Archivo                          | Ubicacion esperada                     |
|----------------------------------|----------------------------------------|
| `CLAUDE.md`                      | Raiz del proyecto o subdirectorio      |
| `CLAUDE.local.md`                | Mismo nivel que `CLAUDE.md`            |
| Reglas modulares                 | `.claude/rules/` (recursivo)           |
| Memoria automatica               | `~/.claude/projects/<id>/memory/`      |

**5. Revisa si hay conflictos entre niveles:**

Si defines una regla en el `CLAUDE.md` raiz que dice "usa tabs" y otra en un subdirectorio que dice "usa spaces", Claude seguira la del subdirectorio cuando trabaje en archivos dentro de el.

:::warning Limite de contexto
Recuerda que las instrucciones de `CLAUDE.md` y las reglas modulares consumen tokens de la ventana de contexto. Un `CLAUDE.md` excesivamente largo puede reducir el espacio disponible para el codigo y la conversacion. Se conciso y prioriza las instrucciones mas importantes.
:::

:::tip Principio de minimalismo
Un buen `CLAUDE.md` no intenta documentar todo el proyecto. Incluye solo lo que Claude necesita para tomar decisiones correctas y lo que no podria inferir por si mismo leyendo el codigo. Si algo es evidente del `package.json` o del `tsconfig.json`, no lo repitas en `CLAUDE.md`.
:::

---

## Conceptos clave del capitulo

:::tip Resumen
- `CLAUDE.md` es el archivo principal de instrucciones persistentes. Incluye comandos, reglas de estilo y convenciones arquitectonicas.
- Las **reglas modulares** en `.claude/rules/` permiten organizar instrucciones por dominio y aplicarlas condicionalmente con **path-scoping**.
- La **memoria automatica** (`MEMORY.md`) toma notas entre sesiones sobre preferencias y patrones del proyecto.
- `CLAUDE.local.md` es para instrucciones personales no compartidas con el equipo.
- En **monorepos**, multiples archivos `CLAUDE.md` en diferentes niveles proporcionan instrucciones especificas por paquete.
- Usa `/init` para generar un `CLAUDE.md` inicial y `/memory` para gestionar instrucciones en sesion.
:::

---

## Autoevaluacion

1. Un proyecto tiene `CLAUDE.md` en la raiz con la regla "usa tabs para indentar" y otro `CLAUDE.md` en `packages/web/` con la regla "usa spaces para indentar". Si trabajas dentro de `packages/web/src/`, que regla aplica Claude y por que?

2. Cual es la diferencia entre poner instrucciones en `CLAUDE.md` y ponerlas en `.claude/rules/` con path-scoping? En que situaciones prefeririras cada enfoque?

3. Un companero nuevo se une al equipo y reporta que Claude Code no sigue las convenciones del proyecto a pesar de que existe un `CLAUDE.md`. Que pasos de diagnostico seguirias?

4. Tienes un monorepo con 5 paquetes. Cada paquete usa un framework diferente para tests (Vitest, Jest, Mocha, etc.). Como organizarias las instrucciones de testing para que Claude use el framework correcto en cada paquete?

5. La memoria automatica de tu proyecto acumulo entradas obsoletas de un refactoring que ya termino. Como limpias esta memoria y que precauciones tomarias?

---

## Laboratorio asociado

Practica los conceptos de este capitulo en el **[Laboratorio L5.1: Memoria e Instrucciones Persistentes](../laboratorios/L5.1-memoria-instrucciones)**.
