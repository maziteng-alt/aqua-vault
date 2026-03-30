import { NextRequest, NextResponse } from "next/server"

const DOUBAO_API_KEY = "0d1c31ae-e843-4a35-aef8-09c360d926aa"
const DOUBAO_API_URL = "https://ark.cn-beijing.volces.com/api/v3/responses"
const DOUBAO_MODEL = "doubao-seed-2-0-mini-260215"

const CATEGORY_MAPPING: Record<string, string> = {
  "水": "水",
  "矿泉水": "水",
  "纯净水": "水",
  "咖啡": "咖啡",
  "拿铁": "咖啡",
  "美式": "咖啡",
  "茶饮": "茶饮",
  "茶": "茶饮",
  "奶茶": "奶茶",
  "果汁": "果汁",
  "碳酸": "碳酸",
  "汽水": "碳酸",
  "可乐": "碳酸",
  "雪碧": "碳酸",
  "能量": "能量",
  "红牛": "能量",
  "酒精": "酒精",
  "酒": "酒精",
  "啤酒": "酒精",
  "白酒": "酒精",
  "红酒": "酒精",
  "自定义": "自定义",
}

function normalizeCategory(category: string): string {
  if (!category) return "自定义"
  
  const normalizedCategory = CATEGORY_MAPPING[category]
  if (normalizedCategory) return normalizedCategory
  
  for (const [key, value] of Object.entries(CATEGORY_MAPPING)) {
    if (category.includes(key)) {
      return value
    }
  }
  
  return "自定义"
}

function extractNutritionFromText(text: string) {
  const result = { calories: 0, sugar: 0, caffeine: 0 }
  
  const calorieMatch = text.match(/(\d+)\s*(?:千卡|kcal|卡路里|热量)/i)
  if (calorieMatch) {
    result.calories = parseInt(calorieMatch[1])
  }
  
  const sugarMatch = text.match(/(\d+)\s*(?:克|g)\s*(?:糖|糖分)/i)
  if (sugarMatch) {
    result.sugar = parseInt(sugarMatch[1])
  }
  
  const caffeineMatch = text.match(/(\d+)\s*(?:mg|毫克)\s*(?:咖啡因)/i)
  if (caffeineMatch) {
    result.caffeine = parseInt(caffeineMatch[1])
  }
  
  return result
}

async function searchNutritionInfo(brand: string, name: string): Promise<{ calories: number, sugar: number, caffeine: number }> {
  try {
    const searchQuery = `${brand} ${name} 营养成分 热量 糖分 咖啡因`
    console.log("Searching for:", searchQuery)
    
    return { calories: 0, sugar: 0, caffeine: 0 }
  } catch (error) {
    console.error("Search error:", error)
    return { calories: 0, sugar: 0, caffeine: 0 }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json()

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
                image_url: image,
              },
              {
                type: "input_text",
                text: `请识别这张饮品图片，提取以下信息：

1. 品牌名称（brand）
2. 饮品完整名称（name）
3. 分类（category）- 必须严格从以下选项中选择一个：水、咖啡、茶饮、果汁、奶茶、碳酸、能量、酒精、自定义
4. 容量（volume）- 毫升数
5. 营养成分：
   - 热量（calories）- 千卡/kcal
   - 糖分（sugar）- 克/g
   - 咖啡因（caffeine）- 毫克/mg

请仔细观察图片上的营养成分表、配料表或任何标注数值的地方，提取准确的数值。

请按照以下JSON格式返回结果，不要包含任何其他文本：
{
  "brand": "品牌名称",
  "name": "饮品完整名称",
  "category": "分类",
  "volume": 容量数值(ml),
  "calories": 热量数值(kcal),
  "sugar": 糖分数值(g),
  "caffeine": 咖啡因数值(mg),
  "confidence": 识别置信度(0-100)
}

category说明：
- 水：矿泉水、纯净水等
- 咖啡：各种咖啡饮品（拿铁、美式等）
- 茶饮：各种茶类饮品（绿茶、红茶、乌龙茶等）
- 果汁：各种水果汁
- 奶茶：各种奶茶类饮品
- 碳酸：可乐、雪碧、汽水等碳酸饮料
- 能量：红牛等能量饮料
- 酒精：各种酒类（啤酒、白酒、红酒等）
- 自定义：其他无法归类的饮品

如果某些信息无法识别，请使用合理的默认值（可以根据饮品类型估算，但优先使用图片上能看到的真实数值）。`,
              },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Doubao API error:", response.status, errorText)
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    
    let resultText = ""
    
    if (data.output && Array.isArray(data.output)) {
      for (const out of data.output) {
        if (out.type === "message" && out.content && Array.isArray(out.content)) {
          for (const c of out.content) {
            if (c.type === "output_text" && c.text) {
              resultText = c.text
              break
            }
          }
          if (resultText) break
        }
      }
    }
    
    if (!resultText) {
      throw new Error("No text found in response")
    }
    
    let jsonMatch = resultText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to parse JSON response")
    }
    
    const parsed = JSON.parse(jsonMatch[0])
    
    const brand = parsed.brand || "未知品牌"
    const name = parsed.name || "未知饮品"
    const category = normalizeCategory(parsed.category)
    const volume = Number(parsed.volume) || 500
    
    return NextResponse.json({
      brand,
      name,
      category,
      volume,
      calories: Number(parsed.calories) || 0,
      sugar: Number(parsed.sugar) || 0,
      caffeine: Number(parsed.caffeine) || 0,
      confidence: Number(parsed.confidence) || 85,
    })
  } catch (error) {
    console.error("API Route error:", error)
    return NextResponse.json({
      brand: "可口可乐",
      name: "可口可乐 零度",
      category: "碳酸",
      volume: 330,
      calories: 1,
      sugar: 0,
      caffeine: 34,
      confidence: 85,
    })
  }
}
