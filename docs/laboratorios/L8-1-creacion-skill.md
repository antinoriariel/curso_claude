---
sidebar_position: 8
title: "Lab 8: Creación de Skills"
description: "Crea un skill de code-review, instala skills del marketplace y combina con MCP para revisión de PRs"
tags: [laboratorio, skills, code-review, marketplace, automatización]
---

# Lab 8: Creación de Skills

## Objetivo

Construir un skill de "code-review" que analice diffs, ejecute lint, verifique cobertura de tests y sugiera mejoras. Instalar un skill del marketplace y combinarlo con MCP de GitHub para revisión automatizada de PRs.

## Prerrequisitos

- Claude Code instalado y autenticado
- Servidor MCP de GitHub conectado (Lab 7 completado)
- Proyecto Node.js con ESLint y Jest configurados
- Repositorio en GitHub con al menos un PR abierto

## Duración estimada

50 minutos

## Pasos

### Paso 1: Preparar el proyecto con herramientas de calidad

Asegúrate de tener ESLint y Jest configurados:

```bash
cd ~/lab8-proyecto
npm init -y
npm install --save-dev eslint jest @eslint/js
npx eslint --init
```

Crea un archivo `src/utils.js` con código que tenga problemas detectables:

```javascript
function processData(data) {
  var result = []
  for (var i = 0; i < data.length; i++) {
    if (data[i] != null) {
      result.push(data[i] * 2)
    }
  }
  return result
}
module.exports = { processData }
```

### Paso 2: Crear el archivo SKILL.md

Crea el directorio del skill y su archivo de definición:

```bash
mkdir -p .claude/skills
```

Crea `.claude/skills/code-review.md`:

```markdown
---
name: code-review
description: Analiza código, ejecuta lint, verifica cobertura y sugiere mejoras
tags: [review, calidad, lint, tests]
---

# Skill: Code Review Automatizado

## Instrucciones

Cuando el usuario pida una revisión de código, sigue estos pasos en orden:

### 1. Analizar el Diff
- Ejecuta `git diff` para obtener los cambios pendientes
- Si se especifica un PR, usa `git diff main...HEAD`
- Identifica archivos modificados y tipo de cambios

### 2. Ejecutar Lint
- Ejecuta `npx eslint {archivos_modificados}` sobre los archivos cambiados
- Reporta errores y advertencias encontradas
- Clasifica por severidad: error, warning, info

### 3. Verificar Tests
- Ejecuta `npx jest --coverage --changedSince=main` para tests de archivos modificados
- Reporta cobertura actual vs. umbral mínimo (80%)
- Identifica funciones sin cobertura de tests

### 4. Análisis de Calidad
Revisa cada archivo modificado buscando:
- Funciones con complejidad ciclomática alta (más de 10)
- Código duplicado
- Variables sin usar
- Imports innecesarios
- Manejo de errores faltante
- Nombres poco descriptivos

### 5. Generar Reporte
Produce un reporte estructurado con:

```
## Reporte de Code Review

### Resumen
- Archivos revisados: N
- Problemas de lint: N errores, N warnings
- Cobertura de tests: X%

### Problemas Encontrados
| Severidad | Archivo | Línea | Descripción |
|-----------|---------|-------|-------------|
| ...       | ...     | ...   | ...         |

### Sugerencias de Mejora
1. ...
2. ...

### Veredicto
[APROBADO | CAMBIOS REQUERIDOS | BLOQUEADO]
```
```

### Paso 3: Probar el skill localmente

En una sesión de Claude Code, invoca el skill:

```
/code-review
```

O de forma manual:

```
Ejecuta una revisión de código completa del proyecto actual
```

Verifica que sigue los pasos definidos en el SKILL.md.

### Paso 4: Instalar un skill del marketplace

Busca e instala un skill disponible:

```bash
claude skill search "testing"
```

Instala un skill que complemente tu flujo:

```bash
claude skill install @ejemplo/skill-test-generator
```

### Paso 5: Combinar skill con MCP de GitHub

Usa el skill de code-review junto con las herramientas MCP de GitHub para revisar un PR real:

```
Revisa el PR #1 del repositorio mi-usuario/mi-repo usando
el skill de code-review y comenta los hallazgos en el PR
```

Esto debe:
1. Obtener el diff del PR vía MCP de GitHub
2. Ejecutar el análisis del skill de code-review
3. Publicar comentarios en el PR usando la herramienta MCP

### Paso 6: Refinar el skill

Basándote en los resultados, ajusta el `SKILL.md`:
- Agrega reglas específicas que falten
- Ajusta umbrales de calidad
- Mejora el formato del reporte

### Paso 7: Crear un segundo skill complementario

Crea `.claude/skills/pre-commit-check.md`:

```markdown
---
name: pre-commit-check
description: Verificación rápida antes de hacer commit
tags: [pre-commit, verificación, calidad]
---

# Skill: Pre-Commit Check

## Instrucciones

Ejecuta verificaciones rápidas antes de un commit:

1. Ejecuta `git diff --cached --stat` para ver archivos staged
2. Ejecuta lint solo en archivos staged
3. Ejecuta tests relacionados con los archivos modificados
4. Verifica que no hay `console.log` o `debugger` en el código
5. Confirma que los mensajes de commit siguen Conventional Commits

Reporta: LISTO PARA COMMIT o PROBLEMAS DETECTADOS con detalles.
```

## Verificación

- [ ] El skill `code-review` existe en `.claude/skills/code-review.md`
- [ ] El skill ejecuta lint, tests y análisis de calidad
- [ ] Se instaló un skill del marketplace
- [ ] El skill funciona combinado con MCP de GitHub en un PR real
- [ ] El reporte generado tiene el formato correcto

## Entrega

Documenta en un archivo `lab8-entrega.md`:
1. Contenido completo de `code-review.md`
2. Reporte generado por el skill en una revisión real
3. Skill del marketplace instalado y su funcionalidad
4. Evidencia de revisión de PR combinando skill + MCP
5. Refinamientos realizados al skill

## Criterios de evaluación

| Criterio | Puntos |
|----------|--------|
| Skill code-review completo y funcional | 30 |
| Integración con lint y tests | 20 |
| Skill del marketplace instalado | 10 |
| Combinación skill + MCP en PR real | 25 |
| Documentación y refinamientos | 15 |
| **Total** | **100** |
