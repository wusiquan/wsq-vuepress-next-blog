# pageData属性从哪来

我在看@vuepress/theme-default代码时，看其使用`usePageData`, `usePageFrontmatter`方法，
[usePageData的代码](https://github.com/vuepress/vuepress-next/blob/main/packages/%40vuepress/client/src/composables/pageData.ts)，
[usePageFrontmatter的代码](https://github.com/vuepress/vuepress-next/blob/main/packages/%40vuepress/client/src/composables/pageFrontmatter.ts)
这两个方法都是`@vuepress/client`模块里的

`usePageData`其中部分代码可以看到，这个方法直接返回pageData变量，于是想问pageData哪里来的
```typescript
export const pageDataEmpty = readonly({
  key: '',
  path: '',
  title: '',
  lang: '',
  frontmatter: {},
  excerpt: '',
  headers: [],
} as PageData) as PageData

/**
 * Global page data ref
 */
export const pageData: PageDataRef = ref(pageDataEmpty)

/**
 * Returns the ref of the data of current page
 */
export const usePageData = <
  T extends Record<any, any> = Record<never, never>
>(): PageDataRef<T> => pageData as PageDataRef<T>
```
另`usePageFrontmatter`可以看到使用`inject(pageFrontmatterSymbol)`，而provide的地方是在@vuepress/client/src/setupGlobalCompueted中
```typescript
// @vuepress/client/src/setupGlobalCompueted.ts

// ...

const pageFrontmatter = computed(() =>
  resolvers.resolvePageFrontmatter(pageData.value)
)

// ...

app.provide(pageFrontmatterSymbol, pageFrontmatter)

// ...
```
而[resolves](https://github.com/vuepress/vuepress-next/blob/main/packages/%40vuepress/client/src/resolvers.ts)的resolvePageFrontmatter方法，
于是回到pageData哪里来的问题
```typescript
/**
 * Resolve page frontmatter from page data
 */
resolvePageFrontmatter: (pageData: PageData): PageFrontmatter => pageData.frontmatter
```


在@vuepress/core的appInit中，可以看到app.pages从哪来
```typescript
// @vuepress/core/src/app/appInit.ts

// create pages
app.pages = await resolveAppPages(app)
```

[resolveAppPages代码](https://github.com/vuepress/vuepress-next/blob/main/packages/%40vuepress/core/src/app/resolveAppPages.ts)

它会调用createPage方法
```typescript
// @vuepress/core/src/page/createPage.ts

// plugin hook: extendsPageOptions
await app.pluginApi.hooks.extendsPageOptions.process(options, app)

// ...

const { dataFilePath, dataFilePathRelative, dataFileChunkName } =
    resolvePageDataInfo({ app, htmlFilePathRelative, key })

const page: Page = {
  // page data
  data: {
    key,
    path,
    title,
    lang,
    frontmatter,
    excerpt,
    headers,
  },

  // ...

  // file info
  dataFilePath,
  dataFilePathRelative,
  dataFileChunkName,
  // ...
}

// plugin hook: extendsPage
await app.pluginApi.hooks.extendsPage.process(page, app)

return page
```

在@vuepress/core的preparePagesData和preparePageData中，可以看到他们是如何生成文件
```typescript
// @vuepress/core/src/app/prepare/preparePagesData.ts

import type { App } from '../../types'

/**
 * Generate page key to page component map temp file
 */
export const preparePagesComponents = async (app: App): Promise<void> => {
  // generate page component map file
  const content = `\
import { defineAsyncComponent } from 'vue'
export const pagesComponents = {\
${app.pages
  .map(
    ({ key, path, componentFilePath, componentFileChunkName }) => `
  // path: ${path}
  ${JSON.stringify(key)}: defineAsyncComponent(() => import(${
      componentFileChunkName
        ? `/* webpackChunkName: "${componentFileChunkName}" */`
        : ''
    }${JSON.stringify(componentFilePath)})),`
  )
  .join('')}
}
`

  await app.writeTemp('internal/pagesComponents.js', content)
}
```

实际截图
![temp_internal_pagesdata](@assets/temp_internal_pagesdata.jpg)


```typescript
// @vuepress/core/src/app/prepare/preparePageData.ts

import type { App, Page } from '../../types'

const HMR_CODE = `
if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}
if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
`

/**
 * Generate page data temp file of a single page
 */
export const preparePageData = async (app: App, page: Page): Promise<void> => {
  // page data file content
  let content = `export const data = ${JSON.stringify(page.data, null, 2)}\n`

  // inject HMR code
  if (app.env.isDev) {
    content += HMR_CODE
  }

  await app.writeTemp(page.dataFilePathRelative, content)
}
```

实际截图
![temp_pages](@assets/temp_pages.jpg)

