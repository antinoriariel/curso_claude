---
sidebar_position: 4
title: "Capítulo 7: Model Context Protocol (MCP)"
description: Fundamentos de MCP, transportes, instalación, autenticación OAuth, Tool Search y creación de servidores personalizados.
tags: [claude-code, mcp, protocolo, herramientas-externas, oauth]
---

# Capitulo 7: Model Context Protocol (MCP)

Hasta ahora, Claude Code ha trabajado con las herramientas integradas en su nucleo: lectura de archivos, ejecucion de comandos, busqueda de codigo. Pero el mundo real exige conectarse a servicios externos --- bases de datos, plataformas de gestion de proyectos, sistemas de monitoreo, navegadores. Model Context Protocol (MCP) es el estandar abierto que hace posible esta extension, convirtiendo a Claude Code en un hub capaz de orquestar cualquier herramienta externa de forma segura y estandarizada.

---

## 7.1 Fundamentos de MCP

### El protocolo

MCP (Model Context Protocol) es un **estandar abierto** creado por Anthropic para conectar modelos de lenguaje con fuentes de datos y herramientas externas. Utiliza **JSON-RPC 2.0** como protocolo de comunicacion, lo que garantiza mensajes estructurados, tipados y con manejo de errores estandarizado.

### Diferencia conceptual con REST APIs

A diferencia de una API REST tradicional donde el cliente debe conocer los endpoints, metodos HTTP y formatos de respuesta, un servidor MCP **se autodescribe**. Expone tres tipos de primitivas:

| Primitiva | Descripcion | Ejemplo |
|---|---|---|
| **Tools** (herramientas) | Funciones invocables con parametros definidos por JSON Schema | `create_issue`, `run_query`, `send_message` |
| **Resources** (recursos) | Datos de solo lectura que proporcionan contexto | Esquema de base de datos, documentacion, configuracion |
| **Prompts** (plantillas) | Templates reutilizables para interacciones comunes | Plantilla de revision de codigo, plantilla de reporte |

### Arquitectura

La comunicacion MCP sigue una arquitectura de cuatro capas:

```
┌─────────────────────────────────────────────────────┐
│                   HOST (Claude Code)                │
│                                                     │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐       │
│  │ Cliente 1 │  │ Cliente 2 │  │ Cliente N │       │
│  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘       │
└────────┼───────────────┼───────────────┼────────────┘
         │               │               │
   ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐
   │ Servidor  │   │ Servidor  │   │ Servidor  │
   │   MCP A   │   │   MCP B   │   │   MCP C   │
   └─────┬─────┘   └─────┬─────┘   └─────┬─────┘
         │               │               │
   ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐
   │ Servicio  │   │ Servicio  │   │ Servicio  │
   │ Externo A │   │ Externo B │   │ Externo C │
   │ (GitHub)  │   │ (Sentry)  │   │ (DB)      │
   └───────────┘   └───────────┘   └───────────┘
```

- **Host**: Claude Code actua como host MCP. Gestiona el ciclo de vida de las conexiones.
- **Cliente**: Componente interno del host que mantiene una conexion 1:1 con un servidor MCP.
- **Servidor**: Proceso que expone tools, resources y prompts. Se autodescribe al conectarse.
- **Servicio externo**: La API, base de datos o sistema al que el servidor MCP accede.

### Flujo de una invocacion

1. Claude Code descubre las herramientas disponibles al iniciar la sesion (handshake).
2. El modelo decide invocar una herramienta basandose en el contexto de la conversacion.
3. El cliente envia una solicitud JSON-RPC al servidor.
4. El servidor ejecuta la operacion y devuelve el resultado.
5. Claude Code incorpora el resultado a su contexto y continua.

---

## 7.2 Transportes: stdio, HTTP, SSE, WebSocket

MCP soporta multiples mecanismos de transporte. La eleccion del transporte depende de donde se ejecuta el servidor y los requisitos de comunicacion.

### Tabla comparativa

| Transporte | Mecanismo | Direccion | Ideal para | Ventajas | Desventajas |
|---|---|---|---|---|---|
| **stdio** | stdin/stdout del proceso local | Bidireccional | Herramientas locales, CLIs | Sin red, baja latencia, simple | Solo local, un cliente |
| **HTTP (Streamable HTTP)** | Peticiones HTTP con SSE para streaming | Bidireccional | Servidores remotos en produccion | OAuth nativo, escalable, stateless | Requiere infraestructura HTTP |
| **SSE** | Server-Sent Events sobre HTTP | Servidor → Cliente (+ POST para cliente → servidor) | Servidores remotos legacy | Compatible con proxies HTTP, simple | Unidireccional nativo, conexion persistente |
| **WebSocket** | Conexion TCP persistente | Bidireccional en tiempo real | Aplicaciones de alta frecuencia | Baja latencia, full-duplex | Mas complejo, problemas con proxies |

### stdio: el transporte local

El transporte **stdio** es el mas comun para herramientas locales. Claude Code lanza el servidor como proceso hijo y se comunica a traves de `stdin` (entrada) y `stdout` (salida):

```bash
# El servidor MCP lee de stdin y escribe en stdout
# Claude Code gestiona el ciclo de vida del proceso
claude mcp add mi-herramienta -- node /ruta/al/servidor.js
```

:::tip[Cuando usar stdio]
Usa stdio cuando el servidor MCP se ejecuta en la misma maquina. Es el transporte por defecto y no requiere configuracion de red ni autenticacion.
:::

### HTTP (Streamable HTTP): el transporte remoto moderno

Para servidores remotos, HTTP con streaming es el transporte recomendado. Soporta OAuth 2.0 de forma nativa:

```bash
claude mcp add --transport http servidor-remoto https://api.ejemplo.com/mcp
```

### SSE: compatibilidad legacy

SSE se mantiene para compatibilidad con servidores MCP existentes que aun no han migrado a Streamable HTTP:

```bash
claude mcp add --transport sse servidor-sse https://api.ejemplo.com/mcp/sse
```

### WebSocket: tiempo real

Para escenarios que requieren comunicacion bidireccional de alta frecuencia:

```bash
claude mcp add --transport ws servidor-ws ws://localhost:8080/mcp
```

---

## 7.3 Instalacion y configuracion

### Comando base

La instalacion de un servidor MCP en Claude Code sigue la sintaxis:

```bash
claude mcp add [--scope <scope>] [--transport <type>] <nombre> [url-o-comando] [-- args...]
```

### Scopes de configuracion

Claude Code maneja tres scopes para servidores MCP, cada uno con un proposito diferente:

| Scope | Archivo de configuracion | Compartido en repo | Proposito |
|---|---|---|---|
| **local** | `.claude/local_settings.json` (en proyecto) | No (gitignored) | Servidores personales en proyecto especifico |
| **user** | `~/.claude.json` | No | Servidores globales para todos los proyectos |
| **project** | `.mcp.json` (raiz del proyecto) | Si (versionado) | Servidores compartidos con el equipo |

### Ejemplos de instalacion por scope

**Scope local** (solo para ti, solo en este proyecto):

```bash
# Servidor de base de datos personal
claude mcp add --scope local mi-db -- \
  npx -y @anthropic-ai/mcp-server-postgres \
  "postgresql://localhost:5432/mi_base"
```

**Scope user** (para ti, en todos los proyectos):

```bash
# Herramienta de busqueda web disponible globalmente
claude mcp add --scope user web-search -- \
  npx -y @anthropic-ai/mcp-server-web-search
```

**Scope project** (compartido con el equipo via repositorio):

```bash
# Servidor de documentacion del proyecto
claude mcp add --scope project docs-server -- \
  npx -y @anthropic-ai/mcp-server-docs ./docs
```

Esto genera un archivo `.mcp.json` en la raiz del proyecto:

```json
{
  "mcpServers": {
    "docs-server": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-docs", "./docs"]
    }
  }
}
```

### Verificacion

Despues de agregar un servidor, verifica que esta funcionando:

```bash
# Desde la terminal, listar servidores configurados
claude mcp list

# Desde una sesion interactiva, verificar estado
/mcp
```

El comando `/mcp` muestra el estado de cada servidor: conectado, desconectado, o con errores. Tambien lista las herramientas, recursos y prompts que expone cada uno.

### Gestion de servidores

```bash
# Eliminar un servidor
claude mcp remove mi-herramienta

# Obtener configuracion en formato JSON
claude mcp get mi-herramienta
```

---

## 7.4 Autenticacion OAuth 2.0

### Servidores remotos con OAuth

Los servidores MCP remotos que acceden a plataformas como Sentry, Linear o Notion requieren autenticacion. MCP implementa el flujo estandar **OAuth 2.0 Authorization Code** con PKCE:

### Flujo paso a paso

```
1. claude mcp add --transport http sentry https://mcp.sentry.io
   ↓
2. Claude Code detecta que el servidor requiere OAuth
   ↓
3. Se abre el navegador automaticamente con la pagina de autorizacion
   ↓
4. El usuario autoriza el acceso en Sentry
   ↓
5. Sentry redirige con un codigo de autorizacion
   ↓
6. Claude Code intercambia el codigo por un token de acceso
   ↓
7. El token se almacena de forma segura para sesiones futuras
```

### Ejemplo completo con Sentry

```bash
# Paso 1: Agregar el servidor MCP de Sentry
claude mcp add --transport http sentry https://mcp.sentry.io

# Paso 2: Al iniciar sesion, Claude Code abre el navegador
# El usuario autoriza el acceso en la interfaz de Sentry

# Paso 3: Verificar que la conexion funciona
/mcp
# Salida esperada:
# sentry: connected (tools: list_issues, get_issue, search_errors, ...)
```

Una vez autorizado, Claude Code almacena el token y lo renueva automaticamente cuando expira. No necesitas repetir el proceso de autorizacion en cada sesion.

### Tokens estaticos para servidores propios

Si administras tu propio servidor MCP remoto, puedes usar un token estatico en lugar de OAuth:

```bash
# Usando una variable de entorno para el token
claude mcp add --transport http mi-servidor https://mi-api.com/mcp \
  --header "Authorization: Bearer ${MI_TOKEN}"
```

### Variables de entorno para servidores stdio

Los servidores stdio pueden recibir credenciales a traves de variables de entorno:

```bash
claude mcp add mi-db -e DB_PASSWORD=secreto -e DB_HOST=localhost -- \
  node /ruta/al/servidor-db.js
```

Las variables definidas con `-e` se pasan exclusivamente al proceso del servidor MCP, sin afectar el entorno del host.

### Headers dinamicos

Para escenarios avanzados donde los headers de autenticacion cambian dinamicamente:

```json
{
  "mcpServers": {
    "mi-servidor": {
      "type": "http",
      "url": "https://api.ejemplo.com/mcp",
      "headers": {
        "Authorization": "Bearer ${AUTH_TOKEN}",
        "X-Team-Id": "${TEAM_ID}"
      }
    }
  }
}
```

Las variables `${VARIABLE}` se resuelven desde el entorno del proceso al momento de la conexion.

---

## 7.5 MCP Tool Search

### El problema de la escala

Cuando un servidor MCP expone muchas herramientas (por ejemplo, la API de GitHub con mas de 50 operaciones), incluir todas las definiciones en el contexto de cada interaccion genera un peso significativo. Cada herramienta con su JSON Schema, descripcion y parametros consume tokens que podrian usarse mejor.

### Solucion: Tool Search

Claude Code implementa **Tool Search** como mecanismo de busqueda semantica para herramientas MCP. En lugar de cargar todas las definiciones al inicio, Claude ve solo los nombres de las herramientas. Cuando necesita una herramienta especifica, realiza una busqueda semantica para cargar su definicion completa.

### Comportamiento por defecto

Tool Search se activa automaticamente cuando un servidor expone un numero elevado de herramientas. Las herramientas se registran como "deferred" (diferidas) y solo se cargan bajo demanda.

### Configuracion

Puedes controlar el comportamiento de Tool Search en la configuracion de Claude Code:

```json
{
  "toolSearch": {
    "enabled": true,
    "maxResults": 5
  }
}
```

### Exencion de servidores

Algunos servidores criticos deben tener todas sus herramientas siempre disponibles. Usa `exemptFromDeferral` para excluirlos del mecanismo de diferimiento:

```json
{
  "mcpServers": {
    "servidor-critico": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "mi-servidor-critico"],
      "exemptFromDeferral": true
    }
  }
}
```

Con `exemptFromDeferral: true`, todas las herramientas de ese servidor se cargan completamente al inicio de cada sesion, sin pasar por Tool Search.

### Cuando usar cada estrategia

| Escenario | Estrategia | Razon |
|---|---|---|
| Servidor con 5-10 herramientas | Sin deferral | Pocas herramientas, costo de contexto bajo |
| Servidor con 50+ herramientas | Tool Search (default) | Reduce uso de tokens significativamente |
| Servidor critico con herramientas frecuentes | `exemptFromDeferral: true` | Evita latencia de busqueda en cada invocacion |

---

## 7.6 Casos de uso

### GitHub: gestion de repositorios

Uno de los servidores MCP mas completos. Permite interactuar con repositorios, pull requests, issues y mas:

```bash
# Instalacion
claude mcp add --scope user github -- \
  npx -y @modelcontextprotocol/server-github
```

```
# Uso en sesion interactiva
> Crea un pull request con los cambios actuales hacia main
# Claude usa create_pull_request del servidor MCP de GitHub

> Busca issues abiertos relacionados con "memory leak"
# Claude usa search_issues con el query apropiado
```

### Sentry: monitoreo de errores

```bash
# Instalacion (remoto con OAuth)
claude mcp add --transport http sentry https://mcp.sentry.io
```

```
# Uso en sesion
> Muestrame los errores mas frecuentes de la ultima semana
# Claude usa list_issues con filtros de fecha y ordenamiento

> Analiza el stack trace del error #12345
# Claude usa get_issue para obtener detalles completos
```

### Base de datos: consultas parametrizadas

```bash
# Instalacion
claude mcp add --scope local db -- \
  npx -y @anthropic-ai/mcp-server-postgres \
  "postgresql://localhost:5432/produccion"
```

```
# Uso en sesion
> Cuantos usuarios se registraron este mes?
# Claude genera y ejecuta un query parametrizado via run_query

> Muestrame las tablas con mas de 1 millon de registros
# Claude consulta el esquema y ejecuta counts
```

:::warning[Seguridad en bases de datos]
Configura el servidor de base de datos con un usuario de **solo lectura** a menos que explicitamente necesites operaciones de escritura. Esto previene modificaciones accidentales.
:::

### Slack: mensajeria

```bash
# Instalacion
claude mcp add --scope user slack -e SLACK_BOT_TOKEN=xoxb-... -- \
  npx -y @anthropic-ai/mcp-server-slack
```

```
# Uso en sesion
> Envia un resumen del PR #42 al canal #dev-updates
# Claude usa send_message con formato Markdown
```

### Puppeteer / Playwright: control de navegador

```bash
# Instalacion de Puppeteer MCP
claude mcp add --scope user puppeteer -- \
  npx -y @anthropic-ai/mcp-server-puppeteer
```

```
# Uso en sesion
> Navega a localhost:3000 y toma una captura de pantalla
# Claude usa navigate y screenshot

> Haz clic en el boton "Registrarse" y llena el formulario
# Claude usa click y type para interactuar con la pagina
```

### Combinacion de servidores

La verdadera potencia emerge al combinar multiples servidores MCP:

```
> Busca los errores criticos en Sentry de las ultimas 24 horas,
  crea un issue en GitHub para cada uno y notifica al canal
  #incidents en Slack

# Claude orquesta tres servidores MCP en secuencia:
# 1. Sentry: list_issues (criticos, 24h)
# 2. GitHub: create_issue (por cada error)
# 3. Slack: send_message (resumen al canal)
```

---

## 7.7 Creacion de servidores MCP personalizados

### Cuando crear un servidor propio

Crea un servidor MCP personalizado cuando:

- Necesitas exponer una API interna de tu organizacion.
- Quieres encapsular logica de negocio compleja como herramientas simples.
- Ningun servidor existente cubre tu caso de uso.

### Estructura basica con el SDK

El SDK oficial de MCP para TypeScript proporciona las abstracciones necesarias. A continuacion, un servidor completo que gestiona una lista de tareas:

```typescript
// servidor-tareas.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Almacenamiento en memoria
interface Tarea {
  id: string;
  titulo: string;
  completada: boolean;
  creadaEn: string;
}

const tareas: Map<string, Tarea> = new Map();
let contadorId = 1;

// Crear el servidor
const server = new McpServer({
  name: "servidor-tareas",
  version: "1.0.0",
});

// Tool: agregar tarea
server.tool(
  "agregar_tarea",
  "Agrega una nueva tarea a la lista",
  {
    titulo: z.string().describe("Titulo de la tarea"),
  },
  async ({ titulo }) => {
    const id = String(contadorId++);
    const tarea: Tarea = {
      id,
      titulo,
      completada: false,
      creadaEn: new Date().toISOString(),
    };
    tareas.set(id, tarea);

    return {
      content: [
        {
          type: "text",
          text: `Tarea creada: [${id}] ${titulo}`,
        },
      ],
    };
  }
);

// Tool: listar tareas
server.tool(
  "listar_tareas",
  "Lista todas las tareas con su estado",
  {},
  async () => {
    if (tareas.size === 0) {
      return {
        content: [{ type: "text", text: "No hay tareas registradas." }],
      };
    }

    const lista = Array.from(tareas.values())
      .map((t) => {
        const estado = t.completada ? "[x]" : "[ ]";
        return `${estado} #${t.id}: ${t.titulo}`;
      })
      .join("\n");

    return {
      content: [{ type: "text", text: lista }],
    };
  }
);

// Tool: completar tarea
server.tool(
  "completar_tarea",
  "Marca una tarea como completada",
  {
    id: z.string().describe("ID de la tarea a completar"),
  },
  async ({ id }) => {
    const tarea = tareas.get(id);
    if (!tarea) {
      return {
        content: [{ type: "text", text: `Error: tarea #${id} no encontrada.` }],
        isError: true,
      };
    }

    tarea.completada = true;
    return {
      content: [
        {
          type: "text",
          text: `Tarea #${id} completada: ${tarea.titulo}`,
        },
      ],
    };
  }
);

// Iniciar transporte stdio
const transport = new StdioServerTransport();
await server.connect(transport);
```

### Definicion de herramientas con JSON Schema

Cada herramienta se define con cuatro elementos:

1. **Nombre**: Identificador unico (snake_case recomendado).
2. **Descripcion**: Texto que Claude usa para decidir cuando invocar la herramienta.
3. **Esquema de parametros**: Definido con Zod (se convierte automaticamente a JSON Schema).
4. **Handler**: Funcion asincrona que ejecuta la logica y retorna el resultado.

### Manejo de errores

Usa `isError: true` en la respuesta para indicar que la operacion fallo. Claude interpretara el mensaje como un error y podra reaccionar apropiadamente:

```typescript
// Patron de error
return {
  content: [{ type: "text", text: `Error: ${mensaje}` }],
  isError: true,
};
```

### Logging

El SDK permite enviar logs al host para depuracion. Usa `console.error` para logs (stdout esta reservado para JSON-RPC):

```typescript
// Los logs van a stderr, no interfieren con el protocolo
console.error("[servidor-tareas] Tarea creada:", id);
```

### Instalacion y prueba del servidor

```bash
# Compilar el servidor (si usas TypeScript)
npx tsc servidor-tareas.ts --module nodenext --moduleResolution nodenext

# Registrar en Claude Code
claude mcp add tareas -- node ./servidor-tareas.js

# Verificar
claude mcp list
# tareas: local stdio (node ./servidor-tareas.js)
```

### Prueba en sesion interactiva

```
> Agrega una tarea: "Revisar PR del modulo de pagos"
# Claude invoca agregar_tarea

> Lista todas las tareas
# Claude invoca listar_tareas

> Marca la tarea 1 como completada
# Claude invoca completar_tarea con id="1"
```

---

## Conceptos clave del capitulo

- **MCP es un estandar abierto** basado en JSON-RPC 2.0 que conecta modelos de lenguaje con herramientas externas de forma autodescriptiva.
- **Tres primitivas**: tools (funciones invocables), resources (datos de contexto) y prompts (plantillas reutilizables).
- **Cuatro transportes**: stdio (local), HTTP (remoto moderno), SSE (remoto legacy) y WebSocket (tiempo real).
- **Tres scopes**: local (personal en proyecto), user (global personal) y project (compartido en repositorio).
- **OAuth 2.0 con PKCE** es el mecanismo de autenticacion para servidores remotos; tokens estaticos y variables de entorno para servidores propios.
- **Tool Search** optimiza el uso de contexto difiriendo la carga de herramientas hasta que son necesarias.
- **Crear servidores MCP** es accesible con el SDK oficial: se definen herramientas con Zod, se implementan handlers asincronos y se conectan via transporte stdio.

---

## Preguntas de autoevaluacion

1. **Que diferencia fundamental tiene MCP respecto a una API REST tradicional?** Describe como el mecanismo de autodescripcion cambia la forma en que Claude Code interactua con servicios externos.

2. **Cuando usarias el transporte stdio frente al transporte HTTP?** Da un ejemplo concreto de cada caso y explica por que el otro transporte no seria apropiado.

3. **Que diferencias existen entre los scopes local, user y project?** Describe un escenario donde usarias cada uno y explica las implicaciones de compartir configuracion MCP en un repositorio.

4. **Como funciona el flujo de autenticacion OAuth 2.0 en MCP?** Describe los pasos desde la instalacion del servidor hasta la primera invocacion autenticada de una herramienta.

5. **Que problema resuelve Tool Search y cuando deberia desactivarse para un servidor especifico?** Explica la relacion entre numero de herramientas, consumo de contexto y la opcion `exemptFromDeferral`.

---

## Laboratorio asociado

**[L7.1]** Instala al menos dos servidores MCP (uno stdio local y uno remoto) en Claude Code. Verifica su funcionamiento con `/mcp`, invoca al menos una herramienta de cada servidor y documenta los resultados. Como desafio adicional, crea un servidor MCP personalizado en TypeScript que exponga al menos dos herramientas y registralo en Claude Code.
