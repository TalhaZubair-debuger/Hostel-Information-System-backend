const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation Failed.");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (password !== confirmPassword) {
        const error = new Error("Password didn't match!");
        error.statusCode = 401;
        throw error;
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            email,
            name,
            password: hashedPassword
        })
        const result = await user.save();
        res.status(201).json({ message: "User Created!", userId: result._id });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.loginOwner = async(req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            const error = new Error("A user with this Email could not be found!");
            error.statusCode = 401;
            throw error;
        }
        loadedUser = user;
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            const error = new Error("Wrong Password!");
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign(
            {
                email: loadedUser.email,
                userId: loadedUser._id.toString()
            },
            "ownerissecureandprioritized",
            { expiresIn: "1h" }
        )
        res.status(200).json({ tokenOwner: token, userId: loadedUser._id.toString() })
    } catch (error) {
        if (!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.loginUser = async(req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            const error = new Error("A user with this Email could not be found!");
            error.statusCode = 401;
            throw error;
        }
        loadedUser = user;
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            const error = new Error("Wrong Password!");
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign(
            {
                email: loadedUser.email,
                userId: loadedUser._id.toString()
            },
            "thesupersecretshit",
            { expiresIn: "1h" }
        )
        res.status(200).json({ token: token, userId: loadedUser._id.toString() })
    } catch (error) {
        if (!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    }   
}