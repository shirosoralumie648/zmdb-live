# 使用 Node.js 18 作为基础镜像
FROM node:18-alpine

# 安装 FFmpeg 和其他必要工具
RUN apk add --no-cache \
    ffmpeg \
    sqlite \
    nginx \
    supervisor

# 设置工作目录
WORKDIR /app

# 复制项目文件
COPY . .

# 安装后端依赖
WORKDIR /app/backend
RUN npm install

# 安装工具模块依赖
WORKDIR /app/tool
RUN npm install

# 安装前端依赖并构建
WORKDIR /app/frontend
RUN npm install
RUN npm run build

# 创建必要的目录
RUN mkdir -p /app/records /app/lives /app/clip

# 复制配置文件模板
WORKDIR /app
RUN cp backend/config.tpl.js backend/config.js || true
RUN cp tool/config.tpl.js tool/config.js || true
RUN cp frontend/src/config.tpl.js frontend/src/config.js || true

# 创建 supervisor 配置
RUN mkdir -p /etc/supervisor/conf.d

# 复制 supervisor 配置文件
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80 3000 4000 5000

# 启动 supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
