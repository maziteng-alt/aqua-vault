"use client"

import { useState } from "react"
import { Check, ChevronLeft, Plus, Minus } from "lucide-react"
import { useData } from "@/lib/data-context"

const drinkTypes = [
  { name: "水", icon: "💧", category: "水", calories: 0, caffeine: 0, sugar: 0 },
  { name: "咖啡", icon: "☕", category: "咖啡", calories: 15, caffeine: 180, sugar: 0 },
  { name: "绿茶", icon: "🍵", category: "茶饮", calories: 3, caffeine: 35, sugar: 0 },
  { name: "红茶", icon: "🫖", category: "茶饮", calories: 5, caffeine: 50, sugar: 0 },
  { name: "果汁", icon: "🍹", category: "果汁", calories: 120, caffeine: 0, sugar: 30 },
  { name: "奶茶", icon: "🧋", category: "奶茶", calories: 300, caffeine: 50, sugar: 40 },
  { name: "可乐", icon: "🥤", category: "碳酸", calories: 180, caffeine: 30, sugar: 45 },
  { name: "能量饮料", icon: "⚡", category: "能量", calories: 110, caffeine: 80, sugar: 27 },
]

interface UseCupScreenProps {
  cup: {
    id: string
    name: string
    capacity: number
    icon?: string
    use_count?: number
  }
  onBack: () => void
}

export function UseCupScreen({ cup, onBack }: UseCupScreenProps) {
  const { addDrinkRecord, updateCup } = useData()
  const [selectedDrink, setSelectedDrink] = useState(drinkTypes[0])
  const [volume, setVolume] = useState(cup.capacity)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await addDrinkRecord({
        name: `${selectedDrink.name} (${cup.name})`,
        volume: volume,
        calories: Math.round((selectedDrink.calories / 500) * volume),
        caffeine: Math.round((selectedDrink.caffeine / 500) * volume),
        sugar: Math.round((selectedDrink.sugar / 500) * volume * 10) / 10,
        category: selectedDrink.category,
        icon: selectedDrink.icon,
      })
      
      await updateCup(cup.id, { use_count: (cup.use_count || 0) + 1 })
      
      onBack()
    } catch (error) {
      console.error('Failed to add record:', error)
      alert('保存失败，请重试')
    } finally {
      setSaving(false)
    }
  }

  const adjustVolume = (delta: number) => {
    setVolume(prev => Math.max(50, Math.min(prev + delta, 500)))
  }

  return (
    <div className="flex flex-col gap-6 pb-4">
      <div className="flex items-center justify-between pt-1">
        <button onClick={onBack} className="w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-sm">
          <ChevronLeft size={20} className="text-slate-600" />
        </button>
        <h1 className="text-xl font-bold text-foreground">使用 {cup.name}</h1>
        <div className="w-10" />
      </div>

      {/* Cup Info */}
      <div className="bright-card p-5 flex items-center gap-4">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl bg-white flex-shrink-0 shadow-md">
          {cup.icon || "🫗"}
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">{cup.name}</h3>
          <p className="text-sm text-slate-400">容量 {cup.capacity} ml</p>
        </div>
      </div>

      {/* Drink Selection */}
      <div className="bright-card p-5">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4">选择饮品</p>
        <div className="grid grid-cols-4 gap-3">
          {drinkTypes.map((drink) => (
            <button
              key={drink.name}
              onClick={() => setSelectedDrink(drink)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all ${
                selectedDrink.name === drink.name
                  ? "bg-blue-500 text-white"
                  : "bg-slate-50 hover:bg-slate-100"
              }`}
            >
              <span className="text-2xl">{drink.icon}</span>
              <span className="text-xs font-semibold">{drink.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Volume Adjustment */}
      <div className="bright-card p-5">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4">饮用量</p>
        
        <div className="text-center mb-6">
          <span className="text-4xl font-extrabold text-blue-500">{volume}</span>
          <span className="text-lg text-slate-400 ml-1">ml</span>
        </div>
        
        {/* Slider */}
        <div className="relative mb-4">
          <div className="flex justify-between items-end gap-2 overflow-x-auto">
            {Array.from({ length: 9 }, (_, index) => {
              const value = Math.round(50 + index * (450 / 8)) // 50ml 到 500ml，9个柱子
              const heightClass = ['h-4', 'h-6', 'h-8', 'h-10', 'h-12', 'h-14', 'h-16', 'h-18', 'h-20'][index] || 'h-4'
              const isActive = Math.abs(volume - value) <= 30 // 选择最近的柱子
              return (
                <div key={value} className="flex-shrink-0 flex flex-col items-center">
                  <div 
                    onClick={() => setVolume(value)}
                    className={`w-1.5 ${heightClass} rounded-full transition-all cursor-pointer ${isActive ? 'bg-blue-500' : 'bg-slate-300'}`}
                  />
                </div>
              )
            })}
          </div>
        </div>
        
        <div className="flex justify-center gap-2 mt-2">
          {[50, 100, 200, cup.capacity].map((preset) => (
            <button
              key={preset}
              onClick={() => setVolume(preset)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                volume === preset
                  ? "bg-blue-500 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {preset}ml
            </button>
          ))}
        </div>
      </div>

      {/* Nutrition Preview */}
      <div className="bright-card p-5">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4">预估营养</p>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-extrabold text-red-500">
              {Math.round((selectedDrink.calories / 500) * volume)}
            </p>
            <p className="text-xs text-slate-400 mt-1">kcal</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-extrabold text-orange-500">
              {Math.round((selectedDrink.caffeine / 500) * volume)}
            </p>
            <p className="text-xs text-slate-400 mt-1">mg 咖啡因</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-extrabold text-violet-500">
              {Math.round((selectedDrink.sugar / 500) * volume * 10) / 10}
            </p>
            <p className="text-xs text-slate-400 mt-1">g 糖</p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className={`w-full py-4 rounded-2xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
          !saving
            ? "bg-gradient-to-r from-blue-500 to-blue-600 active:scale-95"
            : "bg-slate-300 cursor-not-allowed"
        }`}
      >
        {saving ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            保存中...
          </>
        ) : (
          <>
            <Check size={20} />
            记录这次饮用
          </>
        )}
      </button>
    </div>
  )
}
