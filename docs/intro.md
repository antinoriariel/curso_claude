---
slug: /
sidebar_position: 0
title: Vision General del Curso
description: "Curso completo «Claude Code: De Cero a Experto» — 40 horas teorico-practicas para dominar la herramienta agente de desarrollo de Anthropic."
---

# Claude Code: De Cero a Experto

Bienvenido al curso mas completo en espanol sobre **Claude Code**, la herramienta de desarrollo agente creada por Anthropic. A lo largo de 40 horas teorico-practicas, pasaras de no conocer la herramienta a dominarla en entornos profesionales y de produccion.

## Que es Claude Code

Claude Code es un **agente de desarrollo** que opera directamente en tu terminal. A diferencia de los asistentes de chat convencionales, Claude Code puede leer tu codigo, editarlo, ejecutar comandos, buscar en la web y orquestar flujos de trabajo complejos de forma autonoma. Piensa en el como un desarrollador senior que vive en tu terminal y entiende todo tu proyecto.

```bash
# Asi de simple es comenzar
claude "Explica la arquitectura de este proyecto"
```

## Por que este curso

El mercado de herramientas de IA para desarrollo evoluciona rapidamente, pero pocas ofrecen el nivel de integracion y autonomia de Claude Code. Este curso existe porque:

- **No hay recursos estructurados en espanol** sobre Claude Code.
- La documentacion oficial, aunque excelente, esta en ingles y dispersa.
- Dominar Claude Code requiere entender conceptos que van mas alla de "escribir prompts".
- Las empresas necesitan profesionales que sepan integrar agentes de IA en flujos reales.

## Estructura del curso

El curso sigue un modelo de **aprendizaje en espiral**: cada nivel retoma conceptos anteriores y los profundiza.

| Nivel | Nombre | Capitulos | Horas | Enfoque |
|-------|--------|-----------|-------|---------|
| 1 | Fundamentos | Cap. 1-4 | 10 h | Arquitectura, instalacion, primeros pasos, prompting |
| 2 | Configuracion y Extensibilidad | Cap. 5-7 | 10 h | CLAUDE.md, herramientas, MCP, hooks |
| 3 | Orquestacion y Escalado | Cap. 8-10 | 10 h | Multi-agente, CI/CD, SDK |
| 4 | Produccion y Gobernanza | Cap. 11-13 | 10 h | Seguridad, costos, casos reales |

**En total:** 4 niveles, 13 capitulos, 48 submodulos, 40 horas.

Cada capitulo incluye:
- Contenido teorico con ejemplos reales.
- Laboratorios practicos guiados.
- Preguntas de autoevaluacion.
- Referencias a la documentacion oficial.

## A quien va dirigido

Este curso esta disenado para:

- **Desarrolladores** que quieran multiplicar su productividad con IA agente.
- **Tech leads y arquitectos** que necesiten evaluar e integrar Claude Code en sus equipos.
- **DevOps / SRE** interesados en automatizar flujos con agentes.
- **Estudiantes avanzados** de ingenieria de software que busquen diferenciarse en el mercado.

:::info No es un curso de "prompting generico"
Este curso se centra exclusivamente en Claude Code como herramienta de desarrollo. No es un curso sobre ChatGPT, Copilot ni asistentes genericos. Aqui aprenderas a usar un agente autonomo en tu terminal.
:::

## Prerequisitos

| Requisito | Nivel esperado |
|-----------|---------------|
| Terminal / linea de comandos | Comodidad basica con bash o PowerShell |
| Git | Comandos fundamentales (clone, commit, push, branch) |
| Algun lenguaje de programacion | Saber leer codigo en al menos un lenguaje |
| Node.js (v18+) | Instalado en tu maquina |
| Cuenta en Anthropic / Claude | Necesaria para obtener acceso a Claude Code |
| Ingles tecnico | Lectura basica (la herramienta opera en ingles) |

No necesitas experiencia previa con herramientas de IA ni con Claude.

## Como navegar el curso

El curso esta organizado como una **documentacion interactiva**:

- Usa la **barra lateral izquierda** para navegar entre niveles y capitulos.
- Cada capitulo tiene **submodulos** que puedes leer en orden o consultar individualmente.
- Los **laboratorios** estan en una seccion separada y se referencian desde cada capitulo.
- Las **referencias** incluyen tablas de comandos, atajos y configuraciones para consulta rapida.

:::tip Recomendacion
Aunque puedes saltar entre secciones, te recomendamos seguir el orden propuesto en tu primera lectura. Cada nivel construye sobre los anteriores.
:::

## Metodologia: aprendizaje en espiral

Este curso aplica el **modelo de aprendizaje en espiral**, donde cada vuelta al concepto agrega profundidad:

1. **Primera exposicion** (Nivel 1): entiendes que es el ciclo agente y como funciona.
2. **Aplicacion practica** (Nivel 2): configuras y extiendes el comportamiento del agente.
3. **Orquestacion** (Nivel 3): coordinas multiples agentes y los integras en pipelines.
4. **Produccion** (Nivel 4): aplicas gobernanza, seguridad y optimizacion de costos.

Cada concepto clave (como el ciclo agente, la ventana de contexto o el sistema de permisos) aparece multiples veces, cada vez con mayor profundidad y contexto.

## Sistema de evaluacion

| Componente | Peso | Descripcion |
|-----------|------|-------------|
| Laboratorios practicos | 40% | Ejercicios guiados con entregables verificables |
| Autoevaluaciones | 20% | Preguntas al final de cada capitulo |
| Proyecto integrador | 25% | Proyecto completo que atraviesa los 4 niveles |
| Participacion y reflexion | 15% | Documentacion de aprendizajes y decisiones |

:::note Sobre los laboratorios
Cada laboratorio incluye criterios claros de completitud. No se trata de "que funcione", sino de que demuestres comprension del por que detras de cada decision.
:::

## Convenciones usadas

A lo largo del curso encontraras estos elementos:

- Los bloques de codigo con `$` indican comandos de terminal.
- Los bloques `:::tip` contienen recomendaciones practicas.
- Los bloques `:::warning` senalan errores comunes o riesgos.
- Los bloques `:::info` proporcionan contexto adicional.
- Las **negritas** destacan terminos clave en su primera aparicion.

## Comencemos

El primer paso es entender como funciona Claude Code por dentro. Diriegete al [Capitulo 1: Arquitectura de Claude Code](/nivel-1-fundamentos/arquitectura-claude-code) para comenzar tu camino de cero a experto.

```bash
# Tu primer comando con Claude Code
claude "Hola, estoy listo para aprender"
```
