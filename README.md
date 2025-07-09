# 项目简介

本项目是一个基于 Create React App 脚手架搭建的全栈应用，包含前端、后端和移动端模块，旨在实现字幕管理、剪辑、作者、组织等相关功能。

## 主要功能

- **字幕管理**：支持字幕的上传、下载、分段、编辑等操作。
- **剪辑管理**：对视频或音频片段进行管理，包括剪辑的增删改查。
- **作者与组织管理**：支持作者、组织的增删改查及相关信息维护。
- **通知系统**：实现消息通知推送。
- **多端支持**：包含 Web 前端和移动端，适配不同使用场景。
- **API 接口**：后端提供丰富的 RESTful API，供前端和移动端调用。

## 目录结构

- `backend/`：后端 Node.js 服务，包含 API、服务、数据访问层等。
- `frontend/`：Web 前端，基于 React 实现，提供用户界面和交互。
- `mobile/`：移动端前端，适配移动设备的界面和功能。
- `tool/`：工具模块，包含第三方接口调用、辅助服务等。
- `db/`：数据库，基于 Better Sqlite3 实现。

## 快速启用

### 安装依赖
本项目主要基于 `node.js`：
    - **后端**：Express `express` 实现
    - **前端**：React App 脚手架 `react-scripts` 实现

```bash
npm install react-scripts
npm install express # or use `yarn add ***`
```
请确保以上环境已正确配置。

接下来是安装前后端所需的依赖和文件：

```bash
cd backend
npm install
```
- 详见 `backend/package.json`

```bash
cd frontend
npm install
npm run build
```
- 详见 `frontend/package.json`，为后端创建必须的 `build` 目录和 `node_modules` 目录


### 相关配置
- **数据库相关**: 在 `backend/` 目录下新建 `config.js`，内容参考 `config.js.tpl` 或 `config.tpl.js`
- **前端显示相关**: 在 `frontend/src/` 目录下新建 `config.js`，内容参考 `config.js.tpl` 或 `config.tpl.js`
- **直播处理相关**: 在 `tool/` 目录下新建 `config.js`，内容参考 `config.js.tpl` 或 `config.tpl.js`

### 后端服务启动

```bash
cd backend
npm start
```

### 前端网页启动

```bash
cd frontend
npm start
```
