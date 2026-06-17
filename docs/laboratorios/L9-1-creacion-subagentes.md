---
sidebar_position: 9
title: "Lab 9: Creación de Subagentes"
description: "Construye subagentes especializados con permisos restringidos y regístralos en AGENTS.md"
tags: [laboratorio, subagentes, delegación, AGENTS.md, permisos]
---

# Lab 9: Creación de Subagentes

## Objetivo

Construir dos subagentes especializados: un explorador de código (solo lectura, modelo Haiku) y un ejecutor de tests (acceso a Bash limitado). Registrarlos en `AGENTS.md` y ejecutar tareas delegadas.

## Prerrequisitos

- Claude Code instalado y autenticado
- Proyecto con código fuente y tests (puede ser el de labs anteriores)
- Familiaridad con CLAUDE.md y configuración de permisos

## Duración estimada

45 minutos

## Pasos

### Paso 1: Preparar el proyecto con estructura de tests

Asegúrate de tener un proyecto con tests ejecutables:

```bash
mkdir -p ~/lab9-proyecto/{src,tests}
cd ~/lab9-proyecto && git init && npm init -y
npm install --save-dev jest
```

Crea `src/math.js`:

```javascript
function factorial(n) {
  if (n < 0) throw new Error('Número negativo');
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

function fibonacci(n) {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

module.exports = { factorial, fibonacci };
```

Crea `tests/math.test.js`:

```javascript
const { factorial, fibonacci } = require('../src/math');

describe('factorial', () => {
  test('calcula factorial de 5', () => {
    expect(factorial(5)).toBe(120);
  });
  test('factorial de 0 es 1', () => {
    expect(factorial(0)).toBe(1);
  });
  test('lanza error con número negativo', () => {
    expect(() => factorial(-1)).toThrow('Número negativo');
  });
});

describe('fibonacci', () => {
  test('fibonacci de 6 es 8', () => {
    expect(fibonacci(6)).toBe(8);
  });
  test('fibonacci de 0 es 0', () => {
    expect(fibonacci(0)).toBe(0);
  });
});
```

### Paso 2: Definir el subagente "codebase-explorer"

Crea el archivo `AGENTS.md` en la raíz del proyecto:

```markdown
# Subagentes del Proyecto

## codebase-explorer

**Descripción:** Agente de solo lectura para explorar y analizar el código fuente.

**Modelo:** Haiku (rápido, económico)

**Permisos:**
- Herramientas permitidas: Read, Glob, Grep
- Sin acceso a Bash, Edit ni Write
- Solo lectura, no puede modificar archivos

**Instrucciones:**
- Analiza la estructura del proyecto sin modificar nada
- Responde preguntas sobre la arquitectura del código
- Identifica patrones, dependencias y relaciones entre módulos
- Genera reportes de estructura y complejidad
- Siempre reporta hallazgos al agente principal

**Cuándo usar:**
- Para entender la estructura antes de hacer cambios
- Para buscar dónde se define o se usa una función
- Para generar mapas del código fuente
```

### Paso 3: Definir el subagente "test-executor"

Agrega al mismo `AGENTS.md`:

```markdown
## test-executor

**Descripción:** Agente especializado en ejecutar y analizar resultados de tests.

**Modelo:** Sonnet

**Permisos:**
- Herramientas permitidas: Bash (solo pytest, jest, npm test), Read, Glob
- Comandos Bash permitidos: `npx jest*`, `npm test*`, `npm run test*`
- Sin acceso a Edit ni Write
- No puede modificar código, solo ejecutar tests

**Instrucciones:**
- Ejecuta la suite de tests completa o tests específicos
- Analiza resultados: tests pasados, fallidos, saltados
- Reporta cobertura de código si está disponible
- Identifica tests frágiles o lentos
- Sugiere tests faltantes basándose en el análisis de cobertura
- Retorna un resumen estructurado al agente principal

**Cuándo usar:**
- Antes de un commit para verificar que no se rompe nada
- Para analizar la cobertura de tests
- Para ejecutar tests específicos de un módulo
- Para diagnosticar tests que fallan
```

### Paso 4: Ejecutar el subagente explorador

En una sesión de Claude Code, delega una tarea al explorador:

```
Usa el subagente codebase-explorer para analizar la estructura
completa de este proyecto. Necesito un mapa de todos los módulos,
sus exports y las dependencias entre ellos.
```

Observa cómo el agente principal delega la tarea y recibe los resultados.

### Paso 5: Ejecutar el subagente de tests

Delega la ejecución de tests:

```
Usa el subagente test-executor para ejecutar todos los tests
del proyecto, reportar cobertura y identificar áreas sin tests.
```

Documenta:
- Qué comandos ejecutó el subagente
- Los resultados de los tests
- El reporte de cobertura

### Paso 6: Combinar ambos subagentes

Ejecuta una tarea que requiera ambos subagentes:

```
Primero usa codebase-explorer para identificar todas las funciones
en src/. Luego usa test-executor para verificar cuáles tienen tests
y cuáles no. Dame un reporte combinado.
```

### Paso 7: Verificar aislamiento de permisos

Confirma que los subagentes respetan sus restricciones. Intenta que el explorador modifique un archivo:

```
Pide al codebase-explorer que corrija un bug en src/math.js
```

Debe rechazar la operación porque solo tiene permisos de lectura.

## Verificación

- [ ] `AGENTS.md` contiene definiciones de ambos subagentes
- [ ] El subagente codebase-explorer funciona en modo solo lectura
- [ ] El subagente test-executor ejecuta tests correctamente
- [ ] Los subagentes respetan sus restricciones de permisos
- [ ] La combinación de subagentes produce un reporte útil

## Entrega

Documenta en un archivo `lab9-entrega.md`:
1. Contenido completo de `AGENTS.md`
2. Resultados de la exploración del codebase-explorer
3. Resultados de la ejecución de tests del test-executor
4. Reporte combinado de ambos subagentes
5. Evidencia de que los permisos se respetan

## Criterios de evaluación

| Criterio | Puntos |
|----------|--------|
| AGENTS.md con definiciones completas | 20 |
| Subagente codebase-explorer funcional | 20 |
| Subagente test-executor funcional | 20 |
| Combinación exitosa de subagentes | 20 |
| Verificación de aislamiento de permisos | 10 |
| Documentación completa | 10 |
| **Total** | **100** |
