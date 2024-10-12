# AI驱动的文档分析平台 - DocSense

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/jqlong17/DocSense)

## 项目概述

DocSense 是一个 AI 驱动的文档分析平台，允许用户上传文档并通过 AI 辅助对话进行分析。平台提供多个预设提示（prompt），从不同角度分析文档，提高分析效率。

## 主要功能

1. **文档上传**：用户可以上传一个或多个文档进行分析。
2. **AI 辅助对话**：用户可以与 AI 交互，分析上传的文档。
3. **多重提示分析**：使用预设的提示从不同角度同时分析文档。
4. **可定制分析标签页**：用户可以添加新的分析标签页，并自定义提示。
5. **灵活的 AI 模型集成**：平台通过统一的 API 支持各种 AI 模型。

## 用户界面布局

界面分为两个主要部分：

- **左侧面板（屏幕的 1/3）**：
  - 对话界面，包含输入框和文档上传功能。
  - 支持选择不同的 AI 模型进行分析。

- **右侧面板（屏幕的 2/3）**：
  - 分析区域，包含多个标签页。
  - 每个标签页右上角有一个提示设置按钮。
  - 初始有三个标签页，可以添加更多。

## 功能详情

### 对话界面（左侧面板）

- 用户可以与 AI 就上传的文档进行对话。
- 消息对话框的下方有两个按钮：一个是上传文档，另一个是模型选择。
- AI 在生成回复时会考虑对话历史和上传的文档。
- 每个对话气泡下方有一个按钮，可以将内容发送到右侧面板进行进一步分析。

### 分析区域（右侧面板）

- 每个标签页使用预设的提示（prompt）来分析上传的文档。
- 用户可以通过每个标签页右上角的设置按钮修改提示（prompt）和标签名称。
- 分析结果显示在相应的标签页中。
- 如果没有上传文档，分析区域保持空白。

### 附加功能

- **重置按钮**：将应用恢复到初始状态。
- **新建标签页**：用户可以添加新的分析标签页，并自定义提示。

## AI 模型集成

平台使用统一的 API，支持各种 AI 模型。在进行 API 调用时可以指定具体的模型，为每个任务选择最合适的模型提供了灵活性。支持的模型包括：

- `moonshot-v1-8k`
- `moonshot-v1-32k`
- `moonshot-v1-128k`
- `moonshot-v1-auto`
- `GPT-3.5`
- `claude-v1`
- `PaLM2`
- `Mistral`
- `ByteDance-DouBao`
- `Baidu-ERNIE`
- `Aliyun-QianWen`
- `iFlytek-XingHuo`
- `Zhipu-ChatGLM`
- `Qihoo-ZhiNao`
- `Tencent-HunYuan`
- `Moonshot-Kimi`

## 开始使用

1. 克隆仓库。
2. 安装依赖：`npm install`
3. 启动开发服务器：`npm run dev`
4. 在浏览器中打开应用（通常在 `http://localhost:5173`）

## 技术栈

- **React with TypeScript**
- **Vite** 用于构建工具
- **Tailwind CSS** 用于样式
- **Lucide React** 用于图标

## 组件命名

以下是前端组件在后台的命名：

- **Tab 按钮**：`data-testid="tab-button-{tabName}"` - 用于切换不同的分析标签页。
- **设置按钮**：`data-testid="settings-button"` - 用于打开设置对话框。
- **内容区域**：`data-testid="content-area"` - 显示当前选中标签页的内容。
- **模态覆盖层**：`data-testid="modal-overlay"` - 模态对话框的背景层。
- **设置对话框**：`data-testid="settings-dialog"` - 用于配置预设提示的对话框。
- **提示输入框**：`data-testid="prompt-input"` - 用于输入或编辑预设提示。
- **保存按钮**：`data-testid="save-button"` - 用于保存提示设置。
- **左侧聊天面板**：`data-testid="chat-panel"` - 包含对话界面和文档上传功能。
- **右侧分析面板**：`data-testid="analysis-panel"` - 包含分析区域和多个标签页。

## 更新内容

### 2023-10-12 更新

1. **标签页管理**
   - 支持无限新增标签页。
   - 标签页支持删除，删除按钮在鼠标悬停时显示。
   - 标签页名称支持修改，默认名称为“标签”。

2. **设置功能**
   - 设置按钮移动到每个标签页面内。
   - 设置弹窗中显示当前标签名称，并支持同步修改。
   - 设置中支持配置预设的 prompt。

3. **文件上传与处理**
   - 支持上传多个文件，读取文件内容并传递给大模型。
   - 文件上传成功后，显示上传状态并更新文件内容。

4. **API 调用**
   - 使用 `axios` 进行 API 调用，增加了超时时间和错误处理。
   - 确保 API Key 从环境变量中正确加载。

## 核心逻辑

- **标签页管理**
  - 使用 `useState` 管理标签页的名称和内容。
  - 通过 `handleAddTab` 和 `handleDeleteTab` 函数实现标签页的动态增删。
  - 在设置弹窗中，通过 `handleSavePrompt` 函数更新标签名称和 prompt。

- **文件上传**
  - 在 `ChatPanel` 组件中使用 `FileReader` 读取文件内容。
  - 通过 `onFilesChange` 回调函数将文件内容传递给父组件。

- **API 调用**
  - 在 `aiService.ts` 中使用 `axios` 进行 API 调用。
  - 通过 `callAI` 函数发送请求，并处理响应和错误。