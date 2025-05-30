const http = require('http')
const fs = require('fs')
const path = require('path')
const os = require('os')

const PORT = 8090
const DIST_DIR = path.join(__dirname, 'dist')

// MIME类型映射
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm',
}

const server = http.createServer((req, res) => {
  // 处理CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }

  let filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url)

  // 检查文件是否存在
  if (!fs.existsSync(filePath)) {
    // 对于SPA，如果文件不存在，返回index.html
    filePath = path.join(DIST_DIR, 'index.html')
  }

  const extname = String(path.extname(filePath)).toLowerCase()
  const mimeType = mimeTypes[extname] || 'application/octet-stream'

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404)
        res.end('文件未找到')
      } else {
        res.writeHead(500)
        res.end('服务器错误: ' + error.code)
      }
    } else {
      res.writeHead(200, { 'Content-Type': mimeType })
      res.end(content, 'utf-8')
    }
  })
})

// 获取本机IP地址
function getLocalIP() {
  const interfaces = os.networkInterfaces()
  for (const name of Object.keys(interfaces)) {
    for (const netInterface of interfaces[name]) {
      if (netInterface.family === 'IPv4' && !netInterface.internal) {
        return netInterface.address
      }
    }
  }
  return 'localhost'
}

server.listen(PORT, '0.0.0.0', () => {
  const localIP = getLocalIP()
  console.log('🚀 服务器已启动！')
  console.log(`📱 本地访问: http://localhost:${PORT}`)
  console.log(`🌐 局域网访问: http://${localIP}:${PORT}`)
  console.log('按 Ctrl+C 停止服务器')
})
