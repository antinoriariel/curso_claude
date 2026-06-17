---
sidebar_position: 7
title: "Lab 7: Conexión de Servidor MCP"
description: "Conecta el servidor MCP de GitHub y crea un servidor MCP personalizado con TypeScript"
tags: [laboratorio, mcp, github, servidor, typescript]
---

# Lab 7: Conexión de Servidor MCP

## Objetivo

Conectar el servidor MCP de GitHub a Claude Code, ejecutar herramientas MCP dentro de una sesión y crear un servidor MCP personalizado con 3 herramientas usando TypeScript.

## Prerrequisitos

- Claude Code instalado y autenticado
- Node.js 18+ y npm
- Cuenta de GitHub con token de acceso personal (PAT)
- TypeScript instalado globalmente (`npm install -g typescript tsx`)

## Duración estimada

50 minutos

## Pasos

### Paso 1: Conectar el servidor MCP de GitHub

Registra el servidor MCP oficial de GitHub:

```bash
claude mcp add github -- npx -y @modelcontextprotocol/server-github
```

Configura tu token de GitHub como variable de entorno. Agrega a `.claude/settings.json`:

```json
{
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_tu_token_aqui"
  }
}
```

### Paso 2: Verificar la conexión MCP

Lista los servidores MCP conectados:

```bash
claude mcp list
```

Dentro de una sesión interactiva, verifica las herramientas disponibles:

```
/mcp
```

Documenta la lista de herramientas que ofrece el servidor de GitHub.

### Paso 3: Ejecutar herramientas MCP de GitHub

Prueba las herramientas del servidor de GitHub dentro de una sesión:

```
Busca mis repositorios más recientes en GitHub
```

```
Muestra los issues abiertos del repositorio expressjs/express
```

```
Lista los pull requests abiertos de un repositorio público popular
```

### Paso 4: Crear un servidor MCP personalizado

Crea un nuevo proyecto para el servidor MCP:

```bash
mkdir -p ~/lab7-mcp-server && cd ~/lab7-mcp-server
npm init -y
npm install @modelcontextprotocol/sdk zod
npm install -D typescript @types/node
```

Configura `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["src/**/*"]
}
```

### Paso 5: Implementar el servidor MCP con 3 herramientas

Crea `src/server.ts` con el siguiente código:

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as fs from "fs";
import * as path from "path";

const server = new McpServer({
  name: "lab7-tools",
  version: "1.0.0",
});

// Herramienta 1: Contar líneas de código por extensión
server.tool(
  "count-lines",
  "Cuenta líneas de código agrupadas por extensión de archivo",
  { directory: z.string().describe("Directorio a analizar") },
  async ({ directory }) => {
    const counts: Record<string, number> = {};
    function walkDir(dir: string) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
        if (entry.isDirectory()) { walkDir(fullPath); }
        else if (entry.isFile()) {
          const ext = path.extname(entry.name) || "(sin extensión)";
          const lines = fs.readFileSync(fullPath, "utf8").split("\n").length;
          counts[ext] = (counts[ext] || 0) + lines;
        }
      }
    }
    walkDir(directory);
    const result = Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .map(([ext, lines]) => `${ext}: ${lines} líneas`)
      .join("\n");
    return { content: [{ type: "text", text: result || "No se encontraron archivos" }] };
  }
);

// Herramienta 2: Buscar TODOs y FIXMEs
server.tool(
  "find-todos",
  "Busca comentarios TODO y FIXME en el código fuente",
  { directory: z.string().describe("Directorio a buscar") },
  async ({ directory }) => {
    const todos: string[] = [];
    function walkDir(dir: string) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
        if (entry.isDirectory()) { walkDir(fullPath); }
        else if (entry.isFile()) {
          const content = fs.readFileSync(fullPath, "utf8");
          content.split("\n").forEach((line, i) => {
            if (line.match(/\/\/\s*(TODO|FIXME|HACK|XXX)/i)) {
              todos.push(`${fullPath}:${i + 1}: ${line.trim()}`);
            }
          });
        }
      }
    }
    walkDir(directory);
    return { content: [{ type: "text", text: todos.join("\n") || "No se encontraron TODOs" }] };
  }
);

// Herramienta 3: Generar resumen de proyecto
server.tool(
  "project-summary",
  "Genera un resumen rápido del proyecto basado en package.json y estructura",
  { directory: z.string().describe("Directorio raíz del proyecto") },
  async ({ directory }) => {
    const pkgPath = path.join(directory, "package.json");
    let summary = "# Resumen del Proyecto\n\n";
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
      summary += `**Nombre:** ${pkg.name || "N/A"}\n`;
      summary += `**Versión:** ${pkg.version || "N/A"}\n`;
      summary += `**Dependencias:** ${Object.keys(pkg.dependencies || {}).length}\n`;
      summary += `**DevDependencias:** ${Object.keys(pkg.devDependencies || {}).length}\n`;
    }
    const entries = fs.readdirSync(directory);
    summary += `\n**Archivos en raíz:** ${entries.length}\n`;
    summary += `**Directorios:** ${entries.filter(e =>
      fs.statSync(path.join(directory, e)).isDirectory()
    ).join(", ")}\n`;
    return { content: [{ type: "text", text: summary }] };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
main().catch(console.error);
```

### Paso 6: Registrar el servidor personalizado

Compila y registra el servidor:

```bash
npx tsc
claude mcp add lab7-tools -- node ~/lab7-mcp-server/dist/server.js
```

Verifica con:

```bash
claude mcp list
```

### Paso 7: Probar las herramientas personalizadas

En una sesión de Claude Code:

```
Usa la herramienta count-lines para analizar este proyecto
```

```
Busca todos los TODOs en este proyecto con find-todos
```

```
Genera un resumen del proyecto con project-summary
```

## Verificación

- [ ] El servidor MCP de GitHub está conectado y funcional
- [ ] `claude mcp list` muestra ambos servidores
- [ ] Las herramientas de GitHub se ejecutan correctamente
- [ ] El servidor MCP personalizado tiene 3 herramientas funcionando
- [ ] `/mcp` muestra todas las herramientas disponibles

## Entrega

Documenta en un archivo `lab7-entrega.md`:
1. Salida de `claude mcp list`
2. Resultados de ejecutar herramientas de GitHub
3. Código completo del servidor MCP personalizado
4. Resultados de las 3 herramientas personalizadas
5. Captura de `/mcp` mostrando todas las herramientas

## Criterios de evaluación

| Criterio | Puntos |
|----------|--------|
| Servidor MCP de GitHub conectado | 15 |
| Ejecución de herramientas de GitHub | 15 |
| Servidor MCP personalizado con 3 herramientas | 35 |
| Registro y verificación del servidor | 15 |
| Documentación completa | 20 |
| **Total** | **100** |
