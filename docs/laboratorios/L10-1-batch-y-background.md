---
sidebar_position: 10
title: "Lab 10: Batch y Background"
description: "Ejecuta migraciones en batch, lanza sesiones en background y monitorea con Agent View"
tags: [laboratorio, batch, background, migración, paralelismo]
---

# Lab 10: Batch y Background

## Objetivo

Usar el modo batch para migrar imports CommonJS a ESM en un proyecto, lanzar sesiones en background con diferentes tareas y monitorear su progreso.

## Prerrequisitos

- Claude Code instalado y autenticado
- Proyecto Node.js con múltiples archivos usando `require()` (CommonJS)
- Familiaridad con la diferencia entre CommonJS y ESM

## Duración estimada

45 minutos

## Pasos

### Paso 1: Crear proyecto con archivos CommonJS

Prepara un proyecto con múltiples archivos usando `require()`:

```bash
mkdir -p ~/lab10-proyecto/src && cd ~/lab10-proyecto
git init && npm init -y
```

Crea `src/logger.js`:

```javascript
const chalk = require('chalk');
const fs = require('fs');

function log(message) {
  const timestamp = new Date().toISOString();
  console.log(chalk.green(`[${timestamp}] ${message}`));
  fs.appendFileSync('app.log', `${timestamp}: ${message}\n`);
}

module.exports = { log };
```

Crea `src/config.js`:

```javascript
const path = require('path');
const fs = require('fs');

function loadConfig() {
  const configPath = path.join(__dirname, '../config.json');
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }
  return { port: 3000, env: 'development' };
}

module.exports = { loadConfig };
```

Crea `src/app.js`:

```javascript
const express = require('express');
const { log } = require('./logger');
const { loadConfig } = require('./config');

const config = loadConfig();
const app = express();

app.get('/', (req, res) => {
  log('Request received');
  res.json({ status: 'ok' });
});

module.exports = app;
```

Crea `src/index.js`:

```javascript
const app = require('./app');
const { log } = require('./logger');
const { loadConfig } = require('./config');

const config = loadConfig();
app.listen(config.port, () => {
  log(`Server running on port ${config.port}`);
});
```

### Paso 2: Ejecutar migración en batch

Usa el modo print para procesar la migración de todos los archivos:

```bash
claude -p "Migra todos los archivos .js en src/ de CommonJS (require/module.exports) a ESM (import/export). Actualiza también package.json agregando type: module. Mantén la funcionalidad idéntica."
```

Revisa los cambios propuestos antes de aceptar.

### Paso 3: Verificar la migración

Comprueba que los archivos fueron migrados correctamente:

```bash
git diff
```

Verifica que:
- `require()` se convirtió a `import`
- `module.exports` se convirtió a `export`
- `package.json` tiene `"type": "module"`
- Las rutas relativas incluyen extensión `.js`

### Paso 4: Lanzar sesiones en background

Abre tres sesiones en background con tareas diferentes:

**Sesión 1 - Documentación:**
```bash
claude -p "Genera documentación JSDoc para todas las funciones en src/" &
```

**Sesión 2 - Tests:**
```bash
claude -p "Crea tests unitarios con Jest para cada módulo en src/" &
```

**Sesión 3 - Análisis de seguridad:**
```bash
claude -p "Analiza el código en src/ buscando vulnerabilidades de seguridad y genera un reporte" &
```

### Paso 5: Monitorear las sesiones

Usa Claude para verificar las sesiones activas:

```bash
claude sessions list
```

Observa el estado de cada sesión: en progreso, completada o con errores.

### Paso 6: Re-conectarse a una sesión completada

Una vez que una sesión termine, reconéctate para ver los resultados:

```bash
claude sessions resume <session-id>
```

Revisa la salida completa de la sesión y los archivos generados.

### Paso 7: Comparar resultados

Documenta los resultados de cada sesión en background:

| Sesión | Tarea | Duración | Archivos generados | Resultado |
|--------|-------|----------|-------------------|-----------|
| 1 | Documentación | X min | N archivos | Exitoso/Fallido |
| 2 | Tests | X min | N archivos | Exitoso/Fallido |
| 3 | Seguridad | X min | 1 reporte | Exitoso/Fallido |

### Paso 8: Consolidar cambios

Revisa todos los cambios generados por las sesiones en background:

```bash
git status
git diff
```

Haz commit de los cambios válidos, descartando lo que no sea necesario.

## Verificación

- [ ] La migración CommonJS a ESM se completó correctamente
- [ ] Se lanzaron 3 sesiones en background exitosamente
- [ ] Se monitorearon las sesiones activas
- [ ] Se reconectó a al menos una sesión completada
- [ ] Los resultados de cada sesión son válidos

## Entrega

Documenta en un archivo `lab10-entrega.md`:
1. Diff de la migración CommonJS a ESM
2. Evidencia de las 3 sesiones en background lanzadas
3. Tabla comparativa de resultados
4. Salida de `sessions list` mostrando estados
5. Resultados consolidados de las sesiones

## Criterios de evaluación

| Criterio | Puntos |
|----------|--------|
| Migración batch CJS a ESM correcta | 30 |
| Sesiones en background lanzadas | 20 |
| Monitoreo de sesiones documentado | 15 |
| Re-conexión a sesión completada | 15 |
| Documentación y tabla comparativa | 20 |
| **Total** | **100** |
