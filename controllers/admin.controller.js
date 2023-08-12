import Product from "../models/product.model";

// CAN USE SAME FILE (add-product.ejs OR edit-product.ejs) TO DO BOTH ADD AND EDIT PRODUCT 

// ADMIN GET ADD PRODUCT FORM PAGE
export const getAdminAddProduct = (req, res, next) => {
 // res.render('admin/add-product', {
 res.render('admin/edit-product', {
  pageTitle: 'Add Product',
  path: '/admin/add-product',
  editing: false,
 });
}

// ADMIN POST ADD PRODUCT
export const postAdminAddProduct = (req, res, next) => {
 const { title, imageUrl, description, price } = req.body
 // Product.create({
 //  title,
 //  price,
 //  imageUrl,
 //  description,
 //  userId: req.user.id // MANUALLY ASSOCIATING A PRODUCT CREATION TO A USER CREATING THE PRODUCT
 // })
 req.user.createProduct({ // createProduct METHODE AUTOMATICALLY CREATED BY SEQUELIZE - createProduct BECAUSE THE MODEL IS NAMED 'product' - TO CREATE A NEW ASSOCIATED OBJECT
  title,
  price,
  imageUrl,
  description,
 }).then(result => {
  res.redirect('/admin/products')
 }).catch(err => {
  console.log("🚀 ~ file: admin.controller.js:19 ~ Product.create ~ err:", err)
 })
}

// ADMIN GET PRODUCTS
export const getAdminProducts = (req, res, next) => {
 // Product.findAll() // WITHOUT ASSOCIATION

 // ALL PRODUCTS FOR ASSOCIATED USER/ADMIN
 req.user.getProducts().then(prods => {
  res.render('admin/admin-products', {
   prods: prods,
   pageTitle: 'Admin-Products',
   path: '/admin/products',
  });
 }).catch(err => {
  console.log("🚀 ~ file: admin.controller.js:39 ~ Product.findAll ~ err:", err)
 });
}

// ADMIN GET EDIT PRODUCT FORM/PAGE
export const getEditAdminProduct = (req, res, next) => {
 const { id } = req.params
 const { edit } = req.query
 if (!edit) {
  return res.redirect('/admin/products');
 }
 // WITHOUT ASSOCIATION
 // Product.findByPk(id).then(prods => {
 //  res.render('admin/edit-product', {
 //   prods: prods,
 //   pageTitle: 'Edit Product',
 //   path: '/admin/edit-product',
 //   editing: edit,
 //  });
 // })
 // GET SINGLE PRODUCT ASSOCIATED TO AN USER/ADMIN
 req.user.getProducts({ where: { id: id } }) // RETURNS ARRAY EVEN IF IT HAS 1 ELEMENT
  .then(products => {
   const product = products[0]; // ELEMENT OF INTEREST WILL ALWAYS BE A INDEX 0
   if (!product) {
    return res.redirect('/admin/products');
   }
   res.render('admin/edit-product', {
    prods: product,
    pageTitle: 'Edit Product',
    path: '/admin/edit-product',
    editing: edit,
   });
  }).catch(err => {
   console.log("🚀 ~ file: admin.controller.js:51 ~ Product.findByPk ~ err:", err)
  })
}

// ADMIN POST UPDATE PRODUCT
export const postAdminUpdatedProduct = (req, res, next) => {
 const { title, imageUrl, price, description, productId } = req.body;
 // NO CHANGE REQUIRED FOR PRODUCT TO BE ASSOCIATED AS ASSOCIATED PRODUCT IS ALREADY RETRIEVED AND JUST UPDATED THE DETAILS
 Product.findByPk(productId).then(product => {
  product.title = title;
  product.imageUrl = imageUrl;
  product.price = price;
  product.description = description;
  return product.save()
 }).then(result => {
  res.redirect('/admin/products')
 }).catch(err => {
  console.log("🚀 ~ file: admin.controller.js:66 ~ Product.findByPk ~ err:", err)
 })
}

// ADMIN DELETE PRODUCT
export const deleteAdminProduct = (req, res, next) => {
 const { productId } = req.body;
 Product.findByPk(productId).then(prod => {
  return prod.destroy()
 }).then(result => {
  res.redirect('/admin/products')
 }).catch(err => {
  console.log("🚀 ~ file: admin.controller.js:82 ~ Product.findByPk ~ err:", err)
 })

}