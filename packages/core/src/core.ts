// 初始化项目信息
export interface ProjectInfo {
  projectId: string, // 项目id
  baseUrl: string, // 埋点服务host
  path: string, // 埋点服务路径
  projectName?: string // 项目名
}

// 上传条目信息的有效数据载体
interface DataItemData {
  data: string, // 主要信息
  [propName: string]: any // 附加信息属性
}

// 具体的上传条目信息
interface DataItem {
  projectId: string, // 项目id
  type: string, // 数据二级分类
  message: DataItemData // 上传条目信息的有效数据载体
}

// 上传数据信息
interface DataInfo {
  type: string, // 数据大类
  content: DataItem // 具体的上传条目信息
}

// 埋点服务核心类
export default class MonitorCore {
  projectId: string // 项目id
  baseUrl: string // 埋点服务host
  path: string // 埋点服务路径
  projectName?: string // 项目名

  constructor(projectInfo: ProjectInfo) {
    this.projectId = projectInfo.projectId
    this.baseUrl = projectInfo.baseUrl
    this.path = projectInfo.path || ''
    this.projectName = projectInfo.projectName || ''
  }

  // 发送埋点数据入口，发送方式优先级默认为：image，beacon，ajax
  sendEvent(dataInfo: DataInfo) {
    const strData = window.encodeURIComponent(JSON.stringify({
      type: dataInfo.type,
      content: {
        ...dataInfo.content,
        message: JSON.stringify(dataInfo.content.message)
      }
    }))
    if (strData.length < 2000) {
      this.sendImage(strData)
    } else if (!!window.navigator.sendBeacon) {
      this.sendBeacon(strData)
    } else {
      this.sendAjax(strData)
    }
  }

  // 以图片加载方式发送埋点数据
  sendImage(strData: string) {
    const img = new Image()
    img.style.display = 'none'
    const removeImage = function () {
      img.parentNode!.removeChild(img)
    }
    img.onload = removeImage
    img.onerror = removeImage
    img.src = `${this.baseUrl}${this.path}?params=${strData}`
    document.body.appendChild(img)
  }

  // 以beacon方式发送埋点数据
  sendBeacon(strData: string) {
    window.navigator.sendBeacon(`${this.baseUrl}${this.path}`, `params=${strData}`)
  }

  // 以ajax方式发送埋点数据
  sendAjax(strData: string) {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${this.baseUrl}${this.path}`, true)
    xhr.setRequestHeader('content-type', 'application/json')
    xhr.onerror = () => {}
    xhr.send(JSON.stringify({ params: strData }))
  }

  // 发送异常类埋点数据 type: error
  sendError(type: string, message: DataItemData) {
    this.sendEvent({
      type: 'error',
      content: {
        projectId: this.projectId,
        type,
        message
      }
    })
  }

  // 发送性能指标类埋点 type: performance
  sendPerformance(type: string, message: DataItemData) {
    this.sendEvent({
      type: 'performance',
      content: {
        projectId: this.projectId,
        type,
        message
      }
    })
  }

  // 发送业务数据类埋点 type: business
  sendBusiness(type: string, message: DataItemData) {
    this.sendEvent({
      type: 'business',
      content: {
        projectId: this.projectId,
        type,
        message
      }
    })
  }

  // 发送用户行为类埋点 type: custom_behavior
  sendCustomBehavior(type: string, message: DataItemData) {
    this.sendEvent({
      type: 'custom_behavior',
      content: {
        projectId: this.projectId,
        type,
        message
      }
    })
  }
}
