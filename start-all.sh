#!/bin/bash

# 设置脚本的工作目录为脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
cd "$SCRIPT_DIR" || exit

# 设置环境变量，添加常见的 Node.js 安装路径
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

# 检查必要的命令是否存在
check_command() {
    if ! command -v "$1" &> /dev/null; then
        echo "❌ 错误: 找不到命令 '$1'"
        echo "请确保已正确安装 Node.js 和 npm"
        echo "或者在终端中运行此脚本: ./start-all.sh"
        exit 1
    fi
}

echo "🚀 正在启动 oc2script 前后端服务..."

# 检查必要的命令
check_command "node"
check_command "npm"
check_command "ifconfig"

# 获取本机IP地址
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')

echo "📡 检测到本机IP地址: $LOCAL_IP"
echo "📁 工作目录: $SCRIPT_DIR"

# 停止已存在的服务
echo "🛑 检查并停止已存在的服务..."
pkill -f "node.*serve.cjs" 2>/dev/null && echo "   ✓ 已停止前端服务"
pkill -f "node.*dist/index.js" 2>/dev/null && echo "   ✓ 已停止后端服务"

# 等待进程完全停止
sleep 1

# 启动后端服务
echo "🔧 启动后端服务 (端口 3000)..."
cd "$SCRIPT_DIR/oc2script-backend" || exit
npm run build > /dev/null 2>&1
node dist/index.js &
BACKEND_PID=$!
cd "$SCRIPT_DIR" || exit

# 等待后端启动
sleep 2

# 启动前端服务
echo "🖥️  启动前端服务 (端口 8090)..."
node serve.cjs &
FRONTEND_PID=$!

# 等待前端启动
sleep 2

echo ""
echo "✅ 服务启动完成！"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📱 前端应用 (用户界面):"
echo "   本地访问: http://localhost:8090"
echo "   局域网访问: http://$LOCAL_IP:8090"
echo ""
echo "🔧 后端API (程序接口):"
echo "   本地访问: http://localhost:3000"
echo "   局域网访问: http://$LOCAL_IP:3000"
echo "   API接口: http://$LOCAL_IP:3000/convert"
echo ""
echo "📋 使用说明:"
echo "   1. 局域网用户访问: http://$LOCAL_IP:8090"
echo "   2. 在页面中输入 Objective-C 代码进行转换"
echo "   3. 前端会自动调用后端API进行转换"
echo ""
echo "🛑 停止服务: 按 Ctrl+C 或运行 './stop-all.sh'"
echo "🔄 重启服务: 重新运行 './start-all.sh'"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 设置陷阱以在脚本退出时清理后台进程
trap 'echo ""; echo "🛑 正在停止服务..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo "✅ 服务已停止"; exit' INT TERM

# 保持脚本运行
wait 