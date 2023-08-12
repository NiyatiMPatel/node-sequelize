import express from 'express';
import {
 getShopIndexProducts, getShopProducts, getCart, getCheckout, getOrders, getShopSingleProduct, postCart, deleteCartItem, postOrders
} from '../controllers/customer.controller';


const router = express.Router()


// GET SHOP INDEX/ FIRST PAGE
router.get('/', getShopIndexProducts);

// GET SHOP PRODUCTS LIST PAGE
router.get('/products', getShopProducts);

// GET SHOP SINGLE PRODUCTDETAIL PAGE
router.get('/product/:id', getShopSingleProduct);

// POST SHOP ITEM/PRODUCT TO CART 
router.post('/cart', postCart);

// GET SHOP CART PAGE
router.get('/cart', getCart);

// POST SHOP ITEM/PRODUCT TO CART 
router.post('/cart-delete-item', deleteCartItem);

// GET SHOP ORDER PAGE
router.get('/orders', getOrders);

// POST SHOP ORDER
router.post('/create-order', postOrders);


export default router;