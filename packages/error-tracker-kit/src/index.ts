import MonitorCore from '@monitor/core'

// 埋点服务基本实现类
export default class ErrorTrackerKit extends MonitorCore {

  // 是否初始化过
  _hasInit: boolean = false

  constructor(projectInfo) {
    super(projectInfo)
    if (new.target.name === 'ErrorTrackerKit') {
      this._init()
    }
  }

  private _init() {
    if (this._hasInit) return
    this._hasInit = true
    this._catchBaseError()
    this._catchPromiseError()
  }

  _catchBaseError() {
    if (window.addEventListener) {
      // 可以监听 SyntaxError、RangeError、ReferenceError、TypeError、URIError、ResourceError(标签加载方式)、异步错误
      window.addEventListener('error', (event) => {
        console.log('addEventListener.error==')
        console.dir(event)
        this.sendError(
          event.error?.name || 'null',
          {
            data: event.error?.message,
            lineno: event.lineno,
            colno: event.colno,
            source: event.filename
          }
        )
      })
    } else {
      // 可以监听 SyntaxError、RangeError、ReferenceError、TypeError、URIError、异步错误
      window.onerror = (message, source, lineno, colno, error) => {
        this.sendError(
          error?.name || 'null',
          {
            data: error?.message || message.toString(),
            lineno,
            colno,
            source
          }
        )
      }
    }
  }

  _catchPromiseError() {
    if (!window.addEventListener) return
    // 可以监听 Promise 异常，async 异常
    window.addEventListener('unhandledrejection', (event) => {
      console.log('unhandledrejection==')
      console.dir(event)
      const stack = event.reason?.stack
      const {
        lineno = undefined,
        colno = undefined,
        source = undefined
      } = stack ? this.getStackData(stack) : {}
      this.sendError(
        event.type || 'null',
        {
          data: event.reason?.stack,
          lineno,
          colno,
          source
        }
      )
    })
  }

  getStackData(stack: string) {
    const ret: {
      lineno?: number
      colno?: number
      source?: string
    } = {}
    let line: string = (stack.split('\n')[1] || '').trim()
    if (/\(.*\)/.test(line)) {
      line = (line.match(/\((.*)\)/) || [])[1] || ''
    }
    const isStartAt: boolean = line.startsWith('at ')
    line = line.slice(isStartAt ? 3 : 0)
    if (line || isStartAt) {
      const lineUseArr: string[] = line.split(':')
      const ln = lineUseArr.length
      if (ln > 2) {
        ret.lineno = +lineUseArr[ln - 2]
        ret.colno = +lineUseArr[ln - 1]
        ret.source = lineUseArr.slice(0, ln - 2).join(':')
      }
    }
    return ret
  }

}
