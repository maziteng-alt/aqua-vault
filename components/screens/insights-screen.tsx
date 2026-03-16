"use client"

import { Sparkles, TrendingUp, TrendingDown } from "lucide-react"
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts"

const weeklyWater = [
  { day: "周一", value: 1800 },
  { day: "周二", value: 1200 },
  { day: "周三", value: 2100 },
  { day: "周四", value: 1650 },
  { day: "周五", value: 900 },
  { day: "周六", value: 2400 },
  { day: "今天", value: 1350 },
]

const weeklyCaffeine = [
  { day: "周一", value: 180 },
  { day: "周二", value: 320 },
  { day: "周三", value: 150 },
  { day: "周四", value: 420 },
  { day: "周五", value: 280 },
  { day: "周六", value: 100 },
  { day: "今天", value: 225 },
]

const categoryDist = [
  { name: "水",   value: 42, color: "#3b82f6" },
  { name: "咖啡", value: 28, color: "#f97316" },
  { name: "茶饮", value: 15, color: "#06b6d4" },
  { name: "奶茶", value: 10, color: "#ec4899" },
  { name: "其他", value: 5,  color: "#eab308" },
]

const radialGoals = [
  { name: "水分",   value: 68, color: "#3b82f6", bg: "#eff6ff", gradientId: "waterRadialGrad" },
  { name: "咖啡因", value: 45, color: "#f97316", bg: "#fff7ed", gradientId: "caffeineRadialGrad" },
  { name: "热量",   value: 30, color: "#f43f5e", bg: "#fff1f2", gradientId: "calorieRadialGrad" },
]

const aiInsights = [
  {
    icon: "⚡",
    bg: "#fefce8",
    accent: "#ca8a04",
    border: "#fde68a",
    title: "下午咖啡因峰值",
    body: "你在 14:00–15:00 摄入咖啡因的频率极高，连续高峰可能影响夜间睡眠质量。",
    tag: "警告", tagBg: "#fef9c3", tagColor: "#ca8a04",
  },
  {
    icon: "💧",
    bg: "#eff6ff",
    accent: "#3b82f6",
    border: "#bfdbfe",
    title: "今日水分表现良好",
    body: "相比过去 7 天平均水平，今日饮水量提升了 18%，继续保持！",
    tag: "鼓励", tagBg: "#dcfce7", tagColor: "#16a34a",
  },
  {
    icon: "🍬",
    bg: "#fdf4ff",
    accent: "#8b5cf6",
    border: "#e9d5ff",
    title: "周末糖分偏高",
    body: "你在过去 4 个周末的含糖饮品摄入明显高于工作日，建议替换部分奶茶。",
    tag: "建议", tagBg: "#ede9fe", tagColor: "#7c3aed",
  },
]

const TooltipStyle = {
  background: '#ffffff',
  border: '1px solid #e2e8f8',
  borderRadius: 12,
  padding: '6px 12px',
  fontSize: 11,
  color: '#1e2347',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
}

export function InsightsScreen() {
  return (
    <div className="flex flex-col gap-6 pb-4">

      <div className="pt-1">
        <p className="text-sm text-slate-400 font-medium">数据分析与健康洞察</p>
        <h1 className="text-xl font-bold text-foreground mt-0.5">溯源谱SipTrends</h1>
      </div>

      {/* Today's Goals */}
      <div className="bright-card p-5">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4">今日目标达成</p>
        <div className="flex items-center justify-around">
          {radialGoals.map(d => (
            <div key={d.name} className="flex flex-col items-center gap-2">
              <div className="relative">
                <svg width="72" height="72" viewBox="0 0 72 72" className="-rotate-90">
                  <defs>
                    <linearGradient id={d.gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                      {d.name === "水分" && (
                        <>
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </>
                      )}
                      {d.name === "咖啡因" && (
                        <>
                          <stop offset="0%" stopColor="#f97316" />
                          <stop offset="100%" stopColor="#eab308" />
                        </>
                      )}
                      {d.name === "热量" && (
                        <>
                          <stop offset="0%" stopColor="#f43f5e" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </>
                      )}
                    </linearGradient>
                  </defs>
                  <circle cx="36" cy="36" r="30" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                  <circle
                    cx="36" cy="36" r="30"
                    fill="none"
                    stroke={`url(#${d.gradientId})`}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 30 * d.value / 100} ${2 * Math.PI * 30}`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-extrabold" style={{ color: d.color }}>{d.value}%</span>
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-500">{d.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Water Chart */}
      <div className="bright-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-bold text-foreground">本周饮水量</p>
            <p className="text-xs text-slate-400 mt-0.5">单位：ml</p>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            <TrendingUp size={11} className="text-emerald-600" />
            <span className="text-xs font-bold text-emerald-600">+12%</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={110}>
          <AreaChart data={weeklyWater} margin={{ top: 5, right: 4, bottom: 0, left: -24 }}>
            <defs>
              <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#cbd5e1', fontSize: 9 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TooltipStyle} cursor={{ stroke: 'rgba(59,130,246,0.15)' }} />
            <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2.5}
              fill="url(#waterGrad)" dot={false} activeDot={{ r: 5, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Caffeine Chart */}
      <div className="bright-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-bold text-foreground">本周咖啡因</p>
            <p className="text-xs text-slate-400 mt-0.5">单位：mg</p>
          </div>
          <div className="flex items-center gap-1.5 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
            <TrendingDown size={11} className="text-orange-500" />
            <span className="text-xs font-bold text-orange-500">周四峰值</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={110}>
          <AreaChart data={weeklyCaffeine} margin={{ top: 5, right: 4, bottom: 0, left: -24 }}>
            <defs>
              <linearGradient id="cafGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#f97316" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#cbd5e1', fontSize: 9 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TooltipStyle} cursor={{ stroke: 'rgba(249,115,22,0.15)' }} />
            <Area type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2.5}
              fill="url(#cafGrad)" dot={false} activeDot={{ r: 5, fill: '#f97316', stroke: '#fff', strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="bright-card p-5">
        <p className="text-sm font-bold text-foreground mb-4">饮品类别分布</p>
        <div className="flex items-center gap-5">
          <PieChart width={100} height={100}>
            <Pie data={categoryDist} cx={46} cy={46} innerRadius={30} outerRadius={48} dataKey="value" strokeWidth={2} stroke="#f0f4ff">
              {categoryDist.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
          <div className="flex flex-col gap-2.5 flex-1">
            {categoryDist.map(c => (
              <div key={c.name} className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
                <span className="text-xs text-slate-500 flex-1 font-medium">{c.name}</span>
                <span className="text-xs font-extrabold" style={{ color: c.color }}>{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={15} className="text-violet-500" />
          <h2 className="text-base font-bold text-foreground">AI 智能分析</h2>
        </div>
        <div className="flex flex-col gap-3">
          {aiInsights.map((ins, i) => (
            <div key={i}
              className="bright-card p-4 relative overflow-hidden"
              style={{ background: ins.bg, borderColor: ins.border }}>
              <div className="absolute top-4 right-4">
                <span className="text-[10px] px-2.5 py-1 rounded-full font-bold"
                  style={{ background: ins.tagBg, color: ins.tagColor }}>
                  {ins.tag}
                </span>
              </div>
              <div className="flex items-start gap-3 pr-14">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl bg-white shadow-sm flex-shrink-0">
                  {ins.icon}
                </div>
                <div>
                  <p className="text-sm font-bold mb-1.5" style={{ color: ins.accent }}>{ins.title}</p>
                  <p className="text-xs leading-relaxed text-slate-500">{ins.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top cups */}
      <div className="bright-card p-5">
        <p className="text-sm font-bold text-foreground mb-4">最常用杯子 TOP 3</p>
        {[
          { name: "白熊极光保温杯", uses: 47, pct: 85, color: "#3b82f6", gradient: "linear-gradient(90deg, #3b82f6, #06b6d4)" },
          { name: "星巴克随行杯",   uses: 32, pct: 58, color: "#f97316", gradient: "linear-gradient(90deg, #f97316, #eab308)" },
          { name: "精品茶道茶杯",   uses: 28, pct: 50, color: "#f43f5e", gradient: "linear-gradient(90deg, #f43f5e, #ec4899)" },
        ].map((c, i) => (
          <div key={c.name} className="flex items-center gap-3 mb-3.5 last:mb-0">
            <span className="text-xs font-bold text-slate-300 w-5 text-center">{i + 1}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-600">{c.name}</span>
                <span className="text-xs font-extrabold" style={{ color: c.color }}>{c.uses} 次</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden bg-slate-100">
                <div className="h-full rounded-full" style={{ width: `${c.pct}%`, background: c.gradient }} />
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
