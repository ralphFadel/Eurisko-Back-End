const { Error } = require('mongoose');
const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport')
const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key: ''
    }

}));

exports.signUp = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation Failed!');
        error.statusCode=422;
        throw error;
    }
    const name= req.body.name;
    const email= req.body.email;
    const password= req.body.password;
    bcrypt
    .hash(password, 12)
    .then(hashedPass =>{
        const user = new User({
            name: name,
            email: email,
            password: hashedPass
        });
        user.save()
        .then(result => {
            res.status(201).json({
                message: 'sign up successful, kindly login to access more actions and Please check ur email.',
            });
            return transporter.sendMail({
                to: email,
                from: 'noteApp@gmail.com',
                subject: 'Successful SignUp',
                html: '<h2>Thank You for Signing Up, Welcome to the world of Notes!</h2>'
            }).
            catch(err => {
                console.log(err);
            });
        }).
        catch(err => {
            console.log(err);
        });
    })
    .catch(err =>{
        if(!err.statusCode){
            err.statusCode= 500;
        }
        next(err);
        });
};

exports.logIn = (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({email: email})
    .then( user => {
        if(!user){
            const err = new Error('Could not find Email!');
            err.statusCode = 401;
            throw err;
        }
        loadedUser = user;
        return bcrypt.compare(password, user.password)
    })
    .then(isEqual =>{
        if(!isEqual){
            const err = new Error('Could not find Email!');
            err.statusCode = 401;
            throw err;
        }
        const token = jwt.sign({
            email: loadedUser.email,
            userId: loadedUser._id.toString()
        },
        'secretsecretsecretsecret',
        { expiresIn: '1h' }
        );
        res.status(201).json({
            message: 'You are logged in.',
            token: token,
            userId: loadedUser._id.toString()
        });
    })
    .catch(err =>{
    if(!err.statusCode){
        err.statusCode= 500;
    }
    next(err);
    });

};