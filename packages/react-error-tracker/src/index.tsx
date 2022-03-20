import ErrorTrackerKit from '@monitor/error-tracker-kit'
import React, { ErrorInfo } from 'react'

interface P {
  config: Object
}

interface S {
  hasError: boolean
}

// 埋点服务react组件
export default class ReactErrorTracker extends React.Component<P, S> {

  instance: ErrorTrackerKit | undefined

  constructor(props) {
    super(props)
    this.state = { hasError: false }
    this.init()
  }

  init() {
    if (!this.instance) {
      this.instance = new ErrorTrackerKit(this.props.config)
    }
  }

  static getDerivedStateFromError() {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (!this.instance) this.init()
    console.dir(error)
    console.dir(errorInfo)
    const stack = errorInfo.componentStack
    const {
      lineno = undefined,
      colno = undefined,
      source = undefined
    } = this.instance!.getStackData(stack)
    this.instance!.sendError(
      error.name || 'null',
      {
        data: stack,
        lineno,
        colno,
        source
      }
    )
  }

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return <h1>Something went wrong.</h1>
    }
    return this.props.children
  }
}
