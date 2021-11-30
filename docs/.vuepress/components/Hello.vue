
<template>
  <div>{{msg}}</div>  
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    let msg = ref('abcd')

    return {
      msg
    }
  },
})
</script>
