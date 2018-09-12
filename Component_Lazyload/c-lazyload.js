(function () {
  function CLazyLoad (loadingImage) {
    let lazyLoadList = document.querySelectorAll('.lazy-load')
    lazyLoadList.forEach((item) => {
      item = new Picture(item)
    })

    // 构造函数，包装img
    function Picture(img) {

      // 先预设loading图片
      img.src = loadingImage

      // 保存src地址
      img.path = img.dataset.src

      img.top = getElToWindowTop(img)
      img.left = getElToWindowLeft(img)

      // 刷新img到视口顶部和左边的距离
      img.refresh = () => {
        img.top = getElToWindowTop(img)
        img.left = getElToWindowLeft(img)
      }
      return img
    }

    // 获得元素到视口顶部的距离
    function getElToWindowTop(el) {
      return el.getBoundingClientRect().top
    }

    // 获得元素到视口左边的距离
    function getElToWindowLeft(el) {
      return el.getBoundingClientRect().left
    }

    // 获得视口高度
    function getWindowHeight() {
      return document.documentElement.clientHeight || document.body.clientHeight
    }

    // 获得视口宽度
    function getWindowWidth() {
      return document.documentElement.clientWidth || document.body.clientWidth
    }

    // 
    function calcAndLoad() {
      // 计算视口的宽高
      const WINDOW_HEIGHT = getWindowHeight()
      const WINDOW_WIDTH = getWindowWidth()

      lazyLoadList.forEach((item) => {
        // 刷新el到视口的距离
        item.refresh()

        // 判断是否应该加载
        if (item.top <= WINDOW_HEIGHT && item.left <= WINDOW_WIDTH) {
          let img = new Image()
          img.onload = () => {
            item.src = img.src
          }
          img.src = item.path
        }
      })
    }

    window.onresize = () => {
      calcAndLoad()
    }
    window.onload = () => {
      calcAndLoad()
    }
    window.onscroll = () => {
      calcAndLoad()
    }
  }

  // 暴露函数
  window.CLazyLoad = CLazyLoad
})()