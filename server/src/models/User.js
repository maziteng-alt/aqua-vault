const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dailyWaterGoal: {
    type: DataTypes.INTEGER,
    defaultValue: 2000,
    comment: '每日饮水目标（毫升）',
  },
  dailyCaffeineLimit: {
    type: DataTypes.INTEGER,
    defaultValue: 400,
    comment: '每日咖啡因上限（毫克）',
  },
}, {
  tableName: 'users',
  timestamps: true,
})

module.exports = User
