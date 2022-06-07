# Vue 3 + preprocess

rollup 插件 proprocess
为vue3改造的简化版，适用于vue文件。

对应项目工程用法
根据别名 --mode 读取main-config下配置文件，无定制配置时自动补充默认配置

# proprocess用法


```html
<body>
    <!-- @if mode=="a" -->
    <header>是否编译</header>
    <!-- @endif -->
</body>
```


```js
var configValue = '/* @echo something */' || 'default value';

// @if mode=="a"
ifFc()
// @else
elseFc()
// @endif

/*  @if mode=="a" */
someFc()
/* @endif */
```
