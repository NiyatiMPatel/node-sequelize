import { Sequelize } from 'sequelize';
import sequelize from '../util/sqldatabase';

// EACH CART ITEM IS COMBINATION OF PRODUCT AND ID OF THE CART AND QUANTITY OF THE ITEM
const CartItem = sequelize.define('cartItem', {
 id: {
  type: Sequelize.INTEGER,
  allowNull: false,
  autoIncrement: true,
  primaryKey: true,
 },
 quantity: Sequelize.INTEGER
});

export default CartItem;