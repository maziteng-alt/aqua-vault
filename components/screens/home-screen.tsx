"use client"

import { Droplets, Coffee, Zap, Flame, Camera, GlassWater, PenLine, ChevronRight, Sparkles, TrendingUp } from "lucide-react"

const recentDrinks = [
  { id: 1, name: "美式咖啡", brand: "星巴克", time: "09:24", volume: 350, calories: 15, caffeine: 150, category: "咖啡", bg: "#fff7ed", accent: "#f97316", icon: "☕" },
  { id: 2, name: "纯净水", brand: "农夫山泉", time: "11:05", volume: 500, calories: 0, caffeine: 0, category: "水", bg: "#eff6ff", accent: "#3b82f6", icon: "💧" },
  { id: 3, name: "燕麦拿铁", brand: "瑞幸", time: "14:30", volume: 400, calories: 120, caffeine: 75, category: "咖啡", bg: "#fdf4ff", accent: "#a855f7", icon: "🥛" },
]

const favCups = [
  { id: 1, name: "白熊保温杯", capacity: 500, bg: "#eff6ff", accent: "#3b82f6", icon: "🐻‍❄️" },
  { id: 2, name: "咖啡随行杯", capacity: 350, bg: "#fff7ed", accent: "#f97316", icon: "☕" },
  { id: 3, name: "玻璃茶杯",   capacity: 300, bg: "#f0fdf4", accent: "#10b981", icon: "🍵" },
]

interface HomeScreenProps {
  onScanClick: () => void
  onAddClick: () => void
  onViewAllRecordsClick: () => void
  onViewCupsClick: () => void
  onAddCupClick: () => void
}

export function HomeScreen({ onScanClick, onAddClick, onViewAllRecordsClick, onViewCupsClick, onAddCupClick }: HomeScreenProps) {
  return (
    <div className="flex flex-col gap-6 pb-4">

      {/* Header */}
      <div className="flex items-center justify-between pt-3">
        <div>
          <p className="text-sm text-slate-400 font-medium">早上好 👋</p>
          <h1 className="text-2xl font-bold text-foreground mt-0.5">今日水分补给</h1>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-xl shadow-md">
          🧑‍💻
        </div>
      </div>

      {/* Hydration Hero Card */}
      <div className="bright-card p-5 relative overflow-hidden">
        {/* Subtle tinted top strip */}
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-[1.25rem]"
          style={{ background: 'linear-gradient(90deg, #3b82f6, #06b6d4)' }} />

        <div className="flex items-center gap-5 mt-1">
          {/* Rings */}
          <div className="relative flex-shrink-0">
            <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
              <defs>
                {/* Water gradient - blue to cyan */}
                <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
                {/* Calories gradient - red to pink */}
                <linearGradient id="calorieGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
                {/* Caffeine gradient - orange to yellow */}
                <linearGradient id="caffeineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#eab308" />
                </linearGradient>
              </defs>
              
              {/* Outer ring - Water */}
              <circle cx="60" cy="60" r="50" fill="none" stroke="#e2e8f8" strokeWidth="16" />
              <circle
                cx="60" cy="60" r="50"
                fill="none"
                stroke="url(#waterGrad)"
                strokeWidth="16"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 50 * 0.68} ${2 * Math.PI * 50}`}
              />
              
              {/* Middle ring - Calories */}
              <circle cx="60" cy="60" r="32" fill="none" stroke="#fee2e2" strokeWidth="16" />
              <circle
                cx="60" cy="60" r="32"
                fill="none"
                stroke="url(#calorieGrad)"
                strokeWidth="16"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 32 * 0.45} ${2 * Math.PI * 32}`}
              />
              
              {/* Inner ring - Caffeine */}
              <circle cx="60" cy="60" r="14" fill="none" stroke="#ffedd5" strokeWidth="16" />
              <circle
                cx="60" cy="60" r="14"
                fill="none"
                stroke="url(#caffeineGrad)"
                strokeWidth="16"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 14 * 0.75} ${2 * Math.PI * 14}`}
              />
            </svg>
            
            {/* Icons at 12 o'clock position */}
            <div className="absolute inset-0">
              {/* Water icon - outer ring */}
              <div 
                className="absolute rounded-full flex items-center justify-center"
                style={{
                  width: '16px',
                  height: '16px',
                  top: '2px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #3b82f6, #06b6d4)'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                </svg>
              </div>
              
              {/* Calories icon - middle ring */}
              <div 
                className="absolute w-4 h-4 rounded-full flex items-center justify-center"
                style={{
                  top: '20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #f43f5e, #ec4899)'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
                </svg>
              </div>
              
              {/* Caffeine icon - inner ring */}
              <div 
                className="absolute rounded-full flex items-center justify-center"
                style={{
                  width: '14px',
                  height: '15px',
                  top: '38px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #f97316, #eab308)'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
                  <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path>
                  <path d="M6 1v3"></path>
                  <path d="M10 1v3"></path>
                  <path d="M14 1v3"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 grid grid-cols-2 gap-2.5">
            {[
              { label: "总饮量",  value: "1,350", unit: "ml",   icon: Droplets, bg: "#eff6ff", color: "#3b82f6" },
              { label: "咖啡因", value: "225",   unit: "mg",   icon: Coffee,   bg: "#fff7ed", color: "#f97316" },
              { label: "糖分",   value: "18",    unit: "g",    icon: Zap,      bg: "#fdf4ff", color: "#a855f7" },
              { label: "热量",   value: "135",   unit: "kcal", icon: Flame,    bg: "#fff1f2", color: "#f43f5e" },
            ].map(s => (
              <div key={s.label}
                className="rounded-2xl px-3 py-2.5 flex flex-col gap-1"
                style={{ background: s.bg }}>
                <div className="flex items-center gap-1.5">
                  <s.icon size={12} style={{ color: s.color }} />
                  <span className="text-[10px] text-slate-400 font-medium">{s.label}</span>
                </div>
                <div className="flex items-baseline gap-0.5 justify-center">
                  <span className="text-base font-extrabold" style={{ color: s.color }}>{s.value}</span>
                  <span className="text-[10px] text-slate-400">{s.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-slate-400 mb-1.5">
            <span>已喝 1,350 ml</span>
            <span>目标 2,000 ml</span>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full"
              style={{ width: '68%', background: 'linear-gradient(90deg, #3b82f6, #06b6d4)' }} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "扫描包装", icon: Camera,     bg: "#eff6ff", color: "#3b82f6", shadow: "rgba(59,130,246,0.2)",  onClick: onScanClick },
          { label: "选择杯子", icon: GlassWater,  bg: "#f0fdf4", color: "#10b981", shadow: "rgba(16,185,129,0.2)",  onClick: () => {} },
          { label: "手动添加", icon: PenLine,     bg: "#fdf4ff", color: "#a855f7", shadow: "rgba(168,85,247,0.2)",  onClick: onAddClick },
        ].map(a => (
          <button
            key={a.label}
            onClick={a.onClick}
            className="bright-card p-4 flex flex-col items-center gap-3 active:scale-95 transition-transform"
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: a.bg, boxShadow: `0 4px 12px ${a.shadow}` }}>
              <a.icon size={22} style={{ color: a.color }} />
            </div>
            <span className="text-xs font-semibold text-slate-600 text-center">{a.label}</span>
          </button>
        ))}
      </div>

      {/* AI Insight */}
      <div className="rounded-2xl p-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #ede9fe 0%, #dbeafe 100%)', border: '1px solid #c4b5fd' }}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <TrendingUp size={18} className="text-violet-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-sm font-bold text-violet-700">AI 洞察</span>
              <span className="text-[10px] px-2 py-0.5 bg-white rounded-full text-violet-500 font-semibold shadow-sm flex items-center gap-1">
                <Sparkles size={9} /> 新
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
            <div key={drink.id} className="bright-card px-4 py-3.5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: drink.bg }}>
                {drink.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-bold text-foreground truncate">{drink.name}</p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
                    style={{ background: drink.bg, color: drink.accent }}>
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
              className="bright-card flex-shrink-0 p-4 flex flex-col items-center gap-2.5 w-28 cursor-pointer active:scale-95 transition-transform">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background: cup.bg }}>
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
