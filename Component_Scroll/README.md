
## 一款移动端的滚动插件

```
  <div class="scroll-wrapper">
    <ul>
      <li>content</li>
      ...
    </ul>
  </div>

  <script src="./c-scroll.js"></script>
  let scrollWrapper = document.querySelector('.scroll-wrapper')
  let scroll = new CScroll(scrollWrapper, 'y') // 可以在第二个参数传入要滚动的轴向(x/y)
```

