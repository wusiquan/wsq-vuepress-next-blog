# theme加载流程

dev情况  
cli/src/commands/dev/createDev.ts中调用`createDevApp`方法
我打印下入参config
```javascript
{
  bundler: '@vuepress/bundler-webpack',
  base: '/',
  head: [ [ 'link', [Object] ], [ 'meta', [Object] ] ],
  themeConfig: {
    docsDir: '.',
    navbar: [ [Object] ],
    sidebar: { '/posts/vuepress-next': [Array] },
    editLinkText: '在 GitHub 上编辑此页'
  },
  alias: {
    '@assets': '/Users/wusiquan/Desktop/siquangit/wsq-vuepress-next-blog/docs/.vuepress/assets'
  },
  bundlerConfig: { evergreen: true },
  source: '/Users/wusiquan/Desktop/siquangit/wsq-vuepress-next-blog/docs'
}
```
它会调用`createBaseApp`方法，将config传递过去，
首先会createAppOptions(config)，返回app级options，这里能看出很多默认值
```typescript
export const createAppOptions = ({
  // site config
  base = '/',
  lang = 'en-US',
  title = '',
  description = '',
  head = [],
  locales = {},

  // theme config
  theme = '@vuepress/default',
  themeConfig = {},

  // bundler config
  bundler = '@vuepress/webpack',
  bundlerConfig = {},

  // directory config
  source,
  dest = path.resolve(source, '.vuepress/dist'),
  temp = path.resolve(source, '.vuepress/.temp'),
  cache = path.resolve(source, '.vuepress/.cache'),
  public: publicDir = path.resolve(source, '.vuepress/public'),

  // markdown config
  markdown = {},

  // development config
  host = '0.0.0.0',
  port = 8080,
  debug = false,
  open = false,
  pagePatterns = ['**/*.md', '!.vuepress', '!node_modules'],
  templateDev = path.normalize(
    require.resolve('@vuepress/client/templates/index.dev.html')
  ),
  templateSSR = path.normalize(
    require.resolve('@vuepress/client/templates/index.ssr.html')
  ),
  shouldPreload = true,
  shouldPrefetch = false,

  // plugin config
  plugins = [],
}: AppConfig): AppOptions => ({
  base,
  lang,
  title,
  description,
  head,
  locales,
  theme,
  themeConfig,
  bundler,
  bundlerConfig,
  source,
  dest,
  temp,
  cache,
  public: publicDir,
  markdown,
  debug,
  host,
  port,
  open,
  pagePatterns,
  templateDev,
  templateSSR,
  shouldPreload,
  shouldPrefetch,
  plugins,
})
```
接着resolveThemeInfo(app, options.theme)

resolveThemeInfo里resolveTheme, resolveTheme中就获取到theme, resolveTheme内会requireResolve再通过resolvePlugin他会考虑周全些，如isString(plugin), isFunction(pluginModule)的判断，从而找到theme对象，这里是默认情况，找到的是theme-default, 它导出是的一个函数，所以resolvePlugin中会调用`pluginModule(config, app)`

回到resolveThemeInfo发现theme.extends再递归找一下父主题

这样就在createBaseApp中用上了主题的plugins和layout，这个"用上"又可以讲一讲