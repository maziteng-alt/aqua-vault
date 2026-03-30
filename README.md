# Aqua Vault 全栈项目

一个美观的饮品记录应用，支持用户登录、数据存储、AI分析和AI扫描识别功能。

## 💰 方案对比

| 方案 | 前端 | 后端/数据库 | AI | 成本 |
|------|------|-------------|----|------|
| **推荐：Vercel + Supabase** | Vercel (免费) | Supabase (免费) | 阿里云 (按量付费) | 几乎免费 ✅ |
| 阿里云全栈 | ECS | RDS | 通义千问 | ¥150-300/月 |

---

## 🎯 推荐方案：Vercel + Supabase（免费！）

### 技术栈

- **前端**：Next.js + Tailwind CSS
- **部署**：Vercel（免费）
- **后端/数据库**：Supabase（免费PostgreSQL + Auth）
- **AI服务**：阿里云通义千问（按量付费）

---

## 📦 项目结构

```
.
├── app/                 # Next.js 前端应用
├── components/          # React 组件
├── lib/
│   ├── supabase.ts      # Supabase 配置
│   └── api.ts           # Supabase API 封装
├── supabase/
│   └── migrations/      # 数据库表 SQL
├── server/              # (可选) 原 Express 后端（已弃用）
└── package.json
```

---

## 🚀 快速开始

### 第一步：注册 Supabase

1. 访问 https://supabase.com
2. 点击 "Start your project"
3. 创建新项目（免费版足够）

### 第二步：创建数据库表

1. 进入 Supabase 项目 → SQL Editor
2. 新建查询
3. 复制 `supabase/migrations/001-create-tables.sql` 的内容
4. 执行！

### 第三步：配置环境变量

```bash
cp .env.local.example .env.local
```

编辑 `.env.local`，填入你的 Supabase 信息：

```env
# 在 Supabase 项目设置 → API 中找到
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon-key
```

### 第四步：启动本地开发

```bash
npm install
npm run dev
```

访问 http://localhost:3000

---

## 📡 API 用法（Supabase 版本）

所有 API 都在 `lib/api.ts` 中封装好了，直接调用即可！

### 用户认证

```typescript
import { signUp, signIn, signOut, getCurrentUser } from '@/lib/api'

// 注册
await signUp('email@example.com', 'password123')

// 登录
await signIn('email@example.com', 'password123')

// 登出
await signOut()

// 获取当前用户
const user = await getCurrentUser()
```

### 用户资料

```typescript
import { getUserProfile, updateUserProfile } from '@/lib/api'

// 获取资料
const profile = await getUserProfile()

// 更新资料
await updateUserProfile({
  username: '新名字',
  daily_water_goal: 2500,
})
```

### 饮品记录

```typescript
import {
  getDrinkRecords,
  getTodayDrinkRecords,
  createDrinkRecord,
  updateDrinkRecord,
  deleteDrinkRecord,
} from '@/lib/api'

// 获取今日记录和统计
const { records, stats } = await getTodayDrinkRecords()

// 添加记录
await createDrinkRecord({
  name: '美式咖啡',
  brand: '星巴克',
  volume: 350,
  calories: 15,
  caffeine: 150,
  category: '咖啡',
  icon: '☕',
  accent_color: '#f97316',
})
```

### 杯子管理

```typescript
import {
  getCups,
  getFavoriteCups,
  createCup,
  updateCup,
  deleteCup,
} from '@/lib/api'

// 获取所有杯子
const cups = await getCups()

// 添加杯子
await createCup({
  name: '白熊保温杯',
  capacity: 500,
  icon: '🐻‍❄️',
  is_favorite: true,
})
```

---

## 🤖 阿里云 AI 配置（可选）

### 1. 购买通义千问

推荐模型：**qwen-vl-max**（视觉识别最强）

1. 访问 https://dashscope.console.aliyun.com
2. 开通 "通义千问" 服务
3. 创建 API-KEY

### 2. 配置环境变量

在 `.env.local` 中添加：

```env
ALIYUN_ACCESS_KEY_ID=你的AccessKey ID
ALIYUN_ACCESS_KEY_SECRET=你的AccessKey Secret
```

---

## ☁️ 部署到 Vercel（免费！）

### 1. Push 代码到 GitHub

```bash
git add .
git commit -m "Setup Supabase"
git push
```

### 2. 导入到 Vercel

1. 访问 https://vercel.com
2. 点击 "New Project"
3. 选择你的 GitHub 仓库
4. 导入！

### 3. 配置环境变量

在 Vercel 项目设置 → Environment Variables 中添加：

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
ALIYUN_ACCESS_KEY_ID (可选)
ALIYUN_ACCESS_KEY_SECRET (可选)
```

### 4. 部署！

点击 "Deploy"，等待完成即可！

---

## 📊 Supabase 免费额度

| 资源 | 免费额度 |
|------|---------|
| 数据库 | 500MB 存储 |
| 认证用户 | 无限量 |
| 文件存储 | 1GB |
| 带宽 | 2GB/月 |

**个人项目完全够用！**

---

## 🎨 技术栈

### 前端
- Next.js 16
- React 19
- Tailwind CSS
- Lucide Icons
- Recharts

### 后端/数据库
- Supabase (PostgreSQL + Auth)
- Row Level Security (RLS)

### AI
- 阿里云通义千问 (qwen-vl-max)

---

## 📝 开发计划

- [x] Supabase 集成
- [x] 数据库表设计
- [x] API 封装
- [ ] 前端页面集成 Supabase
- [ ] 阿里云通义千问集成
- [ ] AI 扫描识别功能

---

## 📄 许可证

MIT
