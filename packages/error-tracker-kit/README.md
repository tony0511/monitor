# `@monitor/error-tracker-kit`


> 主要处理异常监控


## Install

```shell
npm install @monitor/error-tracker-kit
# or
yarn add @monitor/error-tracker-kit
```

## Usage

```javascript
import ErrorTrackerKit from '@monitor/error-tracker-kit'

const instance = new ErrorTrackerKit({
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
