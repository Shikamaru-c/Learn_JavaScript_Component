
## 一款桌面端的FullPage插件

### 学习面向对象编程和ES6语法

```
  html
    // class属性不是必须的
    <div class="wrapper">
      <div class="section">content1...</div>
      <div class="section">content2...</div>
      <div class="section">content3...</div>
      <div class="section">content4...</div>      
      ...
    </div>

    // 引入JS文件
    <script src="./CFullPage.js"></script>

    <script>

      let wrapper = document.querySelector('.wrapper')

      // 就能使用啦，可以传入第二个参数(例如: '0.7s')
      // 你甚至不需要为那些div设置样式
      let fullPage = new CFullPage(wrapper[, '0.7s'])
      
    </script>
```
