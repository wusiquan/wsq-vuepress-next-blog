# layout做什么的

/core/src/preparePagesRoutes.ts中会引用Vuepress作为路由组件
在/client/src/components/Vuepress.ts有走page.value.frontmatter.layout，默认Layout, 404组件的逻辑

而/core/appPrepare中会在`preparePageComponent`时生成页面，默认是theme-default中，这里暂时就不展开了

所以，可以认为layout是页面路由的入口，同时就像文档说的需要有个404页面 [文档路径]()

