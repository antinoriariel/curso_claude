---
sidebar_position: 3
title: "Lab 3: Flujo de Trabajo Básico"
description: "Domina los comandos esenciales de Claude Code en un flujo de trabajo completo"
tags: [laboratorio, flujo, init, status, model, compact, cost]
---

# Lab 3: Flujo de Trabajo Básico

## Objetivo

Ejecutar un flujo de trabajo completo con Claude Code: inicializar un proyecto, verificar estado, cambiar modelo, realizar una tarea de refactorización, compactar contexto y revisar costos.

## Prerrequisitos

- Claude Code instalado y autenticado (Lab 2 completado)
- Un proyecto de prueba con código JavaScript o TypeScript

## Duración estimada

35 minutos

## Pasos

### Paso 1: Crear un proyecto de prueba

Crea un proyecto sencillo para practicar:

```bash
mkdir ~/lab3-proyecto && cd ~/lab3-proyecto
git init
```

Crea un archivo `app.js` con código que necesite refactorización:

```javascript
// app.js - Código con oportunidades de mejora
function calcular(a,b,tipo) {
  if(tipo == "suma") { return a+b }
  if(tipo == "resta") { return a-b }
  if(tipo == "multiplicacion") { return a*b }
  if(tipo == "division") { if(b!=0) { return a/b } else { return "error" } }
  return null
}

var resultado1 = calcular(10, 5, "suma")
var resultado2 = calcular(10, 5, "resta")
console.log("Suma: " + resultado1)
console.log("Resta: " + resultado2)
```

### Paso 2: Inicializar con /init

Abre Claude Code en el directorio del proyecto:

```bash
cd ~/lab3-proyecto
claude
```

Dentro de la sesión interactiva, ejecuta:

```
/init
```

Observa el archivo `CLAUDE.md` generado. Documenta su contenido.

### Paso 3: Verificar estado con /status

```
/status
```

Documenta la información que muestra: modelo activo, autenticación, proyecto detectado.

### Paso 4: Cambiar a modelo rápido

Cambia a Haiku para tareas rápidas:

```
/model haiku
```

Verifica el cambio con `/status`. Documenta la diferencia de modelo.

### Paso 5: Ejecutar una tarea de refactorización

Pide a Claude que refactorice el código:

```
Refactoriza app.js: usa const/let en vez de var, cambia == por ===,
usa switch en lugar de if encadenados, agrega manejo de errores apropiado
y usa template literals para los console.log
```

Revisa los cambios propuestos y acepta o ajusta.

### Paso 6: Compactar el contexto

Después de la refactorización, compacta la conversación:

```
/compact
```

Observa cómo se reduce el contexto manteniendo la información esencial.

### Paso 7: Revisar costos de la sesión

```
/cost
```

Documenta:
- Tokens de entrada consumidos
- Tokens de salida generados
- Costo estimado de la sesión

### Paso 8: Cambiar de vuelta al modelo principal

```
/model sonnet
```

Ejecuta una tarea adicional para comparar velocidad y calidad:

```
Agrega JSDoc a todas las funciones en app.js
```

Ejecuta `/cost` nuevamente y compara con el costo anterior.

## Verificación

- [ ] `CLAUDE.md` fue creado exitosamente con `/init`
- [ ] `/status` muestra información correcta
- [ ] Cambiaste entre modelos Haiku y Sonnet
- [ ] La refactorización se completó correctamente
- [ ] `/compact` redujo el contexto
- [ ] `/cost` muestra el desglose de costos

## Entrega

Documenta en un archivo `lab3-entrega.md`:
1. Contenido del `CLAUDE.md` generado
2. Salida de `/status` antes y después de cambiar modelo
3. Código original vs. código refactorizado (diff)
4. Salida de `/cost` en ambos momentos
5. Comparación de experiencia entre Haiku y Sonnet

## Criterios de evaluación

| Criterio | Puntos |
|----------|--------|
| Uso correcto de /init y CLAUDE.md generado | 20 |
| Cambio de modelos documentado | 15 |
| Refactorización completada y de calidad | 25 |
| Uso de /compact y /cost | 20 |
| Documentación completa del flujo | 20 |
| **Total** | **100** |
