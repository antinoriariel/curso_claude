---
sidebar_position: 4
title: "Lab 4: Configuración de Settings"
description: "Configura settings.json a nivel global y de proyecto con permisos, hooks y variables"
tags: [laboratorio, settings, configuración, permisos, hooks]
---

# Lab 4: Configuración de Settings

## Objetivo

Configurar `settings.json` a nivel global y de proyecto, estableciendo permisos para comandos comunes, hooks básicos y variables de entorno. Verificar la configuración resultante.

## Prerrequisitos

- Claude Code instalado y autenticado (Lab 2 completado)
- Un proyecto Node.js con `package.json` (puede ser el del Lab 3)

## Duración estimada

30 minutos

## Pasos

### Paso 1: Explorar la configuración actual

Abre Claude Code y revisa la configuración existente:

```
/config
```

Documenta la configuración inicial como punto de partida.

### Paso 2: Configurar settings global

Edita el archivo de configuración global en `~/.claude/settings.json`:

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
      "Bash(rm -rf /)",
      "Bash(sudo *)"
    ]
  },
  "env": {
    "CLAUDE_CODE_MAX_TOKENS": "8192"
  }
}
```

### Paso 3: Configurar settings de proyecto

Crea el directorio `.claude/` en tu proyecto y el archivo de configuración:

```bash
mkdir -p .claude
```

Crea `.claude/settings.json` con configuración específica del proyecto:

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run dev)",
      "Bash(npx jest *)",
      "Bash(npx eslint *)"
    ]
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Archivo modificado - verificar cambios'"
          }
        ]
      }
    ]
  },
  "env": {
    "NODE_ENV": "development",
    "LOG_LEVEL": "debug"
  }
}
```

### Paso 4: Verificar la configuración combinada

Reinicia Claude Code en el directorio del proyecto y verifica:

```
/config
```

Confirma que se muestran tanto las configuraciones globales como las del proyecto. Documenta cómo se combinan ambas.

### Paso 5: Probar los permisos configurados

Ejecuta un comando permitido para verificar que no pide confirmación:

```
ejecuta npm test
```

Luego intenta un comando no permitido y observa la diferencia de comportamiento.

### Paso 6: Probar las variables de entorno

Verifica que las variables de entorno están disponibles:

```
muestra el valor de las variables de entorno NODE_ENV y LOG_LEVEL
```

### Paso 7: Documentar antes y después

Crea una comparación clara de la configuración:

**Antes (configuración por defecto):**
```json
{}
```

**Después (configuración personalizada):**
Incluye tanto el settings global como el de proyecto, explicando el propósito de cada sección.

## Verificación

- [ ] `~/.claude/settings.json` contiene permisos globales
- [ ] `.claude/settings.json` del proyecto contiene hooks y env
- [ ] `/config` muestra la configuración combinada
- [ ] Los comandos permitidos se ejecutan sin confirmación
- [ ] Las variables de entorno están accesibles

## Entrega

Documenta en un archivo `lab4-entrega.md`:
1. Contenido completo de ambos archivos `settings.json`
2. Salida de `/config` mostrando la configuración combinada
3. Evidencia de que los permisos funcionan correctamente
4. Explicación de la jerarquía de configuración (global vs. proyecto)
5. Comparación antes/después

## Criterios de evaluación

| Criterio | Puntos |
|----------|--------|
| Settings global correctamente configurado | 20 |
| Settings de proyecto con hooks y env | 25 |
| Permisos funcionando correctamente | 20 |
| Verificación con /config | 15 |
| Documentación antes/después | 20 |
| **Total** | **100** |
