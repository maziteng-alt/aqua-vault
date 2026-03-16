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
import { InsightsScreen } from "@/components/screens/insights-screen"
import { SettingsScreen } from "@/components/screens/settings-screen"

export default function App() {
  const [activeTab, setActiveTab] = useState("home")
  const [showAddCup, setShowAddCup] = useState(false)
  const scrollRef = useRef<HTMLElement>(null)

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
    if (showAddCup) {
      return <AddCupScreen 
        onBack={() => setShowAddCup(false)} 
        onSave={(cup) => {
          console.log('Saved cup:', cup)
          setShowAddCup(false)
        }} 
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
            <AddRecordScreen />
          </div>
        )
      case "records":
        return <RecordsScreen />
      case "cups":
        return <CupsScreen onAddCupClick={() => setShowAddCup(true)} />
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

        <TabBar activeTab={activeTab === "add" ? "scan" : activeTab} onTabChange={handleTabChange} />
      </div>
    </div>
  )
}
