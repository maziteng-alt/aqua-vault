"use client"

import { Home, Zap, BookOpen, Coffee, BarChart2, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const tabs = [
  { id: "home",     label: "首页",  icon: Home },
  { id: "scan",     label: "采饮台",  icon: Zap },
  { id: "records",  label: "点滴录",  icon: BookOpen },
  { id: "cups",     label: "藏杯坞",  icon: Coffee },
  { id: "insights", label: "洞察",  icon: BarChart2 },
  { id: "settings", label: "设置",  icon: Settings },
]

interface TabBarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 tab-bar-light"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-label="主导航"
    >
      <div className="flex items-center justify-around px-1 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center gap-1 px-2 py-1.5 rounded-2xl transition-all duration-200 min-w-[52px]",
              )}
              aria-label={tab.label}
              aria-current={isActive ? "page" : undefined}
            >
              <div className={cn(
                "flex items-center justify-center w-9 h-9 rounded-2xl transition-all duration-200",
                isActive
                  ? "bg-blue-500 shadow-lg"
                  : "bg-transparent"
              )}
              style={isActive ? { boxShadow: '0 4px 12px rgba(59,130,246,0.35)' } : {}}>
                <Icon
                  size={18}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className={isActive ? "text-white" : "text-slate-400"}
                />
              </div>
              <span className={cn(
                "text-[10px] font-medium transition-colors duration-200",
                isActive ? "text-blue-500" : "text-slate-400"
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
