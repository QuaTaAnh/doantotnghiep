import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'connectHousingDB', 
  process.env.DB_USER || 'root', 
  process.env.DB_PASSWORD || '17102002', 
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
  }
);

const connectDB = async () =>{
    try {
        await sequelize.authenticate();
        console.log('Connect successfully.');
      } catch (error) {
        console.error('Error: ', error);
      }
}

export default connectDB