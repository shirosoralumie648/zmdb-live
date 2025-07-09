## API 请求说明

认证请求头：
> Authorization: Bearer <你的secretKey>

### 隶属组织 Organization

#### 增加组织
`POST localhost:4000/organizations`
`Content-Type: application/json`

传入JSON参数：
```json
{
    "name": "围棋", 
    "avatar": "https://i0.hdslb.com/bfs/face/77748a186f2a0e9206d6a67eef83e8296b29bbe7.jpg@128w_128h_1c_1s.webp", 
    "sort":1
}
```

### 增加主播
`POST localhost:4000/authors`
`Content-Type: application/json`

传入JSON参数：
```json
{
    "organizationId": 1,
    "uid": 3493139945884106, 
    "name": "雪糕cheese",
    "avatar": "https://i0.hdslb.com/bfs/face/311fd02cad5db2cc33a1926b79cc9c7dc385b673.jpg@128w_128h_1c_1s.webp"
}
```


## 主要文件与子目录说明

- `index.js`：后端服务入口文件，负责初始化 Express 应用、加载中间件和路由、启动服务器。
- `error.js`：全局错误处理模块，统一处理后端抛出的异常和错误响应。
- `middlewares.js`：自定义中间件集合，如请求日志、权限校验、参数解析等。
- `utils.js`：工具函数库，封装通用的辅助方法。
- `validation.js`：参数校验相关逻辑，保证 API 输入数据的合法性。

### api/
- `AuthApi.js`：认证与登录相关 API 路由。
- `SegmentApi.js`：分段（片段）相关 API 路由。

### author/
- `AuthorDao.js`：作者数据访问层，负责与数据库交互。
- `AuthorService.js`：作者业务逻辑处理。

### clip/
- `ClipDao.js`：剪辑数据访问层。
- `ClipService.js`：剪辑业务逻辑处理。

### notification/
- `NotificationService.js`：通知推送相关业务逻辑。

### organization/
- `OrganizationDao.js`：组织数据访问层。
- `OrganizationService.js`：组织业务逻辑处理。

### subtitle/
- `SubtitleDao.js`：字幕数据访问层。
- `SubtitleService.js`：字幕业务逻辑处理。


## 结构说明

- `*Dao.js` 文件：数据访问对象，负责数据库的增删改查。
- `*Service.js` 文件：业务服务层，处理具体业务逻辑。
- `*Api.js` 文件：API 路由层，定义接口路径和请求处理。


