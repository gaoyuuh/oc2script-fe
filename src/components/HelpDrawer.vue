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
          <div class="unsupported-list">
            <div v-for="category in helpData.categories" :key="category.id" class="category">
              <h3>{{ category.title }}</h3>
              <ul>
                <li v-for="item in category.items" :key="item.id">
                  <div class="item-text">{{ item.text }}</div>
                  <div v-if="item.description" class="item-description">
                    {{ item.description }}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { helpData } from '@/data/helpData'

const showHelp = ref(false)

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
  width: 400px;
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

.unsupported-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.category h3 {
  margin: 0 0 12px 0;
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 600;
  border-bottom: 2px solid #4a4a4a;
  padding-bottom: 6px;
}

.category ul {
  margin: 0;
  padding-left: 0;
  list-style: none;
}

.category li {
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  padding-left: 20px;
}

.category li:before {
  content: '•';
  color: #ff6b6b;
  font-weight: bold;
  position: absolute;
  left: 0;
  top: 8px;
}

.item-text {
  color: #cccccc;
  font-size: 0.95rem;
  line-height: 1.4;
  white-space: pre-line;
}

.item-description {
  margin-top: 6px;
  color: #999999;
  font-size: 0.85rem;
  line-height: 1.3;
  font-style: italic;
  padding-left: 8px;
  border-left: 2px solid #555555;
  white-space: pre-line;
}

.category li:last-child {
  border-bottom: none;
}
</style>
