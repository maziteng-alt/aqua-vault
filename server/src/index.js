const express = require('express')
const cors = require('cors')
require('dotenv').config()

const { sequelize } = require('./models')
const authRoutes = require('./routes/auth')
const drinkRecordRoutes = require('./routes/drink-records')
const cupRoutes = require('./routes/cups')
const aiRoutes = require('./routes/ai')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/drink-records', drinkRecordRoutes)
app.use('/api/cups', cupRoutes)
app.use('/api/ai', aiRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Aqua Vault API is running' })
})

const startServer = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ 数据库连接成功')

    await sequelize.sync({ alter: true })
    console.log('✅ 数据库模型同步成功')

    app.listen(PORT, () => {
      console.log(`🚀 服务器运行在 http://localhost:${PORT}`)
      console.log(`📊 健康检查: http://localhost:${PORT}/api/health`)
    })
  } catch (error) {
    console.error('❌ 服务器启动失败:', error)
    process.exit(1)
  }
}

startServer()
