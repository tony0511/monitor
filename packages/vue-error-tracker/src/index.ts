import ErrorTrackerKit from '@monitor/error-tracker-kit'

// 埋点服务vue实现类
export default class VueErrorTracker extends ErrorTrackerKit {

  constructor(projectInfo) {
    super(projectInfo)
  }

  // 需要手动初始化
  init(app: any) {
    if (this._hasInit) return
    this._hasInit = true
    this._catchBaseError()
    this._catchPromiseError()
    this._catchVueError(app)
  }

  // 需要手动初始化
  _catchVueError(app: any) {
    /**
     * 全局捕获Vue错误，直接扔出给onerror处理
     */
    app.config.errorHandler = (error: any) => {
      console.log('vue==')
      console.dir(error)
      const stack = error?.stack
      const {
        lineno = undefined,
        colno = undefined,
        source = undefined
      } = stack ? this.getStackData(stack) : {}
      this.sendError(
        error?.name || 'null',
        {
          data: error?.stack,
          lineno,
          colno,
          source
        }
      )
    }
  }

}
