import { Sequelize } from 'sequelize';
import sequelize from '../util/sqldatabase';

// IN-BETWEEN TABLE  BETWEEN USER TO WHICH THE ORDER BELONGS AND MULTIPLE PRODUCTS
const Order = sequelize.define('order', {
 id: {
  type: Sequelize.INTEGER,
  allowNull: false,
  autoIncrement: true,
  primaryKey: true,
 },
});

export default Order;