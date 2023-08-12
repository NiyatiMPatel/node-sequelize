import { Sequelize } from 'sequelize';
import sequelize from '../util/sqldatabase';

const User = sequelize.define('user', {
 id: {
  type: Sequelize.INTEGER,
  allowNull: false,
  autoIncrement: true,
  primaryKey: true,
 },
 name: {
  type: Sequelize.STRING,
  allowNull: false
 },
 email: {
  type: Sequelize.STRING,
  allowNull: false
 },
});

export default User;