const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Car = require('./models/car');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');
const ParkingZone = require('./models/parkingZone');
const csrf = require('csurf');
const flash = require('connect-flash');

const session = require('express-session')
const SequelizeStore = require('express-session-sequelize')(session.Store)

const sessionStore = new SequelizeStore({
  db: sequelize,
});

const csrfProtection = csrf();

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const parkingRoutes = require('./routes/parking');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'your secret key',
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}));
app.use(csrfProtection)
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next()
  }
  User.findByPk(req.session.user.id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  if(req.user) {
    res.locals.isAdmin = req.user.role
    res.locals.balance = req.user.balance;
    res.locals.timer = setTimeout(() => {
      console.log('One hour has passed. Timer stopped.');
    }, 3600000); 
  }
  next()
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(parkingRoutes);

app.use(errorController.get404);

Car.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Car);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Car, { through: CartItem });
Car.belongsToMany(Cart, { through: CartItem });

User.hasMany(Order);

Order.belongsToMany(Car, { through: OrderItem });
Car.belongsToMany(Order, { through: OrderItem });

User.hasMany(ParkingZone, { foreignKey: 'adminId' });
ParkingZone.belongsTo(User, { foreignKey: 'adminId' });


sequelize
  .sync()
  .then(cart => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
