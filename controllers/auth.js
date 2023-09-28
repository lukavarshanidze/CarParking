const bcrypt = require('bcryptjs')

const User = require("../models/user");

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: req.flash('key')
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ where: { email: email } })
        .then(user => {
            if (!user) {
                req.flash('key', 'Invalid email or password.');
                return res.redirect('/login')
            }
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return res.redirect('/')
                    }
                    req.flash('key', 'Invalid email or password.');
                    res.redirect('/login')
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/login')
                })

        })
        .catch(err => console.log(err));
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: req.flash('key')
    })
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const role = req.body.role;
    console.log('roleee', role);
    User.findOne({ where: { email: email } })
        .then(userDoc => {
            if (userDoc) {
                req.flash('key', 'E-Mail already exists, please pick a different one');
                return res.redirect('/signup')
            }
            return bcrypt
                .hash(password, 12)
                .then(hasedPassword => {
                    return User.create({
                        email: email,
                        password: hasedPassword,
                        balance: 100,
                        role: role
                    })
                })
                .then(user => {
                    return user.createCart();
                })
                .then(() => {
                    res.redirect('/login')
                })
        })
        .catch(err => {
            console.log(err);
        })
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        res.redirect('/')
    });
};

