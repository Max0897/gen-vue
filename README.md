# Fastwater Admin

基于 Vue 3 + Vite 搭建的后台管理前端项目，集成 Ant Design Vue 组件库，使用 Pinia 管理全局状态、Vue Router 管理路由，并通过 Axios 进行接口请求封装。

## 技术栈

- Vue 3 & Vite：现代化组合，提供优秀的开发体验与构建性能。
- Ant Design Vue：企业级 UI 组件库，内置主题与响应式设计能力。
- Pinia：Vue 官方推荐的新一代状态管理方案。
- Vue Router：前端路由与权限控制的基础设施。
- Axios：HTTP 请求库，通过统一封装简化接口调用。
- unplugin-vue-components：按需自动引入组件，减少手动导入成本。

## 快速开始

```bash
# 安装依赖
yarn install

# 启动本地开发服务器
yarn dev

# 构建生产包
yarn build

# 本地预览生产包
yarn preview
```

## 环境变量

在项目根目录创建 `.env` 或 `.env.local`，例如：

```ini
VITE_API_BASE_URL=https://api.example.com
```

如果未显式配置，则 Axios 默认以 `/api` 作为请求前缀，可结合 Vite 代理或后端网关进行转发。

## 推荐目录结构

```text
admin-vue/
├─ public/                     # 静态资源（原样拷贝）
├─ src/
│  ├─ api/                     # Axios 实例与接口封装
│  │  └─ http.js
│  ├─ assets/                  # 静态资源（图片、字体等）
│  ├─ components/              # 可复用基础组件
│  ├─ layouts/                 # 布局组件与框架壳
│  ├─ router/                  # 路由配置与守卫
│  │  └─ index.js
│  ├─ stores/                  # Pinia 全局状态
│  │  └─ index.js
│  ├─ utils/                   # 工具方法与帮助函数
│  ├─ views/                   # 页面级组件
│  │  └─ home/
│  │     └─ HomeView.vue
│  ├─ App.vue
│  └─ main.js
├─ index.html
├─ package.json
├─ vite.config.js
└─ yarn.lock
```

## 代码规范与建议

- 页面组件与业务模块使用组合式 API（`<script setup>`）编写，保持逻辑内聚。
- 统一通过封装的 Axios 实例发起请求，集中处理鉴权、错误提示与数据解构。
- 在 Pinia 中拆分模块（如 `auth`, `user`, `app`），配合持久化方案实现跨页面状态共享。
- 路由中配合 `meta` 字段定义页面标题、权限、缓存策略等信息，便于后续扩展权限体系。
