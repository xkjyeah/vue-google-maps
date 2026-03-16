import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { GITHUB_URI, PROJECT_NAME } from './constants';

const config: Config = {
  title: 'GmapVue Docs',
  tagline: 'Documentation about GmapVue plugin',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://diegoazh.github.io/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/gmap-vue/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: GITHUB_URI, // Usually your GitHub org/user name.
  projectName: PROJECT_NAME, // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: GITHUB_URI,
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: GITHUB_URI,
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'GmapVue Docs',
      logo: {
        alt: 'GmapVue Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'vue3Version',
          position: 'left',
          label: 'version for Vue@3',
        },
        {
          type: 'docSidebar',
          sidebarId: 'vue2Version',
          position: 'left',
          label: 'version for Vue@2',
        },
        { to: '/blog', label: 'Blog', position: 'left' },
        {
          href: GITHUB_URI,
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'version for Vue@3',
              to: '/docs/vue-3-version/',
            },
            {
              label: 'version for Vue@2',
              to: '/docs/vue-2-version/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: GITHUB_URI,
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Diego A. Zapata Häntsch. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
