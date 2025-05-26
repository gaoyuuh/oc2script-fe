<template>
  <div ref="editorRef" class="monaco-editor-container" :class="{ 'error-text': hasError }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as monaco from 'monaco-editor'

interface Props {
  modelValue: string
  language?: string
  readonly?: boolean
  placeholder?: string
  theme?: string
  hasError?: boolean
}

interface Emits {
  (event: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  language: 'objective-c',
  readonly: false,
  placeholder: '',
  theme: 'vs-dark',
  hasError: false,
})

const emit = defineEmits<Emits>()

const editorRef = ref<HTMLElement>()
let editor: monaco.editor.IStandaloneCodeEditor | null = null

onMounted(() => {
  if (!editorRef.value) return

  // 注册 Objective-C 语言（如果还没注册）
  if (!monaco.languages.getLanguages().some((lang) => lang.id === 'objective-c')) {
    monaco.languages.register({ id: 'objective-c' })

    // 配置 Objective-C 语法高亮
    monaco.languages.setMonarchTokensProvider('objective-c', {
      tokenizer: {
        root: [
          // 注释
          [/\/\/.*$/, 'comment'],
          [/\/\*/, 'comment', '@comment'],

          // 字符串
          [/"([^"\\]|\\.)*$/, 'string.invalid'],
          [/"/, 'string', '@string'],
          [/@"/, 'string', '@string'],

          // 数字
          [/\d*\.\d+([eE][\-+]?\d+)?[fFdD]?/, 'number.float'],
          [/0[xX][0-9a-fA-F]+[Ll]?/, 'number.hex'],
          [/\d+[Ll]?/, 'number'],

          // 关键字
          [
            /\b(if|else|while|for|do|switch|case|default|break|continue|return|goto|void|char|short|int|long|float|double|signed|unsigned|struct|union|enum|typedef|static|extern|auto|register|const|volatile|sizeof|typeof)\b/,
            'keyword',
          ],
          [
            /\b(id|nil|YES|NO|TRUE|FALSE|self|super|Class|SEL|IMP|BOOL|NSString|NSArray|NSDictionary|NSObject|NSInteger|NSUInteger|CGFloat)\b/,
            'keyword.objective-c',
          ],
          [
            /\b(@interface|@implementation|@protocol|@property|@synthesize|@dynamic|@selector|@class|@public|@private|@protected|@package|@try|@catch|@finally|@throw|@synchronized|@autoreleasepool|@encode|@defs)\b/,
            'keyword.directive',
          ],

          // 运算符
          [/[{}()\[\]]/, '@brackets'],
          [/[<>](?!@symbols)/, '@brackets'],
          [/@symbols/, 'delimiter'],

          // 标识符
          [/[a-zA-Z_]\w*/, 'identifier'],
        ],

        comment: [
          [/[^\/*]+/, 'comment'],
          [/\*\//, 'comment', '@pop'],
          [/[\/*]/, 'comment'],
        ],

        string: [
          [/[^\\"]+/, 'string'],
          [/\\./, 'string.escape.invalid'],
          [/"/, 'string', '@pop'],
        ],
      },

      symbols: /[=><!~?:&|+\-*\/\^%]+/,
    })
  }

  editor = monaco.editor.create(editorRef.value, {
    value: props.modelValue,
    language: props.language,
    theme: props.theme,
    readOnly: props.readonly,
    automaticLayout: true,
    fontSize: 14,
    lineNumbers: 'on',
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    lineHeight: 24,
    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, monospace',
    tabSize: 2,
    insertSpaces: true,
    renderWhitespace: 'selection',
    contextmenu: true,
    selectOnLineNumbers: true,
    roundedSelection: false,
    cursorStyle: 'line',
    cursorBlinking: 'smooth',
    folding: true,
    foldingHighlight: true,
    showFoldingControls: 'always',
  })

  // 监听编辑器内容变化
  editor.onDidChangeModelContent(() => {
    if (editor && !props.readonly) {
      emit('update:modelValue', editor.getValue())
    }
  })

  // 如果有占位符文本，设置初始提示
  if (props.placeholder && !props.modelValue) {
    editor.setValue(props.placeholder)
    // 取消自动选中，将光标定位到开头
    editor.setPosition({ lineNumber: 1, column: 1 })
  }
})

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  (newValue) => {
    if (editor && editor.getValue() !== newValue) {
      editor.setValue(newValue)
    }
  },
)

// 监听只读状态变化
watch(
  () => props.readonly,
  (readonly) => {
    if (editor) {
      editor.updateOptions({ readOnly: readonly })
    }
  },
)

onUnmounted(() => {
  if (editor) {
    editor.dispose()
  }
})
</script>

<style scoped>
.monaco-editor-container {
  width: 100%;
  height: 100%;
  min-height: 200px;
}

/* 错误状态下的文字颜色覆盖 */
.error-text :deep(.monaco-editor .view-lines .view-line) {
  color: #ff6666 !important;
}

.error-text :deep(.monaco-editor .view-lines .view-line .mtk1) {
  color: #ff6666 !important;
}

.error-text :deep(.monaco-editor .view-lines .view-line .mtk5) {
  color: #ff9999 !important; /* 注释颜色 */
}

.error-text :deep(.monaco-editor .view-lines .view-line .mtk4) {
  color: #ffaaaa !important; /* 关键字颜色 */
}

.error-text :deep(.monaco-editor .cursors-layer .cursor) {
  background-color: #ff6666 !important; /* 光标颜色 */
}

.error-text :deep(.monaco-editor .selected-text) {
  background-color: rgba(255, 68, 68, 0.3) !important; /* 选中文本背景 */
}
</style>
