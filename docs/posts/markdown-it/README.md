# markdown-it

markdown-it源码放到shiki-analysis下了

1. 在MarkdownIt构造函数中，`new ParserInline()`, `new ParserBlock()`, `new ParserCore()`，在对应的构造函数内会对rules初始化
2. 在MarkdownIt构造函数后面, `this.configure(presetName)` 会根据preset的配置文件来进行配置，其中会调用对应ruler的`enableOnly`方法，即上面的rules仅配置的白名单enable

所以`core.process(state)`时才会发现有的rule.enable值为false了