"use client"

import { useState, useRef } from "react"
import { Camera, Check, ChevronLeft, Plus, Upload, Loader2 } from "lucide-react"
import { useData } from "@/lib/data-context"

const emojiOptions = ["🐻‍❄️", "🧊", "☕", "🧋", "🍵", "🥤", "🍶", "🫖", "🥛", "💧", "🔥", "🌟"]

const cupTypes = ["保温杯", "随行杯", "咖啡杯", "塑料杯", "茶杯", "玻璃杯", "其他"]
const materials = ["316不锈钢", "双层玻璃", "耐热玻璃", "PP 食品级", "景德镇陶瓷", "其他"]

interface AddCupScreenProps {
  onBack: () => void
}

export function AddCupScreen({ onBack }: AddCupScreenProps) {
  const { addCup } = useData()
  const [name, setName] = useState("")
  const [capacity, setCapacity] = useState("500")
  const [selectedEmoji, setSelectedEmoji] = useState("🐻‍❄️")
  const [selectedType, setSelectedType] = useState("保温杯")
  const [selectedMaterial, setSelectedMaterial] = useState("316不锈钢")
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    if (!name.trim()) return
    setSaving(true)
    try {
      await addCup({
        name,
        capacity: parseInt(capacity) || 500,
        icon: selectedEmoji,
        accent_color: "#3b82f6",
        background_color: "#eff6ff",
        is_favorite: true,
      })
      onBack()
    } catch (error) {
      console.error('Failed to save cup:', error)
      alert('保存失败：' + (error as any)?.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 pb-4">
      <div className="flex items-center justify-between pt-1">
        <button onClick={onBack} className="w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-sm">
          <ChevronLeft size={20} className="text-slate-600" />
        </button>
        <h1 className="text-xl font-bold text-foreground">点亮新杯</h1>
        <div className="w-10" />
      </div>

      {/* Photo/Emoji Section */}
      <div className="bright-card p-5">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4">杯子图标</p>
        
        {/* Photo Upload Area */}
        <div className="mb-5">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer"
          >
            {photoPreview ? (
              <div className="relative">
                <img
                  src={photoPreview}
                  alt="杯子照片"
                  className="w-36 h-36 rounded-3xl object-cover shadow-md border-2 border-blue-200"
                />
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    setPhotoPreview(null)
                  }}
                  className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 flex items-center justify-center shadow-md text-white"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="w-36 h-36 rounded-3xl flex flex-col items-center justify-center bg-[#eff6ff] border-2 border-dashed border-blue-300">
                <Upload size={40} className="text-blue-400 mb-2" />
                <span className="text-xs text-blue-500 font-medium text-center">点击拍照或上传</span>
              </div>
            )}
          </div>
        </div>

        {/* Emoji Selection */}
        {!photoPreview && (
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">或选择表情符号</p>
            <div className="flex flex-wrap gap-2">
              {emojiOptions.map((emoji, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${
                    selectedEmoji === emoji ? "bg-blue-100 ring-2 ring-blue-500" : "bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Name Input */}
      <div className="bright-card p-5">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4">杯子信息</p>
          <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-600 mb-1.5 block">杯子名称</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：白熊保温杯"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600 mb-1.5 block">容量 (ml)</label>
            <div className="relative">
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="500"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">ml</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600 mb-1.5 block">杯子类型</label>
            <div className="flex flex-wrap gap-2">
              {cupTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                    selectedType === type
                      ? "bg-blue-500 text-white"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600 mb-1.5 block">材质</label>
            <div className="flex flex-wrap gap-2">
              {materials.map((material) => (
                <button
                  key={material}
                  onClick={() => setSelectedMaterial(material)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                    selectedMaterial === material
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {material}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={!name.trim() || saving}
        className={`w-full py-4 rounded-2xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
          name.trim() && !saving
            ? "bg-gradient-to-r from-blue-500 to-blue-600 active:scale-95"
            : "bg-slate-300 cursor-not-allowed"
        }`}
      >
        {saving ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            保存中...
          </>
        ) : (
          <>
            <Check size={18} />
            保存杯子
          </>
        )}
      </button>
    </div>
  )
}
