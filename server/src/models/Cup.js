const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Cup = sequelize.define('Cup', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '杯子名称',
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '容量（毫升）',
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
  backgroundColor: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '背景色',
  },
  isFavorite: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: '是否常用',
  },
  useCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '使用次数',
  },
}, {
  tableName: 'cups',
  timestamps: true,
  indexes: [
    {
      fields: ['userId'],
    },
  ],
})

module.exports = Cup
