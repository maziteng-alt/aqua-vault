import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { drinks } = await request.json()
    const API_KEY = process.env.VOLCENGINE_API_KEY || "0d1c31ae-e843-4a35-aef8-09c360d926aa"
    
    if (!drinks || drinks.length === 0) {
      return NextResponse.json({ 
        insight: "今天还没有饮品记录呢，开始记录你的第一杯吧！" 
      })
    }

    const drinksSummary = drinks.map((drink: any) => 
      `${drink.name} - ${drink.volume}ml, 热量${drink.calories || 0}kcal, 咖啡因${drink.caffeine || 0}mg, 糖${drink.sugar || 0}g`
    ).join("\n")

    const response = await fetch("https://ark.cn-beijing.volces.com/api/v3/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "doubao-seed-2-0-mini-260215",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: `以下是用户今天饮用的饮品记录：

${drinksSummary}

请分析这些饮品的营养摄入情况，给出1-2句简短的健康建议或洞察，不要超过2行文字，用中文回复，语气友好亲切。`
              }
            ]
          }
        ]
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("API error:", response.status, errorText)
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    
    let outputText = ""
    if (data.output && Array.isArray(data.output)) {
      for (const item of data.output) {
        if (item.type === "message" && item.content && Array.isArray(item.content)) {
          for (const contentItem of item.content) {
            if (contentItem.type === "output_text") {
              outputText = contentItem.text
              break
            }
          }
        }
        if (outputText) break
      }
    }

    if (!outputText) {
      throw new Error("Failed to extract AI response")
    }

    return NextResponse.json({ insight: outputText.trim() })
  } catch (error) {
    console.error("AI Insight error:", error)
    return NextResponse.json({ 
      insight: "继续保持良好的饮水习惯，适量饮水有益健康！" 
    })
  }
}
