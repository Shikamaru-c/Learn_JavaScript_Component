class CFullPage {
  constructor (el, duration = '1s') {
    this.element = el
    this.children = Array.prototype.slice.call(this.element.children)    
    this.duration = duration
    this.currentIndex = 0
    this.checkArguments().init().createHeightList().bindEvents()
  }
  checkArguments () {
    if (!this.element) {
      throw new Error('el is required')
    }
    return this
  }
  init () {
    // 设置父元素样式
    this.element.style.overflow = 'hidden'
    this.element.style.width = '100%'
    this.element.style.height = '100vh'

    // 设置子元素样式
    this.children.forEach((item) => {
      item.style.width = '100%'
      item.style.height = '100vh'
      item.style.transition = `transform ${this.duration}`
    })

    return this
  }
  createHeightList () {
    // 生成高度列表，为移动移动距离
    let heightList = [],
        height,
        i,
        len = this.children.length
    
    height = this.children[0].offsetHeight

    for (i = 0; i < len; i++) {
      heightList.push(height * i)
    }

    this.heightList = heightList

    return this
  }
  bindEvents () {
    this.element.addEventListener('wheel', e => {
      // 为了防止快速滚动
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.changeIndex(e)
      }, 100)
    })

    window.addEventListener('resize', () => {
      // 屏幕每次resize都重新生成高度列表
      this.createHeightList()
    })

    return this
  }
  changeIndex (e) {
    if (e.deltaY > 0) {
      if (this.currentIndex < this.children.length - 1) {
        this.currentIndex++
        this.goToPage()
      }
    } else if (e.deltaY < 0) {
      if (this.currentIndex > 0) {
        this.currentIndex--
        this.goToPage()
      }
    }
  }
  goToPage () {
    let length = this.heightList[this.currentIndex]
    this.children.forEach((item) => {
      item.style.transform = `translate3d(0, -${length}px, 0)`
    })
  }
}