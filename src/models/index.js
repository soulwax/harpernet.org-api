const sequelize = require('../config/database');
const QuizResult = require('./QuizResult');

const models = {
  QuizResult
};

// Sync database
const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Sync models with database
    await sequelize.sync({ 
      alter: process.env.NODE_ENV === 'development',
      force: false // Never drop tables in production
    });
    console.log('✅ Database synchronized successfully.');
    
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  ...models,
  syncDatabase
};