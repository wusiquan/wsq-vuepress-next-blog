# eslint:all和eslint:recommend是什么

看下[官网配置文件](https://eslint.org/docs/user-guide/configuring/configuration-files#using-configuration-files)中介绍
可以配置选项`extends: ["eslint:recommend"]`
我看了[eslint仓库](https://github.com/eslint/eslint)，一咋眼没在配置中找到，到是在conf目录里发现了一个`eslint-recommended.js`文件

后在代码[lib/config/flat-config-array.js](https://github.com/eslint/eslint/blob/main/lib/config/flat-config-array.js)中发现

```javascript
const recommendedConfig = require("../../conf/eslint-recommended")

[ConfigArraySymbol.preprocessConfig](config) {
  if (config === "eslint:recommended") {
    return recommendedConfig
  }

  if (config === "eslint:all") {
    return require("../../conf/eslint-all");
  }

  return config
}
```