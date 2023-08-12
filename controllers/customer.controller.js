import Product from "../models/product.model";

// SHOP GET INDEX
export const getShopIndexProducts = (req, res, next) => {
 Product.findAll().then(prod => {
  res.render('customer/index', {
   prods: prod,
   pageTitle: 'Shop',
   path: '/',
  });
 }).catch(err => {
  console.log("🚀 ~ file: customer.controller.js:10 ~ Product.findAll ~ err:", err)
 })

}

// SHOP GET PRODUCTS
export const getShopProducts = (req, res, next) => {
 Product.findAll().then((prod) => {
  res.render('customer/products-list', {
   prods: prod,
   pageTitle: 'Products',
   path: '/products',
  });
 }).catch(err => {
  console.log("🚀 ~ file: customer.controller.js:25 ~ fetchAllProducts ~ err:", err)
 });
}

// SHOP GET SINGLE PRODUCT
export const getShopSingleProduct = (req, res, next) => {
 const { id } = req.params
 Product.findByPk(id).then((prod) => {
  res.render('customer/product-detail', {
   prods: prod,
   pageTitle: prod.title,
   path: '/products',  // FOR NAVIGATION MENU ITEMS TOBE HIGHLIGHTED/SHOWN ACTIVE
  });
 }).catch(err => {
  console.log("🚀 ~ file: customer.controller.js:42 ~ fetchSingleProduct ~ err:", err)
 });
}

// ================================================================ //

// POST SHOP ITEM/PRODUCT TO CART 
export const postCart = async (req, res, next) => {
 const { productId } = req.body;
 let fetchedCart;
 let newQuantity = 1;
 // GET THE CART ASSOCIATED TO EXISTING USER 
 req.user.getCart().then(cart => {
  // SAVE THE EXISTING CART IN fetchedCart TO BE ACCESSED TO ADD NEW PRODUCT OR UPDATE EXISTING PRODUCT IN CART
  fetchedCart = cart
  // FETCH THE PRODUCTS OF THE EXISTING CART AND CHECK IF THE PRODUCT IS ALREADY PART OF THE CART
  return cart.getProducts({ where: { id: productId } }) // ALWAYS RETURNS ARRAY WITH THE ELEMENT OF INTEREST AT INDEX 0
 }).then(products => {
  let product;
  if (products.length > 0) {
   product = products[0]; // SAVING PRODUCT OF INTEREST IN A VARIABLE
  }
  // IF PRODUCT ALREADY EXISTS IN CART GET ITS QUANTITY AND INCREASE THE QUANTITY BY 1
  if (product) {
   const oldQuantity = product.cartItem.quantity;
   newQuantity = oldQuantity + 1;
   return product
  }
  // IF PRODUCT DOESNT EXIST IN CART FIND THE PRODUCT FROM PRODUCTS TABLE AND RETURN IT
  return Product.findByPk(productId)
 }).then(product => {
  // ADD THE PRODUCT WITH UPDATED QUANTITY OR NEW PRODUCT ALONG WITH QUANTITY IN CART
  return fetchedCart.addProduct(product, { through: { quantity: newQuantity } })
 }).then(() => {
  // REDIRECT USERS TO CART PAGE AFTER SUCCESSFULLY ADDING/UPDATING PRODUCT TO CART
  res.redirect('/cart')
 }).catch(err => {
  console.log("🚀 ~ file: customer.controller.js:56 ~ req.user.getCart ~ err:", err)
 })
}

// SHOP GET CART
export const getCart = async (req, res, next) => {
 try {
  // GET THE CART ASSOCIATED TO EXISTING USER 
  const cartData = await req.user.getCart();
  // FETCH PRODUCTS THAT ARE INSIDE OF THE CART TO RENDER
  const products = await cartData.getProducts();
  res.render('customer/cart', {
   path: '/cart',
   pageTitle: 'Cart',
   prods: products
  });
 } catch (error) {
  console.log("🚀 ~ file: customer.controller.js:65 ~ getCart ~ error:", error)
 }
}

// DELETE CART ITEM
export const deleteCartItem = (req, res, next) => {
 const { productId } = req.body;
 // FETCH THE CART ASSOCIATED TO USER
 req.user.getCart().then(cart => {
  // FETCH THE PRODUCT FROM THE CART WHOSE ID === productId
  return cart.getProducts({ where: { id: productId } }) // ALWAYS RETURNS ARRAY HOLDING DATA AND METADAT
 }).then(products => {
  // EXTRACTING REQUIRED PRODUCT DATA
  const product = products[0];
  // DELETE THE PRODUCT FROM CARTITEM TABLE BUT NOT FROM PRODUCTS TABLE
  if (product.cartItem.quantity <= 1) {
   // REMOVE THE ITEM FROM CART IF QUANTITY = 1
   return product.cartItem.destroy();
  } else {
   // DECREASE THE QUANTITY OF ITEM IN CART BY 1 IF QUANTITY > 1 
   product.cartItem.quantity--
   return product.cartItem.save()
  }
 }).then(result => {
  // REDIRECT AFTER SUCCESSFULLY DELETING THE PRODUCT IN CARTITEM
  res.redirect('/cart')
 }).catch(err => {
  console.log("🚀 ~ file: customer.controller.js:106 ~ req.user.getCart ~ err:", err)
 })
}

// ================================================================ //

// SHOP POST ORDERS - TAKE ALL CART ITEMS AND MOVE THEM INTO ORDERS
export const postOrders = (req, res, next) => {
 let fetchedCart;
 // GET ALL THE USER ASSOCIATED CART ITEMS
 req.user.getCart().then(cart => {
  fetchedCart = cart;
  // GET ALL THE PRODUCTS THAT ARE IN THE CART
  return cart.getProducts()
 }).then(
  // RECEIVED ACCESS TO PRODUCTS ARRAY HOLDING PRODUCT WITH CARTITEM ARRAY 
  products => {
   // MOVE THE PRODUCTS INTO NEWLY CREATED ORDER - CREATE ORDER ASSOCIATED TO A USER
   // NEED TO ASSOCIATE PRODUCTS TO THE CREATED ORDER
   return req.user.createOrder().then(
    // RECEIVED ACCESS TO CREATED ORDER
    order => {
     // ASSOCIATE PRODUCTS ALONG WITH THE QUANTITY TO THAT CREATED ORDER
     return order.addProducts(products.map(product => {
      product.orderItem = { quantity: product.cartItem.quantity }
      return product;
     }))
    }
   ).catch(err => {
    console.log("🚀 ~ file: customer.controller.js:147 ~ returnreq.user.createOrder ~ err:", err)
   });
  }).then(result => {
   // ONCE THE ORDERS IS CREATED AND ITEMS ARE MOVED FROM CART TO ORDERS - NEED TO CLEAR THE CART
   return fetchedCart.setProducts(null);
  }).then(result => {
   res.redirect('/orders')
  }).catch(err => {
   console.log("🚀 ~ file: customer.controller.js:139 ~ req.user.getCart ~ err:", err)
  })
}

// SHOP GET ORDERS
export const getOrders = (req, res, next) => {
 // GET THE USER ASSOCIATED ORDERS; *ALSO GET ALL RELATED PRODUCTS ALREADY AND RETURN 1 ARRAY OF ORDERS THAT ALSO INCLUSES PRODUCT PER ORDER === {include: [' ']}*
 req.user.getOrders({ include: ['products'] }).then(orders => {
  res.render('customer/orders', {
   orders: orders,
   pageTitle: 'Orders',
   path: '/orders',
  })
 }).catch(err => {
  console.log("🚀 ~ file: customer.controller.js:166 ~ req.user.getOrders ~ err:", err)
 })
}

