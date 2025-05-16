<template>
  <div class="jspatch-convertor">
    <div class="header">
      <h1></h1>
    </div>

    <div class="main-content">
      <div class="editor-container">
        <div class="editor-header">Objective-C</div>
        <div class="editor">
          <textarea
            v-model="objcCode"
            placeholder="请输入Objective-C代码..."
            @input="updateObjcCode"
          ></textarea>
        </div>
      </div>

      <div class="editor-container">
        <div class="editor-header">Script</div>
        <div class="editor">
          <textarea v-model="jsCode" placeholder="转换后的代码..." readonly></textarea>
        </div>
      </div>
    </div>

    <div class="footer">
      <button class="convert-btn" @click="convertCode" :disabled="isLoading">
        {{ isLoading ? '转换中...' : 'Convert' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const objcCode = ref('')
const jsCode = ref('')
const isLoading = ref(false)

function updateObjcCode() {}

async function convertCode() {
  if (!objcCode.value.trim()) {
    alert('请输入Objective-C代码')
    return
  }

  isLoading.value = true
  
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
      const errorData = await response.json()
      throw new Error(`API错误: ${errorData.error || response.status}`)
    }
    
    const data = await response.json()
    jsCode.value = data.result
  } catch (error) {
    console.error('转换错误:', error)
    jsCode.value = `转换出错: ${error instanceof Error ? error.message : String(error)}`
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.jspatch-convertor {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #2c8e9b, #34a9a2);
  color: white;
}

.header {
  padding: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

h1 {
  font-size: 2rem;
  font-weight: 300;
  margin: 0;
}

.main-content {
  display: flex;
  flex: 1;
  padding: 0 30px;
  gap: 20px;
  margin-bottom: 20px;
}

.editor-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #fff;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
}

.editor-container:focus-within {
  box-shadow:
    0 0 0 3px #4a9eff,
    0 0 15px rgba(74, 158, 255, 0.6);
  transform: translateY(-2px);
}

.editor-container:focus-within .editor-header {
  background-color: rgba(74, 158, 255, 0.2);
  color: #0056b3;
}

.editor-header {
  padding: 16px 12px;
  font-size: 1.2rem;
  color: #191919;
  background-color: rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.editor {
  flex: 1;
  position: relative;
  background-color: rgba(5, 143, 143, 0.15);
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  transition: all 0.3s ease;
}

.editor-container:focus-within .editor {
  background-color: rgba(255, 255, 255, 0.95);
}

.editor textarea {
  width: 100%;
  height: 100%;
  padding: 15px;
  border: none;
  outline: none;
  resize: none;
  background-color: transparent;
  color: #191919;
  font-family: monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  transition: all 0.3s ease;
}

.editor-container:focus-within textarea {
  color: #000;
}

.footer {
  padding: 20px 0;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.convert-btn {
  padding: 10px 40px;
  font-size: 1.2rem;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.convert-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
}
</style>
