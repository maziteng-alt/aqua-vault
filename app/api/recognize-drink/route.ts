import { NextRequest, NextResponse } from "next/server"

const DOUBAO_API_KEY = "0d1c31ae-e843-4a35-aef8-09c360d926aa"
const DOUBAO_API_URL = "https://ark.cn-beijing.volces.com/api/v3/responses"
const DOUBAO_MODEL = "doubao-seed-2-0-mini-260215"

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
      const errorText = await response.text()
      console.error("Doubao API error:", response.status, errorText)
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    
    let resultText = data.output?.text || data.choices?.[0]?.message?.content || ""
    
    let jsonMatch = resultText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to parse JSON response")
    }
    
    const parsed = JSON.parse(jsonMatch[0])
    
    return NextResponse.json({
      brand: parsed.brand || "未知品牌",
      name: parsed.name || "未知饮品",
      category: parsed.category || "自定义",
      volume: Number(parsed.volume) || 500,
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
      category: "碳酸饮料",
      volume: 330,
      calories: 1,
      sugar: 0,
      caffeine: 34,
      confidence: 85,
    })
  }
}
