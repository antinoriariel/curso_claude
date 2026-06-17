---
sidebar_position: 2
title: "Lab 2: Instalación Completa de Claude Code"
description: "Instala, autentica y verifica Claude Code en tu entorno de desarrollo"
tags: [laboratorio, instalación, configuración, doctor]
---

# Lab 2: Instalación Completa de Claude Code

## Objetivo

Realizar la instalación completa de Claude Code, autenticarse mediante OAuth, ejecutar diagnósticos y resolver cualquier advertencia para tener un entorno funcional.

## Prerrequisitos

- Node.js 18 o superior instalado
- npm disponible en PATH
- Cuenta de Anthropic activa (plan Pro, Team o Enterprise)
- Terminal con permisos de administrador (si es necesario)

## Duración estimada

20 minutos

## Pasos

### Paso 1: Verificar requisitos del sistema

Confirma que tienes las versiones correctas:

```bash
node --version    # Debe ser >= 18.0.0
npm --version     # Debe ser >= 8.0.0
git --version     # Recomendado para funcionalidad completa
```

Si Node.js no está instalado o es una versión antigua, actualízalo desde [nodejs.org](https://nodejs.org).

### Paso 2: Instalar Claude Code globalmente

```bash
npm install -g @anthropic-ai/claude-code
```

Verifica la instalación:

```bash
claude --version
```

### Paso 3: Autenticarse con OAuth

Inicia el proceso de autenticación:

```bash
claude
```

Selecciona la opción de autenticación OAuth cuando se presente. Se abrirá tu navegador para completar el flujo de autorización. Sigue las instrucciones en pantalla para vincular tu cuenta de Anthropic.

### Paso 4: Ejecutar diagnóstico

Una vez autenticado, ejecuta el diagnóstico completo:

```bash
/doctor
```

Este comando verifica:
- Conexión con la API de Anthropic
- Permisos del sistema de archivos
- Configuración de Git
- Versiones de dependencias

### Paso 5: Resolver advertencias

Si `/doctor` reporta advertencias, resuélvelas. Problemas comunes:

**Git no configurado:**
```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

**Permisos insuficientes (Linux/macOS):**
```bash
chmod +x $(which claude)
```

**Proxy corporativo:**
```bash
export HTTPS_PROXY=http://proxy.empresa.com:8080
```

### Paso 6: Verificar funcionalidad básica

Ejecuta un comando simple para confirmar que todo funciona:

```bash
claude -p "di hola y confirma que estás funcionando correctamente"
```

### Paso 7: Documentar el proceso

Captura la salida de cada paso. Guarda capturas de pantalla o copia la salida del terminal para los siguientes puntos:
- Versiones instaladas (Paso 1)
- Resultado de la instalación (Paso 2)
- Confirmación de autenticación (Paso 3)
- Salida completa de `/doctor` (Paso 4)
- Resolución de advertencias si las hubo (Paso 5)

## Verificación

- [ ] `claude --version` muestra una versión válida
- [ ] La autenticación OAuth se completó exitosamente
- [ ] `/doctor` no muestra errores críticos
- [ ] `claude -p` responde correctamente
- [ ] Documentaste cada paso con evidencia

## Entrega

Documenta en un archivo `lab2-entrega.md`:
1. Capturas o salida del terminal de cada paso
2. Versiones instaladas de Node.js, npm y Claude Code
3. Resultado completo de `/doctor`
4. Problemas encontrados y cómo los resolviste (si aplica)

## Criterios de evaluación

| Criterio | Puntos |
|----------|--------|
| Instalación exitosa verificada | 25 |
| Autenticación OAuth completada | 25 |
| Diagnóstico /doctor sin errores | 20 |
| Documentación del proceso | 20 |
| Resolución de advertencias (si aplica) | 10 |
| **Total** | **100** |
