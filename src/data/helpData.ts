// 类型定义
export interface HelpConfig {
  title: string
  content: string // 整个帮助内容使用 Markdown 格式
}

// 帮助数据配置
export const helpData: HelpConfig = {
  title: '帮助',
  content: `
# 不支持自动转换的情况:

## 1. 调用原始方式需自己添加代码

\`\`\`javascript
self.kzc__original__原方法名(参数...);
\`\`\`

## 2. 不支持宏定义，需要手动在 oc 中展开

## 3. 不识别的下标语法

**示例代码：**
\`\`\`objective-c
self.dict["key"]
\`\`\`

> **说明：** self.dict 是类实例属性，没在当前作用域初始化，所以不支持自动转换下标方法。

**需要手动转换为：**
\`\`\`javascript
self.dict.objectForKey_("key");
\`\`\`

⚠️ **注意：** 遇到不识别的下标语法，会报错中止转换

## 4. enumerateObjectsUsingBlock_ 不支持 *stop

如果检测到 **\\*stop** 参数，会报错中止转换。

**解决方案：**
1. 不使用 \\*stop 参数
2. 或者转换为 for 循环，使用 \`break;\`

## 5. 转换的类和方法默认都是已存在的，不支持插入新方法

## 6. 存取类实例的字段，需手动转换

**设置字段：**
\`\`\`objective-c
- (void)setModel:(id)model {
    // 原代码
    _model = model;
    // 需要手动转换为
    setRawDataForField(self, "model", model);
}
\`\`\`

**获取字段：**
\`\`\`objective-c
- (id)model {
    // 原代码
    return _model;
    // 需要手动转换为
    return getRawDataForField(self, "model");
}
\`\`\`
  `,
}
