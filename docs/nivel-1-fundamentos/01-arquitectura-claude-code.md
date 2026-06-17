---
sidebar_position: 1
title: "Capitulo 1: Arquitectura de Claude Code"
description: Fundamentos del ciclo agente, modelo de herramientas, ventana de contexto y ecosistema de modelos Anthropic.
tags: [claude-code, arquitectura, fundamentos, ciclo-agente]
---

# Capitulo 1: Arquitectura de Claude Code

Antes de escribir tu primer prompt en Claude Code, necesitas entender **como piensa y opera** la herramienta. Este capitulo te dara el modelo mental correcto para aprovechar todo su potencial. Vamos a recorrer desde el ecosistema general de Claude hasta los detalles tecnicos de la ventana de contexto.

---

## 1.1 El ecosistema Claude: modelos, superficies y contextos

### La familia de modelos Claude

Anthropic no ofrece un unico modelo, sino una **familia de modelos** optimizados para diferentes casos de uso. Comprender sus diferencias es fundamental para tomar buenas decisiones de costo y rendimiento.

| Modelo | Fortaleza principal | Contexto | Caso de uso tipico |
|--------|-------------------|----------|--------------------|
| **Claude Sonnet 4.6** | Equilibrio velocidad/calidad | 200K tokens | Desarrollo diario, refactorizacion, debugging |
| **Claude Opus 4.8** | Maxima capacidad de razonamiento | 200K tokens | Arquitectura compleja, analisis profundo, decisiones criticas |
| **Claude Haiku 4.5** | Velocidad y bajo costo | 200K tokens | Tareas rapidas, clasificacion, subtareas en pipelines |
| **Claude Fable 5** | Escritura y narrativa | 200K tokens | Documentacion, contenido, comunicacion |

:::info Nomenclatura de versiones
Los numeros como "4.6" o "4.8" indican la generacion y version del modelo. Anthropic actualiza estos modelos periodicamente, mejorando capacidades sin cambiar la interfaz.
:::

### Superficies de interaccion

Una **superficie** es el medio a traves del cual interactuas con Claude. Cada superficie tiene capacidades diferentes:

| Superficie | Tipo | Herramientas disponibles | Ideal para |
|-----------|------|------------------------|------------|
| **Claude Code (CLI)** | Terminal | Todas (archivos, bash, git, web, busqueda) | Desarrollo profesional, automatizacion |
| **VS Code (extension)** | IDE | Mismas que CLI, integradas en el editor | Desarrollo con contexto visual del IDE |
| **JetBrains (plugin)** | IDE | Mismas que CLI, integradas en el IDE | Desarrollo en IntelliJ, PyCharm, etc. |
| **Claude Desktop** | App nativa | Lectura de archivos, MCP, vision | Tareas generales con interfaz grafica |
| **Claude.ai** | Web | Chat basico, analisis de archivos, vision | Consultas rapidas, prototipado de prompts |
| **API directa** | Programatica | Las que tu definas via tool use | Integracion en sistemas propios |

### Claude.ai vs Claude Code vs Claude API

Esta distincion es critica y fuente frecuente de confusion:

```
Claude.ai          → Interfaz web de chat. Ideal para conversaciones.
                     No tiene acceso a tu sistema de archivos.

Claude Code        → Agente en tu terminal. Lee, edita, ejecuta, busca.
                     Acceso completo a tu entorno de desarrollo.

Claude API         → Acceso programatico. Tu construyes la experiencia.
                     Maximo control, mayor complejidad.
```

:::warning Error comun
Muchos desarrolladores confunden las capacidades de Claude.ai con las de Claude Code. Cuando alguien dice "Claude no puede editar archivos", probablemente esta usando Claude.ai, no Claude Code. Son productos distintos con capacidades muy diferentes.
:::

---

## 1.2 Ciclo agente: percepcion, razonamiento, accion, observacion

Este es el **concepto mas importante** de todo el curso. Claude Code no es un chatbot que responde preguntas: es un **agente** que opera en un ciclo continuo hasta completar la tarea.

### El ciclo fundamental

```
    ┌─────────────────────────────────────────────┐
    │                                             │
    │   1. PERCEPCION                             │
    │      El usuario envia un prompt             │
    │      + contexto del sistema                 │
    │              │                              │
    │              ▼                              │
    │   2. RAZONAMIENTO                           │
    │      Claude analiza la solicitud,           │
    │      planifica pasos, selecciona            │
    │      herramientas                           │
    │              │                              │
    │              ▼                              │
    │   3. ACCION                                 │
    │      Ejecuta la herramienta elegida         │
    │      (leer archivo, ejecutar comando,       │
    │       editar codigo, buscar, etc.)          │
    │              │                              │
    │              ▼                              │
    │   4. OBSERVACION                            │
    │      Recibe el resultado de la accion       │
    │      y evalua:                              │
    │        - ¿Se completo la tarea? → Responde  │
    │        - ¿Falta algo? → Vuelve a paso 2    │
    │                                             │
    └─────────────────────────────────────────────┘
```

### Ejemplo concreto del ciclo

Imagina que le pides a Claude Code: *"Encuentra y corrige el bug en la funcion de autenticacion"*.

El ciclo se desarrolla asi:

1. **Percepcion**: Claude recibe tu prompt junto con el contexto del proyecto (CLAUDE.md, archivos abiertos, etc.).

2. **Razonamiento** (iteracion 1): "Necesito encontrar la funcion de autenticacion. Voy a buscar archivos relacionados con auth."
   - **Accion**: Ejecuta `Grep` buscando "auth" en el proyecto.
   - **Observacion**: Encuentra `src/auth/login.ts`, `src/auth/middleware.ts`, `tests/auth.test.ts`.

3. **Razonamiento** (iteracion 2): "Voy a leer el archivo principal de login para entender la logica."
   - **Accion**: Ejecuta `Read` sobre `src/auth/login.ts`.
   - **Observacion**: Identifica que la comparacion de passwords usa `==` en lugar de una funcion de comparacion segura.

4. **Razonamiento** (iteracion 3): "Encontre el bug. Voy a corregirlo usando comparacion segura con la libreria crypto."
   - **Accion**: Ejecuta `Edit` para reemplazar la comparacion insegura.
   - **Observacion**: Archivo editado exitosamente.

5. **Razonamiento** (iteracion 4): "Deberia verificar que los tests pasan con el cambio."
   - **Accion**: Ejecuta `Bash` con `npm test`.
   - **Observacion**: Todos los tests pasan. Tarea completada.

6. **Respuesta final**: Claude te explica que encontro, que cambio y por que.

:::tip Implicacion practica
Cuanto mas claro y especifico sea tu prompt, menos iteraciones necesita Claude. Un prompt vago como "arregla el codigo" puede requerir 10+ iteraciones exploratorias. Un prompt preciso como "el endpoint POST /api/login devuelve 500 cuando el email tiene mayusculas" puede resolverse en 3-4 iteraciones.
:::

### El proceso de razonamiento (thinking)

Dentro de cada paso de razonamiento, Claude utiliza un proceso de **pensamiento extendido** (extended thinking). Esto significa que antes de elegir una accion, el modelo dedica tokens a:

- Analizar el estado actual del problema.
- Considerar multiples estrategias.
- Evaluar riesgos de cada accion.
- Planificar los siguientes pasos.

Puedes observar este proceso cuando Claude Code muestra indicadores de "pensando..." antes de ejecutar una herramienta. Este razonamiento consume tokens de la ventana de contexto, pero mejora significativamente la calidad de las decisiones.

---

## 1.3 Modelo de herramientas

Claude Code tiene acceso a un conjunto de **herramientas integradas** que le permiten interactuar con tu entorno de desarrollo. Estas herramientas se organizan en categorias funcionales.

### Operaciones de archivos

| Herramienta | Funcion | Ejemplo de uso |
|------------|---------|----------------|
| `Read` | Leer contenido de archivos | Examinar codigo fuente, configuraciones, logs |
| `Write` | Crear archivos nuevos | Generar nuevos modulos, scripts, configuraciones |
| `Edit` | Modificar archivos existentes | Corregir bugs, refactorizar, actualizar codigo |

```bash
# Claude usa Read internamente cuando le pides:
$ claude "Lee el archivo package.json y dime que dependencias tiene"

# Claude usa Edit cuando le pides:
$ claude "Cambia el puerto del servidor de 3000 a 8080 en server.ts"

# Claude usa Write cuando le pides:
$ claude "Crea un nuevo componente Button en src/components/Button.tsx"
```

:::note Preferencia por Edit sobre Write
Claude Code siempre prefiere `Edit` sobre `Write` para archivos existentes. Edit envia solo el cambio (diff), no el archivo completo, lo que es mas eficiente y menos propenso a errores.
:::

### Busqueda

| Herramienta | Funcion | Ejemplo de uso |
|------------|---------|----------------|
| `Glob` | Buscar archivos por patron de nombre | Encontrar todos los `*.test.ts`, localizar `config.*` |
| `Grep` | Buscar contenido dentro de archivos | Encontrar donde se usa una funcion, buscar TODOs |

```bash
# Glob: encontrar archivos por patron
$ claude "Encuentra todos los archivos de test en el proyecto"
# Internamente: Glob con patron "**/*.test.{ts,js}"

# Grep: buscar dentro de archivos
$ claude "Donde se usa la funcion calculateTotal?"
# Internamente: Grep buscando "calculateTotal" en el proyecto
```

### Ejecucion

| Herramienta | Funcion | Ejemplo de uso |
|------------|---------|----------------|
| `Bash` | Ejecutar comandos de terminal | Correr tests, instalar paquetes, ejecutar scripts |

```bash
# Claude ejecuta comandos bash cuando es necesario
$ claude "Instala la dependencia zod y ejecuta los tests"
# Internamente:
#   1. Bash: npm install zod
#   2. Bash: npm test
```

:::warning Permisos
Claude Code te pedira permiso antes de ejecutar comandos que modifiquen tu sistema. Esto incluye escritura de archivos, ejecucion de bash y operaciones de git. Puedes configurar listas de comandos permitidos para agilizar tu flujo de trabajo.
:::

### Web

| Herramienta | Funcion | Ejemplo de uso |
|------------|---------|----------------|
| `WebSearch` | Buscar informacion en la web | Consultar documentacion, buscar soluciones |
| `WebFetch` | Obtener contenido de una URL | Leer documentacion especifica, descargar specs |

```bash
# Buscar documentacion actualizada
$ claude "Busca en la web como configurar ESLint v9 con TypeScript"

# Obtener contenido de una URL especifica
$ claude "Lee la documentacion de la API en https://api.ejemplo.com/docs"
```

### Inteligencia de codigo

Claude Code tambien puede utilizar herramientas de **inteligencia de codigo** para comprender la estructura de tu proyecto mas alla de busquedas de texto, incluyendo navegacion semantica cuando el entorno lo soporta.

### Composicion de herramientas

Lo mas poderoso de Claude Code no es cada herramienta individual, sino como las **compone automaticamente**. En una sola solicitud, Claude puede:

1. Buscar archivos relevantes (`Glob` + `Grep`)
2. Leer y analizar el codigo (`Read`)
3. Planificar cambios coherentes
4. Aplicar modificaciones (`Edit`)
5. Ejecutar validaciones (`Bash`: tests, linters)
6. Iterar si algo falla

Esta composicion autonoma es lo que convierte a Claude Code en un **agente** y no simplemente en un autocompletado inteligente.

---

## 1.4 Ventana de contexto (200K tokens)

### Que es la ventana de contexto

La **ventana de contexto** es la cantidad maxima de informacion que Claude puede "tener en mente" en un momento dado. Con 200,000 tokens (aproximadamente 150,000 palabras o 500 paginas de texto), es una de las mas amplias del mercado.

Para dimensionarlo en terminos de codigo:

| Medida | Aproximacion |
|--------|-------------|
| 200K tokens | ~150,000 palabras |
| En lineas de codigo | ~6,000-8,000 lineas |
| En archivos tipicos | ~40-60 archivos de 150 lineas |

### Que ocupa la ventana

La ventana de contexto no es solo tu prompt. Incluye:

1. **Prompt del sistema**: instrucciones internas de Claude Code.
2. **CLAUDE.md**: tu archivo de memoria de proyecto.
3. **Historial de la conversacion**: todos los mensajes previos en la sesion.
4. **Resultados de herramientas**: contenido de archivos leidos, salida de comandos.
5. **Pensamiento extendido**: el razonamiento interno del modelo.
6. **La respuesta actual**: lo que Claude esta generando.

:::warning Cuidado con sesiones largas
En una sesion extensa de debugging, es facil acumular cientos de miles de tokens entre archivos leidos, comandos ejecutados y conversacion. Cuando la ventana se llena, Claude pierde acceso a la informacion mas antigua.
:::

### El comando /compact

Cuando la ventana se acerca a su limite, puedes usar el comando `/compact` para **resumir la conversacion** y liberar espacio:

```bash
# Dentro de una sesion de Claude Code
> /compact

# Claude resumira la conversacion manteniendo los puntos clave
# y liberando tokens para seguir trabajando
```

### Auto-compactacion

Claude Code tambien realiza **compactacion automatica** cuando detecta que la ventana esta cerca de su capacidad. Este proceso:

- Resume mensajes antiguos conservando decisiones clave.
- Mantiene el contexto de archivos recientemente editados.
- Preserva el objetivo actual de la tarea.

:::tip Buena practica
Para tareas grandes, divide tu trabajo en **sesiones enfocadas**. En lugar de una sesion de 3 horas, considera hacer sesiones de 30-45 minutos con objetivos claros. Al inicio de cada sesion, proporciona contexto fresco en tu prompt.
:::

### Implicaciones para proyectos grandes

En un monorepo con miles de archivos, Claude Code no puede leer todo el proyecto de una vez. Por eso es crucial:

- Mantener un **CLAUDE.md** bien organizado que describa la estructura del proyecto.
- Dar **contexto especifico** en tus prompts: "en el modulo de pagos" es mejor que "en el proyecto".
- Usar **@-mentions** para apuntar a archivos especificos cuando sea posible.

---

## 1.5 Modelos disponibles y criterios de seleccion

### Matriz de decision

Elegir el modelo correcto para cada tarea es una habilidad importante. Aqui tienes una guia practica:

| Escenario | Modelo recomendado | Razon |
|-----------|-------------------|-------|
| Desarrollo diario (editar, debuggear, refactorizar) | **Sonnet** | Mejor relacion velocidad/calidad para tareas iterativas |
| Disenar arquitectura de sistema complejo | **Opus** | Razonamiento profundo necesario para decisiones de alto impacto |
| Subtareas en pipelines automatizados | **Haiku** | Bajo costo y alta velocidad para tareas simples y repetitivas |
| Escribir documentacion tecnica extensa | **Fable** | Optimizado para escritura y narrativa |
| Revisar PR con cambios criticos | **Opus** | Capacidad de analisis profundo para detectar problemas sutiles |
| Generar tests unitarios estandar | **Sonnet** | Tarea estructurada que no requiere razonamiento extremo |
| Clasificar issues automaticamente | **Haiku** | Tarea de clasificacion simple y de alto volumen |

### Como cambiar de modelo

Dentro de Claude Code, puedes seleccionar el modelo a utilizar:

```bash
# Iniciar Claude Code con un modelo especifico
$ claude --model claude-sonnet-4-6

# Cambiar modelo durante una sesion interactiva
> /model claude-opus-4-8

# Verificar que modelo estas usando
> /model
```

### Consideraciones de costo

Los modelos tienen costos diferentes por token. Como regla general:

```
Haiku  →  $   (mas economico, ideal para volumen)
Sonnet →  $$  (balance costo/calidad, uso general)
Fable  →  $$  (similar a Sonnet, orientado a escritura)
Opus   →  $$$ (mas costoso, reservar para tareas complejas)
```

:::tip Estrategia de costos
Una estrategia efectiva es usar **Sonnet como modelo por defecto** y cambiar a Opus solo cuando necesites razonamiento profundo (diseno de arquitectura, debugging de problemas complejos, revisiones criticas). Usa Haiku para tareas automatizadas en pipelines donde el volumen es alto.
:::

---

## Resumen del capitulo

:::tip Conceptos clave
- **Ecosistema Claude**: familia de modelos (Sonnet, Opus, Haiku, Fable) accesibles desde multiples superficies (CLI, IDE, web, API).
- **Ciclo agente**: bucle de percepcion, razonamiento, accion y observacion que se repite hasta completar la tarea.
- **Modelo de herramientas**: conjunto integrado de herramientas (archivos, busqueda, ejecucion, web) que Claude compone automaticamente.
- **Ventana de contexto**: 200K tokens de capacidad que incluyen prompt, historial, resultados de herramientas y razonamiento. Gestionable con `/compact`.
- **Seleccion de modelo**: elegir el modelo correcto segun la tarea optimiza tanto calidad como costo.
:::

---

## Preguntas de autoevaluacion

1. **Describe con tus palabras las cuatro fases del ciclo agente.** ¿Por que es importante que sea un ciclo y no una secuencia lineal?

2. **¿Cual es la diferencia fundamental entre Claude.ai y Claude Code?** Da un ejemplo de una tarea que puedes hacer en Claude Code pero no en Claude.ai.

3. **Si tu ventana de contexto esta casi llena durante una sesion de debugging**, ¿que estrategias puedes usar para seguir trabajando efectivamente?

4. **Tienes que procesar 500 issues de GitHub para clasificarlos por prioridad.** ¿Que modelo elegiras y por que?

5. **Explica por que Claude Code prefiere la herramienta Edit sobre Write** para modificar archivos existentes. ¿Que ventajas tiene este enfoque?

---

## Laboratorio

Los conceptos de este capitulo se practican en el **Laboratorio L1.1: Exploracion del ciclo agente**, donde observaras en tiempo real como Claude Code ejecuta el ciclo de percepcion-razonamiento-accion-observacion en un proyecto real.

Diriegete a la seccion de [Laboratorios](/laboratorios/L1-1-exploracion-ciclo-agente) para acceder al ejercicio.
