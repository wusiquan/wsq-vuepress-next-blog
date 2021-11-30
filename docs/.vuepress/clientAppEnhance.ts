import { defineClientAppEnhance } from '@vuepress/client'
// @ts-ignore
import Hello from './components/Hello.vue'

export default defineClientAppEnhance(({ app, router, siteData }) => {
  app.component('Hello', Hello)
})