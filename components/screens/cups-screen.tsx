"use client"

import { useState } from "react"
import { Star, Plus, Droplets, CheckCircle2, Crown } from "lucide-react"
import { cn } from "@/lib/utils"

const cups = [
  { id: 1, name: "白熊极光保温杯", capacity: 500, type: "保温杯", material: "316不锈钢", bg: "#eff6ff", accent: "#3b82f6", favorite: true,  uses: 47, icon: "🐻‍❄️" },
  { id: 2, name: "星巴克随行杯",   capacity: 355, type: "随行杯", material: "双层玻璃",  bg: "#f0fdf4", accent: "#10b981", favorite: true,  uses: 32, icon: "🧊" },
  { id: 3, name: "复古玻璃咖啡杯", capacity: 350, type: "咖啡杯", material: "耐热玻璃",  bg: "#fff7ed", accent: "#f97316", favorite: false, uses: 18, icon: "☕" },
  { id: 4, name: "奶茶大容量杯",   capacity: 700, type: "塑料杯", material: "PP 食品级", bg: "#fdf4ff", accent: "#8b5cf6", favorite: false, uses: 12, icon: "🧋" },
  { id: 5, name: "精品茶道茶杯",   capacity: 200, type: "茶杯",   material: "景德镇陶瓷", bg: "#fff1f2", accent: "#f43f5e", favorite: true,  uses: 28, icon: "🍵" },
]

interface CupsScreenProps {
  onAddCupClick: () => void
}

export function CupsScreen({ onAddCupClick }: CupsScreenProps) {
  const [favorites, setFavorites] = useState<number[]>([1, 2, 5])
  const [activeCup, setActiveCup] = useState(1)

  const toggleFavorite = (id: number) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const active = cups.find(c => c.id === activeCup)!

  return (
    <div className="flex flex-col gap-6 pb-4">

      <div className="flex items-center justify-between pt-1">
        <div>
          <p className="text-sm text-slate-400 font-medium">我的收藏</p>
          <h1 className="text-xl font-bold text-foreground mt-0.5">藏杯坞AquaVault</h1>
        </div>
        <button className="primary-btn px-4 py-2.5 rounded-2xl flex items-center gap-1.5 text-xs font-bold" onClick={onAddCupClick}>
          <Plus size={14} />
          点亮新杯
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "杯具总数",   value: cups.length,                         bg: "#eff6ff", color: "#3b82f6" },
          { label: "已收藏",     value: favorites.length,                    bg: "#fefce8", color: "#ca8a04" },
          { label: "总使用次数", value: cups.reduce((a, c) => a + c.uses, 0), bg: "#fdf4ff", color: "#8b5cf6" },
        ].map(s => (
          <div key={s.label}
            className="bright-card px-3 py-3.5 flex flex-col items-center gap-1"
            style={{ background: s.bg, borderColor: 'transparent' }}>
            <span className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</span>
            <span className="text-[10px] text-slate-400 font-medium text-center">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Active Cup Hero */}
      <div
        className="bright-card p-5 relative overflow-hidden"
        style={{ background: active.bg, borderColor: 'transparent' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Crown size={14} style={{ color: active.accent }} />
          <span className="text-xs font-bold" style={{ color: active.accent }}>今日在用</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl bg-white flex-shrink-0 shadow-md">
            {active.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-base font-extrabold text-foreground">{active.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{active.type} · {active.material}</p>
            <div className="flex items-center gap-4 mt-2.5">
              <div className="flex items-center gap-1.5">
                <Droplets size={13} style={{ color: active.accent }} />
                <span className="text-sm font-bold" style={{ color: active.accent }}>{active.capacity} ml</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-500" />
                <span className="text-xs text-slate-500 font-medium">使用 {active.uses} 次</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cup Grid */}
      <div>
        <h2 className="text-base font-bold text-foreground mb-4">全部杯子</h2>
        <div className="grid grid-cols-2 gap-3">
          {cups.map(cup => (
            <div
              key={cup.id}
              className={cn(
                "rounded-2xl p-4 cursor-pointer transition-all active:scale-95 relative",
                activeCup === cup.id
                  ? "ring-2 shadow-lg"
                  : "border border-slate-100 shadow-sm"
              )}
              style={{
                background: cup.bg,
                ...(activeCup === cup.id ? { ringColor: cup.accent, boxShadow: `0 8px 24px ${cup.accent}25` } : {})
              }}
              onClick={() => setActiveCup(cup.id)}
            >
              {/* Active dot */}
              {activeCup === cup.id && (
                <div className="absolute top-3 left-3 w-2.5 h-2.5 rounded-full"
                  style={{ background: cup.accent, boxShadow: `0 0 6px ${cup.accent}` }} />
              )}

              {/* Favorite button */}
              <button
                className="absolute top-3 right-3 w-8 h-8 rounded-xl flex items-center justify-center bg-white shadow-sm transition-all"
                onClick={e => { e.stopPropagation(); toggleFavorite(cup.id) }}
                aria-label={favorites.includes(cup.id) ? "取消收藏" : "收藏"}
              >
                <Star
                  size={13}
                  fill={favorites.includes(cup.id) ? cup.accent : "none"}
                  style={{ color: favorites.includes(cup.id) ? cup.accent : '#cbd5e1' }}
                />
              </button>

              {/* Cup emoji */}
              <div className="w-full flex justify-center mb-3 mt-1">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl bg-white shadow-sm">
                  {cup.icon}
                </div>
              </div>

              <p className="text-sm font-bold text-foreground leading-tight">{cup.name}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{cup.type}</p>
              <div className="flex items-center justify-between mt-2.5">
                <span className="text-sm font-extrabold" style={{ color: cup.accent }}>{cup.capacity} ml</span>
                <span className="text-[10px] text-slate-400 font-medium">{cup.uses} 次</span>
              </div>
            </div>
          ))}

          {/* Add button */}
          <button
            className="rounded-2xl p-4 flex flex-col items-center justify-center gap-3 cursor-pointer active:scale-95 transition-all"
            style={{ border: '2px dashed #e2e8f8', background: '#f8faff', minHeight: 200 }}
            onClick={onAddCupClick}
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-100">
              <Plus size={22} className="text-slate-300" />
            </div>
            <p className="text-xs text-slate-400 font-semibold">点亮新杯</p>
          </button>
        </div>
      </div>
    </div>
  )
}
