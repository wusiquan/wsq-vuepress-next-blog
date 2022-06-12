import path from 'path'
import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from '@vuepress/cli'
import { defaultTheme } from '../../theme-default'
import { sidebar } from './configs'
import { shikiPlugin } from '@vuepress/plugin-shiki'
// import emoji from 'markdown-it-emoji'

export default defineUserConfig({
  base: '/wsq-vuepress-next-blog/',
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

  theme: defaultTheme({
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
      },
      {
        text: 'eslint',
        link: '/posts/eslint/'
      },
      {
        text: '小程序开发',
        link: '/posts/miniprogram/'
      }
    ],

    sidebar,

    themePlugins: {
      // backToTop: false
      prismjs: false
    },

    // page meta
    editLinkText: '在 GitHub 上编辑此页',
  }),

  alias: {
    '@assets': path.resolve(__dirname, './assets')
  },
  // https://v2.vuepress.vuejs.org/reference/bundler/webpack.html#options
  // https://v2.vuepress.vuejs.org/reference/bundler/vite.html#viteoptions
  bundler: viteBundler({
    viteOptions: {},
    vuePluginOptions: {}
  }),

  plugins: [
    shikiPlugin({
      theme: 'dracula-soft'
    })
    // [ '@vuepress/plugin-shiki', { theme: 'dracula-soft' } ],
    // [ require('./plugins/demoblock'), {} ]
  ],

  // extendsMarkdown: (md) => {
  //   md.use(emoji)
  //   /*
  //       https://github.com/markdown-it/markdown-it-container的示例
  //       :::spoiler click me
  //       *content*
  //       :::
  //    */
  //   md.use(require('markdown-it-container'), 'spoiler', {
  //     validate: function(params) {
  //       return params.trim().match(/^spoiler\s+(.*)$/)
  //     },
    
  //     render: function (tokens, idx) {
  //       var m = tokens[idx].info.trim().match(/^spoiler\s+(.*)$/)
    
  //       if (tokens[idx].nesting === 1) {
  //         // opening tag
  //         return '<details><summary>' + md.utils.escapeHtml(m[1]) + '</summary>\n'
  //       } else {
  //         // closing tag
  //         return '</details>\n'
  //       }
  //     }
  //   })
  // }
})
