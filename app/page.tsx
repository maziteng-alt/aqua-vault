"use client"

import { useState, useRef, useEffect } from "react"
import { AppBackground } from "@/components/aurora-background"
import { TabBar } from "@/components/tab-bar"
import { HomeScreen } from "@/components/screens/home-screen"
import { ScanScreen } from "@/components/screens/scan-screen"
import { AddRecordScreen } from "@/components/screens/add-record-screen"
import { RecordsScreen } from "@/components/screens/records-screen"
import { CupsScreen } from "@/components/screens/cups-screen"
import { AddCupScreen } from "@/components/screens/add-cup-screen"
import { UseCupScreen } from "@/components/screens/use-cup-screen"
import { InsightsScreen } from "@/components/screens/insights-screen"
import { SettingsScreen } from "@/components/screens/settings-screen"
import { LoginScreen } from "@/components/screens/login-screen"
import { useData } from "@/lib/data-context"
import * as api from "@/lib/api"

export default function App() {
  const [activeTab, setActiveTab] = useState("home")
  const [showAddCup, setShowAddCup] = useState(false)
  const [useCup, setUseCup] = useState<{
    id: string
    name: string
    capacity: number
    icon?: string
  } | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const scrollRef = useRef<HTMLElement>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const user = await api.getCurrentUser()
      setIsLoggedIn(!!user)
    } catch (error) {
      setIsLoggedIn(false)
    } finally {
      setCheckingAuth(false)
    }
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'auto' })
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTo({ top: 0, behavior: 'auto' })
        }
      }, 50)
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTo({ top: 0, behavior: 'auto' })
        }
      }, 150)
    }
  }

  const renderScreen = () => {
    if (checkingAuth) {
      return (
        <div className="flex flex-col gap-6 pb-4 pt-20 items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="text-sm text-slate-400">加载中...</p>
        </div>
      )
    }

    if (!isLoggedIn) {
      return <LoginScreen onLogin={() => {
        setIsLoggedIn(true)
      }} />
    }

    if (showAddCup) {
      return <AddCupScreen 
        onBack={() => setShowAddCup(false)} 
      />
    }

    if (useCup) {
      return <UseCupScreen 
        cup={useCup}
        onBack={() => setUseCup(null)} 
      />
    }

    switch (activeTab) {
      case "home":
        return <HomeScreen 
          onScanClick={() => handleTabChange("scan")} 
          onAddClick={() => handleTabChange("add")}
          onViewAllRecordsClick={() => handleTabChange("records")}
          onViewCupsClick={() => handleTabChange("cups")}
          onAddCupClick={() => {
            setActiveTab("cups")
            setShowAddCup(true)
          }}
          onUseCupClick={(cup) => setUseCup(cup)}
        />
      case "scan":
        return (
          <div className="flex flex-col gap-5">
            <div className="flex gap-2 p-1 bg-white rounded-2xl border border-border shadow-sm">
              <button
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-blue-500 text-white shadow-sm"
              >
                AI 扫描识别
              </button>
              <button
                onClick={() => handleTabChange("add")}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-400"
              >
                手动添加
              </button>
            </div>
            <ScanScreen />
          </div>
        )
      case "add":
        return (
          <div className="flex flex-col gap-5">
            <div className="flex gap-2 p-1 bg-white rounded-2xl border border-border shadow-sm">
              <button
                onClick={() => handleTabChange("scan")}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-400"
              >
                AI 扫描识别
              </button>
              <button
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-violet-500 text-white shadow-sm"
              >
                手动添加
              </button>
            </div>
            <AddRecordScreen onBack={() => handleTabChange("home")} />
          </div>
        )
      case "records":
        return <RecordsScreen />
      case "cups":
        return <CupsScreen 
          onAddCupClick={() => setShowAddCup(true)} 
          onUseCupClick={(cup) => setUseCup(cup)}
        />
      case "insights":
        return <InsightsScreen />
      case "settings":
        return <SettingsScreen />
      default:
        return <HomeScreen 
          onScanClick={() => handleTabChange("scan")} 
          onAddClick={() => handleTabChange("add")}
          onViewAllRecordsClick={() => handleTabChange("records")}
          onViewCupsClick={() => handleTabChange("cups")}
          onAddCupClick={() => {
            setActiveTab("cups")
            setShowAddCup(true)
          }}
          onUseCupClick={(cup) => setUseCup(cup)}
        />
    }
  }

  return (
    <div className="min-h-dvh relative flex items-start justify-center">
      <AppBackground />

      {/* Mobile frame */}
      <div className="relative w-full max-w-sm min-h-dvh flex flex-col">
        {/* Status bar safe area */}
        <div className="flex-shrink-0" style={{ height: 'env(safe-area-inset-top, 44px)', minHeight: 44 }} />

        {/* Scrollable content */}
        <main
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-3"
          style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))' }}
        >
          <div key={activeTab} className="animate-in fade-in duration-200">
            {renderScreen()}
          </div>
        </main>

        {isLoggedIn && (
          <TabBar activeTab={activeTab === "add" ? "scan" : activeTab} onTabChange={handleTabChange} />
        )}
      </div>
    </div>
  )
}
