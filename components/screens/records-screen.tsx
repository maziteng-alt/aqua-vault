"use client"

import { useState, useMemo, useEffect } from "react"
import { Info, Plus, Edit2, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import { useData } from "@/lib/data-context"

interface RecordsScreenProps {
  onAddClick?: () => void
}

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

const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

export function RecordsScreen({ onAddClick }: RecordsScreenProps) {
  const { drinkRecords, loading, userProfile } = useData()
  const [selectedDate, setSelectedDate] = useState(new Date())

  const calendarDays = useMemo(() => {
    const days = []
    for (let i = -3; i <= 3; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      days.push({
        date: date.getDate().toString().padStart(2, '0'),
        day: weekDays[date.getDay()],
        fullDate: date,
        isToday: i === 0,
      })
    }
    return days
  }, [])

  const filteredRecords = useMemo(() => {
    const startOfDay = new Date(selectedDate)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(selectedDate)
    endOfDay.setHours(23, 59, 59, 999)

    return drinkRecords.filter(record => {
      const recordDate = new Date(record.drink_time)
      return recordDate >= startOfDay && recordDate <= endOfDay
    }).map(record => {
      const config = categoryConfig[record.category] || categoryConfig["自定义"]
      const time = new Date(record.drink_time)
      const timeStr = time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      
      return {
        ...record,
        time: timeStr,
        bg: config.bg,
        accent: record.accent_color || config.accent,
        icon: record.icon || config.icon,
        gradient: config.gradient,
      }
    }).sort((a, b) => new Date(b.drink_time).getTime() - new Date(a.drink_time).getTime())
  }, [drinkRecords, selectedDate])

  const dailyStats = useMemo(() => {
    const totalVolume = filteredRecords.reduce((sum, r) => sum + r.volume, 0)
    const categoryCounts: Record<string, number> = {}
    
    filteredRecords.forEach(r => {
      categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1
    })

    const topCategories = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([category, count]) => ({
        category,
        count,
        icon: categoryConfig[category]?.icon || '🥤'
      }))

    return {
      totalVolume,
      totalCount: filteredRecords.length,
      topCategories
    }
  }, [filteredRecords])

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
        <div className="w-10 h-10 rounded-full bg-white shadow-lg border border-white/80 flex items-center justify-center">
          <Filter className="w-5 h-5 text-slate-700" />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center gap-1.5 mb-5">
          {calendarDays.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedDate(item.fullDate)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-md flex-1 cursor-pointer transition-all ${
                item.fullDate.toDateString() === selectedDate.toDateString()
                  ? 'bg-slate-900 text-white shadow-lg'
                  : 'bg-white/60 backdrop-blur-md border border-white/50 text-slate-600'
              }`}
            >
              <span className={`text-sm font-bold ${item.fullDate.toDateString() === selectedDate.toDateString() ? 'text-white' : 'text-slate-800'}`}>{item.date}</span>
              <span className={`text-[9px] mt-0.5 ${item.fullDate.toDateString() === selectedDate.toDateString() ? 'text-slate-300' : 'text-slate-500'}`}>{item.day}</span>
            </div>
          ))}
        </div>

        <div className="space-y-3 mb-2">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-1 mb-0.5">
                <span className="text-sm font-bold text-slate-800">每日饮用量</span>
                <Info className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-900">{dailyStats.totalVolume}</span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  /{userProfile?.daily_water_goal || 2000}ml <Edit2 className="w-3 h-3" />
                </span>
              </div>
            </div>
            <button 
              onClick={onAddClick}
              className="bg-white/80 backdrop-blur-md border border-white/60 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:bg-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> 添加记录
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            <div className="flex-shrink-0 bg-white/60 backdrop-blur-xl rounded-xl p-2 w-20 border border-white/60 flex flex-col justify-center shadow-[0_4px_16px_0_rgba(31,38,135,0.03)]">
              <span className="text-[10px] text-slate-600 font-medium mb-0.5">总计</span>
              <div className="flex items-baseline gap-0.5">
                <span className="text-base font-bold text-slate-800">{dailyStats.totalCount}</span>
                <span className="text-[9px] text-slate-400">/杯</span>
              </div>
            </div>
            
            {dailyStats.topCategories.map((cat, idx) => (
              <div key={idx} className="flex-shrink-0 bg-white/60 backdrop-blur-xl rounded-md p-2 w-20 border border-white/60 flex justify-between items-center shadow-[0_4px_16px_0_rgba(31,38,135,0.03)]">
                <div>
                  <span className="text-[10px] text-slate-600 font-medium mb-0.5 block">{cat.category}</span>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-base font-bold text-slate-800">{cat.count}</span>
                    <span className="text-[9px] text-slate-400">/杯</span>
                  </div>
                </div>
                <span className="text-lg">{cat.icon}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-1 mb-3">
          <h2 className="text-base font-bold text-slate-800">今日饮品</h2>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="text-6xl">🍵</div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-600">还没有饮品记录</p>
              <p className="text-xs text-slate-400 mt-1">点击首页的"手动添加"开始记录</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRecords.map((record) => (
              <div
                key={record.id}
                className="relative overflow-hidden bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rounded-2xl p-4 transition-transform hover:scale-[1.02]"
              >
                <div className="flex justify-between items-start mb-3 relative z-10">
                  <div className="pr-14">
                    <h3 className="text-base font-bold text-slate-800 mb-0.5">{record.name}</h3>
                    <p className="text-[11px] text-slate-500 mb-1.5 font-medium">
                      {record.brand || '自定义'} <span className="mx-1 text-slate-300">|</span> {record.volume}ml
                    </p>
                    <span className="inline-block px-2 py-0.5 rounded-full border text-[9px] font-medium backdrop-blur-md bg-[#FAF6F3]/60 border-[#D4C4B7] text-[#8C7A6B]">
                      {record.category}
                    </span>
                  </div>
                </div>

                <div className="absolute -top-2 -right-2 w-20 h-20 z-0">
                  <div className="absolute inset-0 rounded-full border border-dashed border-slate-300/60 m-1"></div>
                  <div className="absolute inset-2.5 rounded-full bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-md shadow-sm border border-white/80 flex items-center justify-center text-3xl">
                    {record.icon}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 relative z-10">
                  {[
                    { label: '热量', value: record.calories || 0, unit: 'Kcal' },
                    { label: '糖分', value: record.sugar || 0, unit: 'g' },
                    { label: '咖啡因', value: record.caffeine || 0, unit: 'mg' },
                  ].map((stat, index) => (
                    <div key={index} className="bg-white/50 backdrop-blur-md rounded-xl p-2 border border-white/40 shadow-sm flex flex-col justify-center">
                      <p className="text-[9px] text-slate-500 mb-0.5 font-medium">{stat.label}</p>
                      <p className="font-bold text-slate-800 text-sm flex items-baseline gap-0.5 leading-none">
                        {stat.value} <span className="text-[8px] font-normal text-slate-500">{stat.unit}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
