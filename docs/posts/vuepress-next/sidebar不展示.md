# sidebar不展示

vuepress-next sidebar不展示的情况肯定有多种

我的情况是config中配置sidebar的路径与文章md的目录不同导致

![config_sidebar](@assets/config_sidebar.jpg)

原因是theme-default中useSidebarItems.ts(theme-default/src/client/composables/useSidebarItems.ts)中`setupSidebarItems`方法调用`resolveSidebarItems`方法，走到`isPlainObject(side)`条件中调用`resolveMultiSidebarItems`方法

![resolveMultiSidebarItems](@assets/resolveMultiSidebarItems.jpg)

由于`resolveMultiSidebarItems`方法中的判断，发现不匹配, 导致`setupSidebarItems中provide的sidebarItems为[]`
这样在theme-default/src/client/components/Sidebar.vue组件，即侧边栏中使用时useSidebarItems()就是空数组的了
而Sidebar.vue组件是在theme-default/src/client/layouts/Layout.vue组件中使用的