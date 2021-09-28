import type { SidebarConfig } from '@vuepress/theme-default'

export const sidebar: SidebarConfig = {
  '/posts/vuepress-next': [
    {
      text: 'vuepress-next分析',
      children: [
        'README.md',
        'hello.md',
        'sidebar不展示.md',
        'Layout规则及其原理.md'
      ]
    }
  ]
}
