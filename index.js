import * as dotenv from "dotenv";

import express from 'express';
import path from 'path';

import bodyParser from 'body-parser';

import rootDir from './util/path';

import adminRoutes from './routes/admin.router';
import customerRoutes from './routes/customer.router';

import { get404 } from "./controllers/errors.controller";

// import db from './util/sqldatabase'
import sequelize from './util/sqldatabase'

import Product from "./models/product.model";
import User from "./models/user.model";
import Cart from "./models/cart.model";
import CartItem from "./models/cart-item.model";
import Order from "./models/order.model";
import OrderItem from "./models/order-item.model";

// =================================================== //
dotenv.config();

const app = express();

// create application/json parser
app.use(bodyParser.json())
// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }))

// =================================================== //
// INITIAL CHECK
// app.listen(process.env.PORT, () => {
//  return console.log("🚀 ~ file: index.js:9 ~ App listening on port:", process.env.PORT)
// })
// app.get('/', (req, res) => res.send('Hello World!'))

// SQL DATABASE CONNECTION TEST
// db.execute('SELECT * FROM products').then(result => {
//  console.log("🚀 ~ file: index.js:24 ~ db.execute ~ result:", result)
// }).catch(err => {
//  console.log("🚀 ~ file: index.js:26 ~ db.execute ~ err:", err)
// });

// =================================================== //

// TEMPLATING ENGINE EJS FOR VIEWS
app.set('view engine', 'ejs');
app.set('views', 'views');

// =================================================== //

// REGISTER COMMON MIDDLEWRE TO STORE USER IN REQUEST TO BE ACCESSED FROM ANYWHERE IN APP
app.use((req, res, next) => {
 // ACCESS DATABASE TO RETRIEVE USER (FOR NOW JUST DUMMY USER WITH ID=1)
 User.findByPk(1).then(user => {
  // STORE RETRIEVED USER (SEQUELIZED OBJECT) IN REQUEST - ADD NEW FIELD=USER IN REQ OBJECT; **USER BEING SEQUELIZED OBJECT WHEN ACCESSED FROM ANYWHERE IN APP CAN USE SEQUELIZE METHODS ON USER OBJECT**
  req.user = user;
  next();
 }).catch(err => {
  console.log("🚀 ~ file: index.js:57 ~ User.findByPk ~ err:", err)
 })
})

// =================================================== //

// SERVING FILES STATICALLY FOR STATIC FILES ONLY HAS READ ACCESS
app.use(express.static(path.join(rootDir, 'public')))

// ==================================================== //

// IMPORT ROUTES
app.use('/admin', adminRoutes);
app.use(customerRoutes);

// CATCH ALL ROUTES (404 ERROR)
app.use(get404);

// ================================================ //


// MODEL ASSOCIATION/RELATION (BIDIRECTIONAL) BEFORE SYNC ==> 

// PRODUCT BELONGS TO USER (A USER (ADMIN) CREATED THIS PRODUCT); IF THE USER IS DELETED ANY PRODUCT/S CREATED BY THAT USER WILL ALSO BE DELETED - THIS IS OPTIONAL
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' }); //ADDS UESERID (FK) IN PRODUCTS TABLE TO WHICH PRODUCT BELONGS

// A USER HAS MANY PRODUCTS (CREATES/ADDS MANY PRODUCTS TO THE SHOP)
User.hasMany(Product);

// =================== //

// A CART BELONGS TO USER AND A USER HAS ONLY ONE CART 
Cart.belongsTo(User) // ADDS USERID (FK) IN CARTS TABLE TO WHICH CART BELONGS
User.hasOne(Cart)

// =================== //

// BELONGSTOMANY ONLY WORKS WITH AN INTERMEDIATE TABLE THAT CONNECTS 2 TABLES WHICH BASICALLY STORES COMBINATION OF PRODUCT_IDs AND CART_IDs ==> { through:  } TELLING SEQUELIZE WHERE THESE CONNECTIONS SHOULD BE STORED 
// (FKS => PRODUCT_ID AND CART_ID IN CARTITEMS TABLE)

// SINGLE CART CAN HOLD MULTIPLE PRODUCTS
Cart.belongsToMany(Product, { through: CartItem });

// SINGLE PRODUCT CAN BE PART OF MULTIPLE DIFFERENT CARTS
Product.belongsToMany(Cart, { through: CartItem });

// ================== //

// A ORDER BELONGS TO USER AND A USER MAY HAVE MANY ORDERS
Order.belongsTo(User); //ADDS USERID (FK) IN ORDERS TABLE TO WHICH ORDER BELONGS
User.hasMany(Order);

// BELONGSTOMANY ONLY WORKS WITH AN INTERMEDIATE TABLE THAT CONNECTS 2 TABLES WHICH BASICALLY STORES COMBINATION OF PRODUCT_IDs AND ORDER_IDs ==> { through:  } TELLING SEQUELIZE WHERE THESE CONNECTIONS SHOULD BE STORED
// (FKS => PRODUCT_ID AND ORDER_IDs IN ORDERITEMS TABLE)

// SINGLE ORDER CAN HOLD MULTIPLE PRODUCTS
Order.belongsToMany(Product, { through: OrderItem });

// SINGLE PRODUCT CAN BE PART OF MULTIPLE DIFFERENT ORDERS
Product.belongsToMany(Order, { through: OrderItem });

// ========================================================= //

// TRANSFER MODELS INTO SQL TABLES OR GET A TABLE THAT BELONGS TO MODELS WHENEVER THE APPLICATION IS STARTED
// sequelize.sync({ force: true }) NOT USED FOR PRODUCTION ONLY FOR DEVELOPMENT
sequelize.sync().then(result => {
 // CHECK FOR A DUMMY USER WITH ID=1
 return User.findByPk(1)
 // console.log("🚀 ~ file: index.js:67 ~ sequelize.sync ~ result:", result)
}).then(user => {
 //  CREATE USER IF DOESNT EXIST 
 if (!user) {
  return User.create({ name: 'DummyUser', email: 'dummy@dummy.com' })
 }
 // ELSE RETURN FOUND USER
 return Promise.resolve(user);
}).then(user => {
 // CHECK IF THE CART EXISTS FOR THE USER
 return user.getCart().then(cart => {
  // CREATE CART FOR DEDICATED USER IF CART DOESNT EXISTS; THIS DOESNT HOLD ANY DATA IT JUST NEEDS TO BE PRESENT FOR EACH USER
  if (!cart) {
   return user.createCart();
  }
  // ELSE RETURN FOUND CART
  return cart;
 }).catch(err => {
  console.log("🚀 ~ file: index.js:126 ~ returnuser.getCart ~ err:", err)
 });
}).then(cart => {
 // console.log("🚀 ~ file: index.js:88 ~ sequelize.sync ~ user:", user)
 app.listen(process.env.PORT);
}).catch(err => {
 console.log("🚀 ~ file: index.js:67 ~ sequelize.sync ~ err:", err)
})
 // LOOKS AT ALL MODELS DEFINED. SYNCS MODELS TO DATABASE BY CREATING APPROPRIATE TABLES AND RELATIONS AS DEFINED ABOVE IF TABLES EXIST

// ================================================ //

