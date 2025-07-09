
## 主要文件与子目录说明

- `public/`：静态资源目录，包含入口 HTML 文件和图片等。
  - `index.html`：前端应用的 HTML 入口。

- `src/`：前端源代码目录。
  - `App.js`：应用主组件，负责路由和全局布局。
  - `index.js`：应用入口文件，挂载 React 应用。
  - `config.js.tpl`、`config.tpl.js`：配置模板文件，用于环境变量或 API 地址等配置。
  - `context.js`：全局上下文定义，管理全局状态。
  - `Footer.js`、`Header.js`：全局页脚和页眉组件。
  - `MessageSnackbar.js`：全局消息提示组件。
  - `WaitingBackdrop.js`：全局等待遮罩组件。
  - `utils.js`：通用工具函数。
  - `reportWebVitals.js`：性能监控相关代码。

  ### src/api/
  - `AuthorApi.js`：作者相关 API 封装。
  - `ClipApi.js`：剪辑相关 API 封装。
  - `NotificationsApi.js`：通知相关 API 封装。
  - `OrganizationApi.js`：组织相关 API 封装。
  - `SubtitleApi.js`：字幕相关 API 封装。

  ### src/home/
  - `context.js`：主页相关上下文。
  - `Home.js`：主页主组件。
  - `MainPanel.js`：主页主面板。
  - `Sidebar.js`：主页侧边栏。

    #### src/home/clip/
    - `ClipTable.js`：剪辑列表表格组件。
    - `SubtitleDownloadButton.js`：字幕下载按钮组件。
    - `TitleButton.js`：标题按钮组件。

    #### src/home/search/
    - `AuthorsSelector.js`：作者选择器组件。
    - `SearchBox.js`：搜索框组件。
    - `SearchText.js`：搜索文本组件。

    #### src/home/subtitle/
    - `ArtPlayer.js`：播放器组件。
    - `SegmentControl.js`：分段控制组件。
    - `SubtitleButtonGroup.js`：字幕按钮组组件。
    - `SubtitleDialog.js`：字幕对话框组件。
    - `SubtitleTable.js`：字幕列表表格组件。

- `help.md`：前端使用帮助文档。
- `package.json`：前端依赖和脚本配置。

## 结构说明

- `api/`：封装所有与后端交互的 API。
- `home/`：主页及其子模块组件。
- 其余为全局组件和工具。
