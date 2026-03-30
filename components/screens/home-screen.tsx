"use client"

import { useState, useEffect } from "react"
import { Droplet, Coffee, Flame, Zap, Camera, GlassWater, PenLine, ChevronRight, Sparkles, TrendingUp } from "lucide-react"
import { useData } from "@/lib/data-context"

const categoryConfig: Record<string, { bg: string, accent: string, icon: string }> = {
  "水": { bg: "#eff6ff", accent: "#3b82f6", icon: "💧" },
  "咖啡": { bg: "#fff7ed", accent: "#f97316", icon: "☕" },
  "茶饮": { bg: "#f0fdf4", accent: "#10b981", icon: "🍵" },
  "果汁": { bg: "#fdf4ff", accent: "#a855f7", icon: "🍹" },
  "奶茶": { bg: "#fef3c7", accent: "#d97706", icon: "🧋" },
  "碳酸": { bg: "#fef9c3", accent: "#ca8a04", icon: "🥤" },
  "能量": { bg: "#fce7f3", accent: "#ec4899", icon: "⚡" },
  "酒精": { bg: "#f1f5f9", accent: "#64748b", icon: "🍺" },
  "自定义": { bg: "#f0f9ff", accent: "#0ea5e9", icon: "🥛" },
}

interface HomeScreenProps {
  onScanClick: () => void
  onAddClick: () => void
  onViewAllRecordsClick: () => void
  onViewCupsClick: () => void
  onAddCupClick: () => void
  onUseCupClick: (cup: { id: string; name: string; capacity: number; icon?: string }) => void
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 6) return "夜深了 🌙"
  if (hour < 12) return "早上好 🌅"
  if (hour < 14) return "中午好 ☀️"
  if (hour < 18) return "下午好 🌤️"
  return "晚上好 🌆"
}

export function HomeScreen({ onScanClick, onAddClick, onViewAllRecordsClick, onViewCupsClick, onAddCupClick, onUseCupClick }: HomeScreenProps) {
  const { drinkRecords, cups, todayStats, userProfile, loading } = useData()
  const [greeting, setGreeting] = useState(getGreeting())

  useEffect(() => {
    const timer = setInterval(() => {
      setGreeting(getGreeting())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  const dailyGoal = userProfile?.daily_water_goal || 2000
  const progressPercent = Math.min((todayStats.totalVolume / dailyGoal) * 100, 100)
  
  const dailyCalorieGoal = userProfile?.daily_calorie_goal || 2000
  const caloriePercent = Math.min((todayStats.totalCalories / dailyCalorieGoal) * 100, 100)
  
  const dailyCaffeineLimit = userProfile?.daily_caffeine_limit || 400
  const caffeinePercent = Math.min((todayStats.totalCaffeine / dailyCaffeineLimit) * 100, 100)

  const recentDrinks = (() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const todayRecords = drinkRecords.filter((record) => {
      const recordDate = new Date(record.drink_time)
      return recordDate >= today && recordDate < tomorrow
    })

    return todayRecords.slice(0, 3).map(record => {
      const config = categoryConfig[record.category] || categoryConfig["自定义"]
      const time = new Date(record.drink_time)
      const timeStr = time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      
      return {
        id: record.id,
        name: record.name,
        brand: record.brand || "",
        time: timeStr,
        volume: record.volume,
        calories: record.calories || 0,
        caffeine: record.caffeine || 0,
        category: record.category,
        bg: config.bg,
        accent: record.accent_color || config.accent,
        icon: record.icon || config.icon,
      }
    })
  })()

  const favCups = cups.filter(cup => cup.is_favorite).slice(0, 3).map(cup => ({
    id: cup.id,
    name: cup.name,
    capacity: cup.capacity,
    bg: cup.background_color || "#eff6ff",
    accent: cup.accent_color || "#3b82f6",
    icon: cup.icon || "🥤",
  }))

  if (loading) {
    return (
      <div className="flex flex-col gap-6 pb-4 pt-10 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="text-sm text-slate-400">加载中...</p>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-4 pb-4">

      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <p className="text-sm text-slate-400 font-medium">{greeting}</p>
          <h1 className="text-2xl font-bold text-foreground mt-0.5">今日水分补给</h1>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-xl shadow-md">
          🧑‍💻
        </div>
      </div>

      {/* Hydration Hero Card{/* 今日统计卡片 */}
      <div className="glass-inner p-4 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-shadow duration-500 relative overflow-hidden">

        {/* 半圆环图表 (Arch Chart) */}
        <div className="flex justify-center mb-1 mt-2">
          <div className="relative w-[280px] h-[150px]">
            <svg width="280" height="150" viewBox="0 0 280 150">
              <defs>
                <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2895FF" />
                  <stop offset="50%" stopColor="#62D9FF" />
                  <stop offset="100%" stopColor="#58FFEB" />
                </linearGradient>
                <linearGradient id="caffeineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7D4141" />
                  <stop offset="100%" stopColor="#FFEBBE" />
                </linearGradient>
                <linearGradient id="calorieGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FE5196" />
                  <stop offset="100%" stopColor="#F77062" />
                </linearGradient>
              </defs>
              {/* 背景圆环 */}
              <path d="M 30 130 A 110 110 0 0 1 250 130" fill="none" stroke="#EBF0FF" strokeWidth="24" strokeLinecap="round" />
              <path d="M 60 130 A 80 80 0 0 1 220 130" fill="none" stroke="#FFF0E5" strokeWidth="24" strokeLinecap="round" />
              <path d="M 90 130 A 50 50 0 0 1 190 130" fill="none" stroke="#FFE5E5" strokeWidth="24" strokeLinecap="round" />

              {/* 前景进度圆环 */}
              {/* 水分 */}
              <path d="M 30 130 A 110 110 0 0 1 250 130" fill="none" stroke="url(#waterGrad)" strokeWidth="24" strokeLinecap="round" strokeDasharray="345.57" strokeDashoffset={345.57 * (1 - progressPercent / 100)} />
              {/* 咖啡因 */}
              <path d="M 60 130 A 80 80 0 0 1 220 130" fill="none" stroke="url(#caffeineGrad)" strokeWidth="24" strokeLinecap="round" strokeDasharray="251.32" strokeDashoffset={251.32 * (1 - caffeinePercent / 100)} />
              {/* 热量 */}
              <path d="M 90 130 A 50 50 0 0 1 190 130" fill="none" stroke="url(#calorieGrad)" strokeWidth="24" strokeLinecap="round" strokeDasharray="157.08" strokeDashoffset={157.08 * (1 - caloriePercent / 100)} />
            </svg>
            
            {/* 圆环起始位置的图标 */}
            <div className="absolute left-[30px] top-[130px] -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Droplet className="w-3.5 h-3.5" style={{ color: '#2895FF' }} />
            </div>
            <div className="absolute left-[60px] top-[130px] -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Coffee className="w-3.5 h-3.5" style={{ color: '#7D4141' }} />
            </div>
            <div className="absolute left-[90px] top-[130px] -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Flame className="w-3.5 h-3.5" style={{ color: '#FE5196' }} />
            </div>
          </div>
        </div>

        {/* 2x2 数据网格 */}
        <div className="grid grid-cols-2 gap-3 mb-2">
          {/* 卡片 1: 水分 */}
          <div className="glass-inner p-3 rounded-xl">
            <div className="flex items-center gap-1.5 mb-1">
              <Droplet className="w-3.5 h-3.5" style={{ color: '#2895FF' }} />
              <span className="text-xs font-medium text-slate-600">总饮量</span>
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-bold" style={{ color: '#2895FF' }}>{todayStats.totalVolume.toLocaleString()}</span>
              <span className="text-xs text-slate-400 font-medium">ml</span>
            </div>
          </div>

          {/* 卡片 2: 咖啡因 */}
          <div className="glass-inner p-3 rounded-xl">
            <div className="flex items-center gap-1.5 mb-1">
              <Coffee className="w-3.5 h-3.5" style={{ color: '#7D4141' }} />
              <span className="text-xs font-medium text-slate-600">咖啡因</span>
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-bold" style={{ color: '#7D4141' }}>{todayStats.totalCaffeine.toLocaleString()}</span>
              <span className="text-xs text-slate-400 font-medium">mg</span>
            </div>
          </div>

          {/* 卡片 3: 热量 */}
          <div className="glass-inner p-3 rounded-xl">
            <div className="flex items-center gap-1.5 mb-1">
              <Flame className="w-3.5 h-3.5" style={{ color: '#FE5196' }} />
              <span className="text-xs font-medium text-slate-600">热量</span>
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-bold" style={{ color: '#FE5196' }}>{todayStats.totalCalories.toLocaleString()}</span>
              <span className="text-xs text-slate-400 font-medium">kcal</span>
            </div>
          </div>

          {/* 卡片 4: 糖分 */}
          <div className="glass-inner p-3 rounded-xl">
            <div className="flex items-center gap-1.5 mb-1">
              <Zap className="w-3.5 h-3.5 text-purple-500" />
              <span className="text-xs font-medium text-slate-600">糖分</span>
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-bold text-purple-500">{todayStats.totalSugar.toLocaleString()}</span>
              <span className="text-xs text-slate-400 font-medium">g</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "扫描包装", emoji: "📷", onClick: onScanClick },
          { label: "选择杯子", emoji: "🥤", onClick: onViewCupsClick },
          { label: "手动添加", emoji: "✏️", onClick: onAddClick },
        ].map(a => (
          <button
            key={a.label}
            onClick={a.onClick}
            className="glass-card relative p-4 flex flex-col items-center gap-3 active:scale-95 transition-all duration-300 rounded-[1.25rem] border border-white/60 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-shadow duration-500"
          >
            <div className="glass-inner w-12 h-12 rounded-2xl flex items-center justify-center text-2xl">
              {a.emoji}
            </div>
            <span className="text-xs font-semibold text-center text-slate-700">{a.label}</span>
          </button>
        ))}
      </div>

      {/* AI Insight */}
      <div className="glass-card p-4 relative overflow-hidden rounded-[1.25rem] border border-white/60 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-shadow duration-500">
        <div className="flex items-start gap-3">
          <div className="glass-inner w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl">
            💡
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-sm font-bold text-violet-700">AI 洞察</span>
              <span className="glass-inner text-[10px] px-2 py-0.5 rounded-full text-violet-500 font-semibold flex items-center gap-1">
                ✨ 新
              </span>
            </div>
            <p className="text-xs text-violet-600 leading-relaxed font-medium">
              你在 14:00–15:00 饮用咖啡因的频率高达 85%。试试换成低糖绿茶来平缓能量波动？
            </p>
          </div>
        </div>
      </div>

      {/* Recent Drinks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-foreground">今日饮品</h2>
          <button className="flex items-center gap-0.5 text-sm text-blue-500 font-medium" onClick={onViewAllRecordsClick}>
            全部 <ChevronRight size={14} />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {recentDrinks.map(drink => (
            <div key={drink.id} className="glass-card px-4 py-3.5 flex items-center gap-4 rounded-[1.25rem] border border-white/60 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-shadow duration-500">
              <div className="glass-inner w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                {drink.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-bold text-foreground truncate">{drink.name}</p>
                  <span className="glass-inner text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0" style={{ color: drink.accent }}>
                    {drink.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{drink.brand} · {drink.time}</p>
              </div>
              <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                <span className="text-sm font-bold text-foreground">{drink.volume} ml</span>
                <span className="text-xs text-slate-400">{drink.calories} kcal</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Favorite Cups */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-foreground">常用杯子</h2>
          <button className="flex items-center gap-0.5 text-sm text-blue-500 font-medium" onClick={onViewCupsClick}>
            藏杯坞 <ChevronRight size={14} />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
          {favCups.map(cup => (
            <div key={cup.id}
              className="glass-card flex-shrink-0 p-4 flex flex-col items-center gap-2.5 w-28 cursor-pointer active:scale-95 transition-transform rounded-[1.25rem] border border-white/60 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-shadow duration-500"
              onClick={() => onUseCupClick({
                id: cup.id,
                name: cup.name,
                capacity: cup.capacity,
                icon: cup.icon,
              })}
            >
              <div className="glass-inner w-12 h-12 rounded-2xl flex items-center justify-center text-2xl">
                {cup.icon}
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-foreground leading-tight">{cup.name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{cup.capacity} ml</p>
              </div>
            </div>
          ))}
          <button className="flex-shrink-0 p-4 flex flex-col items-center justify-center gap-2.5 w-28 cursor-pointer active:scale-95 transition-transform rounded-2xl border-2 border-dashed border-slate-200" onClick={onAddCupClick}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50">
              <span className="text-2xl text-slate-300">+</span>
            </div>
            <p className="text-xs text-slate-400 text-center font-medium">点亮新杯</p>
          </button>
        </div>
      </div>

    </div>
  )
}
