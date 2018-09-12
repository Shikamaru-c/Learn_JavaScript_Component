
## 一款移动端、桌面端通用的LazyLoad插件

```
  // 在需要懒加载的图片上，添加class属性"lazy-load"
  // 并且设置data-src为图片地址

  <header>
    <img class="lazy-load" data-src="images/logo.png">
  </header>
  <article>
    ...
    <img class="lazy-load" data-src="images/flower.png">
  </article>
  <footer>
    <img class="lazy-load" data-src="images/about.jpg">
  </footer>

  <script src="./c-lazyload.js"></script>

  CLazyLoad('./loading.gif') // 将loading图传入函数即可
```

## 简单实用，如果需要其他功能可以直接在源码上添加新的功能