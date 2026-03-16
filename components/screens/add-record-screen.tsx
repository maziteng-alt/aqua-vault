"use client"

import { useState } from "react"
import { Clock, Tag, FileText, ChevronDown, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

const drinkTypes = ["水", "咖啡", "茶饮", "果汁", "奶茶", "碳酸", "能量", "酒精", "自定义"]
const tags = ["早餐", "午餐", "晚餐", "健身前", "健身后", "工作中", "放松"]

const nutritionFields = [
  { label: "容量 (ml)",    key: "volume",   color: "#3b82f6", bg: "#eff6ff", placeholder: "350",  defaultVal: "350" },
  { label: "热量 (kcal)", key: "calories",  color: "#f43f5e", bg: "#fff1f2", placeholder: "0",    defaultVal: "15" },
  { label: "糖分 (g)",    key: "sugar",     color: "#ca8a04", bg: "#fefce8", placeholder: "0",    defaultVal: "0" },
  { label: "咖啡因 (mg)", key: "caffeine",  color: "#8b5cf6", bg: "#fdf4ff", placeholder: "0",    defaultVal: "150" },
]

export function AddRecordScreen() {
  const [selectedType, setSelectedType] = useState("咖啡")
  const [selectedTags, setSelectedTags] = useState<string[]>(["工作中"])
  const [values, setValues] = useState({ volume: "350", calories: "15", sugar: "0", caffeine: "150" })

  const toggleTag = (t: string) =>
    setSelectedTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])

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
            defaultValue="星巴克"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-slate-400 font-medium">饮品名称</label>
          <input
            className="input-bright w-full px-4 py-3 text-sm"
            placeholder="例：美式咖啡、柠檬水..."
            defaultValue="馥芮白"
          />
        </div>
      </div>

      {/* Nutrition */}
      <div className="bright-card p-4 flex flex-col gap-3">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">营养信息</label>
        <div className="grid grid-cols-2 gap-3">
          {nutritionFields.map(f => (
            <div key={f.key}
              className="rounded-2xl p-3.5 flex flex-col gap-2"
              style={{ background: f.bg }}>
              <label className="text-xs font-semibold" style={{ color: f.color }}>{f.label}</label>
              <input
                type="number"
                className="w-full bg-white rounded-xl px-3 py-2 text-sm font-bold border-0 focus:outline-none focus:ring-2"
                style={{ color: f.color, focusRingColor: f.color }}
                placeholder={f.placeholder}
                value={values[f.key as keyof typeof values]}
                onChange={e => setValues(prev => ({ ...prev, [f.key]: e.target.value }))}
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
            defaultValue="14:30"
          />
        </div>
      </div>

      {/* Tags */}
      <div className="bright-card p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Tag size={13} className="text-slate-400" />
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">场景标签</label>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={cn(
                "px-3.5 py-2 rounded-full text-xs font-semibold transition-all",
                selectedTags.includes(tag) ? "chip-active" : "chip-inactive"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="bright-card p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <FileText size={13} className="text-slate-400" />
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">备注</label>
        </div>
        <textarea
          className="input-bright w-full px-4 py-3 text-sm resize-none"
          placeholder="记录喝时的感受，或特殊情况..."
          rows={3}
        />
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
      <button className="primary-btn w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold mt-1">
        <CheckCircle2 size={18} />
        保存记录
      </button>
    </div>
  )
}
