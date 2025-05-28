<template>
  <div class="code-convertor">
    <div class="main-content">
      <div class="editor-container">
        <div class="editor-header">Objective-C</div>
        <div class="editor">
          <MonacoEditor
            v-model="objcCode"
            language="objective-c"
            :readonly="false"
            :placeholder="defaultObjcCode"
            theme="vs-dark"
          />
        </div>
      </div>

      <div class="editor-container" :class="{ 'error-state': hasError }">
        <div class="editor-header">KZLang</div>
        <div class="editor">
          <MonacoEditor
            v-model="jsCode"
            language="javascript"
            :readonly="false"
            placeholder="// 转换后的 KZLang 代码将显示在这里..."
            theme="vs-dark"
            :hasError="hasError"
          />
        </div>
      </div>
    </div>

    <div class="footer">
      <button class="convert-btn" @click="convertCode" :disabled="isLoading">
        {{ isLoading ? '转换中...' : 'Convert' }}
      </button>
    </div>

    <!-- 帮助组件 -->
    <HelpDrawer />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MonacoEditor from '@/components/MonacoEditor.vue'
import HelpDrawer from '@/components/HelpDrawer.vue'

// 定义API响应接口
interface ApiResponse {
  code: number
  msg: string
  result: string
}

// 定义默认的 Objective-C 示例代码
const defaultObjcCode = `// 请输入 Objective-C 代码...
@interface ExampleClass: NSObject

@end

@implementation ExampleClass

- (void)helloWorld {
    NSLog(@"Hello World");
}

@end`

const objcCode = ref('')
const jsCode = ref('')
const isLoading = ref(false)
const hasError = ref(false)

async function convertCode() {
  if (!objcCode.value.trim()) {
    alert('请输入Objective-C代码')
    return
  }

  isLoading.value = true
  hasError.value = false // 重置错误状态

  try {
    // 调用后端API
    const response = await fetch('http://localhost:3000/convert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: objcCode.value }),
    })

    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status}`)
    }

    const data: ApiResponse = await response.json()

    // 根据返回的 code 判断是否成功
    if (data.code === 0) {
      // 成功：显示转换结果，清除错误状态
      hasError.value = false
      jsCode.value = data.result
    } else {
      // 失败：显示错误信息，设置错误状态
      hasError.value = true
      jsCode.value = `// 转换失败 (错误码: ${data.code})\n// ${data.msg}`
    }
  } catch (error) {
    console.error('转换错误:', error)
    hasError.value = true
    jsCode.value = `// 网络或服务器错误\n// ${error instanceof Error ? error.message : String(error)}`
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.code-convertor {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #1a1a1a, #2d2d2d, #1e1e1e);
  color: white;
  position: relative;
}

.main-content {
  display: flex;
  flex: 1;
  padding: 20px;
  gap: 20px;
  margin-bottom: 10px;
}

.editor-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #1e1e1e;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  border: 1px solid #3a3a3a;
}

.editor-container:focus-within {
  box-shadow:
    0 0 0 2px #6a6a6a,
    0 0 15px rgba(106, 106, 106, 0.3);
  transform: translateY(-2px);
  border-color: #6a6a6a;
}

/* 错误状态样式 */
.editor-container.error-state {
  border: 2px solid #ff4444;
  box-shadow:
    0 0 0 1px #ff4444,
    0 0 15px rgba(255, 68, 68, 0.3);
}

.editor-container.error-state:focus-within {
  box-shadow:
    0 0 0 2px #ff4444,
    0 0 20px rgba(255, 68, 68, 0.5);
  transform: translateY(-2px);
  border-color: #ff4444;
}

.editor-container.error-state .editor-header {
  background-color: #441414;
  color: #ffaaaa;
  border-bottom-color: #ff4444;
}

.editor-header {
  padding: 12px 16px;
  font-size: 1rem;
  color: #cccccc;
  background-color: #2d2d30;
  border-bottom: 1px solid #3a3a3a;
  font-weight: 500;
  transition: all 0.3s ease;
}

.editor-container:focus-within .editor-header {
  background-color: #3a3a3a;
  color: #ffffff;
  border-bottom-color: #6a6a6a;
}

.editor {
  flex: 1;
  position: relative;
  background-color: #1e1e1e;
  overflow: hidden;
}

.footer {
  padding: 15px 0;
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

.convert-btn {
  padding: 12px 48px;
  font-size: 1.1rem;
  background-color: rgba(255, 255, 255, 0.08);
  color: #f0f0f0;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  backdrop-filter: blur(10px);
}

.convert-btn:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
}

.convert-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
