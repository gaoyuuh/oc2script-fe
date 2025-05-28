// 类型定义
export interface HelpItem {
  id: string
  text: string
  description?: string // 可选的描述字段
}

export interface HelpCategory {
  id: string
  title: string
  items: HelpItem[]
}

export interface HelpConfig {
  title: string
  categories: HelpCategory[]
}

// 帮助数据配置
export const helpData: HelpConfig = {
  title: '帮助',
  categories: [
    {
      id: 'unsupported',
      title: '暂不支持自动转换：',
      items: [
        {
          id: 'kzc_original',
          text: '调用原始方式需自己添加代码',
          description: 'self.kzc__original__原方法名(参数...);',
        },
        {
          id: 'macro',
          text: '不支持宏定义，需要手动在 oc 中展开',
        },
        {
          id: 'subscript',
          text: '不识别的下标语法',
          description: `
            self.dict["key"]
            // self.dict 是类实例属性，没在当前作用域初始化，所以不支持自动转换下标方法。
            // 需要手动转换为 self.dict.objectForKey_("key");
            
            * 遇到不识别的下标语法，会报错中止转换

          `,
        },
        {
          id: 'enumerate',
          text: 'enumerateObjectsUsingBlock_ 不支持 *stop',
          description: `
            如果检测到 *stop 参数，会报错中止转换。可修改为
            1. 不使用 *stop 参数
            2. 或者转换为 for 循环，使用 break;

            `,
        },
        {
          id: 'insert_method',
          text: '转换的类和方法默认都是已存在的，不支持插入新方法',
        },
        {
          id: 'instance_field',
          text: '存取类实例的字段，需手动转换\nsetRawDataForField(obj,"字段名",value);\nvar a = getRawDataForField(obj,"字段名");',
          description: `
          - (void)setModel:(id)model {
            // 原代码
            _model = model;
            // 需要手动转换为
            setRawDataForField(self, "model", model);
          }
          
          - (id)model {
            // 原代码
            return _model;
            // 需要手动转换为
            return getRawDataForField(self, "model");
          }
          `,
        },
      ],
    },
  ],
}
