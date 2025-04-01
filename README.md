# AI Agent Client

一个基于Express和Claude的智能AI代理服务器，支持通过MCP（Model Context Protocol）协议与Claude助手进行交互。

## 功能特性

- Claude 3.5 AI助手集成
- Model Context Protocol支持
- Google搜索集成
- 网页爬取功能
- Express后端服务器

## 安装

```bash
# 克隆项目
git clone https://github.com/Ghostdar/ai-agent-client.git
cd ai-agent-client

# 安装依赖
npm install
```

## 环境变量

创建一个`.env`文件并添加以下变量：

```
ANTHROPIC_API_KEY=your_anthropic_api_key
GOOGLE_API_KEY=your_google_api_key
GOOGLE_CSE_ID=your_google_cse_id
```

## 开发

```bash
# 启动开发服务器
npm run dev

# 启动MCP开发服务
npm run dev:mcp
```

## 生产构建

```bash
# 构建项目
npm run build:all

# 启动服务
npm start
```

## 许可证

UNLICENSED - 私有项目
