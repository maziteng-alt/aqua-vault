const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const DrinkRecord = sequelize.define('DrinkRecord', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '饮品名称',
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '品牌',
  },
  volume: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '容量（毫升）',
  },
  calories: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '热量（千卡）',
  },
  caffeine: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '咖啡因（毫克）',
  },
  sugar: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    comment: '糖分（克）',
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '类别：水、咖啡、茶、饮料等',
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '图标emoji',
  },
  accentColor: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '主题色',
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '备注',
  },
  drinkTime: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: '饮用时间',
  },
}, {
  tableName: 'drink_records',
  timestamps: true,
  indexes: [
    {
      fields: ['userId'],
    },
    {
      fields: ['drinkTime'],
    },
  ],
})

module.exports = DrinkRecord
