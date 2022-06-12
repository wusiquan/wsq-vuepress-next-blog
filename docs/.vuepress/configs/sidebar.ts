import type { SidebarConfig } from '@vuepress/theme-default'

export const sidebar: SidebarConfig = {
  '/test': [
    {
      text: '测试',
      children: [
        'README.md'
      ]
    }
  ],

  '/posts/vuepress-next': [
    {
      text: 'vuepress-next分析',
      children: [
        'README.md',
        'theme加载流程.md',
        'pageData属性从哪来',
        'layout做什么的.md',
        'plugin机制.md',
        // 感觉可以通过frontter? 来给个标签
        'sidebar不展示.md',
        '尝试禁用某个插件.md',
        'clientAppRootComponentFiles钩子插件分析.md'
      ]
    }
  ],

  '/posts/eslint': [
    {
      text: 'eslint分析',
      children: [
        'README.md',
        'eslint中的eslint:all',
        '插件vue配置的configs'
      ]
    }
  ],

  '/posts/miniprogram': [
    {
      text: '小程序开发',
      children: [
        'README.md',
        '分享场景',
        '性能优化-getSystemInfoSync'
      ]
    }
  ]

  // '/posts/typescript': [
  //   {
  //     text: 'typescript分析',
  //     children: [
  //       'README.md',
  //       'shiki里看到编辑器提示.md'
  //     ]
  //   }
  // ],

  // '/posts/markdown-it': [
  //   {
  //     text: 'markdown-it分析',
  //     children: [
  //       'README.md'
  //     ]
  //   }
  // ]
}
