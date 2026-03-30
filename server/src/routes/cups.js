const express = require('express')
const { Cup } = require('../models')
const auth = require('../middleware/auth')

const router = express.Router()

router.get('/', auth, async (req, res) => {
  try {
    const cups = await Cup.findAll({
      where: { userId: req.userId },
      order: [['isFavorite', 'DESC'], ['useCount', 'DESC']],
    })

    res.json({ cups })
  } catch (error) {
    console.error('获取杯子列表错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

router.get('/favorites', auth, async (req, res) => {
  try {
    const cups = await Cup.findAll({
      where: { userId: req.userId, isFavorite: true },
      order: [['useCount', 'DESC']],
    })

    res.json({ cups })
  } catch (error) {
    console.error('获取常用杯子错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

router.get('/:id', auth, async (req, res) => {
  try {
    const cup = await Cup.findOne({
      where: { id: req.params.id, userId: req.userId },
    })

    if (!cup) {
      return res.status(404).json({ message: '杯子不存在' })
    }

    res.json({ cup })
  } catch (error) {
    console.error('获取杯子详情错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

router.post('/', auth, async (req, res) => {
  try {
    const { name, capacity, icon, accentColor, backgroundColor, isFavorite } = req.body

    const cup = await Cup.create({
      userId: req.userId,
      name,
      capacity,
      icon,
      accentColor,
      backgroundColor,
      isFavorite: isFavorite || false,
    })

    res.status(201).json({
      message: '添加成功',
      cup,
    })
  } catch (error) {
    console.error('添加杯子错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

router.put('/:id', auth, async (req, res) => {
  try {
    const { name, capacity, icon, accentColor, backgroundColor, isFavorite } = req.body

    const cup = await Cup.findOne({
      where: { id: req.params.id, userId: req.userId },
    })

    if (!cup) {
      return res.status(404).json({ message: '杯子不存在' })
    }

    await cup.update({
      name: name || cup.name,
      capacity: capacity || cup.capacity,
      icon: icon !== undefined ? icon : cup.icon,
      accentColor: accentColor !== undefined ? accentColor : cup.accentColor,
      backgroundColor: backgroundColor !== undefined ? backgroundColor : cup.backgroundColor,
      isFavorite: isFavorite !== undefined ? isFavorite : cup.isFavorite,
    })

    res.json({
      message: '更新成功',
      cup,
    })
  } catch (error) {
    console.error('更新杯子错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    const cup = await Cup.findOne({
      where: { id: req.params.id, userId: req.userId },
    })

    if (!cup) {
      return res.status(404).json({ message: '杯子不存在' })
    }

    await cup.destroy()

    res.json({ message: '删除成功' })
  } catch (error) {
    console.error('删除杯子错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

module.exports = router
