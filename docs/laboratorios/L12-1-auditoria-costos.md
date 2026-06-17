---
sidebar_position: 12
title: "Lab 12: Auditoría de Costos y Gobernanza"
description: "Audita costos de sesiones, implementa políticas de equipo, configura auto mode y diagnostica problemas"
tags: [laboratorio, costos, gobernanza, políticas, safe-mode, auditoría]
---

# Lab 12: Auditoría de Costos y Gobernanza

## Objetivo

Auditar los costos de sesiones complejas, implementar políticas de configuración administrada para un equipo, configurar auto mode con reglas ask/deny y usar safe mode para diagnosticar problemas de configuración.

## Prerrequisitos

- Claude Code instalado y autenticado
- Historial de sesiones previas (labs anteriores completados)
- Acceso a configuración de equipo (plan Team o Enterprise, o simulación)

## Duración estimada

40 minutos

## Pasos

### Paso 1: Auditar costos de una sesión compleja

Ejecuta una sesión con múltiples tareas para generar consumo medible:

```bash
cd ~/lab12-proyecto
claude
```

Dentro de la sesión, ejecuta tareas variadas:

```
Explora la estructura de este proyecto, identifica los 5 archivos más
complejos, sugiere refactorizaciones y genera tests para el archivo principal.
```

Al finalizar, revisa los costos:

```
/cost
```

Documenta detalladamente:
- Total de tokens de entrada
- Total de tokens de salida
- Tokens de caché (si aplica)
- Costo estimado en USD
- Número de llamadas a herramientas

### Paso 2: Comparar costos entre modelos

Ejecuta la misma tarea con diferentes modelos para comparar:

**Con Haiku:**
```
/model haiku
```
Ejecuta la tarea y registra `/cost`.

**Con Sonnet:**
```
/model sonnet
```
Ejecuta la misma tarea y registra `/cost`.

Crea una tabla comparativa:

| Métrica | Haiku | Sonnet |
|---------|-------|--------|
| Tokens entrada | | |
| Tokens salida | | |
| Costo estimado | | |
| Calidad percibida (1-5) | | |
| Tiempo de respuesta | | |

### Paso 3: Implementar configuración administrada (Managed Settings)

Crea un archivo de políticas que simule una configuración empresarial. Este archivo representa lo que un administrador desplegaría para su equipo.

Crea `managed-settings.json`:

```json
{
  "permissions": {
    "allow": [
      "Bash(npm test)",
      "Bash(npm run build)",
      "Bash(npm run lint)",
      "Bash(git status)",
      "Bash(git diff)",
      "Bash(git log)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(sudo *)",
      "Bash(curl * | bash)",
      "Bash(wget * | bash)",
      "Bash(npm publish)",
      "Bash(git push --force)"
    ]
  },
  "env": {
    "CLAUDE_CODE_MAX_TOKENS": "4096",
    "CLAUDE_CODE_DISABLE_AUTO_APPROVE": "true"
  }
}
```

Documenta el propósito de cada regla:
- **allow**: Comandos seguros que el equipo necesita frecuentemente
- **deny**: Operaciones peligrosas que nunca deben ejecutarse automáticamente

### Paso 4: Configurar auto mode con reglas ask/deny

Configura el comportamiento automático en `.claude/settings.json`:

```json
{
  "permissions": {
    "allow": [
      "Read(*)",
      "Glob(*)",
      "Grep(*)",
      "Bash(npm test)",
      "Bash(npm run lint)"
    ],
    "deny": [
      "Bash(rm *)",
      "Bash(git push *)",
      "Write(*.env)",
      "Write(*credentials*)"
    ]
  }
}
```

Explica la estrategia de permisos:
- **allow**: Operaciones de solo lectura y comandos de CI seguros se aprueban automáticamente
- **deny**: Operaciones destructivas y escritura de archivos sensibles se bloquean siempre
- **ask** (implícito): Todo lo demás requiere confirmación del usuario

### Paso 5: Probar las reglas configuradas

Ejecuta operaciones que prueben cada categoría:

**Operación auto-aprobada (allow):**
```
Lee el archivo package.json y ejecuta npm test
```

**Operación bloqueada (deny):**
```
Elimina todos los archivos temporales con rm -rf /tmp/*
```

**Operación que requiere confirmación (ask):**
```
Crea un nuevo archivo src/nuevo-modulo.js con una función de utilidad
```

Documenta el comportamiento en cada caso.

### Paso 6: Diagnosticar con safe mode

Simula un problema de configuración. Introduce un error intencional en la configuración:

```json
{
  "permissions": {
    "allow": ["Bash(npm test)"],
    "deny": ["Bash(npm test)"]
  }
}
```

Ejecuta Claude Code en modo seguro para diagnosticar:

```bash
claude --safe-mode
```

Dentro del modo seguro:
- Verifica qué configuraciones están activas
- Identifica conflictos entre allow y deny
- Revisa la jerarquía de configuración aplicada
- Confirma que las reglas se resuelven correctamente

### Paso 7: Crear reporte de gobernanza

Produce un reporte completo de gobernanza para tu equipo:

```markdown
## Reporte de Gobernanza - Claude Code

### Política de Permisos
- Comandos auto-aprobados: [lista]
- Comandos bloqueados: [lista]
- Comandos que requieren aprobación: [criterio]

### Análisis de Costos
- Costo promedio por sesión: $X.XX
- Modelo recomendado para tareas rutinarias: Haiku
- Modelo recomendado para tareas complejas: Sonnet
- Presupuesto mensual estimado por desarrollador: $X.XX

### Configuración de Seguridad
- Hooks activos: [lista]
- Restricciones de archivos: [lista]
- Auditoría de sesiones: [frecuencia]
```

## Verificación

- [ ] Auditaste costos de al menos una sesión compleja
- [ ] Comparaste costos entre Haiku y Sonnet
- [ ] Configuraste managed settings con allow y deny
- [ ] Probaste reglas de auto mode (allow/deny/ask)
- [ ] Ejecutaste safe mode para diagnosticar un problema
- [ ] Generaste el reporte de gobernanza

## Entrega

Documenta en un archivo `lab12-entrega.md`:
1. Tabla de costos comparativa entre modelos
2. Archivo managed-settings.json completo con justificaciones
3. Configuración de auto mode con reglas ask/deny
4. Resultado del diagnóstico con safe mode
5. Reporte de gobernanza completo

## Criterios de evaluación

| Criterio | Puntos |
|----------|--------|
| Auditoría de costos detallada | 20 |
| Comparación de costos entre modelos | 15 |
| Managed settings con políticas justificadas | 20 |
| Auto mode con reglas ask/deny funcionales | 20 |
| Diagnóstico con safe mode | 10 |
| Reporte de gobernanza completo | 15 |
| **Total** | **100** |
