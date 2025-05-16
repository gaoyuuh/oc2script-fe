import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { exec } from 'child_process';
import * as path from 'path';

const app = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 接口路由
app.post('/convert', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: '缺少代码参数' });
    }
    
    // 获取脚本的绝对路径（假设 reverse_string.sh 位于项目根目录）
    const scriptPath = path.join(__dirname, '../reverse_string.sh');
    
    // 执行脚本转换
    exec(`"${scriptPath}" "${code.replace(/"/g, '\\"')}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`执行错误: ${error.message}`);
        return res.status(500).json({ error: error.message });
      }
      
      if (stderr) {
        console.error(`标准错误输出: ${stderr}`);
        return res.status(500).json({ error: stderr });
      }
      
      // 返回转换结果
      res.json({ result: stdout });
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('服务器错误:', errorMessage);
    res.status(500).json({ error: errorMessage });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
}); 