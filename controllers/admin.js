exports.getAddCar = (req, res, next) => {
  res.render("admin/edit-car", {
    pageTitle: "Add Car",
    path: "/admin/add-car",
    editing: false,
  });
};

exports.postAddCar = (req, res, next) => {
  const carName = req.body.carName;
  const carNumber = req.body.carNumber;
  const carType = req.body.carType;
  req.user.createCar({
    carName: carName,
    carNumber: carNumber,
    carType: carType
  })
    .then(result => {
      res.redirect('/admin/cars')
    }).catch(err => {
      console.log(err);
    });
};

exports.getEditCar = (req, res, next) => {
  const editMode = req.query.edit
  if (!editMode) {
    return res.redirect('/')
  };
  const carId = req.params.carId;

  req.user
    .getCars({ where: { id: carId } })
    .then(cars => {
      const car = cars[0]
      if (!car) {
        return res.redirect('/');
      }
      res.render("admin/edit-car", {
        pageTitle: "Edit Car",
        path: "/admin/cars",
        editing: editMode,
        car: car,
      });
    })
    .catch(err => {
      console.log(err);
    })
};

exports.postEditCars = (req, res, next) => {
  const carId = req.body.carId;
  const updatedCarName = req.body.carName;
  const updatedCarNumber = req.body.carNumber;
  const updatedCarType = req.body.carType;
  req.user.getCars({ where: { id: carId } })
    .then(cars => {
      let car = cars[0]
      car.carName = updatedCarName;
      car.carNumber = updatedCarNumber;
      car.carType = updatedCarType;
      return car.save();
    })
    .then(result => {
      res.redirect('/admin/cars')
    })
    .catch(err => {
      console.log(err)
    })
};

exports.getCars = (req, res, next) => {
  req.user
    .getCars()
    .then(cars => {
      res.render('admin/cars', {
        cars: cars,
        pageTitle: 'My Cars',
        path: "/admin/cars",
      });
    })
    .catch(err => {
      console.log(err);
    })
};

exports.postDeleteCar = (req, res, next) => {
  const carId = req.body.carId;
  req.user.getCars({ where: { id: carId } })
    .then(cars => {
      const car = cars[0]
      return car.destroy();
    })
    .then(result => {
      res.redirect('/admin/cars')
    })
    .catch(err => console.log(err))
};


