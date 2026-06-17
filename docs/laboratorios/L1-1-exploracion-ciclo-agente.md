---
sidebar_position: 1
title: "Lab 1: Exploración del Ciclo del Agente"
description: "Observa y documenta el ciclo completo del agente de Claude Code en acción"
tags: [laboratorio, agente, ciclo, observación]
---

# Lab 1: Exploración del Ciclo del Agente

## Objetivo

Observar el ciclo completo del agente de Claude Code (prompt → selección de herramienta → resultado → siguiente acción) ejecutando una exploración sobre un repositorio conocido y documentando cada paso del proceso.

## Prerrequisitos

- Claude Code instalado y autenticado
- Un repositorio Git clonado localmente (puede ser propio o público)
- Terminal con capacidad de copiar salida

## Duración estimada

30 minutos

## Pasos

### Paso 1: Preparar el repositorio de prueba

Clona un repositorio público si no tienes uno disponible:

```bash
git clone https://github.com/expressjs/express.git ~/lab1-repo
cd ~/lab1-repo
```

### Paso 2: Ejecutar la exploración con modo print

Ejecuta Claude Code en modo no interactivo para observar el ciclo completo:

```bash
claude -p "explora este proyecto y dame un resumen de su arquitectura"
```

Observa la salida completa. Identifica cada momento en que el agente:
- Selecciona una herramienta (Read, Grep, Glob, Bash, etc.)
- Recibe un resultado
- Decide la siguiente acción

### Paso 3: Ejecutar con verbose para más detalle

Repite la exploración con salida detallada:

```bash
claude -p "explora este proyecto, identifica los archivos principales y describe la estructura" --verbose
```

### Paso 4: Documentar el ciclo observado

Crea una tabla documentando cada iteración del ciclo del agente. Usa este formato:

| # | Prompt/Decisión del Agente | Herramienta Seleccionada | Entrada de la Herramienta | Resultado Obtenido | Siguiente Acción |
|---|---------------------------|-------------------------|--------------------------|--------------------|--------------------|
| 1 | Explorar estructura | Glob | `**/*` | Lista de archivos | Leer package.json |
| 2 | Entender dependencias | Read | `package.json` | Contenido del archivo | Buscar entry point |
| ... | ... | ... | ... | ... | ... |

### Paso 5: Identificar patrones del agente

Responde estas preguntas basándote en tu observación:

1. ¿Cuántas iteraciones del ciclo realizó el agente?
2. ¿Qué herramienta fue la más utilizada?
3. ¿Hubo algún momento donde el agente cambió de estrategia?
4. ¿En qué orden exploró el proyecto? ¿Fue lógico?

### Paso 6: Comparar con un prompt diferente

Ejecuta una segunda exploración con un prompt distinto:

```bash
claude -p "¿qué patrones de diseño usa este proyecto?"
```

Documenta las diferencias en el comportamiento del agente comparado con el Paso 2.

### Paso 7: Crear diagrama del ciclo

Dibuja o describe un diagrama de flujo que represente el ciclo general:

```
Usuario envía prompt
    ↓
Agente analiza el contexto
    ↓
¿Necesita más información? → Sí → Selecciona herramienta → Ejecuta → Recibe resultado ↩
    ↓ No
Genera respuesta final
```

## Verificación

- [ ] Ejecutaste al menos 2 exploraciones con prompts diferentes
- [ ] Completaste la tabla con mínimo 5 iteraciones del ciclo
- [ ] Identificaste las herramientas más utilizadas
- [ ] Comparaste el comportamiento con prompts distintos
- [ ] Creaste el diagrama de flujo del ciclo

## Entrega

Documenta en un archivo `lab1-entrega.md`:
1. La tabla completa del ciclo del agente (mínimo 5 filas)
2. Respuestas a las preguntas del Paso 5
3. Comparación entre los dos prompts diferentes
4. Diagrama del ciclo del agente

## Criterios de evaluación

| Criterio | Puntos |
|----------|--------|
| Tabla del ciclo completa y precisa | 30 |
| Identificación correcta de herramientas | 20 |
| Análisis de patrones del agente | 20 |
| Comparación entre prompts | 15 |
| Diagrama del ciclo | 15 |
| **Total** | **100** |
