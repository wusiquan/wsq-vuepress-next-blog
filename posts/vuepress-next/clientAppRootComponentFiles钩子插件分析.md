# clientAppRootComponentFiles钩子插件分析

@vuepress/core/app

resolveThemeInfo会调用resolveTheme(app, themeName)

```typescript
const resolveThemeInfo = (app, themeName) => {
  // resolve current theme info
  const theme = resolveTheme(app, themeName)
  const themeInfo = {
    layouts: resolveThemeLayouts(theme.layouts),
    plugins: [theme, ...resolvePluginsFromConfig(app, theme.plugins)],
  }

  // ...
}
```

resolveTheme内调用resolvePlugin方法, resolvePlugin(app, themeEntry, app.options.themeConfig)
其中themeEntry值这里是@vuepress/theme-default/lib/node/index，defaultTheme导出如下
```typescript
export const defaultTheme: Theme<DefaultThemeOptions> = ({
  themePlugins = {},
  ...localeOptions
}) => {
  return {
    name: '@vuepress/theme-default',

    // ...

    plugins: [
      ['@vuepress/back-to-top', themePlugins.backToTop !== false],
      // ...
    ]

    // ...
  }
}
```
resolvePlugin方法发现其是一个函数类型，会调用pluginModule(config, app)，返回到resolveThemeInfo方法，调用resolvePluginsFromConfig(app, theme.plugins)，它会遍历plugins调用resolvePlugin(app, plugin, config === true ? {} : config)，这里plugin参数值为'@vuepress/back-to-top', config参数值为表达式`themePlugins.backToTop !== false`的值，同样resolvePlugin方法发现@vuepress/plugin-back-to-top导出是一个函数类型，会调用pluginModule(config, app)
```typescript
export const backToTopPlugin: Plugin<BackToTopPluginOptions> = (_, app) => {
  if (app.env.isDev && app.options.bundler.endsWith('vite')) {
    // eslint-disable-next-line import/no-extraneous-dependencies
    app.options.bundlerConfig.viteOptions = require('vite').mergeConfig(
      app.options.bundlerConfig.viteOptions,
      {
        optimizeDeps: {
          exclude: ['ts-debounce'],
        },
      }
    )
  }

  return {
    name: '@vuepress/plugin-back-to-top',

    clientAppRootComponentFiles: path.resolve(
      __dirname,
      '../client/components/BackToTop.js'
    ),
  }
}
```

在@vuepress/cli/commands/dev/createDev调用app.init()
即@vuepress/core/app/appInit, 内部调用app.pluginApi.registerHooks()

```typescript
/**
 * Initialize a vuepress app
 *
 * Plugins should be used before initialization.
 */
export const appInit = async (app: App): Promise<void> => {
  // ...

  // register all hooks of plugins that have been used
  // plugins should be used before `registerHooks()`
  // hooks in plugins will take effect after `registerHooks()`
  app.pluginApi.registerHooks()

  // ...
}
```

@vuepress/core/pluginApi/createPluginApiRegisterHooks中的内部函数, 打印可看到plugins数组中的对应项{name: '@vuepress/plugin-back-to-top', clientAppRootComponentFiles: '/xxxx/node_modules/@vuepress/plugin-back-to-top/lib/client/components/BackToTop.js'}
这里normalizeClientFilesHook是个高阶函数, 实际就是对plugin-back-to-top插件node导出的clientAppRootComponentFiles路径/xxx/node_modules/@vuepress/plugin-back-to-top/lib/client/components/BackToTop.js，标准化为数组形式，并检查对应文件是否存在
```typescript
const createPluginApiRegisterHooks = (plugins, hooks) => () => {
  plugins.forEach(({ name: pluginName, alias, define, clientAppEnhanceFiles, clientAppRootComponentFiles, clientAppSetupFiles, ...commonHooks }) => {
    // ...

    if (clientAppRootComponentFiles) {
      hooks.clientAppRootComponentFiles.add({
        pluginName,
        hook: normalizeClientFilesHook(clientAppRootComponentFiles),
      })
    }

    // ...
  })
}
```
在@vuepress/cli/commands/dev/createDev调用app.prepare()
即@vuepress/core/app/appPrepare, 内部调用prepareClientAppRootComponents(app)

```typescript
// @vuepress/core/app/appPrepare.ts
export const appPrepare = async (app: App): Promise<void> => {
  // ...

  // generate client app root components file
  await prepareClientAppRootComponents(app)

  // ...
}
```
在@vuepress/core/app/prepare/prepareClientAppRootComponents中process，实际就是对上面`add`后的[
  {
    pluginName: '@vuepress/plugin-back-to-top',
    hook: [AsyncFunction (anonymous)]
  }
]进行处理，返回结果clientAppRootComponentFiles为[
  [
    '/xxxx/node_modules/@vuepress/plugin-back-to-top/lib/client/components/BackToTop.js'
  ]
]
```typescript
// @vuepress/core/app/prepare/prepareClientAppRootComponents
import type { App } from '../../types'

/**
 * Generate client app root components temp file
 */
export const prepareClientAppRootComponents = async (
  app: App
): Promise<void> => {
  // plugin hook: clientAppRootComponentFiles
  const clientAppRootComponentFiles = await app.pluginApi.hooks.clientAppRootComponentFiles.process(
    app
  )

  // flat the hook result to get the file paths array
  const filePaths = clientAppRootComponentFiles.flat()

  // generate client app root components files entry
  const content = `\
${filePaths
  .map(
    (filePath, index) =>
      `import clientAppRootComponent${index} from '${filePath}'`
  )
  .join('\n')}

export const clientAppRootComponents = [
${filePaths.map((_, index) => `  clientAppRootComponent${index},`).join('\n')}
]
`

  await app.writeTemp('internal/clientAppRootComponents.js', content)
}
```
所以会写入.temp/internal/clientAppRootComponents.js
```javascript
import clientAppRootComponent0 from '/xxx/node_modules/@vuepress/plugin-back-to-top/lib/client/components/BackToTop.js'

export const clientAppRootComponents = [
  clientAppRootComponent0,
]

```
在@vuepress/client/app中可以看到使用全局组件clientAppRootComponents
```typescript
// ...
import { clientAppRootComponents } from '@internal/clientAppRootComponents'
import { createApp, createSSRApp, h } from 'vue'
// ...

export const createVueApp: CreateVueAppFunction = async () => {
  // create vue app
  const app = appCreator({
    name: 'VuepressApp',

    setup() {
      // ...

      return () => [
        h(RouterView),
        ...clientAppRootComponents.map((comp) => h(comp)),
      ]
    },
  })

  // ...

  return {
    app,
    // router,
  }
}

// mount app in client bundle
if (!__VUEPRESS_SSR__) {
  createVueApp().then(({ app, router }) => {
    router.isReady().then(() => {
      app.mount('#app')
    })
  })
}
```