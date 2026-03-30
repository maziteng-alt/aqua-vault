const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User } = require('../models')
const auth = require('../middleware/auth')

const router = express.Router()

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body

    const existingUser = await User.findOne({
      where: { email },
    })

    if (existingUser) {
      return res.status(400).json({ message: '邮箱已被注册' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    })

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.status(201).json({
      message: '注册成功',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        dailyWaterGoal: user.dailyWaterGoal,
        dailyCaffeineLimit: user.dailyCaffeineLimit,
      },
    })
  } catch (error) {
    console.error('注册错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({
      where: { email },
    })

    if (!user) {
      return res.status(400).json({ message: '邮箱或密码错误' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(400).json({ message: '邮箱或密码错误' })
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.json({
      message: '登录成功',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        dailyWaterGoal: user.dailyWaterGoal,
        dailyCaffeineLimit: user.dailyCaffeineLimit,
      },
    })
  } catch (error) {
    console.error('登录错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] },
    })

    if (!user) {
      return res.status(404).json({ message: '用户不存在' })
    }

    res.json({ user })
  } catch (error) {
    console.error('获取用户信息错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

router.put('/me', auth, async (req, res) => {
  try {
    const { username, avatar, dailyWaterGoal, dailyCaffeineLimit } = req.body

    const user = await User.findByPk(req.userId)

    if (!user) {
      return res.status(404).json({ message: '用户不存在' })
    }

    await user.update({
      username: username || user.username,
      avatar: avatar !== undefined ? avatar : user.avatar,
      dailyWaterGoal: dailyWaterGoal || user.dailyWaterGoal,
      dailyCaffeineLimit: dailyCaffeineLimit || user.dailyCaffeineLimit,
    })

    const updatedUser = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] },
    })

    res.json({ message: '更新成功', user: updatedUser })
  } catch (error) {
    console.error('更新用户信息错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

module.exports = router
