(function () {
  function CScroll (el, axi) {
    this.scrollWrapper = el
    this.scrollContent = el.children[0]
    this.previousTouch = {
      x: 0,
      y: 0
    }
    this.nowTouch = {
      x: 0,
      y: 0
    }
    this.previousPos = {
      x: 0,
      y: 0
    }
    this.axi = toS(axi)
    this.AXI = toB(axi)
    this.OVER_LIMIT = 3
    this.QUICK_TIME = 25
    this.QUICK_LENGTH_TIMES = 3
    this._init(this.axi)
    this.scrollWrapper.ontouchstart= (e) => this.touchStartHandle(e)
    this.scrollWrapper.ontouchmove = (e) => this.touchMoveHandle(e)
    this.scrollWrapper.ontouchend = (e) => this.touchEndHandle(e)
  }

  CScroll.prototype._initY = function () {
    this.scrollWrapper.height = this.scrollWrapper.offsetHeight
    this.scrollContent.height = (() => {
      let style = document.defaultView.getComputedStyle(this.scrollContent, '')
      let marginTop = parseInt(style.marginTop)
      let marginBottom = parseInt(style.marginBottom)
      return this.scrollContent.offsetHeight + marginTop + marginBottom
    })()
    this.maxOffset = this.scrollWrapper.height - this.scrollContent.height

  }
  CScroll.prototype._initX = function () {
    this.scrollWrapper.width = this.scrollWrapper.offsetWidth
    this.scrollContent.width = (() => {
      let style = document.defaultView.getComputedStyle(this.scrollContent, '')
      let marginLeft = parseInt(style.marginLeft)
      let marginRight = parseInt(style.marginRight)
      return this.scrollContent.offsetWidth + marginLeft + marginRight
    })()
    this.maxOffset = this.scrollWrapper.width - this.scrollContent.width
  }
  CScroll.prototype._init = function (axi) {
    if (axi === 'y') {
      this._initY()
    } else if (axi === 'x') {
      this._initX()
    } else {
      console.log('请在第二个参数输入字符串x或者y(大小写均可)')
    }
  }
  CScroll.prototype.touchStartHandle = function (e) {
    let pos,
        contentOffset,
        wrapperOffset

    // 如果点击的时候还在滚动中，就需要求出点击时的pos
    if (this.scrollContent.style.transition) {

      // 获取当前的pos
      if (this.axi === 'y') {
        contentOffset = this.scrollContent.getBoundingClientRect().top
        wrapperOffset = this.scrollWrapper.getBoundingClientRect().top
      } else if (this.axi ==='x') {
        contentOffset = this.scrollContent.getBoundingClientRect().left
        wrapperOffset = this.scrollWrapper.getBoundingClientRect().left
      }
      pos = contentOffset - wrapperOffset
      // 把transition的移动曲线调整为线性
      this.scrollContent.style.transition = ''
      // 移动到该位置
      this.move(pos, this.axi)
      // 存入记录中
      this.previousPos[this.axi] = pos
    }
    // 赋值第一个pageY
    this.nowTouch[this.axi] = e.touches[0]['page' + this.AXI]
  }
  CScroll.prototype.touchMoveHandle = function (e) {
    let touch = e.touches[0],
        move, // 移动距离
        to, // 移动到某位置
        pos // 当前位置
    
    // 保存之前的touch.y
    this.previousTouch[this.axi] = this.nowTouch[this.axi]
    // 更新现在touchy
    this.nowTouch[this.axi] = touch['page' + this.AXI]
    // 计算需要移动的距离
    move = this.nowTouch[this.axi] - this.previousTouch[this.axi]
    // 如果超出边界就变得很难拉动(这里用一个值去除以moveY达到效果)
    pos = this.previousPos[this.axi]
    if (pos > 0 || pos < this.maxOffset) {
      move /= this.OVER_LIMIT
    }
    // 计算出需要达到的位置
    to = move + pos
    // 保存现在的位置
    this.previousPos[this.axi] = to
    // 记录时间戳
    this.nowTouch.timeStamp = e.timeStamp
    // 更新位置
    this.move(to, this.axi)
  }
  CScroll.prototype.touchEndHandle = function (e) {
    // 如果已经回到边界，就不再计算速度如何
    if (overMax(this)) {
      return
    }
    isQuick(e, this)
    function overMax(self) {
      // 边界判断
      let pos = self.previousPos[self.axi],
          to
      if (pos > 0) {
        to = 0
      } else if (pos < self.maxOffset) {
        to = self.maxOffset
      }

      // 如果超出了父元素
      if (to != undefined) {
        // 更新位置
        self.scrollContent.style.transition = `all 0.7s cubic-bezier(0.165, 0.84, 0.44, 1)`
        self.move(to, self.axi)
        // 记录现在content的位置
        self.previousPos[self.axi] = to
        return true
      }
    }

    function isQuick(e, self) {
      // 记录touchEnd时的时间戳
      let endTimeStamp = e.timeStamp,
          quickLength,
          to,
          diffTime
      // 如果小于QUICK_TIME就说明快速滚动了
      diffTime = endTimeStamp - self.nowTouch.timeStamp
      if (diffTime < self.QUICK_TIME) {
        // 计算最后一次滚动的距离
        quickLength = self.nowTouch[self.axi] - self.previousTouch[self.axi]
        // 计算出需要达到的位置
        if (self.axi === 'y') {
        to = quickLength / self.scrollWrapper.height * self.scrollContent.height * self.QUICK_LENGTH_TIMES + self.previousPos.y
        } else if (self.axi === 'x') {
          to = quickLength / self.scrollWrapper.width * self.scrollContent.width * self.QUICK_LENGTH_TIMES + self.previousPos.x
        }
        // 判断是否超出了界限
        if (to > 0) {
          to = 0
        } else if (to < self.maxOffset) {
          to = self.maxOffset
        }
        // 再根据不同的quickLength(即最后滚动的距离)的长短设置不同的transition
        if (Math.abs(quickLength < 10)) {
          self.scrollContent.style.transition = 'all 2.5s cubic-bezier(0.23, 1, 0.32, 1)'
        } else {
          self.scrollContent.style.transition = 'all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }
        // 滚动并且记录位置
        self.move(to, self.axi)
        self.previousPos[this.axi] = to
      }
    }
  }
  
  CScroll.prototype.move = function (to, axi) {
    if (axi === 'y') {
      this.scrollContent.style.transform = `translate3d(0, ${to}px, 0)`
    } else if (axi === 'x') {
      this.scrollContent.style.transform = `translate3d(${to}px, 0, 0)`      
    }
  }

  function toS (str) {
    return str.toLowerCase()
  }
  function toB (str) {
    return str.toUpperCase()
  }

  window.CScroll = CScroll
})()