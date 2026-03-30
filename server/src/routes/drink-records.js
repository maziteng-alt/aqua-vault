const express = require('express')
const { Op } = require('sequelize')
const { DrinkRecord } = require('../models')
const auth = require('../middleware/auth')

const router = express.Router()

router.get('/', auth, async (req, res) => {
  try {
    const { startDate, endDate, category, limit = 50, offset = 0 } = req.query

    const where = { userId: req.userId }

    if (startDate || endDate) {
      where.drinkTime = {}
      if (startDate) where.drinkTime[Op.gte] = new Date(startDate)
      if (endDate) where.drinkTime[Op.lte] = new Date(endDate)
    }

    if (category) {
      where.category = category
    }

    const records = await DrinkRecord.findAndCountAll({
      where,
      order: [['drinkTime', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    })

    res.json({
      records: records.rows,
      total: records.count,
    })
  } catch (error) {
    console.error('获取饮品记录错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

router.get('/today', auth, async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const records = await DrinkRecord.findAll({
      where: {
        userId: req.userId,
        drinkTime: {
          [Op.gte]: today,
          [Op.lt]: tomorrow,
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
      }),
      { totalVolume: 0, totalCaffeine: 0, totalSugar: 0, totalCalories: 0 }
    )

    res.json({ records, stats })
  } catch (error) {
    console.error('获取今日饮品记录错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

router.get('/:id', auth, async (req, res) => {
  try {
    const record = await DrinkRecord.findOne({
      where: { id: req.params.id, userId: req.userId },
    })

    if (!record) {
      return res.status(404).json({ message: '记录不存在' })
    }

    res.json({ record })
  } catch (error) {
    console.error('获取饮品记录详情错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

router.post('/', auth, async (req, res) => {
  try {
    const { name, brand, volume, calories, caffeine, sugar, category, icon, accentColor, note, drinkTime } = req.body

    const record = await DrinkRecord.create({
      userId: req.userId,
      name,
      brand,
      volume,
      calories: calories || 0,
      caffeine: caffeine || 0,
      sugar: sugar || 0,
      category,
      icon,
      accentColor,
      note,
      drinkTime: drinkTime || new Date(),
    })

    res.status(201).json({
      message: '添加成功',
      record,
    })
  } catch (error) {
    console.error('添加饮品记录错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

router.put('/:id', auth, async (req, res) => {
  try {
    const { name, brand, volume, calories, caffeine, sugar, category, icon, accentColor, note, drinkTime } = req.body

    const record = await DrinkRecord.findOne({
      where: { id: req.params.id, userId: req.userId },
    })

    if (!record) {
      return res.status(404).json({ message: '记录不存在' })
    }

    await record.update({
      name: name || record.name,
      brand: brand !== undefined ? brand : record.brand,
      volume: volume || record.volume,
      calories: calories !== undefined ? calories : record.calories,
      caffeine: caffeine !== undefined ? caffeine : record.caffeine,
      sugar: sugar !== undefined ? sugar : record.sugar,
      category: category || record.category,
      icon: icon !== undefined ? icon : record.icon,
      accentColor: accentColor !== undefined ? accentColor : record.accentColor,
      note: note !== undefined ? note : record.note,
      drinkTime: drinkTime || record.drinkTime,
    })

    res.json({
      message: '更新成功',
      record,
    })
  } catch (error) {
    console.error('更新饮品记录错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    const record = await DrinkRecord.findOne({
      where: { id: req.params.id, userId: req.userId },
    })

    if (!record) {
      return res.status(404).json({ message: '记录不存在' })
    }

    await record.destroy()

    res.json({ message: '删除成功' })
  } catch (error) {
    console.error('删除饮品记录错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

module.exports = router
