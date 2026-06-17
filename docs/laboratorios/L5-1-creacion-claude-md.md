---
sidebar_position: 5
title: "Lab 5: Creación de CLAUDE.md y Reglas"
description: "Crea CLAUDE.md con reglas de estilo, reglas modulares y memoria automática"
tags: [laboratorio, claude-md, reglas, memoria, convenciones]
---

# Lab 5: Creación de CLAUDE.md y Reglas

## Objetivo

Crear un archivo `CLAUDE.md` completo para un proyecto real con reglas de estilo, comandos de build y convenciones. Configurar reglas modulares con path-scoping y activar la memoria automática.

## Prerrequisitos

- Claude Code instalado y autenticado
- Un proyecto con código fuente (JavaScript/TypeScript recomendado)
- Familiaridad con convenciones de estilo de código

## Duración estimada

40 minutos

## Pasos

### Paso 1: Crear un proyecto con estructura real

Si no tienes un proyecto disponible, crea uno con estructura típica:

```bash
mkdir -p ~/lab5-proyecto/{src,tests,docs}
cd ~/lab5-proyecto && git init
npm init -y
```

Crea algunos archivos de ejemplo en `src/` y `tests/` para que el proyecto tenga contenido.

### Paso 2: Crear CLAUDE.md manualmente

Crea el archivo `CLAUDE.md` en la raíz del proyecto con el siguiente contenido:

```markdown
# Instrucciones del Proyecto

## Comandos de Build y Test
- Build: `npm run build`
- Test: `npm test`
- Lint: `npm run lint`
- Formato: `npm run format`

## Reglas de Estilo
- Usar TypeScript estricto con `strict: true`
- Nombres de variables y funciones en camelCase
- Nombres de clases en PascalCase
- Constantes globales en UPPER_SNAKE_CASE
- Preferir `const` sobre `let`, nunca usar `var`
- Usar arrow functions para callbacks
- Máximo 80 caracteres por línea

## Convenciones del Proyecto
- Cada módulo exporta desde un archivo `index.ts`
- Tests junto al código fuente con sufijo `.test.ts`
- Mensajes de commit en formato Conventional Commits
- Documentar funciones públicas con JSDoc
- Manejar errores con clases de error personalizadas

## Arquitectura
- Patrón: Clean Architecture con capas separadas
- src/domain/ - Entidades y reglas de negocio
- src/application/ - Casos de uso
- src/infrastructure/ - Implementaciones externas
- src/presentation/ - Controladores y rutas
```

### Paso 3: Crear reglas modulares con path-scoping

Crea el directorio de reglas:

```bash
mkdir -p .claude/rules
```

Crea una regla específica para testing en `.claude/rules/testing.md`:

```markdown
---
globs: ["tests/**", "**/*.test.ts", "**/*.spec.ts"]
---

# Reglas para Tests

- Usar `describe` para agrupar tests por funcionalidad
- Cada `it` debe testear un solo comportamiento
- Nomenclatura: `it('should [acción esperada] when [condición]')`
- Usar factories o fixtures en vez de datos hardcodeados
- Mockear dependencias externas, nunca la unidad bajo test
- Incluir tests para casos edge y errores
- Mínimo 80% de cobertura por módulo nuevo
```

Crea una regla para componentes de API en `.claude/rules/api.md`:

```markdown
---
globs: ["src/presentation/**", "src/routes/**"]
---

# Reglas para API

- Validar inputs con esquemas (Zod o Joi)
- Respuestas siempre en formato JSON consistente
- Incluir códigos de estado HTTP apropiados
- Documentar endpoints con OpenAPI/Swagger
- Implementar rate limiting en endpoints públicos
```

### Paso 4: Activar memoria automática

En una sesión de Claude Code, activa la memoria:

```
/memory
```

Ejecuta varias tareas para que Claude registre información:

```
Analiza la estructura de este proyecto y recuerda los patrones principales
```

### Paso 5: Verificar creación de MEMORY.md

Inspecciona el archivo `MEMORY.md` generado:

```bash
cat CLAUDE.md
```

Verifica que contiene notas relevantes sobre el proyecto aprendidas durante la sesión.

### Paso 6: Probar que las reglas se aplican

Pide a Claude que genere código y verifica que respeta las reglas:

```
Crea una función en src/domain/calculator.ts que sume dos números,
con su test correspondiente en tests/calculator.test.ts
```

Verifica que el código generado sigue las convenciones de `CLAUDE.md` y que el test sigue las reglas de `.claude/rules/testing.md`.

### Paso 7: Iterar sobre CLAUDE.md

Basándote en la experiencia, ajusta el `CLAUDE.md` agregando reglas que falten o refinando las existentes.

## Verificación

- [ ] `CLAUDE.md` existe con reglas de estilo, comandos y convenciones
- [ ] `.claude/rules/testing.md` tiene path-scoping correcto
- [ ] `.claude/rules/api.md` tiene path-scoping correcto
- [ ] La memoria automática generó contenido en `MEMORY.md`
- [ ] El código generado por Claude respeta las reglas definidas

## Entrega

Documenta en un archivo `lab5-entrega.md`:
1. Contenido completo de `CLAUDE.md`
2. Contenido de cada archivo en `.claude/rules/`
3. Contenido de `MEMORY.md` generado
4. Ejemplo de código generado que demuestre cumplimiento de reglas
5. Ajustes realizados después de la primera iteración

## Criterios de evaluación

| Criterio | Puntos |
|----------|--------|
| CLAUDE.md completo y bien estructurado | 25 |
| Reglas modulares con path-scoping correcto | 25 |
| Memoria automática activada y funcional | 15 |
| Código generado cumple las reglas | 20 |
| Iteración y refinamiento documentado | 15 |
| **Total** | **100** |
