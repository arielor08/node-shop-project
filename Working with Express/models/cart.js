const fs = require('fs');
const path = require('path');

const cartFile = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);

module.exports = class Cart {
  static addProduct(id, productPrice) {
    //Fetch the previous cart
    fs.readFile(cartFile, (err, fileContet) => {
      let cart = { products: [], totalPrice: 0 };

      if (!err) {
        cart = JSON.parse(fileContet);
      }

      //Analyze the cart => find existing products
      const existingProduct = cart.products.find((prod) => prod.id === id);

      let updatedProduct;

      //Add new product/ increase quantity
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.quantity = updatedProduct.quantity + 1;
        cart.products = [updatedProduct];
      } else {
        updatedProduct = { id: id, quantity: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(cartFile, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(cartFile, (err, fileContet) => {
      if (err) {
        return;
      }
      const updatedCart = { ...JSON.parse(fileContet) };
      const product = updatedCart.products.find((prod) => prod.id === id);
      if (!product) {
        return;
      }
      const quantity = product.quantity;
      updatedCart.products = updatedCart.products.filter(
        (prod) => prod.id !== id
      );
      updatedCart.totalPrice = updatedCart.totalPrice - productPrice * quantity;
      fs.writeFile(cartFile, JSON.stringify(updatedCart), (err) => {
        console.log(err);
      });
    });
  }

  static getCart(cb) {
    fs.readFile(cartFile, (err, fileContet) => {
      if (err) {
        cb(null);
      } else {
        cb(JSON.parse(fileContet));
      }
    });
  }
};
