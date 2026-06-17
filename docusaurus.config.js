// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Claude Code: De Cero a Experto',
  tagline: 'Curso completo de Claude Code — 40 horas teórico-prácticas',
  favicon: 'img/favicon.ico',
  url: 'https://claude.antinori.com.ar',
  baseUrl: '/',
  organizationName: 'curso-claude-code',
  projectName: 'curso-claude-code',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'es',
    locales: ['es'],
  },
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: '/',
          showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Claude Code: De Cero a Experto',
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'cursoSidebar',
            position: 'left',
            label: 'Curso',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Curso',
            items: [
              { label: 'Inicio', to: '/' },
              { label: 'Laboratorios', to: '/laboratorios/L1-1-exploracion-ciclo-agente' },
            ],
          },
          {
            title: 'Recursos',
            items: [
              { label: 'Claude Code Docs', href: 'https://code.claude.com/docs/en/' },
              { label: 'Anthropic', href: 'https://www.anthropic.com' },
            ],
          },
        ],
        copyright: `CC BY 4.0 — ${new Date().getFullYear()}. No afiliado con Anthropic, Inc.`,
      },
      prism: {
        theme: require('prism-react-renderer').themes.github,
        darkTheme: require('prism-react-renderer').themes.dracula,
        additionalLanguages: ['bash', 'json', 'yaml', 'markdown'],
      },
    }),
};

module.exports = config;
