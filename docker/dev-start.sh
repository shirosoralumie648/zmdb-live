#!/bin/bash

# ZMDB Live 开发环境启动脚本

echo "🚀 启动 ZMDB Live 开发环境..."

# 检查配置文件是否存在，如果不存在则从模板复制
echo "📋 检查配置文件..."

if [ ! -f "/app/backend/config.js" ]; then
    echo "创建后端配置文件..."
    cp /app/backend/config.tpl.js /app/backend/config.js
fi

if [ ! -f "/app/tool/config.js" ]; then
    echo "创建工具配置文件..."
    cp /app/tool/config.tpl.js /app/tool/config.js
fi

if [ ! -f "/app/frontend/src/config.js" ]; then
    echo "创建前端配置文件..."
    cp /app/frontend/src/config.tpl.js /app/frontend/src/config.js
fi

# 创建必要的目录
echo "📁 创建必要目录..."
mkdir -p /app/records /app/lives /app/clip /app/data

# 设置权限
chmod -R 755 /app/records /app/lives /app/clip /app/data

echo "✅ 开发环境准备完成！"
echo ""
echo "🌐 服务访问地址："
echo "  - 前端开发服务器: http://localhost:3000"
echo "  - 后端 API 服务: http://localhost:4000"
echo "  - 工具服务: http://localhost:5000"
echo "  - Nginx 代理: http://localhost:80"
echo ""
echo "📝 开发提示："
echo "  - 修改代码后会自动重启相关服务"
echo "  - 查看日志: docker-compose logs -f"
echo "  - 进入容器: docker-compose exec zmdb-app sh"
echo ""
