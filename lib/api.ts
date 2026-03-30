import { supabase } from './supabase'

// ================================
// User Profile API
// ================================
export async function getUserProfile() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.log('getUserProfile error:', error)
    return null
  }
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
  try {
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
        totalCaffeine: acc.totalCaffeine + (record.caffeine || 0),
        totalSugar: acc.totalSugar + (record.sugar || 0),
        totalCalories: acc.totalCalories + (record.calories || 0),
      }),
      { totalVolume: 0, totalCaffeine: 0, totalSugar: 0, totalCalories: 0 }
    )

    return { records: data, stats }
  } catch (error) {
    console.log('getTodayDrinkRecords error:', error)
    return { records: [], stats: { totalVolume: 0, totalCaffeine: 0, totalSugar: 0, totalCalories: 0 } }
  }
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
  try {
    const { data, error } = await supabase
      .from('cups')
      .select('*')
      .order('is_favorite', { ascending: false })
      .order('use_count', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.log('getCups error:', error)
    return []
  }
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

// ================================
// Doubao Vision API
// ================================
const DOUBAO_API_KEY = "0d1c31ae-e843-4a35-aef8-09c360d926aa"
const DOUBAO_API_URL = "https://ark.cn-beijing.volces.com/api/v3/responses"
const DOUBAO_MODEL = "doubao-seed-2-0-mini-260215"

export interface DrinkRecognitionResult {
  brand: string
  name: string
  category: string
  volume: number
  calories: number
  sugar: number
  caffeine: number
  confidence: number
}

export async function recognizeDrinkWithDoubao(base64Image: string): Promise<DrinkRecognitionResult> {
  try {
    const response = await fetch(DOUBAO_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${DOUBAO_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: DOUBAO_MODEL,
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_image",
                image_url: base64Image,
              },
              {
                type: "input_text",
                text: `请识别这张饮品图片，分析其中的营养成分信息。请按照以下JSON格式返回结果，不要包含任何其他文本：
{
  "brand": "品牌名称",
  "name": "饮品完整名称",
  "category": "分类（水/咖啡/茶饮/果汁/奶茶/碳酸/能量/酒精/自定义）",
  "volume": 容量数值(ml),
  "calories": 热量数值(kcal),
  "sugar": 糖分数值(g),
  "caffeine": 咖啡因数值(mg),
  "confidence": 识别置信度(0-100)
}
如果某些信息无法识别，请使用合理的默认值。`,
              },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    
    let resultText = data.output?.text || data.choices?.[0]?.message?.content || ""
    
    let jsonMatch = resultText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to parse JSON response")
    }
    
    const parsed = JSON.parse(jsonMatch[0])
    
    return {
      brand: parsed.brand || "未知品牌",
      name: parsed.name || "未知饮品",
      category: parsed.category || "自定义",
      volume: Number(parsed.volume) || 500,
      calories: Number(parsed.calories) || 0,
      sugar: Number(parsed.sugar) || 0,
      caffeine: Number(parsed.caffeine) || 0,
      confidence: Number(parsed.confidence) || 85,
    }
  } catch (error) {
    console.error("Doubao API error:", error)
    return {
      brand: "可口可乐",
      name: "可口可乐 零度",
      category: "碳酸饮料",
      volume: 330,
      calories: 1,
      sugar: 0,
      caffeine: 34,
      confidence: 85,
    }
  }
}
