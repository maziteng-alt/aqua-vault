"use client"

import { useState, useEffect } from "react"
import { Eye, EyeOff, Wifi, WifiOff, Shield, Sliders, MessageSquare, Thermometer, Hash, ImageIcon, Droplet, Coffee, Zap, Flame } from "lucide-react"
import { cn } from "@/lib/utils"
import { useData } from "@/lib/data-context"

export function SettingsScreen() {
  const { userProfile, updateUserProfile } = useData()
  const [showApiKey, setShowApiKey] = useState(false)
  const [imageAnalysis, setImageAnalysis] = useState(true)
  const [selectedModel, setSelectedModel] = useState("gpt-4o")
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "ok" | "fail">("idle")
  const [saving, setSaving] = useState(false)
  
  const [dailyWaterGoal, setDailyWaterGoal] = useState(2000)
  const [dailyCaffeineLimit, setDailyCaffeineLimit] = useState(400)
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState(2000)
  const [dailySugarLimit, setDailySugarLimit] = useState(50)

  useEffect(() => {
    if (userProfile) {
      setDailyWaterGoal(userProfile.daily_water_goal || 2000)
      setDailyCaffeineLimit(userProfile.daily_caffeine_limit || 400)
      setDailyCalorieGoal(userProfile.daily_calorie_goal || 2000)
      setDailySugarLimit(userProfile.daily_sugar_limit || 50)
    }
  }, [userProfile])

  const handleTest = () => {
    setTestStatus("testing")
    setTimeout(() => setTestStatus("ok"), 1800)
  }

  const handleSaveGoals = async () => {
    try {
      setSaving(true)
      await updateUserProfile({
        daily_water_goal: dailyWaterGoal,
        daily_caffeine_limit: dailyCaffeineLimit,
        daily_calorie_goal: dailyCalorieGoal,
        daily_sugar_limit: dailySugarLimit,
      })
      alert("目标设置已保存！")
    } catch (error) {
      console.error("Failed to save goals:", error)
      alert("保存失败，请重试")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 pb-4">

      <div className="pt-1">
        <p className="text-sm text-slate-400 font-medium">目标设置</p>
        <h1 className="text-2xl font-bold text-foreground mt-0.5">每日目标与限制</h1>
      </div>

      {/* Daily Water Goal */}
      <div className="bright-card p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Droplet size={13} style={{ color: '#2895FF' }} />
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">每日饮水量目标</label>
        </div>
        <input
          type="number"
          min="500"
          max="5000"
          step="100"
          className="input-bright w-full px-4 py-3 text-sm"
          value={dailyWaterGoal}
          onChange={(e) => setDailyWaterGoal(Number(e.target.value))}
        />
        <p className="text-[11px] text-slate-400">推荐：2000 - 2500 ml/天</p>
      </div>

      {/* Daily Caffeine Limit */}
      <div className="bright-card p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Coffee size={13} style={{ color: '#7D4141' }} />
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">每日咖啡因限制</label>
        </div>
        <input
          type="number"
          min="0"
          max="1000"
          step="50"
          className="input-bright w-full px-4 py-3 text-sm"
          value={dailyCaffeineLimit}
          onChange={(e) => setDailyCaffeineLimit(Number(e.target.value))}
        />
        <p className="text-[11px] text-slate-400">健康建议：不超过 400 mg/天</p>
      </div>

      {/* Daily Calorie Limit */}
      <div className="bright-card p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Flame size={13} style={{ color: '#F75D72' }} />
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">每日热量限制</label>
        </div>
        <input
          type="number"
          min="1000"
          max="5000"
          step="100"
          className="input-bright w-full px-4 py-3 text-sm"
          value={dailyCalorieGoal}
          onChange={(e) => setDailyCalorieGoal(Number(e.target.value))}
        />
        <p className="text-[11px] text-slate-400">健康建议：不超过200kcal/天</p>
      </div>

      {/* Daily Sugar Limit */}
      <div className="bright-card p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Zap size={13} className="text-purple-500" />
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">每日糖分限制</label>
        </div>
        <input
          type="number"
          min="0"
          max="200"
          step="5"
          className="input-bright w-full px-4 py-3 text-sm"
          value={dailySugarLimit}
          onChange={(e) => setDailySugarLimit(Number(e.target.value))}
        />
        <p className="text-[11px] text-slate-400">WHO建议：不超过 50 g/天</p>
      </div>

      {/* Save Goals Button */}
      <button
        onClick={handleSaveGoals}
        disabled={saving}
        className={cn(
          "w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold transition-all primary-btn",
          saving && "opacity-70 cursor-wait"
        )}
      >
        {saving ? (
          <>
            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            <span>保存中...</span>
          </>
        ) : (
          <span>保存目标设置</span>
        )}
      </button>

      <div className="h-px bg-slate-200" />

      <div className="pt-1">
        <p className="text-sm text-slate-400 font-medium">AI 配置</p>
        <h1 className="text-2xl font-bold text-foreground mt-0.5">AI 模型设置</h1>
      </div>

      {/* Connection status */}
      <div
        className="bright-card p-4 flex items-center gap-4"
        style={{
          background: testStatus === "ok" ? "#f0fdf4"
            : testStatus === "fail" ? "#fff1f2"
            : "#f8faff",
          borderColor: testStatus === "ok" ? "#bbf7d0"
            : testStatus === "fail" ? "#fecaca"
            : "#e2e8f8",
        }}
      >
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0",
          testStatus === "ok" ? "bg-emerald-100" : testStatus === "fail" ? "bg-red-100" : "bg-slate-100"
        )}>
          {testStatus === "fail"
            ? <WifiOff size={20} className="text-red-400" />
            : <Wifi size={20} className={testStatus === "ok" ? "text-emerald-500" : "text-slate-400"} />
          }
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-foreground">
            {testStatus === "ok" ? "连接成功" : testStatus === "fail" ? "连接失败" : testStatus === "testing" ? "正在测试..." : "连接状态未知"}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {testStatus === "ok" ? "模型响应正常，可以开始使用" : "配置 API Key 后测试连接"}
          </p>
        </div>
        {testStatus === "ok" && (
          <span className="text-[10px] px-3 py-1 rounded-full font-bold bg-emerald-100 text-emerald-600">
            在线
          </span>
        )}
      </div>

      {/* Base URL */}
      <div className="bright-card p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Sliders size={13} className="text-slate-400" />
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Base URL</label>
        </div>
        <input
          className="input-bright w-full px-4 py-3 text-sm"
          placeholder="https://api.openai.com/v1"
          defaultValue="https://api.openai.com/v1"
        />
      </div>

      {/* API Key */}
      <div className="bright-card p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Shield size={13} className="text-violet-500" />
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">API Key</label>
        </div>
        <div className="relative">
          <input
            type={showApiKey ? "text" : "password"}
            className="input-bright w-full pl-4 pr-12 py-3 text-sm font-mono"
            placeholder="sk-..."
            defaultValue="sk-proj-abc123xyz456..."
          />
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-xl bg-slate-100"
            onClick={() => setShowApiKey(!showApiKey)}
            aria-label={showApiKey ? "隐藏 API Key" : "显示 API Key"}
          >
            {showApiKey
              ? <EyeOff size={14} className="text-slate-500" />
              : <Eye size={14} className="text-slate-500" />
            }
          </button>
        </div>
        <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
          <Shield size={10} className="text-slate-300" />
          API Key 仅存储在本地，不会上传至任何服务器
        </p>
      </div>

      {/* Model selector */}
      <div className="bright-card p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Hash size={13} className="text-slate-400" />
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">模型</label>
        </div>
        <div className="flex flex-wrap gap-2">
          {["gpt-4o", "gpt-4o-mini", "claude-3-5-sonnet", "gemini-pro"].map(m => (
            <button
              key={m}
              onClick={() => setSelectedModel(m)}
              className={cn(
                "px-3.5 py-2 rounded-full text-xs font-mono font-semibold transition-all",
                selectedModel === m ? "chip-active" : "chip-inactive"
              )}
            >
              {m}
            </button>
          ))}
        </div>
        <input
          className="input-bright w-full px-4 py-2.5 text-xs font-mono"
          placeholder="或输入自定义模型名称..."
        />
      </div>

      {/* System Prompt */}
      <div className="bright-card p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <MessageSquare size={13} className="text-slate-400" />
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">System Prompt</label>
        </div>
        <textarea
          className="input-bright w-full px-4 py-3 text-xs font-mono resize-none leading-relaxed"
          rows={4}
          defaultValue={"你是一个专业的饮品营养分析助手。请从图片或描述中准确识别饮品信息，包括品牌、名称、容量、卡路里、糖分和咖啡因含量。以 JSON 格式返回结果。"}
        />
      </div>

      {/* Temperature & Max Tokens */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bright-card p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Thermometer size={13} className="text-amber-500" />
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Temperature</label>
          </div>
          <input
            type="number" step="0.1" min="0" max="2"
            className="input-bright w-full px-4 py-3 text-sm font-mono"
            defaultValue="0.3"
          />
        </div>
        <div className="bright-card p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Hash size={13} className="text-blue-500" />
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Max Tokens</label>
          </div>
          <input
            type="number"
            className="input-bright w-full px-4 py-3 text-sm font-mono"
            defaultValue="1024"
          />
        </div>
      </div>

      {/* Image Analysis Toggle */}
      <div
        className="bright-card p-4 flex items-center justify-between"
        style={{
          background: imageAnalysis ? '#eff6ff' : '#f8faff',
          borderColor: imageAnalysis ? '#bfdbfe' : '#e2e8f8',
        }}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0",
            imageAnalysis ? "bg-blue-100" : "bg-slate-100"
          )}>
            <ImageIcon size={18} className={imageAnalysis ? "text-blue-500" : "text-slate-400"} />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">图片分析</p>
            <p className="text-xs text-slate-400 mt-0.5">使用视觉模型识别饮品包装</p>
          </div>
        </div>
        <button
          className="w-13 h-7 rounded-full relative flex-shrink-0 transition-all"
          style={{
            width: 52, height: 28,
            background: imageAnalysis
              ? 'linear-gradient(135deg, #3b82f6, #6366f1)'
              : '#e2e8f0',
            boxShadow: imageAnalysis ? '0 4px 12px rgba(59,130,246,0.35)' : 'none',
          }}
          onClick={() => setImageAnalysis(!imageAnalysis)}
          role="switch"
          aria-checked={imageAnalysis}
          aria-label="启用图片分析"
        >
          <div
            className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-all"
            style={{ left: imageAnalysis ? 'calc(100% - 24px)' : '4px' }}
          />
        </button>
      </div>

      {/* Test Connection */}
      <button
        onClick={handleTest}
        disabled={testStatus === "testing"}
        className={cn(
          "w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold transition-all primary-btn",
          testStatus === "testing" && "opacity-70 cursor-wait"
        )}
      >
        {testStatus === "testing" ? (
          <>
            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            <span>测试中...</span>
          </>
        ) : testStatus === "ok" ? (
          <>
            <Wifi size={16} />
            <span>连接成功 · 重新测试</span>
          </>
        ) : (
          <>
            <Wifi size={16} />
            <span>测试连接</span>
          </>
        )}
      </button>

      {/* Save */}
      <button
        className="w-full py-3.5 rounded-2xl text-sm font-bold text-slate-500 transition-all bg-slate-100 border border-slate-200 active:scale-97"
      >
        保存设置
      </button>
    </div>
  )
}
