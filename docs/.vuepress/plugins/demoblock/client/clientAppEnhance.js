import { defineClientAppEnhance } from '@vuepress/client'
import DemoBlock from './DemoBlock.vue'

export default defineClientAppEnhance(({ app }) => {
  app.component('DemoBlock', DemoBlock)
})