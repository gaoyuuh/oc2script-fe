<template>
  <div class="help-component">
    <!-- 帮助按钮 -->
    <div class="help-button-container">
      <button class="help-btn" @click="toggleHelp" :class="{ active: showHelp }">
        <span class="help-icon">?</span>
        帮助
      </button>
    </div>

    <!-- 帮助抽屉 -->
    <div class="help-drawer" :class="{ open: showHelp }">
      <div class="help-overlay" @click="closeHelp"></div>
      <div class="help-content">
        <div class="help-header">
          <h2>{{ helpData.title }}</h2>
          <button class="close-btn" @click="closeHelp">×</button>
        </div>
        <div class="help-body">
          <div class="markdown-content" v-html="parseMarkdown(helpData.content)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { marked } from 'marked'
import { helpData } from '@/data/helpData'

const showHelp = ref(false)

// 配置 marked
marked.setOptions({
  breaks: true,
  gfm: true,
})

// 解析 Markdown
function parseMarkdown(markdown: string): string {
  return marked(markdown.trim()) as string
}

// 帮助抽屉控制
function toggleHelp() {
  showHelp.value = !showHelp.value
}

function closeHelp() {
  showHelp.value = false
}
</script>

<style scoped>
.help-component {
  position: relative;
}

.help-button-container {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 10;
}

.help-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background-color: rgba(255, 255, 255, 0.12);
  color: #f0f0f0;
  border: 2px solid rgba(255, 255, 255, 0.25);
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  font-weight: 500;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
}

.help-btn:hover {
  background-color: rgba(255, 255, 255, 0.18);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

.help-btn.active {
  background-color: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

.help-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  background-color: rgba(255, 255, 255, 0.25);
  border-radius: 50%;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.3s ease;
}

.help-btn:hover .help-icon {
  background-color: rgba(255, 255, 255, 0.35);
}

/* 帮助抽屉样式 */
.help-drawer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.help-drawer.open {
  pointer-events: all;
  opacity: 1;
}

.help-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.help-content {
  position: absolute;
  top: 0;
  right: 0;
  width: 500px;
  height: 100%;
  background: linear-gradient(135deg, #2a2a2a, #1e1e1e);
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.3);
  transform: translateX(100%);
  transition: transform 0.3s ease;
  overflow-y: auto;
}

.help-drawer.open .help-content {
  transform: translateX(0);
}

.help-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #3a3a3a;
  background-color: rgba(255, 255, 255, 0.05);
}

.help-header h2 {
  margin: 0;
  color: #f0f0f0;
  font-size: 1.3rem;
  font-weight: 500;
}

.close-btn {
  background: none;
  border: none;
  color: #cccccc;
  font-size: 24px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.help-body {
  padding: 20px;
}

.markdown-content {
  color: #cccccc;
  line-height: 1.6;
  font-size: 0.8rem;
}

/* Markdown 标题样式 */
.markdown-content :deep(h1) {
  color: #ff8a80;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 24px 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #4a4a4a;
}

.markdown-content :deep(h2) {
  color: #ffab91;
  font-size: 1rem;
  font-weight: 600;
  margin: 20px 0 12px 0;
  padding-bottom: 6px;
  border-bottom: 1px solid #555555;
}

.markdown-content :deep(h3) {
  color: #ffcc9c;
  font-size: 0.9rem;
  font-weight: 600;
  margin: 16px 0 8px 0;
}

.markdown-content :deep(h4),
.markdown-content :deep(h5),
.markdown-content :deep(h6) {
  color: #ffd7cc;
  font-weight: 600;
  margin: 12px 0 6px 0;
  font-size: 0.85rem;
}

/* 段落样式 */
.markdown-content :deep(p) {
  margin: 8px 0;
  color: #cccccc;
  font-size: 0.8rem;
}

/* 代码样式 */
.markdown-content :deep(code) {
  background-color: #2d2d2d;
  color: #f8f8f2;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 0.75rem;
}

.markdown-content :deep(pre) {
  background-color: #1e1e1e;
  color: #f8f8f2;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 12px 0;
  border: 1px solid #3a3a3a;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 0.75rem;
}

.markdown-content :deep(pre code) {
  background: none;
  padding: 0;
  color: inherit;
  font-size: inherit;
}

/* 引用样式 */
.markdown-content :deep(blockquote) {
  margin: 12px 0;
  padding: 12px 16px;
  background-color: rgba(255, 255, 255, 0.05);
  border-left: 4px solid #666666;
  color: #bbbbbb;
  border-radius: 0 4px 4px 0;
  font-size: 0.8rem;
}

.markdown-content :deep(blockquote p) {
  margin: 0;
  color: #bbbbbb;
  font-size: 0.8rem;
}

/* 强调样式 */
.markdown-content :deep(strong) {
  color: #ffffff;
  font-weight: 600;
}

.markdown-content :deep(em) {
  color: #dddddd;
  font-style: italic;
}

/* 列表样式 */
.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin: 12px 0;
  padding-left: 24px;
  font-size: 0.8rem;
}

.markdown-content :deep(li) {
  margin: 6px 0;
  color: #cccccc;
  line-height: 1.5;
  font-size: 0.8rem;
}

.markdown-content :deep(ul li) {
  list-style-type: disc;
}

.markdown-content :deep(ol li) {
  list-style-type: decimal;
}

/* 链接样式 */
.markdown-content :deep(a) {
  color: #66b3ff;
  text-decoration: none;
}

.markdown-content :deep(a:hover) {
  color: #99ccff;
  text-decoration: underline;
}

/* 分隔线样式 */
.markdown-content :deep(hr) {
  border: none;
  border-top: 1px solid #555555;
  margin: 20px 0;
}

/* 表格样式 */
.markdown-content :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 12px 0;
  font-size: 0.8rem;
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
  border: 1px solid #555555;
  padding: 8px 12px;
  text-align: left;
  font-size: 0.8rem;
}

.markdown-content :deep(th) {
  background-color: #2d2d2d;
  color: #ffffff;
  font-weight: 600;
}

.markdown-content :deep(td) {
  background-color: #1e1e1e;
  color: #cccccc;
}
</style>
