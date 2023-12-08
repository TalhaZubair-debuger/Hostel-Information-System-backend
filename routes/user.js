const express = require("express");
const userController = require("../controllers/user");
const { body } = require("express-validator")
const User = require("../models/user");
const isAuth = require("../middlewares/is-auth");
const router = express.Router();

router.put("/signup", [
    body("email")
        .isEmail()
        .withMessage("Enter a valid email")
        .custom((value, { req }) => {
            return User.findOne({ email: value })
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject("Email already exists!")
                    }
                })
        })
        .normalizeEmail(),
    body("name")
        .trim()
        .not()
        .isEmpty(),
    body("password")
        .trim()
        .isLength({ min: 5 }),
    body("confirmPassword")
        .trim()
        .isLength({ min: 5 }),
], userController.signup);

router.post("/login-owner", [
    body("email")
        .isEmail()
        .withMessage("Enter a valid email")
        .normalizeEmail(),
    body("password")
        .trim()
        .isLength({ min: 5 }),
], userController.loginOwner);

router.post("/login-user", [
    body("email")
        .isEmail()
        .withMessage("Enter a valid email")
        .normalizeEmail(),
    body("password")
        .trim()
        .isLength({ min: 5 }),
], userController.loginUser);

router.get("/get-user-favorites", isAuth, userController.getUserFavorites);

router.get("/get-user", isAuth, userController.getUser);

router.get("/get-hostel-owner-user/:ownerId", isAuth, userController.getHostelOwnerIdUserId);

router.post("/get-otp" );

module.exports = router;