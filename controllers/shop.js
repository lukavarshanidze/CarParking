const Car = require('../models/car');
const ParkingZone = require('../models/parkingZone');

exports.getProducts = (req, res) => {
  Car.findAll()
    .then(cars => {
      res.render('shop/product-list', {
        prods: cars,
        pageTitle: 'All Products',
        path: "/products",
      });
    })
    .catch(err => {
      console.log(err);
    })

};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Car.findByPk(prodId)
    .then((car) => {
      res.render('shop/product-detail', {
        product: car,
        pageTitle: 'Edit Text',
        path: "/products",
      })
    });
};

exports.getIndex = (req, res, next) => {
  ParkingZone.findAll()
    .then(parkingZones => {
      res.render('shop/index', {
        prods: parkingZones,
        pageTitle: 'Shop',
        path: "/",
      });
    })
    .catch(err => {
      console.log(err);
    })
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(cart => {
      return cart.getCars()
    })
    .then(cars => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cars,
      });
    })
    .catch(err => {
      console.log(err);
    })

};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  const prodPrice = req.body.productPrice;
  let newQuantity = 1;
  let fetchedCart;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getCars({ where: { id: prodId } })
    })
    .then(cars => {
      let car;
      if (cars.length > 0) {
        car = cars[0]
      }
      if (car) {
        const oldQuantity = car.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return car
      }
      return Car.findByPk(prodId)
    })
    .then(car => {
      return fetchedCart.addCar(car, {
        through: { quantity: newQuantity }
      })
    })
    .then(() => {
      res.redirect('/cart')
    })
    .catch(err => {
      console.log(err);
    })
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then(cart => {
      return cart.getCars({ where: { id: prodId } })
    })
    .then(cars => {
      const car = cars[0]
      return car.cartItem.destroy();
    })
    .then(result => {
      res.redirect('/cart')
    })
    .catch(err => {
      console.log(err);
    })
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart
      return cart.getCars()
    })
    .then(cars => {
      return req.user
        .createOrder()
        .then(order => {
          return order.addCar(cars.map(car => {
            car.orderItem = { quantity: car.cartItem.quantity }
            return car
          }))
        })
        .catch(err => console.log(err))
    })
    .then(result => {
      return fetchedCart.setCars(null)
    })
    .then(result => {
      res.redirect('/orders')
    })
    .catch()
};

exports.getOrders = (req, res, next) => {
  req.user.getOrders({ include: ['products'] })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
      });
    })
    .catch(err => {
      console.log(err);
    })
};


