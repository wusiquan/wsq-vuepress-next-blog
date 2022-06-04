### 测试目录下的README.md

theme-default代码是copy 2.0.0-beta.46版本

aaa

::: demo
```vue
<template>
  <div class="card-wrap">
    <div class="card">{{ title }}</div>
  </div>
</template>

<script>
import { ref, defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const title = ref('vuepress-plugin-demoblock-plus')

    return { title }
  }
})
</script>

<style>
.card-wrap {
  text-align: center;
}

.card {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 500;
  color: var(--c-brand);
  background: var(--c-bg);
  border: 1px solid var(--c-brand);
  height: 80px;
  width: 600px;
}
</style>
```
:::
  