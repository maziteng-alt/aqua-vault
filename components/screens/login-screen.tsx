"use client"

import { useState } from "react"
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react"
import { useData } from "@/lib/data-context"
import * as api from "@/lib/api"

interface LoginScreenProps {
  onLogin: () => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (mode === "login") {
        await api.signIn(email, password)
      } else {
        await api.signUp(email, password)
      }
      onLogin()
    } catch (err: any) {
      setError(err.message || "发生错误，请重试")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 pb-4 pt-10">
      <div className="text-center">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-4xl mx-auto shadow-lg mb-4">
          💧
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          {mode === "login" ? "欢迎回来" : "创建账号"}
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          {mode === "login" ? "登录你的饮品记录" : "开始你的健康追踪"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="bright-card p-4 flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-400 font-medium">邮箱</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                className="input-bright w-full pl-10 pr-4 py-3 text-sm"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-400 font-medium">密码</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                className="input-bright w-full pl-10 pr-4 py-3 text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="primary-btn w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              请稍候...
            </>
          ) : (
            <>
              {mode === "login" ? "登录" : "注册"}
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <div className="text-center">
        <button
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login")
            setError("")
          }}
          className="text-sm text-blue-500 font-medium"
        >
          {mode === "login" 
            ? "还没有账号？点击注册" 
            : "已有账号？点击登录"}
        </button>
      </div>
    </div>
  )
}
