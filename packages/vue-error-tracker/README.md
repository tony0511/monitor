# `@monitor/vue-error-tracker`


> 主要处理异常监控


## Install

```shell
npm install @monitor/vue-error-tracker
# or
yarn add @monitor/vue-error-tracker
```

## Usage

```javascript
import VueErrorTracker from '@monitor/vue-error-tracker'

const instance = new VueErrorTracker({
  projectId: 'xxxx-123',
  baseUrl: 'http://example.com',
  path: '/reportError',
  projectName: '测试项目'
})

// vue 2.x
instance.init(Vue)

// vue 3.x
const app = createApp(App)
instance.init(app)

// 手动上报
instance.sendError(
  'type_code', // 上传的错误类型
  {
    data: 'Error message' // 错误信息
    // ... 其他附加数据
  }
)
```
