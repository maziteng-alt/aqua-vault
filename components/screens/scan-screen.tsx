"use client"

import { useState, useRef } from "react"
import { Upload, Scan, CheckCircle2, Edit3, Sparkles, Zap, Droplets, Flame, Coffee, AlertCircle } from "lucide-react"

type ScanState = "idle" | "scanning" | "result"

const mockResult = {
  brand: "可口可乐",
  name: "可口可乐 零度",
  category: "碳酸饮料",
  volume: 330,
  calories: 1,
  sugar: 0,
  caffeine: 34,
  confidence: 97,
}

export function ScanScreen() {
  const [scanState, setScanState] = useState<ScanState>("idle")
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
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

  const handleScan = () => {
    setScanState("scanning")
    setTimeout(() => setScanState("result"), 2200)
  }

  return (
    <div className="flex flex-col gap-6 pb-4">

      <div className="pt-1">
        <p className="text-sm text-slate-400 font-medium">AI 识别</p>
        <h1 className="text-2xl font-bold text-foreground mt-0.5">扫描饮品包装</h1>
      </div>

      {/* Scan area */}
      <div className="bright-card overflow-hidden">

        {scanState === "idle" && (
          <div className="flex flex-col items-center gap-5 p-8">
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
                    alt="饮品包装"
                    className="w-44 h-44 rounded-3xl object-cover shadow-md border-2 border-blue-200"
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
                <div className="w-36 h-36 rounded-3xl flex items-center justify-center"
                  style={{ background: '#eff6ff', border: '2px dashed #93c5fd' }}>
                  <Upload size={40} className="text-blue-400" />
                </div>
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-600">
                {photoPreview ? "点击更换图片" : "点击上传点单截图或拍摄外观/成分表"}
              </p>
              <p className="text-xs text-slate-400 mt-1">支持 JPG、PNG 格式</p>
            </div>
            <button
              onClick={handleScan}
              disabled={!photoPreview}
              className={`px-8 py-3.5 rounded-2xl text-sm font-bold ${
                photoPreview 
                  ? "primary-btn" 
                  : "bg-slate-300 cursor-not-allowed"
              }`}
            >
              开始 AI 识别
            </button>
          </div>
        )}

        {scanState === "scanning" && (
          <div className="flex flex-col items-center gap-5 p-8">
            <div className="relative w-44 h-44">
              <div className="absolute inset-0 rounded-3xl" style={{ border: '2px solid #bfdbfe' }} />
              {/* Corner markers */}
              {[
                "top-0 left-0 border-t-[3px] border-l-[3px] rounded-tl-2xl",
                "top-0 right-0 border-t-[3px] border-r-[3px] rounded-tr-2xl",
                "bottom-0 left-0 border-b-[3px] border-l-[3px] rounded-bl-2xl",
                "bottom-0 right-0 border-b-[3px] border-r-[3px] rounded-br-2xl",
              ].map((cls, i) => (
                <div key={i} className={`absolute w-6 h-6 border-blue-500 ${cls}`} />
              ))}
              {/* Scan line */}
              <div
                className="absolute left-2 right-2 h-0.5 rounded-full"
                style={{
                  background: 'linear-gradient(90deg, transparent, #3b82f6, transparent)',
                  boxShadow: '0 0 8px rgba(59,130,246,0.6)',
                  animation: 'scanLine 1.5s ease-in-out infinite',
                  top: '50%',
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Scan size={36} className="text-blue-400 animate-pulse" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-base font-bold text-blue-500 animate-pulse">AI 正在识别...</p>
              <p className="text-xs text-slate-400 mt-1">分析营养成分和品牌信息</p>
            </div>
          </div>
        )}

        {scanState === "result" && (
          <div className="p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span className="text-sm font-bold text-emerald-600">识别成功</span>
              </div>
              <div className="flex items-center gap-1.5 bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
                <Sparkles size={11} className="text-violet-500" />
                <span className="text-xs font-bold text-violet-600">{mockResult.confidence}% 置信度</span>
              </div>
            </div>

            {/* Result card */}
            <div className="rounded-2xl p-4" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
              <div className="flex items-center gap-3 mb-4">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="饮品包装"
                    className="w-14 h-14 rounded-2xl object-cover bg-white shadow-sm flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl bg-white shadow-sm flex-shrink-0">
                    🥤
                  </div>
                )}
                <div>
                  <p className="text-xs text-slate-400 font-medium">{mockResult.brand}</p>
                  <p className="text-base font-bold text-foreground">{mockResult.name}</p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-blue-100 text-blue-600">
                    {mockResult.category}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "容量",  value: mockResult.volume,   unit: "ml",   icon: Droplets, bg: "#dbeafe", color: "#3b82f6" },
                  { label: "热量",  value: mockResult.calories, unit: "kcal", icon: Flame,    bg: "#ffe4e6", color: "#f43f5e" },
                  { label: "糖分",  value: mockResult.sugar,    unit: "g",    icon: Zap,      bg: "#fef9c3", color: "#ca8a04" },
                  { label: "咖啡因",value: mockResult.caffeine, unit: "mg",   icon: Coffee,   bg: "#ede9fe", color: "#8b5cf6" },
                ].map(s => (
                  <div key={s.label} className="rounded-xl p-2.5 flex flex-col items-center gap-1"
                    style={{ background: s.bg }}>
                    <s.icon size={13} style={{ color: s.color }} />
                    <span className="text-sm font-bold" style={{ color: s.color }}>{s.value}</span>
                    <span className="text-[9px] text-slate-400">{s.unit}</span>
                    <span className="text-[9px] text-slate-500 font-medium">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setScanState("idle")
                  setPhotoPreview(null)
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-slate-50 border border-slate-200"
              >
                <Edit3 size={15} className="text-slate-500" />
                <span className="text-sm font-semibold text-slate-600">重新扫描</span>
              </button>
              <button className="flex-1 primary-btn flex items-center justify-center gap-2 py-3.5 rounded-2xl">
                <CheckCircle2 size={15} />
                <span className="text-sm font-bold">确认记录</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tip */}
      <div className="bright-card p-4 flex items-start gap-3"
        style={{ background: '#fffbeb', borderColor: '#fde68a' }}>
        <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-amber-700 mb-1">拍摄小贴士</p>
          <p className="text-xs text-amber-600 leading-relaxed">
            对准饮品正面标签，确保光线充足，营养成分表清晰可见，识别准确率更高。
          </p>
        </div>
      </div>

      <style>{`
        @keyframes scanLine {
          0%   { top: 10%; }
          50%  { top: 85%; }
          100% { top: 10%; }
        }
      `}</style>
    </div>
  )
}
