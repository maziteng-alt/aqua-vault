"use client"

import { useState } from "react"
import { Filter, Repeat2, Edit3, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

const filters = ["全部", "水", "咖啡", "茶饮", "奶茶", "果汁"]

const recordsByDay = [
  {
    date: "今天  ·  2025年3月15日",
    total: "1,350 ml",
    records: [
      { id: 1, name: "馥芮白",     brand: "星巴克",   time: "09:24", volume: 350, calories: 130, caffeine: 150, sugar: 12, category: "咖啡", bg: "#fff7ed", accent: "#f97316", icon: "☕" },
      { id: 2, name: "纯净水",     brand: "农夫山泉", time: "11:05", volume: 500, calories: 0,   caffeine: 0,   sugar: 0,  category: "水",   bg: "#eff6ff", accent: "#3b82f6", icon: "💧" },
      { id: 3, name: "燕麦拿铁",   brand: "瑞幸咖啡", time: "14:30", volume: 400, calories: 120, caffeine: 75,  sugar: 9,  category: "咖啡", bg: "#fdf4ff", accent: "#a855f7", icon: "🥛" },
      { id: 4, name: "柠檬蜂蜜水", brand: "自制",     time: "17:10", volume: 300, calories: 48,  caffeine: 0,   sugar: 12, category: "果汁", bg: "#f0fdf4", accent: "#10b981", icon: "🍋" },
    ]
  },
  {
    date: "昨天  ·  3月14日",
    total: "2,100 ml",
    records: [
      { id: 5, name: "美式咖啡",   brand: "精品咖啡馆", time: "08:30", volume: 400, calories: 15,  caffeine: 180, sugar: 0,  category: "咖啡", bg: "#fff7ed", accent: "#f97316", icon: "☕" },
      { id: 6, name: "绿茶",       brand: "茶里王",     time: "10:15", volume: 500, calories: 3,   caffeine: 35,  sugar: 0,  category: "茶饮", bg: "#f0fdf4", accent: "#10b981", icon: "🍵" },
      { id: 7, name: "矿泉水",     brand: "依云",       time: "13:20", volume: 500, calories: 0,   caffeine: 0,   sugar: 0,  category: "水",   bg: "#eff6ff", accent: "#3b82f6", icon: "💧" },
      { id: 8, name: "芒果奶茶",   brand: "茶百道",     time: "15:45", volume: 700, calories: 310, caffeine: 30,  sugar: 52, category: "奶茶", bg: "#fdf4ff", accent: "#8b5cf6", icon: "🧋" },
    ]
  }
]

export function RecordsScreen() {
  const [activeFilter, setActiveFilter] = useState("全部")

  return (
    <div className="flex flex-col gap-6 pb-4">

      <div className="flex items-center justify-between pt-1">
        <div>
          <p className="text-sm text-slate-400 font-medium">我的饮品日志</p>
          <h1 className="text-xl font-bold text-foreground mt-0.5">点滴录SipArchive</h1>
        </div>
        <button className="w-10 h-10 bright-card flex items-center justify-center rounded-2xl">
          <Filter size={16} className="text-slate-500" />
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={cn(
              "flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all",
              activeFilter === f ? "chip-active" : "chip-inactive"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Records */}
      {recordsByDay.map(day => (
        <div key={day.date}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">{day.date}</span>
            <span className="text-xs font-bold text-blue-500">{day.total}</span>
          </div>

          <div className="flex flex-col gap-3">
            {day.records
              .filter(r => activeFilter === "全部" || r.category === activeFilter)
              .map(record => (
              <div key={record.id} className="bright-card overflow-hidden">
                {/* Top color strip */}
                <div className="h-1 w-full" style={{ background: record.accent }} />
                <div className="px-4 py-3.5 flex items-center gap-3.5">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: record.bg }}>
                    {record.icon}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-foreground truncate">{record.name}</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold flex-shrink-0"
                        style={{ background: record.bg, color: record.accent }}>
                        {record.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">{record.brand} · {record.time}</p>
                    {/* Nutrition tags */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {[
                        { val: `${record.volume}ml`,         color: "#3b82f6", bg: "#eff6ff" },
                        { val: `${record.calories}kcal`,     color: "#f43f5e", bg: "#fff1f2" },
                        { val: `${record.caffeine}mg咖啡因`, color: "#f97316", bg: "#fff7ed" },
                        { val: `${record.sugar}g糖`,         color: "#8b5cf6", bg: "#fdf4ff" },
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
                    <button className="w-8 h-8 rounded-xl flex items-center justify-center bg-blue-50">
                      <Repeat2 size={13} className="text-blue-500" />
                    </button>
                    <button className="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-50">
                      <Edit3 size={13} className="text-slate-400" />
                    </button>
                    <button className="w-8 h-8 rounded-xl flex items-center justify-center bg-red-50">
                      <Trash2 size={13} className="text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
