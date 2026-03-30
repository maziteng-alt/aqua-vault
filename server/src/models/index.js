const sequelize = require('../config/database')
const User = require('./User')
const DrinkRecord = require('./DrinkRecord')
const Cup = require('./Cup')

User.hasMany(DrinkRecord, { foreignKey: 'userId', onDelete: 'CASCADE' })
DrinkRecord.belongsTo(User, { foreignKey: 'userId' })

User.hasMany(Cup, { foreignKey: 'userId', onDelete: 'CASCADE' })
Cup.belongsTo(User, { foreignKey: 'userId' })

module.exports = {
  sequelize,
  User,
  DrinkRecord,
  Cup,
}
