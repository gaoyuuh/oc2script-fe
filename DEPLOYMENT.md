# oc2script 局域网部署指南

## 📁 项目结构

```
oc2script-fe/
├── dist/                    # 前端构建产物
├── oc2script-backend/       # 后端项目
├── serve.cjs               # 前端静态服务器
├── start-all.sh            # 一键启动脚本
├── stop-all.sh             # 一键停止脚本
└── vite.config.ts          # 前端配置
```

## 🚀 快速启动

### 启动所有服务

```bash
./start-all.sh
```

### 停止所有服务

```bash
./stop-all.sh
```

## 🌐 访问地址

启动后，会自动显示访问地址，通常为：

- **前端应用**: http://172.16.25.66:8090
- **后端API**: http://172.16.25.66:3000

## 📋 使用说明

1. 局域网用户在浏览器中访问前端地址
2. 在页面中输入 Objective-C 代码
3. 系统会自动调用后端API进行代码转换

## 🔧 服务管理

### 检查服务状态

```bash
# 检查前端服务 (8090端口)
lsof -i :8090

# 检查后端服务 (3000端口)
lsof -i :3000
```

### 手动启动单个服务

**启动前端服务:**

```bash
node serve.cjs
```

**启动后端服务:**

```bash
cd oc2script-backend
npm run build
node dist/index.js
```

## 🛠️ 开发模式

如需开发调试，可以使用：

```bash
# 前端开发服务器
npm run dev

# 后端开发服务器
cd oc2script-backend
npm run dev
```

## ❗ 注意事项

- 确保防火墙允许 3000 和 8090 端口的入站连接
- 仅在可信的局域网环境中使用
- 如需更改端口，请修改相应配置文件
