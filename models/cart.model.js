import { Sequelize } from 'sequelize';
import sequelize from '../util/sqldatabase';

// IN-BETWEEN TABLE  BETWEEN USER TO WHICH THE CART BELONGS AND MULTIPLE PRODUCTS
const Cart = sequelize.define('cart', {
 id: {
  type: Sequelize.INTEGER,
  allowNull: false,
  autoIncrement: true,
  primaryKey: true,
 },

});

export default Cart;