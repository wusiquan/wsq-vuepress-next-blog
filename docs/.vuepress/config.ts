import path from 'path'
import { defineUserConfig } from '@vuepress/cli'
import type { DefaultThemeOptions } from '@vuepress/theme-default'
import { sidebar } from './configs'

export default defineUserConfig<DefaultThemeOptions>({
  base: '/',
  head: [
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: `/favicon.ico`
      }
    ],
    [ 'meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' } ]
  ],

  themeConfig: {
    docsDir: '.',
    
    navbar: [
      {
        text: 'vuepress-next',
        link: '/posts/vuepress-next/'
        // ariaLabel: '导航',
        // children: [
        //   { text: '测试', link: '/posts/vuepress-next/' },
        //   { text: 'vuepress-next', link: '/posts/vuepress-next/vuepress2%E7%9A%84Layout' }
        // ]
      }
    ],

    sidebar,

    // themePlugins: {
    //   backToTop: false
    // },

    // page meta
    editLinkText: '在 GitHub 上编辑此页',
  },

  alias: {
    '@assets': path.resolve(__dirname, './assets')
  },
  // https://v2.vuepress.vuejs.org/reference/bundler/webpack.html#options
  bundlerConfig: {
    evergreen: true
  },

  plugins: [
    // "@vuepress/debug"
  ]
})
