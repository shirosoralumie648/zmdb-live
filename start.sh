#!/bin/bash

# ZMDB Live 项目启动脚本

echo "🚀 启动 ZMDB Live 项目..."

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误：未找到 Node.js，请先安装 Node.js"
    exit 1
fi

# 检查 npm 是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ 错误：未找到 npm，请先安装 npm"
    exit 1
fi

# 检查配置文件是否存在
echo "📋 检查配置文件..."
if [ ! -f "backend/config.js" ]; then
    echo "❌ 错误：backend/config.js 不存在"
    exit 1
fi

if [ ! -f "frontend/src/config.js" ]; then
    echo "❌ 错误：frontend/src/config.js 不存在"
    exit 1
fi

if [ ! -f "tool/config.js" ]; then
    echo "❌ 错误：tool/config.js 不存在"
    exit 1
fi

# 创建必要的目录
echo "📁 创建必要目录..."
mkdir -p db tmp records lives clip/segment

# 安装依赖
echo "📦 安装后端依赖..."
cd backend && npm install
if [ $? -ne 0 ]; then
    echo "❌ 后端依赖安装失败"
    exit 1
fi

echo "📦 安装工具服务依赖..."
cd ../tool && npm install
if [ $? -ne 0 ]; then
    echo "❌ 工具服务依赖安装失败"
    exit 1
fi

echo "📦 安装前端依赖..."
cd ../frontend && npm install
if [ $? -ne 0 ]; then
    echo "❌ 前端依赖安装失败"
    exit 1
fi

echo "🏗️  构建前端..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ 前端构建失败"
    exit 1
fi

cd ..

echo "✅ 项目配置完成！"
echo ""
echo "🎯 启动服务："
echo "  后端服务: cd backend && npm start"
echo "  工具服务: cd tool && npm start"
echo "  前端开发: cd frontend && npm start"
echo ""
echo "🌐 访问地址："
echo "  前端: http://localhost:3000"
echo "  后端API: http://localhost:4000"
echo "  工具服务: http://localhost:5000"
