import { Sequelize } from 'sequelize';
import sequelize from '../util/sqldatabase';

const Product = sequelize.define('product', {
 id: {
  type: Sequelize.INTEGER,
  allowNull: false,
  autoIncrement: true,
  primaryKey: true,
 },
 title: {
  type: Sequelize.STRING,
  allowNull: false
 },
 price: {
  type: Sequelize.DOUBLE,
  allowNull: false
 },
 description: {
  type: Sequelize.STRING,
  allowNull: false
 },
 imageUrl: {
  type: Sequelize.STRING,
  allowNull: false
 },
});

export default Product;