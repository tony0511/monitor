# `@monitor/core`


> 主要初始化埋点服务数据，以及提供报送接口


## Install

```shell
npm install @monitor/core
# or
yarn add @monitor/core
```

## Usage

```javascript
import MonitorCore from '@monitor/core'

const instance = new MonitorCore({
  projectId: 'xxxx-123',
  baseUrl: 'http://example.com',
  path: '/reportError',
  projectName: '测试项目'
})

// 手动上报
instance.sendError(
  'type_code', // 上传的错误类型
  {
    data: 'Error message' // 错误信息
    // ... 其他附加数据
  }
)

```
