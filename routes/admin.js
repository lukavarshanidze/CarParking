const express = require("express");

const adminController = require("../controllers/admin");
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get("/add-car", isAuth, adminController.getAddCar);

router.get("/cars", isAuth, adminController.getCars);

router.post("/add-car", isAuth, adminController.postAddCar);

router.get("/edit-car/:carId", isAuth, adminController.getEditCar);

router.post('/edit-car', isAuth, adminController.postEditCars);

router.post('/delete-car', isAuth, adminController.postDeleteCar)


module.exports = router;



