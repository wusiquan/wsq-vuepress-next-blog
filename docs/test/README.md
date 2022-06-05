# hello

## compiler

compiler-sfc/parse.ts中
```typescript
// compiler-sfc/parse.ts
const ast = compiler.parse(source, {
  // there are no components at SFC parsing level
  isNativeTag: () => true,
  // preserve all whitespaces
  isPreTag: () => true,
  getTextMode: ({ tag, props }, parent) => {
  },
  onError: e => {
  }
})
```
调用compiler-dom/index.ts的parse函数
而它会调用compiler-core/parse.ts的baseParse函数，其中选项会extend parseOptions
```typescript
// compiler-dom/index.ts
export function parse(template: string, options: ParserOptions = {}): RootNode {
  return baseParse(template, extend({}, parserOptions, options))
}

// parseOptions常量
// compiler-dom/parseOptions.ts
export const parserOptions: ParserOptions = {
  isVoidTag,
  isNativeTag: tag => isHTMLTag(tag) || isSVGTag(tag),
  isPreTag: tag => tag === 'pre',
  decodeEntities: __BROWSER__ ? decodeHtmlBrowser : decodeHtml,
  isBuiltInComponent: (tag: string): symbol | undefined => {
  },
  // https://html.spec.whatwg.org/multipage/parsing.html#tree-construction-dispatcher
  getNamespace(tag: string, parent: ElementNode | undefined): DOMNamespaces {
  },
  // https://html.spec.whatwg.org/multipage/parsing.html#parsing-html-fragments
  getTextMode({ tag, ns }: ElementNode): TextModes {
  }
}
```

其中ParserOptions的类型定义，在compiler-core/options.ts
```typescript
export interface ParserOptions
  extends ErrorHandlingOptions,
    CompilerCompatOptions {
  /**
   * e.g. platform native elements, e.g. `<div>` for browsers
   */
  isNativeTag?: (tag: string) => boolean
  /**
   * e.g. native elements that can self-close, e.g. `<img>`, `<br>`, `<hr>`
   */
  isVoidTag?: (tag: string) => boolean
  /**
   * e.g. elements that should preserve whitespace inside, e.g. `<pre>`
   */
  isPreTag?: (tag: string) => boolean
  /**
   * Platform-specific built-in components e.g. `<Transition>`
   */
  isBuiltInComponent?: (tag: string) => symbol | void
  /**
   * Separate option for end users to extend the native elements list
   */
  isCustomElement?: (tag: string) => boolean | void
  /**
   * Get tag namespace
   */
  getNamespace?: (tag: string, parent: ElementNode | undefined) => Namespace
  /**
   * Get text parsing mode for this element
   */
  getTextMode?: (
    node: ElementNode,
    parent: ElementNode | undefined
  ) => TextModes
  /**
   * @default ['{{', '}}']
   */
  delimiters?: [string, string]
  /**
   * Whitespace handling strategy
   */
  whitespace?: 'preserve' | 'condense'
  /**
   * Only needed for DOM compilers
   */
  decodeEntities?: (rawText: string, asAttr: boolean) => string
  /**
   * Whether to keep comments in the templates AST.
   * This defaults to `true` in development and `false` in production builds.
   */
  comments?: boolean
}
```

在@vitejs/plugin-vue中调用compiler-sfc/compileTemplate的compileTemplate函数
compileTemplate函数会调用doCompileTemplate，doCompileTemplate会调用compiler-dom/index的compile函数
```typescript
// compiler-sfc/compileTemplat的doCompileTemplate函数中

let { code, ast, preamble, map } = compiler.compile(source, {
  mode: 'module',
  prefixIdentifiers: true,
  hoistStatic: true,
  cacheHandlers: true,
  ssrCssVars:
    ssr && ssrCssVars && ssrCssVars.length
      ? genCssVarsFromList(ssrCssVars, shortId, isProd)
      : '',
  scopeId: scoped ? longId : undefined,
  slotted,
  sourceMap: true,
  ...compilerOptions,
  nodeTransforms: nodeTransforms.concat(compilerOptions.nodeTransforms || []),
  filename,
  onError: e => errors.push(e),
  onWarn: w => warnings.push(w)
})

// compiler-dom/index的compile函数中
baseCompile(
  template,
  extend({}, parserOptions, options, {
    nodeTransforms: [
      // ignore <script> and <tag>
      // this is not put inside DOMNodeTransforms because that list is used
      // by compiler-ssr to generate vnode fallback branches
      ignoreSideEffectTags,
      ...DOMNodeTransforms,
      ...(options.nodeTransforms || [])
    ],
    directiveTransforms: extend(
      {},
      DOMDirectiveTransforms,
      options.directiveTransforms || {}
    ),
    transformHoist: __BROWSER__ ? null : stringifyStatic
  })
)

// 其中compiler-dom/parserOptions的paserOptions
export const paserOptions: ParserOptions = {
  isVoidTag,
  isNativeTag: tag => isHTMLTag(tag) || isSVGTag(tag),
  isPreTag: tag => tag === 'pre',
  decodeEntities: __BROWSER__ ? decodeHtmlBrowser : decodeHtml,
  isBuiltInComponent: (tag: string): symbol | undefined => {
  },
  // https://html.spec.whatwg.org/multipage/parsing.html#tree-construction-dispatcher
  getNamespace(tag: string, parent: ElementNode | undefined): DOMNamespaces {
  },
  getTextMode({ tag, ns }: ElementNode): TextModes {
  }
}
```
compiler-dom/index的compile函数会compiler-core/compile的baseCompile函数
它会调用compiler-core/parse的baseParse函数
```typescript
// compiler-core/compile的compile函数
const ast = isString(template) ? baseParse(template, options) : template


// compiler-core/parse的baseParse珊瑚
export function baseParse(
  content: string,
  options: ParserOptions = {}
): RootNode {
  const context = createParserContext(content, options)
  const start = getCursor(context)
  return createRoot(
    parseChildren(context, TextModes.DATA, []),
    getSelection(context, start)
  )
}
```



https://docs.chenjianhui.site/vuepress-plugin-demo-container/zh/started.html#%E5%AE%89%E8%A3%85
https://calebman.github.io/vuepress-plugin-demo-container/complex.html#todomvc-example

https://github.com/markdown-it/markdown-it-container

element
https://github.com/ElemeFE/element/blob/dev/build/md-loade