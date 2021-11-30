const { path } = require('@vuepress/utils')
const { shikiPlugin } = require('@vuepress/plugin-shiki')
const mdContainer = require('markdown-it-container')

const blockPlugin = md => {
  md.use(mdContainer, 'demo', {
    validate(params) {
      return params.trim().match(/^demo\s*(.*)$/)
    },
    render(tokens, idx) {
      if (tokens[idx].nesting === 1) {
        console.log(333, tokens[idx + 1])
        // const description = m && m.length > 1 ? m[1] : ''
        const content = tokens[idx + 1].type === 'fence' ? tokens[idx + 1].content : ''
        // return `<DemoBlock sourceCode="${md.utils.escapeHtml(content)}">${
        //   content ? `<!--vue-demo:${content}:vue-demo-->` : ''
        // }`

        return `<DemoBlock>`
      } else if (tokens[idx].nesting === -1) {
        return '</DemoBlock>'
      }
    }
  })
}

const codePlugin = (md, options) => {
  const lang = options?.lang || 'vue'
  const defaultRender = md.renderer.rules.fence
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    // 判断该 fence 是否在 :::demo 内
    const prevToken = tokens[idx - 1]
    const isInDemoContainer = prevToken && prevToken.nesting === 1 && prevToken.info.trim().match(/^demo\s*(.*)$/)
    if (token.info.trim() === lang && isInDemoContainer) {
      const m = prevToken.info.trim().match(/^demo\s*(.*)$/)
      const description = m && m.length > 1 ? m[1] : ''
      return `
        ${
          description
            ? `<template #description>
          <div>${md.renderInline(description)}</div>
        </template>`
            : ''
        }
          <div v-pre class="language-${lang}">
            ${md.options.highlight(token.content, lang) || ''}
          </div>
        `
    }
    return defaultRender(tokens, idx, options, env, self)
  }
}

const renderPlugin = (md, options) => {
  const render = md.render
  md.render = (...args) => {
    let result = render.call(md, ...args)
    const arr = args
    const startTag = '<!--vue-demo:'
    const endTag = ':vue-demo-->'
    // if (result.indexOf(startTag) !== -1 && result.indexOf(endTag) !== -1) {
    //   // const { template, script, style } = renderDemoBlock(result, options)
    //   result = '<Hello />' + results
    //   // const hoistedTags = arr[1].hoistedTags || (arr[1].hoistedTags = [])
    //   // hoistedTags.push('<script>export default {}</script>')
    //   // hoistedTags.push('<style>.a { color: red }</style>')
    // }
    // result = '<Hello />' + result
    return result
  }
}

module.exports = (
  { theme = 'github-light', langs = [], lang = 'vue', scriptImports = [] },
  app
) => {
  return {
    name: 'vuepress-plugin-demoblock-plus',
    clientAppEnhanceFiles: path.resolve(__dirname, '../client/clientAppEnhance.js'),
    extendsMarkdown: async (md) => {
      // await shikiPlugin({ theme, langs }).extendsMarkdown(md)
      md.use(blockPlugin)
      md.use(codePlugin, {
        lang
      })
      md.use(renderPlugin, {
        lang,
        scriptImports
      })
    }
  }
}
