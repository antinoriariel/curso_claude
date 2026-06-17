---
sidebar_position: 6
title: "Lab 6: Implementación de Hooks"
description: "Crea hooks PreToolUse, PostToolUse y UserPromptSubmit para controlar el comportamiento del agente"
tags: [laboratorio, hooks, seguridad, automatización, settings]
---

# Lab 6: Implementación de Hooks

## Objetivo

Implementar hooks de diferentes tipos para controlar el comportamiento de Claude Code: bloquear comandos peligrosos con PreToolUse, ejecutar formateo automático con PostToolUse e inyectar contexto con UserPromptSubmit.

## Prerrequisitos

- Claude Code instalado y autenticado
- Proyecto Node.js con `package.json` y un formateador configurado (Prettier)
- Familiaridad con `settings.json` (Lab 4 completado)

## Duración estimada

45 minutos

## Pasos

### Paso 1: Preparar el proyecto

Asegúrate de tener un proyecto con Prettier configurado:

```bash
cd ~/lab6-proyecto
npm init -y
npm install --save-dev prettier
echo '{ "semi": true, "singleQuote": true }' > .prettierrc
```

Crea un archivo de ejemplo en `src/index.js`:

```javascript
function hello(name) {
    return "Hello, " + name
}
module.exports = { hello }
```

### Paso 2: Crear hook PreToolUse - Bloqueo de comandos peligrosos

Edita `.claude/settings.json` para agregar el hook de seguridad:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "node -e \"const input = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')); const cmd = input.tool_input?.command || ''; const blocked = ['rm -rf','dd if=','mkfs',':(){ :|:&','chmod -R 777 /']; const match = blocked.find(b => cmd.includes(b)); if(match) { const result = {decision:'block',reason:'Comando bloqueado por política de seguridad: '+match}; process.stdout.write(JSON.stringify(result)); } else { process.stdout.write(JSON.stringify({})); }\""
          }
        ]
      }
    ]
  }
}
```

### Paso 3: Crear hook PostToolUse - Formateo automático

Agrega el hook de formateo automático al mismo archivo `settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      "... (hook anterior)"
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "node -e \"const input = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')); const file = input.tool_input?.file_path || ''; if(file.match(/\\.(js|ts|jsx|tsx|json|css)$/)) { require('child_process').execSync('npx prettier --write ' + file, {stdio:'inherit'}); }\""
          }
        ]
      }
    ]
  }
}
```

### Paso 4: Crear hook UserPromptSubmit - Inyección de contexto

Agrega el hook que inyecta contexto de un ticket Jira. Crea primero un script auxiliar `scripts/inject-context.js`:

```javascript
const fs = require('fs');
const input = JSON.parse(fs.readFileSync('/dev/stdin', 'utf8'));
const prompt = input.prompt || '';

// Simular búsqueda de ticket Jira si se menciona
const ticketMatch = prompt.match(/[A-Z]+-\d+/);
if (ticketMatch) {
  const ticket = ticketMatch[0];
  const context = {
    additionalContext: `[Contexto del ticket ${ticket}]: ` +
      `Este ticket trata sobre mejoras de rendimiento. ` +
      `Prioridad: Alta. Sprint: 24.`
  };
  process.stdout.write(JSON.stringify(context));
} else {
  process.stdout.write(JSON.stringify({}));
}
```

Agrega el hook a `settings.json`:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node scripts/inject-context.js"
          }
        ]
      }
    ]
  }
}
```

### Paso 5: Archivo settings.json completo

Tu `.claude/settings.json` final debe verse así:

```json
{
  "permissions": {
    "allow": [
      "Bash(npm test)",
      "Bash(npm run *)",
      "Bash(npx prettier *)"
    ]
  },
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "node scripts/block-dangerous.js"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "node scripts/format-on-save.js"
          }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node scripts/inject-context.js"
          }
        ]
      }
    ]
  }
}
```

### Paso 6: Verificar hooks con /config

```
/config
```

Confirma que los tres hooks aparecen registrados correctamente.

### Paso 7: Probar cada hook

**Probar PreToolUse (bloqueo):**
```
ejecuta rm -rf /tmp/test
```
Debe ser bloqueado por el hook.

**Probar PostToolUse (formateo):**
```
modifica src/index.js agregando una nueva función
```
Verifica que el archivo queda formateado automáticamente.

**Probar UserPromptSubmit (contexto):**
```
Trabaja en el ticket PROJ-123 mejorando el rendimiento
```
Verifica que el contexto del ticket se inyecta.

## Verificación

- [ ] PreToolUse bloquea comandos peligrosos (rm -rf, dd)
- [ ] PostToolUse ejecuta Prettier después de ediciones
- [ ] UserPromptSubmit inyecta contexto de tickets
- [ ] `/config` muestra los tres hooks registrados
- [ ] Cada hook funciona según lo esperado

## Entrega

Documenta en un archivo `lab6-entrega.md`:
1. Archivo `settings.json` completo
2. Scripts auxiliares creados
3. Evidencia de cada hook funcionando (captura de terminal)
4. Explicación del flujo de cada hook

## Criterios de evaluación

| Criterio | Puntos |
|----------|--------|
| Hook PreToolUse funcional y seguro | 25 |
| Hook PostToolUse con formateo automático | 25 |
| Hook UserPromptSubmit con inyección de contexto | 25 |
| Verificación con /config | 10 |
| Documentación y explicaciones | 15 |
| **Total** | **100** |
