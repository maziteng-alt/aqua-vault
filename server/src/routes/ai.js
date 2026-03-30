const express = require('express')
const axios = require('axios')
const { DrinkRecord } = require('../models')
const auth = require('../middleware/auth')

const router = express.Router()

router.post('/analyze', auth, async (req, res) => {
  try {
    const { days = 7 } = req.body

    const today = new Date()
    const startDate = new Date(today)
    startDate.setDate(startDate.getDate() - days)

    const records = await DrinkRecord.findAll({
      where: {
        userId: req.userId,
        drinkTime: {
          [require('sequelize').Op.gte]: startDate,
          [require('sequelize').Op.lte]: today,
        },
      },
      order: [['drinkTime', 'DESC']],
    })

    const stats = records.reduce(
      (acc, record) => ({
        totalVolume: acc.totalVolume + record.volume,
        totalCaffeine: acc.totalCaffeine + record.caffeine,
        totalSugar: acc.totalSugar + record.sugar,
        totalCalories: acc.totalCalories + record.calories,
        count: acc.count + 1,
        categories: {
          ...acc.categories,
          [record.category]: (acc.categories[record.category] || 0) + 1,
        },
      }),
      { totalVolume: 0, totalCaffeine: 0, totalSugar: 0, totalCalories: 0, count: 0, categories: {} }
    )

    const mockAIResponse = generateMockInsights(stats, days)

    res.json({
      analysis: mockAIResponse,
      stats,
      recordCount: records.length,
    })
  } catch (error) {
    console.error('AI分析错误:', error)
    res.status(500).json({ message: 'AI分析失败' })
  }
})

router.post('/scan', auth, async (req, res) => {
  try {
    const { imageBase64 } = req.body

    if (!imageBase64) {
      return res.status(400).json({ message: '请提供图片' })
    }

    const mockScanResult = {
      name: '美式咖啡',
      brand: '星巴克',
      volume: 350,
      calories: 15,
      caffeine: 150,
      sugar: 0,
      category: '咖啡',
      icon: '☕',
      accentColor: '#f97316',
      confidence: 0.95,
    }

    res.json({
      message: '扫描成功',
      drink: mockScanResult,
    })
  } catch (error) {
    console.error('AI扫描错误:', error)
    res.status(500).json({ message: '扫描识别失败' })
  }
})

function generateMockInsights(stats, days) {
  const insights = []

  if (stats.count > 0) {
    insights.push({
      type: 'positive',
      title: '饮水习惯良好',
      body: `过去${days}天你记录了${stats.count}次饮品，平均每天${(stats.count / days).toFixed(1)}次。`,
      icon: '💧',
      tag: '继续保持',
      tagBg: 'linear-gradient(135deg, #10b981, #059669)',
      tagColor: '#ffffff',
      accent: '#10b981',
    })
  }

  if (stats.totalCaffeine > 0) {
    const avgCaffeine = Math.round(stats.totalCaffeine / stats.count)
    insights.push({
      type: 'warning',
      title: '咖啡因提醒',
      body: `平均每次摄入${avgCaffeine}mg咖啡因。建议下午3点后减少摄入，避免影响睡眠。`,
      icon: '☕',
      tag: '注意控制',
      tagBg: 'linear-gradient(135deg, #f97316, #ea580c)',
      tagColor: '#ffffff',
      accent: '#f97316',
    })
  }

  if (stats.totalSugar > 0) {
    insights.push({
      type: 'suggestion',
      title: '糖分建议',
      body: `尝试选择无糖或低糖饮品，比如绿茶、黑咖啡或纯净水，对健康更有益。`,
      icon: '🍃',
      tag: '健康建议',
      tagBg: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      tagColor: '#ffffff',
      accent: '#3b82f6',
    })
  }

  return insights
}

module.exports = router
