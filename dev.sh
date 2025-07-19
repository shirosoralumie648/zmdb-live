#!/bin/bash

# ZMDB Live 开发环境启动脚本

echo "🔧 启动 ZMDB Live 开发环境..."

# 检查配置文件
if [ ! -f "backend/config.js" ] || [ ! -f "frontend/src/config.js" ] || [ ! -f "tool/config.js" ]; then
    echo "❌ 配置文件缺失，请先运行 ./start.sh 进行初始化"
    exit 1
fi

# 创建必要目录
mkdir -p db tmp records lives clip/segment

echo "🚀 启动服务..."

# 启动后端服务（后台运行）
echo "📡 启动后端服务 (端口 4000)..."
cd backend
npm start &
BACKEND_PID=$!
cd ..

# 等待后端启动
sleep 3

# 启动工具服务（后台运行）
echo "🔧 启动工具服务 (端口 5000)..."
cd tool
npm start &
TOOL_PID=$!
cd ..

# 等待工具服务启动
sleep 3

# 启动前端开发服务
echo "🌐 启动前端开发服务 (端口 3000)..."
echo "按 Ctrl+C 停止所有服务"
cd frontend
npm start

# 当前端服务停止时，同时停止后端和工具服务
echo "🛑 停止所有服务..."
kill $BACKEND_PID $TOOL_PID 2>/dev/null
echo "✅ 所有服务已停止"
