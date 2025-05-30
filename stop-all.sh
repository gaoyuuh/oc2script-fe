#!/bin/bash

# 设置脚本的工作目录为脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
cd "$SCRIPT_DIR" || exit

# 设置环境变量，添加常见的命令路径
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

echo "🛑 正在停止 oc2script 服务..."

# 停止前端服务
if pkill -f "node.*serve.cjs" 2>/dev/null; then
    echo "   ✓ 前端服务已停止"
else
    echo "   ℹ️ 前端服务未在运行"
fi

# 停止后端服务
if pkill -f "node.*dist/index.js" 2>/dev/null; then
    echo "   ✓ 后端服务已停止"
else
    echo "   ℹ️ 后端服务未在运行"
fi

# 等待进程完全停止
sleep 1

echo "✅ 所有服务已停止" 