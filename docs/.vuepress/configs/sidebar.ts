import type { SidebarConfig } from '@vuepress/theme-default'

export const sidebar: SidebarConfig = {
  '/posts/vuepress-next': [
    {
      text: 'vuepress-next分析',
      children: [
        'README.md',
        'theme加载流程.md',
        'layout做什么的.md',
        'plugin机制.md',
        // 感觉可以通过frontter? 来给个标签
        'sidebar不展示.md',
        '尝试禁用某个插件.md',
        'clientAppRootComponentFiles钩子插件分析.md'
      ]
    }
  ]
}
