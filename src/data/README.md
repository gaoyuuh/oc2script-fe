# 帮助数据管理

简单的静态数据管理系统，数据和展示分离。

## 文件结构

```
src/data/
├── helpData.ts    # 数据文件和类型定义
└── README.md      # 说明文档
```

## 使用方法

### 添加新的帮助项

直接编辑 `helpData.ts` 文件中的数据：

```typescript
{
  id: 'language-features',
  title: '语言特性',
  items: [
    { id: 'cpp-features', text: 'C++ 特性（类、模板、命名空间等）' },
    { id: 'new-feature', text: '新的不支持特性' }, // 添加这行
    // ...
  ]
}
```

### 添加新的分类

在 `categories` 数组中添加新分类：

```typescript
{
  id: 'new-category',
  title: '新分类',
  items: [
    { id: 'item1', text: '项目1' },
    { id: 'item2', text: '项目2' }
  ]
}
```

## 数据结构

### HelpItem

```typescript
interface HelpItem {
  id: string // 唯一标识符
  text: string // 显示文本
}
```

### HelpCategory

```typescript
interface HelpCategory {
  id: string // 唯一标识符
  title: string // 分类标题
  items: HelpItem[] // 包含的项目列表
}
```

### HelpConfig

```typescript
interface HelpConfig {
  title: string // 帮助页面标题
  categories: HelpCategory[] // 分类列表
}
```

## 最佳实践

1. **使用有意义的 ID**：确保每个项目和分类都有唯一且有意义的 ID
2. **分类管理**：将相关的项目归类到同一个分类中
3. **文本简洁**：保持帮助文本简洁明了

修改数据后，组件会自动更新显示内容。
