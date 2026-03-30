"use client"

import { Home, Zap, BookOpen, Coffee, BarChart2, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const tabs = [
  { id: "home",     label: "首页",  icon: Home },
  { id: "scan",     label: "采饮台",  icon: Zap },
  { id: "records",  label: "点滴录",  icon: BookOpen },
  { id: "cups",     label: "藏杯坞",  icon: Coffee },
  { id: "insights", label: "溯源谱",  icon: BarChart2 },
  { id: "settings", label: "设置",  icon: Settings },
]

interface TabBarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-label="主导航"
    >
      <div className="flex items-center justify-around px-2 py-2 mx-4 mb-3 glass-inner rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1 rounded-2xl transition-all duration-300 min-w-[52px]",
                isActive && "scale-105"
              )}
              aria-label={tab.label}
              aria-current={isActive ? "page" : undefined}
            >
              <div className={cn(
                "flex items-center justify-center w-9 h-9 rounded-2xl transition-all duration-300",
                isActive
                  ? "bg-gradient-to-r from-[#2895FF] via-[#62D9FF] to-[#58FFEB] shadow-md"
                  : "bg-transparent"
              )}>
                <Icon
                  size={18}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  fill={isActive ? "currentColor" : "none"}
                  className={isActive ? "text-white" : "text-slate-500"}
                />
              </div>
              <span className={cn(
                "text-[10px] font-semibold transition-all duration-300",
                isActive ? "bg-gradient-to-r from-[#2895FF] via-[#62D9FF] to-[#58FFEB] bg-clip-text text-transparent" : "text-slate-500"
              )}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
