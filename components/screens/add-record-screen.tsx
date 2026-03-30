"use client"

import { useState } from "react"
import { Clock, ChevronDown, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useData } from "@/lib/data-context"

const drinkTypes = ["水", "咖啡", "茶饮", "果汁", "奶茶", "碳酸", "能量", "酒精", "自定义"]

const categoryConfig: Record<string, { icon: string, accent_color: string }> = {
  "水": { icon: "💧", accent_color: "#3b82f6" },
  "咖啡": { icon: "☕", accent_color: "#f97316" },
  "茶饮": { icon: "🍵", accent_color: "#10b981" },
  "果汁": { icon: "🍹", accent_color: "#a855f7" },
  "奶茶": { icon: "🧋", accent_color: "#d97706" },
  "碳酸": { icon: "🥤", accent_color: "#ca8a04" },
  "能量": { icon: "⚡", accent_color: "#ec4899" },
  "酒精": { icon: "🍺", accent_color: "#64748b" },
  "自定义": { icon: "🥛", accent_color: "#0ea5e9" },
}

interface AddRecordScreenProps {
  onBack?: () => void
}

export function AddRecordScreen({ onBack }: AddRecordScreenProps) {
  const [selectedType, setSelectedType] = useState("咖啡")
  const [brand, setBrand] = useState("星巴克")
  const [name, setName] = useState("馥芮白")
  const [volume, setVolume] = useState("350")
  const [calories, setCalories] = useState("15")
  const [sugar, setSugar] = useState("0")
  const [caffeine, setCaffeine] = useState("150")
  const [time, setTime] = useState("14:30")
  const [saving, setSaving] = useState(false)
  
  const { addDrinkRecord } = useData()

  const handleSave = async () => {
    try {
      setSaving(true)
      const config = categoryConfig[selectedType]
      
      const drinkTime = new Date()
      const [hours, minutes] = time.split(':').map(Number)
      drinkTime.setHours(hours, minutes, 0, 0)

      await addDrinkRecord({
        name,
        brand: brand || undefined,
        volume: parseInt(volume) || 0,
        calories: parseInt(calories) || 0,
        sugar: parseFloat(sugar) || 0,
        caffeine: parseInt(caffeine) || 0,
        category: selectedType,
        icon: config.icon,
        accent_color: config.accent_color,
        drink_time: drinkTime.toISOString(),
      })

      if (onBack) {
        onBack()
      }
    } catch (error) {
      console.error('Failed to save record:', error)
      alert('保存失败，请重试')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 pb-4">

      <div className="pt-1">
        <p className="text-sm text-slate-400 font-medium">手动记录</p>
        <h1 className="text-2xl font-bold text-foreground mt-0.5">添加饮品</h1>
      </div>

      {/* Drink Type */}
      <div className="bright-card p-4 flex flex-col gap-3">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">饮品类型</label>
        <div className="flex flex-wrap gap-2">
          {drinkTypes.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={cn(
                "px-3.5 py-2 rounded-full text-xs font-semibold transition-all",
                selectedType === type ? "chip-active" : "chip-inactive"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Brand + Name */}
      <div className="bright-card p-4 flex flex-col gap-4">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">饮品信息</label>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-slate-400 font-medium">品牌</label>
          <input
            className="input-bright w-full px-4 py-3 text-sm"
            placeholder="例：星巴克、瑞幸咖啡..."
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-slate-400 font-medium">饮品名称</label>
          <input
            className="input-bright w-full px-4 py-3 text-sm"
            placeholder="例：美式咖啡、柠檬水..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>

      {/* Nutrition */}
      <div className="bright-card p-4 flex flex-col gap-3">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">营养信息</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "容量 (ml)",    value: volume,   onChange: setVolume,   color: "#3b82f6", bg: "#eff6ff", placeholder: "350" },
            { label: "热量 (kcal)", value: calories,  onChange: setCalories,  color: "#f43f5e", bg: "#fff1f2", placeholder: "0" },
            { label: "糖分 (g)",    value: sugar,     onChange: setSugar,     color: "#ca8a04", bg: "#fefce8", placeholder: "0" },
            { label: "咖啡因 (mg)", value: caffeine,  onChange: setCaffeine,  color: "#8b5cf6", bg: "#fdf4ff", placeholder: "0" },
          ].map(f => (
            <div key={f.label}
              className="rounded-2xl p-3.5 flex flex-col gap-2"
              style={{ background: f.bg }}>
              <label className="text-xs font-semibold" style={{ color: f.color }}>{f.label}</label>
              <input
                type="number"
                className="w-full bg-white rounded-xl px-3 py-2 text-sm font-bold border-0 focus:outline-none focus:ring-2"
                style={{ color: f.color }}
                placeholder={f.placeholder}
                value={f.value}
                onChange={e => f.onChange(e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Time */}
      <div className="bright-card p-4 flex flex-col gap-3">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">饮用时间</label>
        <div className="relative">
          <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="time"
            className="input-bright w-full pl-10 pr-4 py-3 text-sm"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
      </div>

      {/* Cup */}
      <div className="bright-card p-4 flex flex-col gap-3">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">使用的杯子</label>
        <button className="input-bright w-full px-4 py-3 text-sm flex items-center justify-between">
          <span className="text-slate-400">选择我的杯子...</span>
          <ChevronDown size={16} className="text-slate-400" />
        </button>
      </div>

      {/* Submit */}
      <button 
        onClick={handleSave}
        disabled={saving}
        className="primary-btn w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <CheckCircle2 size={18} />
        {saving ? "保存中..." : "保存记录"}
      </button>
    </div>
  )
}
