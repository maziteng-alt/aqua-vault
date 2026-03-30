"use client"

import { useState, useEffect } from "react"
import { Star, Plus, Droplets, CheckCircle2, Crown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useData } from "@/lib/data-context"

interface CupsScreenProps {
  onAddCupClick: () => void
  onUseCupClick: (cup: { id: string; name: string; capacity: number; icon?: string; use_count?: number }) => void
}

export function CupsScreen({ onAddCupClick, onUseCupClick }: CupsScreenProps) {
  const { cups, loading, updateCup } = useData()
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    if (cups.length > 0) {
      setFavorites(cups.filter(c => c.is_favorite).map(c => c.id))
    }
  }, [cups])

  const toggleFavorite = async (id: string) => {
    const cup = cups.find(c => c.id === id)
    if (!cup) return

    try {
      await updateCup(id, { is_favorite: !cup.is_favorite })
      setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
    } catch (error) {
      console.error('Failed to update favorite:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6 pb-4 pt-20 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="text-sm text-slate-400">加载中...</p>
      </div>
    )
  }

  const totalUses = cups.reduce((a, c) => a + (c.use_count || 0), 0)

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
          { label: "总使用次数", value: totalUses, bg: "#fdf4ff", color: "#8b5cf6" },
        ].map(s => (
          <div key={s.label}
            className="bright-card px-3 py-3.5 flex flex-col items-center gap-1"
            style={{ background: s.bg, borderColor: 'transparent' }}>
            <span className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</span>
            <span className="text-[10px] text-slate-400 font-medium text-center">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Cup Grid */}
      <div>
        <h2 className="text-base font-bold text-foreground mb-4">全部杯子</h2>
        {cups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="text-6xl">🫗</div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-600">还没有收藏杯子</p>
              <p className="text-xs text-slate-400 mt-1">点击"点亮新杯"开始收藏</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {cups.map(cup => (
              <div
                key={cup.id}
                className="rounded-2xl p-4 cursor-pointer transition-all active:scale-95 relative border border-slate-100 shadow-sm"
                style={{ background: '#eff6ff' }}
                onClick={() => onUseCupClick({
                  id: cup.id,
                  name: cup.name,
                  capacity: cup.capacity,
                  icon: cup.icon,
                  use_count: cup.use_count,
                })}
              >
                {/* Favorite button */}
                <button
                  className="absolute top-3 right-3 w-8 h-8 rounded-xl flex items-center justify-center bg-white shadow-sm transition-all"
                  onClick={e => { e.stopPropagation(); toggleFavorite(cup.id) }}
                  aria-label={favorites.includes(cup.id) ? "取消收藏" : "收藏"}
                >
                  <Star
                    size={13}
                    fill={favorites.includes(cup.id) ? '#3b82f6' : "none"}
                    style={{ color: favorites.includes(cup.id) ? '#3b82f6' : '#cbd5e1' }}
                  />
                </button>

                {/* Cup emoji */}
                <div className="w-full flex justify-center mb-3 mt-1">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl bg-white shadow-sm">
                    {cup.icon || "🫗"}
                  </div>
                </div>

                <p className="text-sm font-bold text-foreground leading-tight">{cup.name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">杯子</p>
                <div className="flex items-center justify-between mt-2.5">
                  <span className="text-sm font-extrabold text-blue-500">{cup.capacity} ml</span>
                  <span className="text-[10px] text-slate-400 font-medium">{cup.use_count || 0} 次</span>
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
        )}
      </div>
    </div>
  )
}
