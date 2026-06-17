---
sidebar_position: 11
title: "Lab 11: GitHub Actions con Claude Code"
description: "Crea workflows de GitHub Actions para code review automatizado y CI/CD con Claude Code"
tags: [laboratorio, github-actions, CI/CD, automatización, routines]
---

# Lab 11: GitHub Actions con Claude Code

## Objetivo

Crear un workflow de GitHub Actions que ejecute Claude Code para revisión automática de PRs, configurar una Routine semanal para auditoría de dependencias y construir un pipeline CI/CD completo.

## Prerrequisitos

- Repositorio en GitHub con permisos de administrador
- Claude Code instalado localmente
- Cuenta con acceso a Claude API (clave API)
- Familiaridad con GitHub Actions (sintaxis YAML básica)

## Duración estimada

50 minutos

## Pasos

### Paso 1: Preparar el repositorio

Asegúrate de tener un repositorio en GitHub con código fuente:

```bash
cd ~/lab11-proyecto
git init && git remote add origin https://github.com/tu-usuario/lab11-proyecto.git
mkdir -p .github/workflows
```

### Paso 2: Crear Action de Code Review para PRs

Crea `.github/workflows/claude-review.yml`:

```yaml
name: Claude Code Review

on:
  pull_request:
    types: [opened, synchronize]

permissions:
  contents: read
  pull-requests: write

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout código
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Instalar Claude Code
        run: npm install -g @anthropic-ai/claude-code

      - name: Ejecutar revisión de código
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          # Obtener archivos modificados en el PR
          FILES=$(git diff --name-only origin/${{ github.base_ref }}...HEAD)

          # Ejecutar revisión con Claude Code
          claude -p "Revisa los siguientes archivos modificados en este PR
          y genera un reporte de code review con problemas encontrados,
          sugerencias de mejora y un veredicto (APROBADO/CAMBIOS REQUERIDOS):

          Archivos modificados:
          $FILES

          Diff completo:
          $(git diff origin/${{ github.base_ref }}...HEAD)" > review_output.txt

      - name: Publicar reporte como comentario
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const review = fs.readFileSync('review_output.txt', 'utf8');
            await github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              body: `## Revisión Automática con Claude Code\n\n${review}`
            });
```

### Paso 3: Configurar secretos en GitHub

En tu repositorio de GitHub:
1. Ve a Settings > Secrets and variables > Actions
2. Crea un nuevo secreto `ANTHROPIC_API_KEY` con tu clave API

### Paso 4: Crear Routine semanal para auditoría de dependencias

Crea `.github/workflows/claude-dependency-audit.yml`:

```yaml
name: Auditoría Semanal de Dependencias

on:
  schedule:
    - cron: '0 9 * * 1'  # Lunes a las 9:00 UTC
  workflow_dispatch:       # Permite ejecución manual

permissions:
  contents: read
  issues: write

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout código
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Instalar dependencias
        run: npm ci

      - name: Ejecutar npm audit
        run: npm audit --json > audit_results.json || true

      - name: Instalar Claude Code
        run: npm install -g @anthropic-ai/claude-code

      - name: Analizar resultados con Claude
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          claude -p "Analiza este reporte de npm audit y genera:
          1. Resumen de vulnerabilidades por severidad
          2. Paquetes que necesitan actualización urgente
          3. Plan de acción priorizado
          4. Comandos específicos para resolver cada vulnerabilidad

          Reporte de audit:
          $(cat audit_results.json)" > dependency_report.txt

      - name: Crear issue con resultados
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const report = fs.readFileSync('dependency_report.txt', 'utf8');
            const date = new Date().toISOString().split('T')[0];
            await github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: `Auditoría de Dependencias - ${date}`,
              body: `## Reporte Semanal\n\n${report}`,
              labels: ['dependencies', 'security']
            });
```

### Paso 5: Crear pipeline CI/CD completo

Crea `.github/workflows/claude-ci-cd.yml`:

```yaml
name: CI/CD con Claude Code

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

permissions:
  contents: read
  pull-requests: write
  checks: write

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --coverage

  claude-review:
    needs: lint-and-test
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - run: npm install -g @anthropic-ai/claude-code
      - name: Review con Claude
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          claude -p "Haz una revisión concisa del PR.
          Enfócate en: bugs potenciales, seguridad, rendimiento.
          Formato: lista de hallazgos con severidad." > review.txt
      - uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const review = fs.readFileSync('review.txt', 'utf8');
            await github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              body: `### Claude CI Review\n${review}`
            });

  deploy-staging:
    needs: [lint-and-test, claude-review]
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy a staging
        run: echo "Desplegando a staging..."
```

### Paso 6: Probar el workflow localmente

Crea una rama y un PR de prueba:

```bash
git checkout -b feature/test-review
echo "// cambio de prueba" >> src/index.js
git add . && git commit -m "feat: cambio de prueba para CI"
git push -u origin feature/test-review
```

Crea el PR desde GitHub y observa cómo se ejecuta el workflow.

### Paso 7: Verificar los resultados

Revisa en la pestaña Actions de GitHub:
- Que el workflow se activó con el PR
- Que Claude generó un comentario de revisión
- Que el pipeline completo terminó sin errores

## Verificación

- [ ] Workflow de code review activado por PRs
- [ ] Routine semanal de auditoría configurada
- [ ] Pipeline CI/CD completo con lint, test y review
- [ ] Secreto ANTHROPIC_API_KEY configurado en GitHub
- [ ] Al menos un PR revisado automáticamente

## Entrega

Documenta en un archivo `lab11-entrega.md`:
1. Los tres archivos YAML completos de workflows
2. Captura del workflow ejecutándose en GitHub Actions
3. Comentario de revisión generado por Claude en un PR
4. Configuración de la Routine semanal
5. Lecciones aprendidas sobre CI/CD con Claude Code

## Criterios de evaluación

| Criterio | Puntos |
|----------|--------|
| Workflow de code review funcional | 25 |
| Routine semanal de dependencias | 20 |
| Pipeline CI/CD completo | 25 |
| Prueba exitosa con PR real | 15 |
| Documentación completa | 15 |
| **Total** | **100** |
