# ZMDB Live Docker 开发环境

本文档介绍如何在 VSCode 中使用 Docker 环境运行 ZMDB Live 项目。

## 前置要求

1. **Docker Desktop** - 确保已安装并运行
2. **VSCode** - 安装最新版本
3. **Dev Containers 扩展** - 在 VSCode 中安装 `ms-vscode-remote.remote-containers` 扩展

## 快速开始

### 方法一：使用 VSCode Dev Containers（推荐）

1. 在 VSCode 中打开项目根目录
2. 按 `Ctrl+Shift+P` 打开命令面板
3. 输入并选择 `Dev Containers: Reopen in Container`
4. 等待容器构建完成（首次构建需要几分钟）
5. 容器启动后，所有服务将自动运行

### 方法二：使用 Docker Compose

```bash
# 构建并启动所有服务
docker-compose up --build

# 后台运行
docker-compose up -d --build

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 服务访问

启动成功后，您可以通过以下地址访问各个服务：

- **前端应用**: http://localhost:3000
- **后端 API**: http://localhost:4000
- **工具服务**: http://localhost:5000
- **Nginx 代理**: http://localhost:80

## 开发工作流

### 代码修改
- 所有源代码都通过 volume 挂载，修改后会自动同步到容器内
- 后端和工具服务支持热重载
- 前端开发服务器支持热更新

### 调试
```bash
# 进入容器
docker-compose exec zmdb-app sh

# 查看特定服务日志
docker-compose logs backend
docker-compose logs tool
docker-compose logs nginx

# 重启特定服务
docker-compose restart zmdb-app
```

### 数据持久化
- 数据库文件存储在 Docker volume `zmdb_data` 中
- 录播文件、剪辑文件等存储在对应的挂载目录中

## 配置文件

项目启动时会自动从模板文件创建配置文件：

- `backend/config.js` - 后端配置
- `tool/config.js` - 工具服务配置  
- `frontend/src/config.js` - 前端配置

如需自定义配置，请修改对应的配置文件。

## 常见问题

### 端口冲突
如果遇到端口冲突，可以修改 `docker-compose.yml` 中的端口映射：

```yaml
ports:
  - "8080:80"    # 将 Nginx 映射到 8080 端口
  - "3001:3000"  # 将前端映射到 3001 端口
```

### 权限问题
如果遇到文件权限问题，可以在容器内执行：

```bash
chmod -R 755 /app/records /app/lives /app/clip
```

### 重新构建
如果需要重新构建镜像：

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up
```

## VSCode 开发体验

在 Dev Container 中，您将获得：

- 完整的 Node.js 开发环境
- 预装的有用扩展
- 自动端口转发
- 集成终端访问
- 代码格式化和 ESLint 支持

## 生产部署

对于生产环境，建议：

1. 修改 `docker-compose.yml` 中的环境变量
2. 使用外部数据库（如 PostgreSQL）
3. 配置 SSL 证书
4. 设置适当的资源限制

## 故障排除

### 容器无法启动
1. 检查 Docker Desktop 是否运行
2. 确保端口未被占用
3. 查看 `docker-compose logs` 获取详细错误信息

### 服务无法访问
1. 确认端口转发配置正确
2. 检查防火墙设置
3. 验证服务是否正常启动

如有其他问题，请查看项目日志或提交 Issue。
