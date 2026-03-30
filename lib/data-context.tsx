'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import * as api from './api'

interface DrinkRecord {
  id: string
  user_id: string
  name: string
  brand?: string
  volume: number
  calories?: number
  caffeine?: number
  sugar?: number
  category: string
  icon?: string
  accent_color?: string
  note?: string
  drink_time: string
  created_at: string
  updated_at: string
}

interface Cup {
  id: string
  user_id: string
  name: string
  capacity: number
  icon?: string
  accent_color?: string
  background_color?: string
  is_favorite?: boolean
  use_count?: number
  created_at: string
  updated_at: string
}

interface UserProfile {
  id: string
  username?: string
  avatar?: string
  daily_water_goal?: number
  daily_caffeine_limit?: number
  daily_calorie_goal?: number
  daily_sugar_limit?: number
  created_at: string
  updated_at: string
}

interface DataContextType {
  drinkRecords: DrinkRecord[]
  cups: Cup[]
  userProfile: UserProfile | null
  todayStats: {
    totalVolume: number
    totalCaffeine: number
    totalSugar: number
    totalCalories: number
  }
  loading: boolean
  refresh: () => Promise<void>
  addDrinkRecord: (record: Omit<DrinkRecord, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>
  updateDrinkRecord: (id: string, updates: Partial<DrinkRecord>) => Promise<void>
  deleteDrinkRecord: (id: string) => Promise<void>
  addCup: (cup: Omit<Cup, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'use_count'>) => Promise<void>
  updateCup: (id: string, updates: Partial<Cup>) => Promise<void>
  deleteCup: (id: string) => Promise<void>
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [drinkRecords, setDrinkRecords] = useState<DrinkRecord[]>([])
  const [cups, setCups] = useState<Cup[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [todayStats, setTodayStats] = useState({
    totalVolume: 0,
    totalCaffeine: 0,
    totalSugar: 0,
    totalCalories: 0,
  })
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    try {
      setLoading(true)
      
      const [user, recordsData, cupsData] = await Promise.all([
        api.getUserProfile(),
        api.getTodayDrinkRecords(),
        api.getCups(),
      ])

      setUserProfile(user)
      setDrinkRecords(recordsData.records)
      setTodayStats(recordsData.stats)
      setCups(cupsData)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const addDrinkRecord = async (record: Omit<DrinkRecord, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    await api.createDrinkRecord(record)
    await refresh()
  }

  const updateDrinkRecord = async (id: string, updates: Partial<DrinkRecord>) => {
    await api.updateDrinkRecord(id, updates)
    await refresh()
  }

  const deleteDrinkRecord = async (id: string) => {
    await api.deleteDrinkRecord(id)
    await refresh()
  }

  const addCup = async (cup: Omit<Cup, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'use_count'>) => {
    await api.createCup(cup)
    await refresh()
  }

  const updateCup = async (id: string, updates: Partial<Cup>) => {
    await api.updateCup(id, updates)
    await refresh()
  }

  const deleteCup = async (id: string) => {
    await api.deleteCup(id)
    await refresh()
  }

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    await api.updateUserProfile(updates)
    await refresh()
  }

  useEffect(() => {
    refresh()
  }, [])

  return (
    <DataContext.Provider value={{
      drinkRecords,
      cups,
      userProfile,
      todayStats,
      loading,
      refresh,
      addDrinkRecord,
      updateDrinkRecord,
      deleteDrinkRecord,
      addCup,
      updateCup,
      deleteCup,
      updateUserProfile,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
