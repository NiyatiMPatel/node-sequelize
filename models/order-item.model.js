import { Sequelize } from 'sequelize';
import sequelize from '../util/sqldatabase';

// EACH ORDER ITEM IS COMBINATION OF PRODUCT AND ID OF THE ORDER AND QUANTITY OF THE ITEM
const OrderItem = sequelize.define('orderItem', {
 id: {
  type: Sequelize.INTEGER,
  allowNull: false,
  autoIncrement: true,
  primaryKey: true,
 },
 quantity: Sequelize.INTEGER
});

export default OrderItem;