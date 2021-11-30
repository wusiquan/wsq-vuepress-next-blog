import path from 'path'
import { defineUserConfig } from '@vuepress/cli'
import type { DefaultThemeOptions } from '@vuepress/theme-default'
import { sidebar } from './configs'
import emoji from 'markdown-it-emoji'

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
      // {
      //   text: 'vuepress-next',
      //   link: '/posts/vuepress-next/'
      //   // ariaLabel: '导航',
      //   // children: [
      //   //   { text: '测试', link: '/posts/vuepress-next/' },
      //   //   { text: 'vuepress-next', link: '/posts/vuepress-next/vuepress2%E7%9A%84Layout' }
      //   // ]
      // },
      {
        text: 'test',
        link: '/test'
      }
    ],

    sidebar,

    themePlugins: {
      // backToTop: false
      prismjs: false
    },

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
    [ '@vuepress/plugin-shiki', { theme: 'dracula-soft' } ],
    // [ require('./plugins/demoblock'), {} ]
  ],

  extendsMarkdown: (md) => {
    md.use(emoji)
    /*
        https://github.com/markdown-it/markdown-it-container的示例
        :::spoiler click me
        *content*
        :::
     */
    md.use(require('markdown-it-container'), 'spoiler', {
      validate: function(params) {
        return params.trim().match(/^spoiler\s+(.*)$/)
      },
    
      render: function (tokens, idx) {
        var m = tokens[idx].info.trim().match(/^spoiler\s+(.*)$/)
    
        if (tokens[idx].nesting === 1) {
          // opening tag
          return '<details><summary>' + md.utils.escapeHtml(m[1]) + '</summary>\n'
        } else {
          // closing tag
          return '</details>\n'
        }
      }
    })
  }
})
