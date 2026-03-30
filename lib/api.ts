import { supabase } from './supabase'

// ================================
// User Profile API
// ================================
export async function getUserProfile() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) throw error
  return data
}

export async function updateUserProfile(updates: {
  username?: string
  avatar?: string
  daily_water_goal?: number
  daily_caffeine_limit?: number
  daily_calorie_goal?: number
  daily_sugar_limit?: number
}) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not logged in')

  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single()

  if (error) throw error
  return data
}

// ================================
// Drink Records API
// ================================
export async function getDrinkRecords({
  startDate,
  endDate,
  category,
  limit = 50,
  offset = 0,
}: {
  startDate?: Date
  endDate?: Date
  category?: string
  limit?: number
  offset?: number
} = {}) {
  let query = supabase
    .from('drink_records')
    .select('*', { count: 'exact' })

  if (startDate) {
    query = query.gte('drink_time', startDate.toISOString())
  }
  if (endDate) {
    query = query.lte('drink_time', endDate.toISOString())
  }
  if (category) {
    query = query.eq('category', category)
  }

  const { data, error, count } = await query
    .order('drink_time', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return { records: data, total: count }
}

export async function getTodayDrinkRecords() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const { data, error } = await supabase
    .from('drink_records')
    .select('*')
    .gte('drink_time', today.toISOString())
    .lt('drink_time', tomorrow.toISOString())
    .order('drink_time', { ascending: false })

  if (error) throw error

  const stats = data.reduce(
    (acc, record) => ({
      totalVolume: acc.totalVolume + record.volume,
      totalCaffeine: acc.totalCaffeine + record.caffeine,
      totalSugar: acc.totalSugar + record.sugar,
      totalCalories: acc.totalCalories + record.calories,
    }),
    { totalVolume: 0, totalCaffeine: 0, totalSugar: 0, totalCalories: 0 }
  )

  return { records: data, stats }
}

export async function getDrinkRecord(id: string) {
  const { data, error } = await supabase
    .from('drink_records')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function createDrinkRecord(record: {
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
  drink_time?: Date
}) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not logged in')

  const { data, error } = await supabase
    .from('drink_records')
    .insert([{
      ...record,
      user_id: user.id,
      drink_time: record.drink_time || new Date(),
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateDrinkRecord(id: string, updates: Partial<{
  name: string
  brand: string
  volume: number
  calories: number
  caffeine: number
  sugar: number
  category: string
  icon: string
  accent_color: string
  note: string
  drink_time: Date
}>) {
  const { data, error } = await supabase
    .from('drink_records')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteDrinkRecord(id: string) {
  const { error } = await supabase
    .from('drink_records')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ================================
// Cups API
// ================================
export async function getCups() {
  const { data, error } = await supabase
    .from('cups')
    .select('*')
    .order('is_favorite', { ascending: false })
    .order('use_count', { ascending: false })

  if (error) throw error
  return data
}

export async function getFavoriteCups() {
  const { data, error } = await supabase
    .from('cups')
    .select('*')
    .eq('is_favorite', true)
    .order('use_count', { ascending: false })

  if (error) throw error
  return data
}

export async function getCup(id: string) {
  const { data, error } = await supabase
    .from('cups')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function createCup(cup: {
  name: string
  capacity: number
  icon?: string
  accent_color?: string
  background_color?: string
  is_favorite?: boolean
}) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not logged in')

  const { data, error } = await supabase
    .from('cups')
    .insert([{ ...cup, user_id: user.id }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateCup(id: string, updates: Partial<{
  name: string
  capacity: number
  icon: string
  accent_color: string
  background_color: string
  is_favorite: boolean
  use_count: number
}>) {
  const { data, error } = await supabase
    .from('cups')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteCup(id: string) {
  const { error } = await supabase
    .from('cups')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ================================
// Auth API
// ================================
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}
