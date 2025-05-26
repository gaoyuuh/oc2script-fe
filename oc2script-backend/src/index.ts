import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { exec } from 'child_process'
import * as path from 'path'
import * as fs from 'fs'
import * as os from 'os'

const app = express()
const port = process.env.PORT || 3000

// 定义响应接口
interface ApiResponse {
  code: number
  msg: string
  result: string
}

// 定义错误信息接口（从 stderr 解析）
interface ErrorInfo {
  code: number
  msg: string
}

// 中间件
app.use(cors())
app.use(bodyParser.json())

// 接口路由
app.post('/convert', async (req, res) => {
  try {
    const { code } = req.body

    if (!code) {
      const response: ApiResponse = {
        code: 400,
        msg: '缺少代码参数',
        result: '',
      }
      return res.status(400).json(response)
    }

    // 获取脚本的绝对路径
    const scriptPath = path.join(__dirname, '../oc2script')

    // 创建临时输入目录和文件
    const tempDir = os.tmpdir()
    const sessionId = `oc2script_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const inputDir = path.join(tempDir, sessionId)
    const inputFile = path.join(inputDir, 'input.m')

    try {
      // 创建输入目录
      fs.mkdirSync(inputDir, { recursive: true })

      // 将代码写入输入文件
      fs.writeFileSync(inputFile, code, 'utf8')

      // 使用输入目录，不指定输出目录，让结果输出到 stdout
      exec(`"${scriptPath}" "${inputDir}"`, (error, stdout, stderr) => {
        try {
          // 清理临时目录
          fs.rmSync(inputDir, { recursive: true, force: true })

          // 如果有 stderr，说明出错了
          if (stderr && stderr.trim()) {
            console.error('工具返回错误:', stderr)

            try {
              // 尝试解析 stderr 为 JSON
              const errorInfo: ErrorInfo = JSON.parse(stderr.trim())
              const response: ApiResponse = {
                code: errorInfo.code,
                msg: errorInfo.msg,
                result: '',
              }
              return res.json(response)
            } catch {
              // 如果 stderr 不是有效的 JSON，返回原始错误信息
              const response: ApiResponse = {
                code: 500,
                msg: stderr.trim(),
                result: '',
              }
              return res.json(response)
            }
          }

          // 如果有执行错误但没有 stderr
          if (error) {
            console.error('执行错误:', error.message)
            const response: ApiResponse = {
              code: 500,
              msg: error.message,
              result: '',
            }
            return res.json(response)
          }

          // 成功情况：从 stdout 获取结果
          const response: ApiResponse = {
            code: 0,
            msg: '',
            result: stdout || '',
          }
          res.json(response)
        } catch (processError) {
          // 确保清理临时目录
          try {
            fs.rmSync(inputDir, { recursive: true, force: true })
          } catch (cleanupError) {
            console.warn('清理临时目录失败:', cleanupError)
          }

          console.error('处理响应时出错:', processError)
          const response: ApiResponse = {
            code: 500,
            msg: '服务器内部错误',
            result: '',
          }
          res.json(response)
        }
      })
    } catch (setupError) {
      console.error('设置临时目录失败:', setupError)
      const errorMessage = setupError instanceof Error ? setupError.message : String(setupError)
      const response: ApiResponse = {
        code: 500,
        msg: `设置失败: ${errorMessage}`,
        result: '',
      }
      res.json(response)
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    console.error('服务器错误:', errorMessage)
    const response: ApiResponse = {
      code: 500,
      msg: errorMessage,
      result: '',
    }
    res.json(response)
  }
})

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`)
})
