const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/is-auth');
const ParkingZone = require('../models/parkingZone');

function isAdmin(req, res, next) {
    if (isAuth && req.user.role === 'admin') {
        return next();
    }
    res.redirect('/');
}

router.get('/create-parking', isAdmin, (req, res) => {
    res.render('parking/create-parking', {
        pageTitle: 'create Parking Zone',
        path: 'create',
        errorMessage: req.flash('uniqueName'),
        editing: false,
        editZone: false
    })
});

router.post('/create-parking', isAdmin, (req, res) => {
    const parkingName = req.body.parkingName;
    const parkingAddress = req.body.parkingAddress;
    const parkingPrice = req.body.parkingPrice;
    req.user.createParkingZone({
        name: parkingName,
        address: parkingAddress,
        hourlyPrice: parkingPrice,
        taken: 0,
    })
        .then(parkingZone => {
            res.redirect('/');
        })
        .catch(err => {
            if (err) {
                req.flash('uniqueName', 'please enter the fields, or try new name')
                return res.redirect('/create-parking')
            }
        });
});

router.get('/edit-parking/:id', (req, res, next) => {
    const id = req.params.id;
    req.user.getParkingZones({ where: { id: id } })
        .then(zone => {
            const num = zone[0].hourlyPrice
            res.render('parking/create-parking', {
                pageTitle: 'edit',
                path: 'edit',
                errorMessage: req.flash('uniqueName'),
                editZone: zone[0],
                number: num,
                editing: true
            })
        })
        .catch(err => {
            console.log(err);
        })
});

router.post('/delete-parking/:id', (req, res, next) => {
    const parkingZoneId = req.params.id;
    req.user.getParkingZones({ where: { id: parkingZoneId } })
        .then(zones => {
            const car = zones[0]
            return car.destroy();
        })
        .then(result => {
            res.redirect('/')
        })
        .catch(err => console.log(err))
})

router.post('/edit-parking', (req, res, next) => {
    const parkingId = req.body.parkingId;
    const parkingName = req.body.parkingName;
    const parkingAddress = req.body.parkingAddress;
    const parkingPrice = req.body.parkingPrice;

    req.user.getParkingZones({ where: { id: parkingId } })
        .then(zones => {
            let parkingZone = zones[0]
            parkingZone.name = parkingName;
            parkingZone.address = parkingAddress;
            parkingZone.hourlyPrice = parkingPrice;
            parkingZone.taken = 0;
            return parkingZone.save();
        })
        .then(result => {
            res.redirect('/')
        })
        .catch(err => {
            console.log(err)
        })
})

router.post('/take-parking/:id', (req, res, next) => {
    req.user.getCars()
        .then(cars => {
            if (cars.length > 0) {
                const parkingId = req.params.id;
                return ParkingZone.findAll({ where: { id: parkingId } })
            } else {
                return res.redirect('/admin/add-car')
            }
        })
        .then(zones => {
            let parkingZone = zones[0]
            if (parkingZone.taken || req.user.balance < parkingZone.hourlyPrice) {
                return res.redirect('/')
            }
            parkingZone.taken = 1;
            return parkingZone.save()
        })
        .then(result => {
            req.user.balance = req.user.balance - result.hourlyPrice
            return req.user.save()
        })
        .then(() => {
            res.redirect('/')
        })
        .catch(err => {
            console.log(err)
        })
})


module.exports = router;