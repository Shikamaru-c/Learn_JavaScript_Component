class CSlider {
  constructor (el, options) {
    this.wrapper = el
    this.element = el.children[0]
    this.children = Array.prototype.slice.call(this.element.children)
    this.previousIndex = null
    this.currentIndex = 1
    this.dots = null
    this.width = parseInt(document.defaultView.getComputedStyle(el, '').width)
    this.interval = options.interval || 3000
    this.speed = options.speed || 1000
    this.threshold = options.threshold || this.width / 2
    this.dotDefaultStyle = 'display: inline-block; width: 10px; height: 10px; margin: 3px;border-radius: 5px; background: #ccc; list-style: none; transition: all 0.5s;'
    this.dotCurrentStyle = 'background: pink; width: 24px;'
    this.dotsStyle = 'position: absolute; bottom: 10px; left: 0; right: 0; width: 100%; margin: 0;padding: 0; text-align: center;'
    this.checkArguments().init().createDots().clone().bindEvents().autoPlay()
  }
  checkArguments () {
    if (!this.element) {
      throw new Error('el is required')
    }

    return this
  }
  init () {
    this.wrapper.style.overflow = 'hidden'
    
    // 初始化父元素
    this.element.style.whiteSpace = 'nowrap'
    this.element.style.fontSize = '0'
    // this.element.style.overflow = 'hidden'
    this.element.style.width = '100%'
    this.element.style.height = '100%'
    this.element.style.margin = '0'
    this.element.style.padding = '0'
    
    // 初始化子元素
    this.children.forEach((child) => {
      child.style.width = '100%'
      child.style.height = '100%'
      child.style.display = 'inline-block'
    })
    
    return this
  }
  createDots () {
    let len = this.children.length,
    i,
    dots,
    dot,
    position
    
    // 生成dots
    dots = document.createElement('ul')
    dots.style.cssText = this.dotsStyle
    
    // 如果wrapper的position值为static就设置为relative
    position = document.defaultView.getComputedStyle(this.wrapper, '').position
    if (position === 'static') {
      this.wrapper.style.position = 'relative'
    }
    
    // 生成dot
    for (i = 0; i < len; i++) {
      dot = document.createElement('li')
      dot.style.cssText = this.dotDefaultStyle
      dots.appendChild(dot)
    }
    
    this.dots = Array.prototype.slice.call(dots.children)
    
    // 这里还给dot添加了current属性
    // 因为在_changeDot函数里需要使用cssText这种耗资源的操作
    // 如果直接使用forEach对每个元素操作一遍cssText会降低网页性能
    this.dots[0].style.cssText += this.dotCurrentStyle
    this.dots[0].current = true
    
    this.wrapper.appendChild(dots)
    
    return this
  }
  clone () {
    let firstNode,
        lastNode

    // 在slider前后各复制了一份最后和最前的图片

    firstNode = this.children[0].cloneNode(true)
    this.element.appendChild(firstNode)

    lastNode = this.children[this.children.length - 1].cloneNode(true)
    this.element.insertBefore(lastNode, this.children[0])

    this.element.style.transform = `translate3d(-${this.width}px, 0, 0)`    

    this.children = Array.prototype.slice.call(this.element.children)

    return this
  }
  bindEvents () {
    this.wrapper.addEventListener('mouseover', () => {
      clearInterval(this.autoTimer)
    })
    
    this.wrapper.addEventListener('mouseout', () => {
      this.autoPlay()
    })
    
    this.dots[0].parentElement.addEventListener('click', e => {
      let len = this.dots.length - 1
      
      this.previousIndex = this.currentIndex
      
      this.dots.forEach((dot, index) => {
        if (dot === e.target) {
          this.currentIndex = index + 1
          return
        }
      })

      // 为了在边界的时候可以直接向前向后
      if (this.currentIndex === 1) {
        if (this.previousIndex === len + 1) {
          this.currentIndex = this.children.length - 1
        }
      } else if (this.currentIndex === len + 1) {
        if (this.previousIndex === 1) {
          this.currentIndex = 0
        }
      }

      this._play()
    })
    let nowOffset,
        moveHandle
    this.element.addEventListener('mousedown', e => {
      let previousX = e.pageX

      nowOffset = this.currentIndex * this.width

      this.element.addEventListener('mousemove', moveHandle = e => {
        let nowX = e.pageX,
            length = previousX - nowX + nowOffset
        
        
        previousX = nowX
        nowOffset = length

        this.element.style.transition = 'transform 0s'
        this.element.style.transform = `translate3d(-${length}px, 0, 0)`
      })

    })
    window.addEventListener('mouseup', e => {
      let currentIndexOffset

      this.element.removeEventListener('mousemove', moveHandle)

      currentIndexOffset = this.currentIndex * this.width

      if (nowOffset <= currentIndexOffset - this.threshold) {
        this.previousIndex = this.currentIndex
        this.currentIndex -= 1
      } else if (nowOffset >= currentIndexOffset + this.threshold){
        this.previousIndex = this.currentIndex
        this.currentIndex += 1
      }
      this._play()
    })
    
    return this
  }
  autoPlay () {
    this.autoTimer = setInterval(() => {
      this.previousIndex = this.currentIndex
      this.currentIndex++
      this._play()
    }, this.interval)
  }
  _play() {
    this._changePage()
    this._changeDot()
  }
  _changePage() {
    // 计算当前的偏移量
    let previousOffset = this.previousIndex * this.width
    
    // 计算要移动到的位置
    let length = (this.currentIndex - this.previousIndex) * this.width
    length += previousOffset
    
    this.element.style.transition = `transform ${this.speed / 1000}s`
    this.element.style.transform = `translate3d(-${length}px, 0, 0)`
    this._limit()
  }
  _changeDot () {
    this.dots.forEach(dot => {
      if (dot.current) {
        dot.style.cssText = this.dotDefaultStyle
        dot.current = false
      }
    })
    if (this.dots[this.currentIndex - 1]) {
      this.dots[this.currentIndex - 1].style.cssText += this.dotCurrentStyle
      this.dots[this.currentIndex - 1].current = true
    } else {
      this.dots[0].style.cssText += this.dotCurrentStyle
      this.dots[0].current = true
    }
  }
  _limit () {
    if (this.currentIndex === this.children.length - 1) {
      this.currentIndex = 1
      setTimeout(() => {
        this.element.style.transition = 'transform 0s'
        this.element.style.transform = `translate3d(-${this.width}px, 0, 0)`
      }, this.speed)
    } else if (this.currentIndex === 0) {
      this.currentIndex = this.children.length - 2
      setTimeout(() => {
        this.element.style.transition = 'transform 0s'
        this.element.style.transform = `translate3d(-${this.currentIndex * this.width}px, 0, 0)`      
      }, this.speed)
    }
  }
}