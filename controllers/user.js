const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const utilityFunctions = require("../utils/utilityFunctions.js");

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
    const contact = req.body.contact;
    const confirmPassword = req.body.confirmPassword;

    const checkExistingUser = await User.findOne({email});
    if (checkExistingUser) {
        res.status(409).json({message: "Email Already exists"});
        return;
    }

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
            contact,
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

exports.loginOwner = async (req, res, next) => {
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
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.loginUser = async (req, res, next) => {
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
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.getUserFavorites = async (req, res, next) => {
    const user = req.userId;
    try {
        const userResponse = await User.findById(user);
        if (!userResponse) {
            const error = new Error("User is not authorized!");
            error.statusCode = 409;
            throw error;
        }
        res.status(200).json({ favorites: userResponse.favorites });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.getUser = async (req, res, next) => {
    const user = req.userId;
    try {
        const userResponse = await User.findById(user);
        if (!userResponse) {
            const error = new Error("User not Authenticated!");
            error.statusCode = 401;
            throw error;
        }
        res.status(200).json({ user: userResponse });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.getUserById = async (req, res, next) => {
    const user = req.params.userId;
    try {
        const userResponse = await User.findById(user);
        if (!userResponse) {
            const error = new Error("User not Found!");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ user: userResponse });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}
exports.getHostelOwnerIdUserId = async (req, res, next) => {
    const ownerId = req.params.ownerId;
    try {
        const userResponse = await User.findById(ownerId);
        if (!userResponse) {
            const error = new Error("User not found!");
            error.statusCode = 401;
            throw error;
        }
        res.status(200).json({ ownerId: userResponse._id, userId: req.userId });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.generateOtpForPasswordReset = async (req, res, next) => {
    const email = req.body.email;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "Email doesn't exist!" });
        }
        else {
            const otp = utilityFunctions.generateOTP();

            await utilityFunctions.sendEmail(email, otp);
            res.status(200).json({ message: "Email sent!", otp });
        }
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.updatePassword = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error("Error finding user!");
            error.statusCode = 404;
            throw error;
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({message: "Password Updated!"});
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.patchUpdateUser = async (req, res, next) => {
    const userId = req.userId;
    const name = req.body.name;
    const email = req.body.email;
    const contact = req.body.contact;
    const image = req.body.image;
    try {
        const user = await User.findById(userId);
        if (!user) {
            const error = new Error("Error finding user!");
            error.statusCode = 404;
            throw error;
        }

        user.name = name;
        user.email = email;
        user.contact = contact;
        if (image != null){
            user.image = image;
        }
        await user.save();
        res.status(201).json({message: "User Data updated!"});
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}
