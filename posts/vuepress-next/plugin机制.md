# plugin机制

@vuepress/core/src/pluginApi/creatPluginApi模块主要是导出3个对象plugins, hooks, registerHooks

1. plugins对象的创建  
`const plugins: PluginApi['plugins'] = []`

2. hooks对象的创建  
`const hooks = createPluginApiHooks()`

pluginApi/createPluginApiHook方法，返回一个类型为`[K in HooksName]: HookQueue<K>`的对象，其内部会调用`createHookQueue`
```typescript
export const createPluginApiHooks = (): PluginApi['hooks'] => ({
  // life cycle hooks
  onInitialized: createHookQueue('onInitialized'),
  onPrepared: createHookQueue('onPrepared'),
  onWatched: createHookQueue('onWatched'),
  onGenerated: createHookQueue('onGenerated'),

  // page hooks
  extendsPageOptions: createHookQueue('extendsPageOptions'),
  extendsPageData: createHookQueue('extendsPageData'),

  // markdown hooks
  extendsMarkdown: createHookQueue('extendsMarkdown'),

  // client files hooks
  clientAppEnhanceFiles: createHookQueue('clientAppEnhanceFiles'),
  clientAppRootComponentFiles: createHookQueue('clientAppRootComponentFiles'),
  clientAppSetupFiles: createHookQueue('clientAppSetupFiles'),

  // bundler hooks
  alias: createHookQueue('alias'),
  define: createHookQueue('define'),
})
```

3. registerHooks函数的创建  
`const registerHooks = createPluginApiRegisterHooks(plugins, hooks)`
createPluginApiRegisterHooks是函数的函数，即调用后返回一个无参数的函数，这里用于延迟调用

其里面的函数主要是遍历plugins对象，对各种类型hookQueue进行normalize后add，其中commonHooks是单个plugin对象中其余属性(没有前面的name, alias, define...)组成的对象

add方法的参数对象其实就是这里所谓的hookItem
```typescript
export const createPluginApiRegisterHooks = (
  plugins: PluginApi['plugins'],
  hooks: PluginApi['hooks']
): PluginApi['registerHooks'] => () => {
  plugins.forEach(
    ({
      name: pluginName,

      alias,
      define,
      clientAppEnhanceFiles,
      clientAppRootComponentFiles,
      clientAppSetupFiles,

      ...commonHooks
    }) => {
      /**
       * hooks that need to be normalized
       */
      if (alias) {
        hooks.alias.add({
          pluginName,
          hook: normalizeReturnObjectHook(alias),
        })
      }

      if (define) {
        hooks.define.add({
          pluginName,
          hook: normalizeReturnObjectHook(define),
        })
      }

      if (clientAppEnhanceFiles) {
        hooks.clientAppEnhanceFiles.add({
          pluginName,
          hook: normalizeClientFilesHook(clientAppEnhanceFiles),
        })
      }

      if (clientAppRootComponentFiles) {
        hooks.clientAppRootComponentFiles.add({
          pluginName,
          hook: normalizeClientFilesHook(clientAppRootComponentFiles),
        })
      }

      if (clientAppSetupFiles) {
        hooks.clientAppSetupFiles.add({
          pluginName,
          hook: normalizeClientFilesHook(clientAppSetupFiles),
        })
      }

      /**
       * common hooks
       */
      Object.entries(commonHooks).forEach(([key, hook]) => {
        if (hooks[key] && hook) {
          hooks[key].add({
            pluginName,
            hook,
          })
        }
      })
    }
  )
}
```

对于dev命令  
@vuepress/cli/src/commands/dev/createDev导出的createDev方法
```typescript
export const createDev = (defaultAppConfig: Partial<AppConfig>): DevCommand => {
  // ...

  // create vuepress app
  const app = createDevApp({
    // allow setting default app config via `cli()`
    // for example, set different default bundler in `vuepress` and `vuepress-vite` package
    ...defaultAppConfig,
    // use cli options to override config file
    ...userConfig,
    ...cliAppConfig,
  })

  // use user-config plugin
  app.use(transformUserConfigToPlugin(app, userConfig))

  // ...
  await app.init()
  await app.prepare()

  // ...
}
```
它会createDev -> createDevApp -> createBaseApp  
而createBaseApp方法中会app.use主题的plugins以及options.plugins中的plugin
```typescript
export const createBaseApp = (config: AppConfig, isBuild = false): App => {
  // ...
  const app = {
    // ...
    writeTemp,
    use: (...args) => appUse(app, ...args),
    init: () => appInit(app),
    prepare: () => appPrepare(app),
  } as App

  // resolve theme info and use theme plugins
  const themeInfo = resolveThemeInfo(app, options.theme)
  themeInfo.plugins.forEach((plugin) => app.use(plugin))
  app.layouts = themeInfo.layouts

  // resolve plugins
  const plugins = resolvePluginsFromConfig(app, options.plugins)
  plugins.forEach((plugin) => app.use(plugin))

  return app
}
```
在appUse中`app.pluginApi.plugins.push(plugin)`

回到createDev方法会继续`app.use(transformUserConfigToPlugin(app, userConfig))`，他将userConfig对象即config.ts中定义的对象也转成了plugin对象(其实也就加name属性, 检查clientAppEnhanceFiles属性, 见transformUserConfigToPlugin方法)
再调用app.init()，而它在appInit中会调用`app.pluginApi.registerHooks()`

*所以app.use是决定app.pluginApi.plugins对象, *

一句话描述:
createPluginApiHooks方法创建hooks，为定义好的一些类型的hookQueue，其中hookQueue可理解为一个数组(实际是name, items属性以及add, process方法组成的对象), 然后在createDev->createDevApp->createBaseApp、createBuild->createBuildApp->createBaseApp时app.use将app.pluginApi.plugins.push(plugin), 接着app.init时调用app.pluginApi.registerHooks()，遍历plugins为各种hookQueue.add(即注册)hookItem，这样就可以在各个时机调用对应hookQueue.process方法