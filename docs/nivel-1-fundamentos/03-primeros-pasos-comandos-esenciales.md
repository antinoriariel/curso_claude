---
sidebar_position: 3
title: "Capitulo 3: Primeros Pasos — Sesiones y Comandos Esenciales"
description: Navegacion en modo interactivo, comandos slash fundamentales, atajos de teclado y flujo de trabajo basico.
tags: [claude-code, comandos, sesiones, flujo-de-trabajo]
---

# Capitulo 3: Primeros Pasos — Sesiones y Comandos Esenciales

Con Claude Code instalado y configurado, es momento de aprender a navegar su interfaz interactiva y dominar los comandos fundamentales. Este capitulo establece las bases operativas que usaras en cada sesion de trabajo.

---

## 3.1 Navegacion en modo interactivo

Claude Code opera principalmente en modo interactivo a traves de una interfaz REPL (Read-Eval-Print Loop). Comprender como navegar esta interfaz es esencial para trabajar de forma eficiente.

### Iniciar una sesion

```bash
# Iniciar en el directorio actual
claude

# Iniciar con un mensaje directo (modo one-shot parcial)
claude "explica la estructura de este proyecto"

# Continuar la ultima sesion
claude --continue

# Continuar con un mensaje adicional
claude --continue "ahora agrega tests para ese modulo"

# Iniciar una sesion con un modelo especifico
claude --model claude-sonnet-4-20250514
```

### Entrada multilinea

Para escribir instrucciones que abarcan varias lineas, usa **Shift+Enter** para crear saltos de linea sin enviar el mensaje:

```
> Necesito que hagas lo siguiente:        ← Shift+Enter
  1. Crear un archivo utils.ts            ← Shift+Enter
  2. Agregar una funcion de validacion     ← Shift+Enter
  3. Escribir tests unitarios              ← Enter (envia)
```

:::tip[Cuando usar multilinea]
La entrada multilinea es especialmente util cuando das instrucciones complejas con multiples pasos o cuando pegas fragmentos de codigo como contexto para tu pregunta.
:::

### Autocompletado con Tab

Claude Code soporta autocompletado basico con la tecla **Tab** en ciertos contextos:

- **Nombres de archivos**: Al referenciar archivos en tu instruccion.
- **Comandos slash**: Al escribir `/` seguido de Tab, se muestran los comandos disponibles.

### Historial de sesiones

Claude Code mantiene un historial de sesiones anteriores que puedes consultar y retomar:

```bash
# Listar sesiones anteriores
claude --list

# Retomar una sesion especifica por ID
claude --resume <session-id>

# Continuar la sesion mas reciente
claude --continue
```

### Ejemplo de sesion interactiva

```
> que archivos hay en el directorio src/

Claude: Voy a listar los archivos en el directorio src/.
  src/
  ├── index.ts
  ├── utils/
  │   ├── validation.ts
  │   └── helpers.ts
  └── tests/
      └── validation.test.ts

> agrega una funcion formatDate en utils/helpers.ts

Claude: Voy a agregar la funcion formatDate al archivo.
  [archivo modificado: src/utils/helpers.ts]
  + export function formatDate(date: Date): string {
  +   return date.toISOString().split('T')[0];
  + }
```

---

## 3.2 Comandos slash fundamentales

Los comandos slash son instrucciones especiales que controlan el comportamiento de Claude Code. Se escriben con el prefijo `/` y no se envian al modelo como parte de la conversacion.

### Comandos de informacion

| Comando | Descripcion | Uso tipico |
|---|---|---|
| `/help` | Muestra la ayuda completa con todos los comandos disponibles | Consultar comandos que no recuerdas |
| `/status` | Muestra el estado actual de la sesion | Verificar modelo activo, tokens usados, contexto |
| `/cost` | Muestra el costo acumulado de la sesion | Monitorear el gasto durante sesiones largas |
| `/version` | Muestra la version de Claude Code | Verificar que tienes la version correcta |

### Comandos de gestion de sesion

| Comando | Descripcion | Uso tipico |
|---|---|---|
| `/clear` | Limpia el historial de la conversacion actual | Comenzar una nueva linea de trabajo sin salir |
| `/compact` | Compacta el contexto, resumiendo la conversacion | Liberar ventana de contexto en sesiones largas |
| `/model` | Cambia el modelo de IA utilizado | Alternar entre modelos segun la tarea |
| `/effort` | Ajusta el nivel de esfuerzo del modelo | Respuestas rapidas (low) vs. profundas (high) |

### Comandos de configuracion

| Comando | Descripcion | Uso tipico |
|---|---|---|
| `/init` | Genera o actualiza el archivo CLAUDE.md | Configurar el contexto del proyecto |
| `/config` | Abre la configuracion de Claude Code | Ajustar preferencias, tema, permisos |
| `/permissions` | Gestiona los permisos de herramientas | Controlar que acciones puede ejecutar Claude |
| `/doctor` | Ejecuta diagnosticos del sistema | Verificar que todo funciona correctamente |

### Uso detallado de comandos clave

**`/compact` — Compactar el contexto:**

Cuando el contexto se llena, `/compact` resume la conversacion para liberar espacio. Puedes guiar la compactacion:

```
> /compact
> /compact enfocate en los cambios realizados a la API
```

**`/model` — Cambiar de modelo:**

Permite alternar entre modelos disponibles durante la sesion:

```
> /model
# Muestra lista de modelos y permite seleccionar
```

:::info[Seleccion de modelo]
Usa **Haiku** para tareas rapidas y simples. Usa **Sonnet** como modelo general. Reserva **Opus** para tareas que requieren razonamiento profundo.
:::

**`/effort` — Ajustar el nivel de esfuerzo:**

```
> /effort low     # Respuestas concisas y directas
> /effort medium  # Balance entre velocidad y detalle (default)
> /effort high    # Analisis profundo, mas tiempo de respuesta
```

---

## 3.3 Comandos ejecutivos

Claude Code permite ejecutar comandos de shell directamente desde la sesion interactiva usando el prefijo `!`. Esto es util para verificar resultados sin salir de la conversacion.

### Sintaxis basica

```
> !comando

# Ejemplos:
> !git status
> !npm test
> !ls -la src/
> !cat package.json
```

### Inyeccion de salida en el contexto

Cuando ejecutas un comando con `!`, la salida se **inyecta en el contexto de Claude**, permitiendole ver y analizar el resultado:

```
> !npm test
  FAIL  src/tests/helpers.test.ts
    ✕ formatDate should handle invalid input
Tests: 1 failed, 1 passed, 2 total

> el test de formatDate fallo, puedes arreglar la funcion?
Claude: Veo que el test fallo porque formatDate no maneja
entradas invalidas. Voy a agregar validacion...
```

:::note
Los comandos con `!` los ejecutas tu directamente. Cuando Claude necesita ejecutar comandos como parte de su trabajo, te pedira permiso antes de hacerlo.
:::

### Casos de uso comunes

| Comando ejecutivo | Proposito |
|---|---|
| `!git status` | Ver estado del repositorio antes de pedir cambios |
| `!git diff` | Revisar cambios realizados por Claude |
| `!npm test` | Ejecutar tests despues de una modificacion |
| `!npm run build` | Verificar que el build compila correctamente |
| `!cat archivo.ts` | Mostrar contenido de un archivo para dar contexto |
| `!tree src/` | Visualizar estructura de directorios |

---

## 3.4 Atajos de teclado

Los atajos de teclado te permiten controlar la sesion de forma rapida sin escribir comandos.

### Tabla de atajos principales

| Atajo | Accion | Cuando usarlo |
|---|---|---|
| **Enter** | Enviar mensaje | Enviar tu instruccion a Claude |
| **Shift+Enter** | Nueva linea | Escribir mensajes multilinea |
| **Esc** | Interrumpir generacion | Detener una respuesta en progreso |
| **Ctrl+C** | Interrupcion forzada | Cancelar cuando Esc no responde |
| **Ctrl+D** | Salir de Claude Code | Terminar la sesion interactiva |
| **Tab** | Autocompletado | Completar nombres de archivos o comandos |
| **Flecha arriba** | Mensaje anterior | Navegar historial de mensajes enviados |
| **Flecha abajo** | Mensaje siguiente | Navegar historial de mensajes enviados |

:::warning[Esc vs Ctrl+C]
Usa **Esc** como primera opcion para interrumpir: es una interrupcion limpia que preserva el contexto. **Ctrl+C** es una interrupcion forzada que puede perder el estado parcial. Solo usalo si Esc no responde.
:::

### Salir de Claude Code

Puedes salir con **Ctrl+D**, el comando `/exit`, o escribiendo `exit`. La sesion se guarda automaticamente y puedes retomarla con `claude --continue`.

---

## 3.5 Flujo de trabajo basico

El flujo de trabajo fundamental con Claude Code sigue un patron de cuatro fases: **explorar, planificar, implementar y verificar**. Este ciclo se repite para cada tarea de desarrollo.

### El patron explorar-planificar-implementar-verificar

```
┌─────────────┐     ┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Explorar   │────▸│ Planificar  │────▸│ Implementar  │────▸│  Verificar  │
│             │     │             │     │              │     │             │
│ Entender el │     │ Definir la  │     │ Ejecutar los │     │ Confirmar   │
│ contexto    │     │ estrategia  │     │ cambios      │     │ resultados  │
└─────────────┘     └─────────────┘     └──────────────┘     └─────────────┘
       ▲                                                            │
       └────────────────────────────────────────────────────────────┘
                        Iterar si es necesario
```

### Ejemplo completo: agregar una funcion de utilidad

Veamos el flujo completo aplicado a una tarea concreta: agregar una funcion `slugify` a un proyecto TypeScript.

**Fase 1: Explorar**

Primero, entendemos el estado actual del proyecto:

```
> quiero agregar una funcion slugify al proyecto.
  primero, muestra la estructura del directorio utils/
  y el contenido del archivo de utilidades existente
```

Claude explorara los archivos y mostrara la estructura actual.

**Fase 2: Planificar**

```
> antes de implementar, describe tu plan:
  donde colocarias la funcion, que firma tendria,
  y que casos edge deberia manejar
```

Claude propondra una estrategia que puedes revisar y ajustar antes de escribir codigo.

**Fase 3: Implementar**

```
> adelante, implementa la funcion slugify segun el plan.
  incluye tambien los tests unitarios
```

Claude creara o modificara los archivos necesarios, pidiendo permiso para cada operacion de escritura.

**Fase 4: Verificar**

```
> !npm test
> !git diff
> los cambios se ven bien, haz un resumen de lo que se implemento
```

### Mejores practicas para el flujo de trabajo

1. **Se especifico en las instrucciones**: En lugar de "mejora el codigo", di "agrega manejo de errores a la funcion processOrder en src/services/orders.ts".

2. **Trabaja de forma incremental**: Aborda una tarea a la vez. No pidas multiples cambios no relacionados en un solo mensaje.

3. **Verifica antes de continuar**: Ejecuta tests y revisa diffs despues de cada cambio significativo antes de pasar a la siguiente tarea.

4. **Usa `/compact` en sesiones largas**: Si llevas muchos intercambios, compacta el contexto para mantener el rendimiento.

5. **Aprovecha el historial**: Si una sesion se interrumpe, usa `claude --continue` para retomar exactamente donde lo dejaste.

:::tip[Regla de oro]
Trata a Claude Code como un colega junior altamente capaz: dale instrucciones claras, revisa su trabajo, y proporciona retroalimentacion. Cuanto mas contexto y claridad le des, mejores seran los resultados.
:::

---

## Conceptos clave del capitulo

- **El REPL es tu espacio de trabajo**: La interfaz interactiva de Claude Code es donde ocurre toda la interaccion. Dominar la navegacion multilinea, el historial y el autocompletado te hara mas eficiente.
- **Los comandos slash controlan la herramienta**: `/clear`, `/compact`, `/model`, `/effort` y otros te permiten gestionar la sesion sin interferir con la conversacion.
- **Los comandos ejecutivos (`!`) inyectan contexto**: Ejecutar comandos de shell con `!` permite que Claude vea los resultados y actue en consecuencia.
- **El flujo explorar-planificar-implementar-verificar es fundamental**: Seguir este patron sistematicamente produce mejores resultados y menos retrabajos.
- **La claridad en las instrucciones determina la calidad**: Instrucciones especificas y bien contextualizadas generan mejores respuestas.

---

## Preguntas de autoevaluacion

1. **Cual es la diferencia entre `/clear` y `/compact`?** Describe en que situaciones usarias cada uno y que efecto tienen sobre el contexto de la conversacion.

2. **Como funciona la inyeccion de salida con comandos ejecutivos (`!`)?** Explica por que es util que Claude pueda ver la salida de los comandos de shell.

3. **Que diferencia hay entre presionar Esc y Ctrl+C durante una generacion?** Cual es la opcion preferida y por que?

4. **Describe el flujo de trabajo de cuatro fases con un ejemplo propio.** Elige una tarea de desarrollo que hayas realizado y explica como la abordarias con Claude Code.

5. **Por que es importante usar `/compact` en sesiones largas?** Que sucede si el contexto se llena y no se compacta?

---

## Laboratorio asociado

**[L3.1]** Inicia una sesion interactiva de Claude Code en un proyecto de prueba. Practica los siguientes ejercicios en orden:

1. Explora la estructura del proyecto usando lenguaje natural.
2. Usa al menos tres comandos slash diferentes (`/help`, `/status`, `/compact`).
3. Ejecuta dos comandos de shell con el prefijo `!`.
4. Aplica el flujo explorar-planificar-implementar-verificar para agregar una funcion simple al proyecto.
5. Verifica los cambios con `!git diff` y documenta el proceso.
