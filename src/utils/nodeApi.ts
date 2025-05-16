// 仅在Electron环境中使用
// @ts-ignore
const isElectron = window && window.process && window.process.type

let nodeApi: { 
  execCommand: (command: string) => Promise<string> 
} = {
  execCommand: async () => {
    throw new Error('只能在Electron环境中使用')
  }
}

if (isElectron) {
  // 只在Electron环境中导入
  // @ts-ignore
  const { exec } = window.require('child_process')
  
  nodeApi = {
    execCommand: (command: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        exec(command, (error: Error | null, stdout: string, stderr: string) => {
          if (error) {
            reject(error)
            return
          }
          if (stderr) {
            reject(new Error(stderr))
            return
          }
          resolve(stdout)
        })
      })
    }
  }
}

export default nodeApi 