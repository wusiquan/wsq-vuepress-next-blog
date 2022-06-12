# 插件eslint-plugin-vue的configs

在[eslint-plugin-vue仓库](https://github.com/vuejs/eslint-plugin-vue)中的lib/configs/base.js(该文件由tools/update-lib-configs.js生成)中发现其配置中选项
`plugins: ['vue']`，心想这vue表示的含义是 eslint-plguin-vue，那岂不是base这个配置在插件引自己，而且我看eslint-plugin-jsonc的lib/configs/base.ts，也是plugins引用自己，
eslint-plugin-unicorn的configs/recommended.js中也是引用自己，我想目的是方便别的地方extends中引用它的配置时，自动就引用它这个插件?

在package.json中可看到`"devDependencies": { "eslint-plugin-vue": "file:." }`
`"main": "lib/index.js"`，所以lib/config/base.js插件引入是这个

在lib/index.js中(它是tools/update-index.js生成)，有一个选项`configs`，在这里[https://eslint.org/docs/developer-guide/working-with-plugins#configs-in-plugins]有介绍