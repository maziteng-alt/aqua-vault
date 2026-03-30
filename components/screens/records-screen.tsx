"use client"

import { useState, useMemo } from "react"
import { Filter, Repeat2, Edit3, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useData } from "@/lib/data-context"

const filters = ["全部", "水", "咖啡", "茶饮", "奶茶", "果汁", "碳酸", "能量", "酒精", "自定义"]

const categoryConfig: Record<string, { bg: string, accent: string, icon: string, gradient: string }> = {
  "水": { bg: "#eff6ff", accent: "#3b82f6", icon: "💧", gradient: "linear-gradient(90deg, #3b82f6, #06b6d4)" },
  "咖啡": { bg: "#fff7ed", accent: "#f97316", icon: "☕", gradient: "linear-gradient(90deg, #f97316, #eab308)" },
  "茶饮": { bg: "#f0fdf4", accent: "#10b981", icon: "🍵", gradient: "linear-gradient(90deg, #10b981, #059669)" },
  "果汁": { bg: "#fdf4ff", accent: "#a855f7", icon: "🍹", gradient: "linear-gradient(90deg, #10b981, #14b8a6)" },
  "奶茶": { bg: "#fef3c7", accent: "#d97706", icon: "🧋", gradient: "linear-gradient(90deg, #ec4899, #db2777)" },
  "碳酸": { bg: "#fef9c3", accent: "#ca8a04", icon: "🥤", gradient: "linear-gradient(90deg, #f59e0b, #eab308)" },
  "能量": { bg: "#fce7f3", accent: "#ec4899", icon: "⚡", gradient: "linear-gradient(90deg, #f43f5e, #ec4899)" },
  "酒精": { bg: "#f1f5f9", accent: "#64748b", icon: "🍺", gradient: "linear-gradient(90deg, #64748b, #475569)" },
  "自定义": { bg: "#f0f9ff", accent: "#0ea5e9", icon: "🥛", gradient: "linear-gradient(90deg, #0ea5e9, #0284c7)" },
}

export function RecordsScreen() {
  const [activeFilter, setActiveFilter] = useState("全部")
  const [showFilters, setShowFilters] = useState(false)
  const { drinkRecords, loading, refresh, deleteDrinkRecord } = useData()

  const recordsByDay = useMemo(() => {
    const grouped: Record<string, any[]> = {}
    
    drinkRecords.forEach(record => {
      const date = new Date(record.drink_time)
      const dateKey = date.toDateString()
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(record)
    })

    return Object.entries(grouped).map(([dateKey, records]) => {
      const date = new Date(dateKey)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      let dateStr
      if (date.toDateString() === today.toDateString()) {
        dateStr = `今天 · ${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateStr = `昨天 · ${date.getMonth() + 1}月${date.getDate()}日`
      } else {
        dateStr = `${date.getMonth() + 1}月${date.getDate()}日 · ${date.getFullYear()}年`
      }

      const total = records.reduce((sum, r) => sum + r.volume, 0)

      return {
        date: dateStr,
        total: `${total.toLocaleString()} ml`,
        records: records.map(r => {
          const config = categoryConfig[r.category] || categoryConfig["自定义"]
          const time = new Date(r.drink_time)
          const timeStr = time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
          
          return {
            ...r,
            time: timeStr,
            bg: config.bg,
            accent: r.accent_color || config.accent,
            icon: r.icon || config.icon,
            gradient: config.gradient,
          }
        })
      }
    }).sort((a, b) => {
      const aFirst = a.records[0]?.drink_time || ''
      const bFirst = b.records[0]?.drink_time || ''
      return new Date(bFirst).getTime() - new Date(aFirst).getTime()
    })
  }, [drinkRecords])

  if (loading) {
    return (
      <div className="flex flex-col gap-6 pb-4 pt-20 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="text-sm text-slate-400">加载中...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 pb-4">

      <div className="flex items-center justify-between pt-1">
        <div>
          <p className="text-sm text-slate-400 font-medium">我的饮品日志</p>
          <h1 className="text-xl font-bold text-foreground mt-0.5">点滴录SipArchive</h1>
        </div>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="w-10 h-10 flex items-center justify-center rounded-2xl" 
          style={{ background: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.4)', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)' }}>
          <Filter size={16} className="text-slate-500" />
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={cn(
                "flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all",
                activeFilter === f ? "text-white" : "text-slate-600"
              )}
              style={activeFilter === f 
                ? { background: categoryConfig[f === "全部" ? "水" : f]?.gradient || categoryConfig["水"].gradient, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }
                : { background: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.4)' }
              }
            >
              {f}
            </button>
          ))}
        </div>
      )}

      {/* Records */}
      {recordsByDay.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="text-6xl">🍵</div>
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-600">还没有饮品记录</p>
            <p className="text-xs text-slate-400 mt-1">点击首页的"手动添加"开始记录</p>
          </div>
        </div>
      ) : (
        recordsByDay.map(day => (
          <div key={day.date}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400">{day.date}</span>
              <span className="text-xs font-bold text-blue-500">{day.total}</span>
            </div>

            <div className="flex flex-col gap-3">
              {day.records
                .filter(r => activeFilter === "全部" || r.category === activeFilter)
                .map(record => (
                <div key={record.id} className="overflow-hidden rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.4)', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)' }}>
                  {/* Top color strip */}
                  <div className="h-1 w-full" style={{ background: record.gradient }} />
                  <div className="px-4 py-3.5 flex items-center gap-3.5">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.6))', backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                      {record.icon}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-bold text-foreground truncate">{record.name}</p>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.6))', color: record.accent, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                          {record.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mb-2">{record.brand} · {record.time}</p>
                      {/* Nutrition tags */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {[
                          { val: `${record.volume}ml`,         color: "#3b82f6", bg: "#eff6ff" },
                          { val: `${record.calories || 0}kcal`,     color: "#f43f5e", bg: "#fff1f2" },
                          { val: `${record.caffeine || 0}mg咖啡因`, color: "#f97316", bg: "#fff7ed" },
                          { val: `${record.sugar || 0}g糖`,         color: "#8b5cf6", bg: "#fdf4ff" },
                        ].map((s, i) => (
                          <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ background: s.bg, color: s.color }}>
                            {s.val}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button className="w-8 h-8 rounded-xl flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.6))', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
                        <Repeat2 size={13} className="text-blue-500" />
                      </button>
                      <button className="w-8 h-8 rounded-xl flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.6))', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
                        <Edit3 size={13} className="text-slate-400" />
                      </button>
                      <button 
                        className="w-8 h-8 rounded-xl flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.6))', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}
                        onClick={() => deleteDrinkRecord(record.id)}
                      >
                        <Trash2 size={13} className="text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
